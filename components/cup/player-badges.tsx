interface PlayerBadgesProps {
  cupsWon: number;
  profitStreak: number;
  participationStreak: number;
}

interface BadgeProps {
  icon: string;
  count: number;
  label: string;
}

function Badge({ icon, count, label }: BadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className="relative inline-flex size-[14px] shrink-0 items-center justify-center"
      title={label}
    >
      <span aria-hidden className="text-[12px] leading-none">
        {icon}
      </span>
      <span
        aria-hidden
        className="absolute -bottom-0.5 -right-0.5 text-[9px] font-semibold leading-none tabular-nums text-foreground/70 [text-shadow:0_0_2px_var(--background),0_0_2px_var(--background)]"
      >
        {count}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function PlayerBadges({
  cupsWon,
  profitStreak,
  participationStreak,
}: PlayerBadgesProps) {
  if (cupsWon <= 0 && profitStreak <= 0 && participationStreak <= 0) return null;

  return (
    <span className="flex shrink-0 items-center gap-[3px]">
      <Badge
        icon="🏆"
        count={cupsWon}
        label={`${cupsWon} cup ${cupsWon === 1 ? "win" : "wins"}`}
      />
      <Badge
        icon="💰"
        count={profitStreak}
        label={`${profitStreak}-week profit streak`}
      />
      <Badge
        icon="🔥"
        count={participationStreak}
        label={`${participationStreak}-week active streak`}
      />
    </span>
  );
}
