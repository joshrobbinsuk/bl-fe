"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  type Fixture,
  type FixtureResult,
  useCreateBetMutation,
} from "@/lib/services/betting-api";
import { useToast } from "@/hooks/use-toast";

interface BetDialogProps {
  fixture: Fixture;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BetDialog({ fixture, open, onOpenChange }: BetDialogProps) {
  const [choice, setChoice] = useState<FixtureResult>("HOME");
  const [stake, setStake] = useState("");
  const [createBet, { isLoading }] = useCreateBetMutation();
  const { toast } = useToast();

  const calculatePotentialReturn = () => {
    const stakeNum = Number.parseFloat(stake);
    if (isNaN(stakeNum)) return "0.00";

    const oddsStr =
      choice === "HOME"
        ? fixture.home_odds
        : choice === "AWAY"
        ? fixture.away_odds
        : fixture.draw_odds;

    if (!oddsStr) return "0.00";

    const odds = Number.parseFloat(oddsStr);
    return (Number(stakeNum) + Number(stakeNum * odds)).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createBet({
        fixture_id: fixture.id,
        choice,
        stake: Number.parseFloat(stake),
      }).unwrap();

      toast({
        title: "Bet Placed",
        description: "Your bet has been placed successfully",
      });

      onOpenChange(false);
      setStake("");
      setChoice("HOME");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.data?.detail || "Failed to place bet",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Place Your Bet</DialogTitle>
          <DialogDescription>
            {fixture.home_team} vs {fixture.away_team}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Choose Outcome</Label>
            <RadioGroup
              value={choice}
              onValueChange={(val) => setChoice(val as FixtureResult)}
            >
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="HOME" id="home" />
                  <Label htmlFor="home" className="cursor-pointer">
                    {fixture.home_team}
                  </Label>
                </div>
                <span className="font-semibold">
                  {fixture.home_odds
                    ? Number.parseFloat(fixture.home_odds).toFixed(2)
                    : "N/A"}
                </span>
              </div>

              {fixture.draw_odds && (
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DRAW" id="draw" />
                    <Label htmlFor="draw" className="cursor-pointer">
                      Draw
                    </Label>
                  </div>
                  <span className="font-semibold">
                    {Number.parseFloat(fixture.draw_odds).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="AWAY" id="away" />
                  <Label htmlFor="away" className="cursor-pointer">
                    {fixture.away_team}
                  </Label>
                </div>
                <span className="font-semibold">
                  {fixture.away_odds
                    ? Number.parseFloat(fixture.away_odds).toFixed(2)
                    : "N/A"}
                </span>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stake">Stake Amount</Label>
            <Input
              id="stake"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              required
            />
          </div>

          {stake && Number.parseFloat(stake) > 0 && (
            <div className="p-4 bg-accent rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Potential Return</span>
                <span className="font-semibold">
                  ${calculatePotentialReturn()}
                </span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Placing Bet..." : "Confirm Bet"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
