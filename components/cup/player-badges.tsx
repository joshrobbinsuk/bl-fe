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
      className="relative inline-flex size-4 shrink-0 items-center justify-center"
      title={label}
    >
      <span aria-hidden className="text-[13px] leading-none">
        {icon}
      </span>
      {/* Ringed so the disc reads as its own thing against the emoji behind it. */}
      <span
        aria-hidden
        className="absolute -bottom-1 -right-1 flex size-[11px] items-center justify-center rounded-full bg-muted/90 text-[8px] font-semibold leading-none tabular-nums text-foreground ring-1 ring-background"
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

  // Tight where the row is fighting for width, roomier once there is space to
  // spare. Gaps can't flex — flex-shrink sizes items, not the space between
  // them — so this is a breakpoint rather than something automatic.
  return (
    <span className="flex shrink-0 items-center gap-1 sm:gap-2">
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
