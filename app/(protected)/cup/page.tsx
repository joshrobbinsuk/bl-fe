"use client";

import { useState } from "react";
import {
  useGetCupCurrentQuery,
  useGetCupQuery,
  useGetMeQuery,
} from "@/lib/services/betting-api";
import { AppNav } from "@/components/layout/app-nav";
import { CupHeader } from "@/components/cup/cup-header";
import { CupLeaderboard } from "@/components/cup/cup-leaderboard";
import { WeekSelector } from "@/components/cup/week-selector";

export default function CupPage() {
  const [selectedCupId, setSelectedCupId] = useState<string | undefined>(
    undefined,
  );

  const { data: me } = useGetMeQuery();
  const currentQuery = useGetCupCurrentQuery(undefined, {
    skip: selectedCupId !== undefined,
  });
  const pastQuery = useGetCupQuery(selectedCupId ?? "", {
    skip: selectedCupId === undefined,
  });

  const isCurrent = selectedCupId === undefined;
  const isLoading = isCurrent ? currentQuery.isLoading : pastQuery.isLoading;
  const error = isCurrent ? currentQuery.error : pastQuery.error;

  const cup = isCurrent ? currentQuery.data?.cup : pastQuery.data?.cup;
  const leaderboard = isCurrent
    ? currentQuery.data?.leaderboard
    : pastQuery.data?.leaderboard;
  // Past cups don't carry the viewer's own balance/rank; only the current view
  // does. Fall back to `/me` for the balance on past weeks.
  const yourBalance = isCurrent ? currentQuery.data?.your_balance : me?.balance;
  const yourRank = isCurrent
    ? currentQuery.data?.your_rank
    : leaderboard?.find((row) => row.user_id === me?.id)?.rank ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <AppNav />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Cup</h1>
            <p className="text-muted-foreground">
              Biggest pot at the end of the week wins.
            </p>
          </div>

          <WeekSelector value={selectedCupId} onChange={setSelectedCupId} />

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading cup...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">
                Failed to load the cup. Please try again.
              </p>
            </div>
          )}

          {!isLoading && !error && !cup && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No cup is running this week yet.
              </p>
            </div>
          )}

          {cup && (
            <>
              <CupHeader
                cup={cup}
                yourBalance={yourBalance}
                yourRank={yourRank}
                cupsWon={me?.cups_won}
              />
              <CupLeaderboard
                rows={leaderboard ?? []}
                currentUserId={me?.id}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
