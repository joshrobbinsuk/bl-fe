"use client";

import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { UserAvatar } from "@/components/profile/user-avatar";
import { StreakBadges } from "@/components/cup/streak-badges";
import type { CupLeaderboardRow } from "@/lib/services/betting-api";

interface CupLeaderboardProps {
  rows: CupLeaderboardRow[];
  currentUserId: string | undefined;
}

export function CupLeaderboard({ rows, currentUserId }: CupLeaderboardProps) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No entries yet this week</p>
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
                  <span className="w-6 shrink-0 text-sm font-semibold text-muted-foreground tabular-nums">
                    {row.rank}
                  </span>
                  <UserAvatar
                    avatar={row.avatar}
                    userId={row.user_id}
                    username={row.username}
                    size="sm"
                  />
                  <span className="truncate font-medium">
                    {row.username ?? "—"}
                    {isSelf && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </span>
                  {row.cups_won > 0 && (
                    <span
                      className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground"
                      title={`${row.cups_won} cup ${
                        row.cups_won === 1 ? "win" : "wins"
                      }`}
                    >
                      <Trophy className="h-3 w-3" />
                      {row.cups_won}
                    </span>
                  )}
                  {row.is_winner && <span aria-label="Winner">🏆</span>}
                  <StreakBadges
                    participationStreak={row.participation_streak}
                    profitStreak={row.profit_streak}
                  />
                </div>
                <span className="font-semibold tabular-nums">
                  {formatMoney(row.balance)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
