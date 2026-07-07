"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  PunditStreamError,
  streamPunditResponse,
  type PunditTurn,
} from "@/lib/pundit-stream";
import { useToast } from "@/hooks/use-toast";
import { useGetMeQuery } from "@/lib/services/betting-api";

function buildGreeting(username: string | null): PunditTurn {
  return {
    role: "assistant",
    content: username
      ? `Awright ${username}! Ask us about team news, who to back, or how your bets are lookin'.`
      : "Awright son. Ask us about team news, who to back, or how your bets are lookin'.",
  };
}

interface PunditChatContextValue {
  messages: PunditTurn[];
  streaming: boolean;
  streamingContent: string;
  send: (text: string, fixtureIds: string[]) => void;
  abort: () => void;
}

const PunditChatContext = createContext<PunditChatContextValue | null>(null);

export function PunditChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Provider mounts above UsernameGate, so `me` may still be loading (or the
  // username may still be null) when this first renders — the greeting is
  // derived rather than stored, so it stays in sync as `me` arrives without
  // needing an effect to patch stored state.
  const { data: me } = useGetMeQuery();
  const username = me?.username ?? null;
  const [turns, setTurns] = useState<PunditTurn[]>([]);
  const messages = useMemo(
    () => [buildGreeting(username), ...turns],
    [username, turns],
  );
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
    (text: string, fixtureIds: string[]) => {
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
      setTurns((prev) => [...prev, userTurn]);
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
            setTurns((prev) => [...prev, { role: "assistant", content: reply }]);
          }
          setStreamingContent("");
          setStreaming(false);
        });
    },
    [messages, streaming, toast],
  );

  return (
    <PunditChatContext.Provider
      value={{ messages, streaming, streamingContent, send, abort }}
    >
      {children}
    </PunditChatContext.Provider>
  );
}

export function usePunditChat(): PunditChatContextValue {
  const ctx = useContext(PunditChatContext);
  if (!ctx) {
    throw new Error("usePunditChat must be used within a PunditChatProvider");
  }
  return ctx;
}
