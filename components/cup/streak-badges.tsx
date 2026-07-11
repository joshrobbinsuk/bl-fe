interface StreakBadgesProps {
  participationStreak: number;
  profitStreak: number;
}

export function StreakBadges({
  participationStreak,
  profitStreak,
}: StreakBadgesProps) {
  if (participationStreak <= 0 && profitStreak <= 0) return null;

  return (
    <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
      {participationStreak > 0 && (
        <span
          className="flex items-center gap-0.5"
          title={`${participationStreak}-week entry streak`}
        >
          <span aria-hidden>🔥</span>
          {participationStreak}
        </span>
      )}
      {profitStreak > 0 && (
        <span
          className="flex items-center gap-0.5"
          title={`${profitStreak}-week profit streak`}
        >
          <span aria-hidden>💰</span>
          {profitStreak}
        </span>
      )}
    </span>
  );
}
