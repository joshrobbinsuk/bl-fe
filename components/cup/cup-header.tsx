"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Cup, CupStatus } from "@/lib/services/betting-api";

interface CupHeaderProps {
  cup: Cup;
  yourBalance: string | undefined;
  yourRank: number | null | undefined;
  cupsWon: number | undefined;
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${new Date(start).toLocaleDateString(undefined, opts)} – ${new Date(
    end,
  ).toLocaleDateString(undefined, opts)}`;
}

function statusBadge(status: CupStatus) {
  switch (status) {
    case "OPEN":
      return (
        <Badge className="border-success-border bg-success-soft text-success">
          Live
        </Badge>
      );
    case "CLOSING":
      return (
        <Badge className="border-warning-border bg-warning-soft text-warning">
          Settling…
        </Badge>
      );
    case "SETTLED":
      return (
        <Badge className="border-neutral-border bg-neutral-soft text-neutral">
          Settled
        </Badge>
      );
  }
}

export function CupHeader({
  cup,
  yourBalance,
  yourRank,
  cupsWon,
}: CupHeaderProps) {
  const balanceLabel =
    yourBalance !== undefined
      ? money.format(Number.parseFloat(yourBalance))
      : "--";

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formatRange(cup.week_start, cup.week_end)}
              </span>
              {statusBadge(cup.status)}
            </div>
            <div className="text-2xl font-bold tracking-tight">Weekly Cup</div>
            {cup.status === "CLOSING" && (
              <p className="text-sm text-warning">
                Standings are provisional while this week settles.
              </p>
            )}
          </div>

          {cupsWon !== undefined && cupsWon > 0 && (
            <Badge variant="secondary" className="text-sm">
              🏆 × {cupsWon}
            </Badge>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <div className="text-xs text-muted-foreground">Your pot</div>
            <div className="text-xl font-semibold tabular-nums">
              {balanceLabel}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Your rank</div>
            <div className="text-xl font-semibold tabular-nums">
              {yourRank ?? "--"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
