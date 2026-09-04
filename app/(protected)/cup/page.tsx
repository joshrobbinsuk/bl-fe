"use client";

import { useState } from "react";
import {
  useGetAllTimeQuery,
  useGetCupCurrentQuery,
  useGetCupQuery,
  useGetMeQuery,
} from "@/lib/services/betting-api";
import { AppNav } from "@/components/layout/app-nav";
import { BestWeeks } from "@/components/cup/best-weeks";
import { ProfitStreakRecord } from "@/components/cup/profit-streak-record";
import { CupLeaderboard } from "@/components/cup/cup-leaderboard";
import {
  WeekSelector,
  usePreviousCup,
  type WeekScope,
} from "@/components/cup/week-selector";

export default function CupPage() {
  const [scope, setScope] = useState<WeekScope>("current");

  const { data: me } = useGetMeQuery();
  // Always fetched so the selector knows which cup is "This week", even while
  // viewing a past one.
  const currentQuery = useGetCupCurrentQuery();
  const currentCupId = currentQuery.data?.cup?.id;
  const previousCup = usePreviousCup(currentCupId);
  const previousQuery = useGetCupQuery(previousCup?.id ?? "", {
    skip: scope !== "previous" || previousCup === undefined,
  });
  const allTimeQuery = useGetAllTimeQuery(undefined, {
    skip: scope !== "all",
  });

  const isLoading =
    scope === "current"
      ? currentQuery.isLoading
      : scope === "previous"
        ? previousQuery.isLoading
        : allTimeQuery.isLoading;
  const error =
    scope === "current"
      ? currentQuery.error
      : scope === "previous"
        ? previousQuery.error
        : allTimeQuery.error;

  const cup =
    scope === "current"
      ? currentQuery.data?.cup
      : scope === "previous"
        ? previousQuery.data?.cup
        : undefined;
  const leaderboard =
    scope === "current"
      ? currentQuery.data?.leaderboard
      : previousQuery.data?.leaderboard;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <AppNav />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Weekly Cup</h1>
            <p className="text-muted-foreground">
              {scope === "all"
                ? "Top Lads"
                : "Biggest pot at the end of the week wins. Back to £1000 on Monday."}
            </p>
          </div>

          <WeekSelector
            value={scope}
            onChange={setScope}
            currentCupId={currentCupId}
            allLabel="All time"
          />

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">
                Countin&apos; the pots…
              </p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">
                Failed to load the cup. Please try again.
              </p>
            </div>
          )}

          {scope === "all" && allTimeQuery.data && (
            <div className="space-y-6">
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Biggest pots</h2>
                <BestWeeks
                  entries={allTimeQuery.data.best_weeks}
                  currentUserId={me?.id}
                />
              </section>
              <ProfitStreakRecord
                record={allTimeQuery.data.profit_streak_record}
                currentUserId={me?.id}
              />
            </div>
          )}

          {scope !== "all" && !isLoading && !error && !cup && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No cup on yet. Get a bet on to start it, son.
              </p>
            </div>
          )}

          {scope !== "all" && cup && (
            <CupLeaderboard rows={leaderboard ?? []} currentUserId={me?.id} />
          )}
        </div>
      </div>
    </div>
  );
}
