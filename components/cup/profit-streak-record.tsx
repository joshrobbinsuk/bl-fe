"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatWeekStart } from "@/lib/weeks";
import type { ProfitStreakRecord as ProfitStreakRecordData } from "@/lib/services/betting-api";

interface ProfitStreakRecordProps {
  record: ProfitStreakRecordData | null;
  currentUserId: string | undefined;
}

export function ProfitStreakRecord({
  record,
  currentUserId,
}: ProfitStreakRecordProps) {
  return (
    <Card>
      <CardContent className="px-4 py-3">
        <div className="text-xs text-muted-foreground">Longest profit streak</div>
        {record === null ? (
          <p className="mt-1 text-sm text-muted-foreground">
            Nobody&apos;s strung two winning weeks together yet.
          </p>
        ) : (
          <>
            <div
              className="text-2xl font-semibold tabular-nums"
              aria-label={`${record.length} weeks`}
            >
              <span aria-hidden>💰</span> {record.length}×
            </div>
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {record.holders.map((holder) => {
                const isSelf = holder.user_id === currentUserId;
                return (
                  <li
                    key={holder.user_id}
                    className={cn(
                      "rounded px-1.5 py-0.5",
                      isSelf && "bg-accent/60",
                    )}
                  >
                    <span className="font-medium">{holder.username ?? "—"}</span>
                    {isSelf && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                    <span className="ml-1 text-xs text-muted-foreground">
                      ·{" "}
                      {holder.is_current
                        ? "still going"
                        : `ended ${formatWeekStart(holder.ended_week_start)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
