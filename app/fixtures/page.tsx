"use client";

import { useState } from "react";
import { useGetFixturesQuery } from "@/lib/services/betting-api";
import { FixtureCard } from "@/components/fixtures/fixture-card";
import { AppNav } from "@/components/layout/app-nav";
import { SearchInput } from "@/components/ui/search-input";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

export default function FixturesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm.trim(), 300);
  const { data, isLoading, error } = useGetFixturesQuery({
    search: debouncedSearch || undefined,
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
            <SearchInput
              className="flex-1"
              placeholder="Search teams or venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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

          {data?.fixtures && data.fixtures.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No fixtures found</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {data?.fixtures?.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
