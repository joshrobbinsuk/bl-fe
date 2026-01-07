"use client";

import { useState } from "react";
import { useGetFixturesQuery } from "@/lib/services/betting-api";
import { FixtureCard } from "@/components/fixtures/fixture-card";
import { AppNav } from "@/components/layout/app-nav";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function FixturesPage() {
  const [league, setLeague] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useGetFixturesQuery({
    league: league || undefined,
  });
  const filteredFixtures = data?.fixtures.filter((fixture) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      fixture.home_team.toLowerCase().includes(search) ||
      fixture.away_team.toLowerCase().includes(search) ||
      fixture.venue.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <AppNav />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Upcoming Fixtures
            </h1>
            <p className="text-muted-foreground">
              Place your bets on upcoming matches
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams or venues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={league} onValueChange={setLeague}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Leagues" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Leagues</SelectItem>
                <SelectItem value="premier-league">Premier League</SelectItem>
                <SelectItem value="la-liga">La Liga</SelectItem>
                <SelectItem value="bundesliga">Bundesliga</SelectItem>
                <SelectItem value="serie-a">Serie A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading fixtures...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">
                Failed to load fixtures. Please try again.
              </p>
            </div>
          )}

          {filteredFixtures && filteredFixtures.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No fixtures found</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {filteredFixtures?.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
