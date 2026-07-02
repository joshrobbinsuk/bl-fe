"use client";

import { useGetFixturesQuery } from "@/lib/services/betting-api";
import { AppNav } from "@/components/layout/app-nav";
import { PunditChat } from "@/components/pundit/pundit-chat";

export default function PunditPage() {
  const { data } = useGetFixturesQuery({});
  const fixtureIds = data?.fixtures?.map((f) => f.id) ?? [];

  return (
    <div className="flex h-[100dvh] flex-col bg-gradient-to-br from-background to-accent/10">
      <AppNav />

      <div className="border-b px-4 py-3">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          Ask the Pundit
        </h1>
        <p className="text-muted-foreground text-sm">Right, let&apos;s &apos;ave it.</p>
      </div>

      <div className="min-h-0 flex-1">
        <PunditChat fixtureIds={fixtureIds} />
      </div>
    </div>
  );
}
