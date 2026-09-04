"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { formatWeekStart } from "@/lib/weeks";
import type { BestWeekEntry } from "@/lib/services/betting-api";

interface BestWeeksProps {
  entries: BestWeekEntry[];
  currentUserId: string | undefined;
}

export function BestWeeks({ entries, currentUserId }: BestWeeksProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No cup&apos;s been settled yet. History starts Monday.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {entries.map((entry) => {
            const isSelf = entry.user_id === currentUserId;
            return (
              <li
                key={`${entry.cup_id}-${entry.user_id}`}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-3",
                  isSelf && "bg-accent/60",
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                      entry.rank === 1
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {entry.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {entry.username ?? "—"}
                      {isSelf && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Week of {formatWeekStart(entry.week_start)}
                    </div>
                  </div>
                </div>
                <span className="shrink-0 font-semibold tabular-nums">
                  {formatMoney(entry.balance)}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
