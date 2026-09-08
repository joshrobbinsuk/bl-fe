"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { PlayerBadges } from "@/components/cup/player-badges";
import type { CupLeaderboardRow } from "@/lib/services/betting-api";

interface CupLeaderboardProps {
  rows: CupLeaderboardRow[];
  currentUserId: string | undefined;
}

export function CupLeaderboard({ rows, currentUserId }: CupLeaderboardProps) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nobody&apos;s had a punt yet this week.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {rows.map((row) => {
            const isSelf = row.user_id === currentUserId;
            return (
              <li
                key={row.user_id}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3",
                  isSelf && "bg-accent/60",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                      row.rank === 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {row.rank}
                  </span>
                  <span className="truncate font-medium">
                    {row.username ?? "—"}
                    {isSelf && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </span>
                  <PlayerBadges
                    cupsWon={row.cups_won}
                    profitStreak={row.profit_streak}
                    participationStreak={row.participation_streak}
                  />
                </div>
                <div className="flex shrink-0 flex-col items-end tabular-nums">
                  <span className="font-semibold">{formatMoney(row.balance)}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatMoney(row.potential)} max
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
