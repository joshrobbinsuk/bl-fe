"use client";

import { Button } from "@/components/ui/button";
import { useGetCupsQuery } from "@/lib/services/betting-api";

interface WeekSelectorProps {
  /** undefined means the current week */
  value: string | undefined;
  onChange: (cupId: string | undefined) => void;
}

function weekLabel(weekStart: string): string {
  return new Date(weekStart).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function WeekSelector({ value, onChange }: WeekSelectorProps) {
  const { data } = useGetCupsQuery();
  const cups = data?.cups ?? [];

  if (cups.length === 0) return null;

  // API returns most-recent first; the first cup is the current week, which the
  // "This week" pill covers, so only the rest go in the past-week list.
  const pastCups = cups.slice(1);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={value === undefined ? "default" : "outline"}
        onClick={() => onChange(undefined)}
      >
        This week
      </Button>
      {pastCups.map((cup) => (
        <Button
          key={cup.id}
          size="sm"
          variant={value === cup.id ? "default" : "outline"}
          onClick={() => onChange(cup.id)}
        >
          Week of {weekLabel(cup.week_start)}
        </Button>
      ))}
    </div>
  );
}
