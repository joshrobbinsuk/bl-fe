"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePunditChat } from "@/components/pundit/pundit-chat-provider";

interface PunditChatProps {
  fixtureIds: string[];
}

const STAGED_STATUS = [
  "Checking the fixtures…",
  "Having a think…",
  "Nearly there, son…",
];
const SEARCH_STATUS = "Scouring the web, son…";
const STAGE_INTERVAL_MS = 1800;

/**
 * Mounted only while a reply is pending with nothing streamed yet, so the first
 * delta unmounts it and the stage resets for the next question. A live web
 * search takes over the line; the timed stages are the fallback without one.
 */
function StagedStatus({ searching }: { searching: boolean }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage === STAGED_STATUS.length - 1) return;
    const id = setTimeout(() => setStage(stage + 1), STAGE_INTERVAL_MS);
    return () => clearTimeout(id);
  }, [stage]);

  return (
    <span className="inline-flex items-center gap-2 text-muted-foreground">
      <Spinner className="size-3" />
      {searching ? SEARCH_STATUS : STAGED_STATUS[stage]}
    </span>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("flex", role === "user" ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PunditChat({ fixtureIds }: PunditChatProps) {
  const { messages, streaming, searching, streamingContent, send } =
    usePunditChat();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streamingContent, streaming]);

  const handleSend = () => {
    if (!draft.trim() || streaming) return;
    send(draft, fixtureIds);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.content}
          </Bubble>
        ))}

        {streaming && (
          <Bubble role="assistant">
            {streamingContent || <StagedStatus searching={searching} />}
          </Bubble>
        )}
      </div>

      <div className="border-t p-4">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Go on then, ask us…"
            disabled={streaming}
            maxLength={2000}
          />
          <Button
            type="submit"
            size="icon"
            disabled={streaming || !draft.trim()}
            aria-label="Send"
          >
            {streaming ? (
              <Spinner className="size-4" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
