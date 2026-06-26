"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetLeaguesQuery } from "@/lib/services/betting-api";

interface LeagueFilterProps {
  value: string | undefined;
  onChange: (leagueId: string | undefined) => void;
}

export function LeagueFilter({ value, onChange }: LeagueFilterProps) {
  const { data } = useGetLeaguesQuery();
  const leagues = data?.leagues ?? [];

  if (leagues.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={value === undefined ? "default" : "outline"}
        onClick={() => onChange(undefined)}
      >
        All
      </Button>
      {leagues.map((league) => (
        <Button
          key={league.id}
          size="sm"
          variant={value === league.id ? "default" : "outline"}
          onClick={() => onChange(league.id)}
        >
          {league.logo && (
            <Image
              src={league.logo}
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-contain"
              unoptimized
            />
          )}
          {league.display_name}
        </Button>
      ))}
    </div>
  );
}
