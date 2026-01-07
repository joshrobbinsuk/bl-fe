"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Fixture } from "@/lib/services/betting-api"
import { BetDialog } from "./bet-dialog"

interface FixtureCardProps {
  fixture: Fixture
}

export function FixtureCard({ fixture }: FixtureCardProps) {
  const [showBetDialog, setShowBetDialog] = useState(false)
  const kickOff = new Date(fixture.kick_off)

  const hasOdds = fixture.home_odds && fixture.away_odds && fixture.draw_odds

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {fixture.venue}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {kickOff.toLocaleDateString()} {kickOff.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{fixture.home_team}</span>
              {fixture.home_odds && (
                <Badge variant="outline" className="bg-accent">
                  {Number.parseFloat(fixture.home_odds).toFixed(2)}
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-center text-muted-foreground text-sm">vs</div>
            <div className="flex items-center justify-between">
              <span className="font-medium">{fixture.away_team}</span>
              {fixture.away_odds && (
                <Badge variant="outline" className="bg-accent">
                  {Number.parseFloat(fixture.away_odds).toFixed(2)}
                </Badge>
              )}
            </div>
          </div>

          {fixture.draw_odds && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Draw</span>
              <Badge variant="outline" className="bg-accent">
                {Number.parseFloat(fixture.draw_odds).toFixed(2)}
              </Badge>
            </div>
          )}

          <Button className="w-full mt-4" onClick={() => setShowBetDialog(true)} disabled={!hasOdds}>
            Place Bet
          </Button>
        </CardContent>
      </Card>

      <BetDialog fixture={fixture} open={showBetDialog} onOpenChange={setShowBetDialog} />
    </>
  )
}
