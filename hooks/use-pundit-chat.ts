"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PunditStreamError,
  streamPunditResponse,
  type PunditTurn,
} from "@/lib/pundit-stream";
import { useToast } from "@/hooks/use-toast";

export type { PunditTurn } from "@/lib/pundit-stream";

interface UsePunditChat {
  messages: PunditTurn[];
  streaming: boolean;
  streamingContent: string;
  send: (text: string) => void;
  abort: () => void;
}

/**
 * Session-only pundit conversation. Each send appends a user turn, posts the
 * full conversation (ending with that user turn), and streams the assistant
 * reply into a growing buffer that is committed as an assistant turn on done.
 */
export function usePunditChat(fixtureIds: string[]): UsePunditChat {
  const [messages, setMessages] = useState<PunditTurn[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const { toast } = useToast();
  const bufferRef = useRef("");
  const controllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  useEffect(() => abort, [abort]);

  const send = useCallback(
    (text: string) => {
      const content = text.trim();
      if (!content || streaming) return;

      if (fixtureIds.length === 0) {
        toast({
          title: "No fixtures",
          description: "There are no visible fixtures to ask about.",
          variant: "destructive",
        });
        return;
      }

      const userTurn: PunditTurn = { role: "user", content };
      const conversation = [...messages, userTurn];
      setMessages(conversation);
      setStreaming(true);
      setStreamingContent("");
      bufferRef.current = "";

      const controller = new AbortController();
      controllerRef.current = controller;

      // Cleared on a mid-stream error event so the partial reply is never
      // committed as an assistant turn (it would also be re-sent next request).
      let committable = true;

      const finishWithError = (message: string) => {
        toast({
          title: "Pundit error",
          description: message,
          variant: "destructive",
        });
      };

      void streamPunditResponse(
        fixtureIds,
        conversation,
        {
          onDelta: (delta) => {
            bufferRef.current += delta;
            setStreamingContent(bufferRef.current);
          },
          onComplete: (full) => {
            bufferRef.current = full;
          },
          onError: (message) => {
            committable = false;
            bufferRef.current = "";
            finishWithError(message);
          },
        },
        controller.signal,
      )
        .catch((err: unknown) => {
          if (err instanceof Error && err.name === "AbortError") return;
          committable = false;
          finishWithError(
            err instanceof PunditStreamError
              ? err.message
              : "Failed to reach the pundit",
          );
        })
        .finally(() => {
          if (controllerRef.current === controller) controllerRef.current = null;
          const reply = bufferRef.current;
          if (committable && reply) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: reply },
            ]);
          }
          setStreamingContent("");
          setStreaming(false);
        });
    },
    [fixtureIds, messages, streaming, toast],
  );

  return { messages, streaming, streamingContent, send, abort };
}
