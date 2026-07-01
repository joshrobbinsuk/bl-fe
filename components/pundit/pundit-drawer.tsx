"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { usePunditChat } from "@/hooks/use-pundit-chat";

interface PunditDrawerProps {
  fixtureIds: string[];
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
      className={cn(
        "flex",
        role === "user" ? "justify-end" : "justify-start",
      )}
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

export function PunditDrawer({ fixtureIds }: PunditDrawerProps) {
  const { messages, streaming, streamingContent, send, abort } =
    usePunditChat(fixtureIds);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (next: boolean) => {
    if (!next) abort();
    setOpen(next);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, streamingContent, streaming]);

  const handleSend = () => {
    if (!draft.trim() || streaming) return;
    send(draft);
    setDraft("");
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageCircle className="size-4" />
          Ask the Pundit
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        // Don't auto-focus the input on open: on iOS that slams the keyboard up
        // before layout settles and shoves the input off-screen. Open calm, let
        // the user tap to type. dvh gives a true full-height panel.
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="h-[100dvh] w-full p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="size-4" />
            Ask the Pundit
          </SheetTitle>
          <SheetDescription>
            A grounded steer on the fixtures you can bet on right now.
          </SheetDescription>
        </SheetHeader>

        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 && !streaming && (
            <p className="text-muted-foreground text-sm">
              Ask about today&apos;s slate — form, value, who to watch. I can also
              pull the latest news on a single fixture if you ask. No certainties,
              just opinions.
            </p>
          )}

          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>
              {m.content}
            </Bubble>
          ))}

          {streaming && (
            <Bubble role="assistant">
              {streamingContent || (
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Spinner className="size-3" />
                  Thinking…
                </span>
              )}
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
              placeholder="Ask the pundit…"
              disabled={streaming}
              maxLength={2000}
            />
            <Button
              type="submit"
              size="icon"
              disabled={streaming || !draft.trim()}
              aria-label="Send"
            >
              {streaming ? <Spinner className="size-4" /> : <Send className="size-4" />}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
