"use client";

import { useState } from "react";
import { useGetUserBetsQuery } from "@/lib/services/betting-api";
import { BetCard } from "@/components/bets/bet-card";
import { AppNav } from "@/components/layout/app-nav";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyBetsPage() {
  const [filter, setFilter] = useState<string>("all");
  const { data, isLoading, error } = useGetUserBetsQuery({});

  const filteredBets = data?.bets.filter((bet) => {
    if (filter === "all") return true;
    if (filter === "pending") return bet.outcome === "UNDECIDED";
    return bet.outcome === filter.toUpperCase();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <AppNav />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Bets</h1>
            <p className="text-muted-foreground">
              Track your betting history and results
            </p>
          </div>

          <Tabs value={filter} onValueChange={setFilter} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="won">Won</TabsTrigger>
              <TabsTrigger value="lost">Lost</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading bets...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">
                Failed to load bets. Please try again.
              </p>
            </div>
          )}

          {filteredBets && filteredBets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bets found</p>
            </div>
          )}

          <div className="space-y-3">
            {filteredBets?.map((bet) => (
              <BetCard key={bet.id} bet={bet} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
