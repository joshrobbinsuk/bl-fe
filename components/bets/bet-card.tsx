"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Bet } from "@/lib/services/betting-api";

interface BetCardProps {
  bet: Bet;
}

export function BetCard({ bet }: BetCardProps) {
  const kickOff = new Date(bet.kick_off);

  const getStatusClassName = (outcome: string) => {
    switch (outcome) {
      case "WON":
        return "border-success-border bg-success-soft text-success";
      case "LOST":
        return "border-destructive/20 bg-destructive/10 text-destructive";
      case "VOIDED":
        return "border-neutral-border bg-neutral-soft text-neutral";
      default:
        return "border-warning-border bg-warning-soft text-warning";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-medium text-sm">
                {bet.home_team} vs {bet.away_team}
              </div>
              <div className="text-xs text-muted-foreground">
                {kickOff.toLocaleDateString()}{" "}
                {kickOff.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn("min-w-20 justify-center font-semibold", getStatusClassName(bet.outcome))}
            >
              {bet.outcome}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2 border-t text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Choice</div>
              <div className="font-medium">{bet.choice}</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-muted-foreground">Stake</div>
              <div className="font-medium">
                ${Number.parseFloat(bet.stake).toFixed(2)}
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-muted-foreground">Returns</div>
              <div className="font-medium">
                ${Number.parseFloat(bet.returns).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
