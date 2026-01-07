"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Bet } from "@/lib/services/betting-api";

interface BetCardProps {
  bet: Bet;
}

export function BetCard({ bet }: BetCardProps) {
  const kickOff = new Date(bet.kick_off);

  const getStatusColor = (outcome: string) => {
    switch (outcome) {
      case "WON":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "LOST":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "VOIDED":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
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
            <Badge className={getStatusColor(bet.outcome)}>{bet.outcome}</Badge>
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
