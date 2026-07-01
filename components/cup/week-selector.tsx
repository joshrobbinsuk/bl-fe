"use client";

import { Button } from "@/components/ui/button";
import { useGetCupsQuery } from "@/lib/services/betting-api";

interface WeekSelectorProps {
  /** undefined means the current week */
  value: string | undefined;
  /**
   * Id of the cup that is the current week, if one is open. It's covered by the
   * "This week" pill and excluded from the past-week list. When omitted (no
   * open cup, or a caller that doesn't know it), every cup is a selectable past
   * week.
   */
  currentCupId?: string;
  onChange: (cupId: string | undefined) => void;
}

function weekLabel(weekStart: string): string {
  return new Date(weekStart).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function WeekSelector({
  value,
  currentCupId,
  onChange,
}: WeekSelectorProps) {
  const { data } = useGetCupsQuery();
  const cups = data?.cups ?? [];

  if (cups.length === 0) return null;

  const pastCups = cups.filter((cup) => cup.id !== currentCupId);

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
