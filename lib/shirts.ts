// Shirt dimension sets — the FE rendering/picker source of truth. Kept in
// lockstep with the BE validation sets in `api/src/settings.py`: adding a
// colour/pattern is one entry here + one there (+ an SVG fragment in
// components/profile/shirt.tsx for a new pattern). Nothing else hardcodes
// set members. Colours stay in one pastel tone (Tailwind -300) so any
// background/body/pattern combination reads harmoniously at disc size.

export const SHIRT_COLOURS: Record<string, string> = {
  red: "#fca5a5",
  orange: "#fdba74",
  gold: "#fcd34d",
  yellow: "#fde047",
  lime: "#bef264",
  green: "#86efac",
  emerald: "#6ee7b7",
  teal: "#5eead4",
  cyan: "#67e8f9",
  sky: "#7dd3fc",
  blue: "#93c5fd",
  indigo: "#a5b4fc",
  violet: "#c4b5fd",
  purple: "#d8b4fe",
  fuchsia: "#f0abfc",
  pink: "#f9a8d4",
  rose: "#fda4af",
  slate: "#cbd5e1",
  white: "#ffffff",
};

export const SHIRT_PATTERNS = [
  "plain",
  "stripes",
  "hoops",
  "sash",
  "halves",
  "quarters",
  "chevron",
  "band",
] as const;

export interface Shirt {
  background: string;
  body: string;
  pattern: string;
  pattern_colour: string;
}

const COLOUR_SLUGS = Object.keys(SHIRT_COLOURS);
// White is pickable but excluded from derived defaults: a white disc or body
// would render near-invisibly against the page or another white slot.
const DEFAULT_COLOUR_SLUGS = COLOUR_SLUGS.filter((slug) => slug !== "white");

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick<T>(arr: readonly T[], hash: number): T {
  return arr[hash % arr.length];
}

/** Deterministic shirt for the welcome-page preselect — same user id always
 * lands on the same kit. White excluded from disc/body. */
export function defaultShirtFor(userId: string): Shirt {
  const body = pick(DEFAULT_COLOUR_SLUGS, hashString(userId + ":body"));
  const patternColour = pick(COLOUR_SLUGS, hashString(userId + ":pattern_colour"));
  const background = pick(DEFAULT_COLOUR_SLUGS, hashString(userId + ":background"));
  return {
    background:
      background === body
        ? DEFAULT_COLOUR_SLUGS[
            (DEFAULT_COLOUR_SLUGS.indexOf(background) + 1) %
              DEFAULT_COLOUR_SLUGS.length
          ]
        : background,
    body,
    pattern: pick(SHIRT_PATTERNS, hashString(userId + ":pattern")),
    pattern_colour: patternColour === body ? "white" : patternColour,
  };
}

/** Disc colour for a user with no shirt chosen yet, deterministic from id. */
export function fallbackColourFor(userId: string): string {
  const hash = hashString(userId);
  return SHIRT_COLOURS[pick(DEFAULT_COLOUR_SLUGS, hash)];
}
