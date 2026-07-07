export const AVATAR_ICONS: Record<string, string> = {
  ball: "⚽",
  fox: "🦊",
  goat: "🐐",
  beer: "🍺",
  fire: "🔥",
  huff: "😤",
  tophat: "🎩",
  crown: "👑",
  lion: "🦁",
  dog: "🐶",
  frog: "🐸",
  cold: "🥶",
  chicken: "🍗",
  dart: "🎯",
  glove: "🧤",
  rocket: "🚀",
};

export const AVATAR_COLOURS: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  gold: "#f59e0b",
  purple: "#a855f7",
  teal: "#14b8a6",
};

const ICON_SLUGS = Object.keys(AVATAR_ICONS);
const COLOUR_SLUGS = Object.keys(AVATAR_COLOURS);

export interface ParsedAvatar {
  icon: string;
  colour: string;
}

export function parseAvatar(id: string): ParsedAvatar | null {
  const [icon, colour] = id.split("-");
  if (!icon || !colour) return null;
  if (!(icon in AVATAR_ICONS) || !(colour in AVATAR_COLOURS)) return null;
  return { icon, colour };
}

export function isValidAvatar(id: string): boolean {
  return parseAvatar(id) !== null;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Deterministic combo for the welcome-page preselect — same user id always
 * lands on the same icon/colour pair. */
export function defaultAvatarFor(userId: string): string {
  const hash = hashString(userId);
  const icon = ICON_SLUGS[hash % ICON_SLUGS.length];
  const colour =
    COLOUR_SLUGS[Math.floor(hash / ICON_SLUGS.length) % COLOUR_SLUGS.length];
  return `${icon}-${colour}`;
}

/** Disc colour for a user with no avatar chosen yet, deterministic from id. */
export function fallbackColourFor(userId: string): string {
  const hash = hashString(userId);
  return AVATAR_COLOURS[COLOUR_SLUGS[hash % COLOUR_SLUGS.length]];
}
