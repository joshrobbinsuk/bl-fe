"use client";

import { Button } from "@/components/ui/button";
import { useGetCupsQuery, type Cup } from "@/lib/services/betting-api";
import { formatWeekStart } from "@/lib/weeks";

export type WeekScope = "current" | "previous" | "all";

/**
 * The most recent cup that isn't the current week — what the "Week of …" chip
 * selects. A missed week has no cup, so it's simply skipped over.
 */
export function usePreviousCup(
  currentCupId: string | undefined,
): Cup | undefined {
  const { data } = useGetCupsQuery();
  return data?.cups.find((cup) => cup.id !== currentCupId);
}

interface WeekSelectorProps {
  value: WeekScope;
  onChange: (scope: WeekScope) => void;
  /** Id of the open cup, so it isn't offered as the previous week. */
  currentCupId: string | undefined;
  /** Label for a third chip (e.g. "All time"); omitted means no third chip. */
  allLabel?: string;
}

export function WeekSelector({
  value,
  onChange,
  currentCupId,
  allLabel,
}: WeekSelectorProps) {
  const previousCup = usePreviousCup(currentCupId);

  const chips: { scope: WeekScope; label: string }[] = [
    { scope: "current", label: "This week" },
  ];
  if (previousCup) {
    chips.push({
      scope: "previous",
      label: `Week of ${formatWeekStart(previousCup.week_start)}`,
    });
  }
  if (allLabel) chips.push({ scope: "all", label: allLabel });

  if (chips.length === 1) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Button
          key={chip.scope}
          size="sm"
          variant={value === chip.scope ? "default" : "outline"}
          onClick={() => onChange(chip.scope)}
        >
          {chip.label}
        </Button>
      ))}
    </div>
  );
}
