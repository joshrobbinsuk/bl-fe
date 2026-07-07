"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PunditChat } from "@/components/pundit/pundit-chat";

interface PunditDrawerProps {
  fixtureIds: string[];
}

export function PunditDrawer({ fixtureIds }: PunditDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MessageCircle className="size-4" />
          Ask the Pundit
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex h-[100dvh] w-full flex-col p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="size-4" />
            Ask the Pundit
          </SheetTitle>
          <SheetDescription>Right, let&apos;s &apos;ave it.</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1">
          <PunditChat fixtureIds={fixtureIds} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
