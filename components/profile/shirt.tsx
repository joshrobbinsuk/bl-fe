import { useId } from "react";
import { cn } from "@/lib/utils";
import { SHIRT_COLOURS, SHIRT_MOTIFS, type Shirt } from "@/lib/shirts";

type ShirtSize = "sm" | "md" | "lg";

const SIZE_PX: Record<ShirtSize, number> = { sm: 24, md: 32, lg: 64 };

// Short-sleeve kit silhouette in a 0 0 64 64 box: sleeves splaying from the
// shoulders, a body tapering to the hem, a scooped collar. Drawn once; the
// disc sits behind it and every pattern/motif clips to it.
const SILHOUETTE =
  "M 16 18 L 8 24 L 12 36 L 20 32 L 20 50 L 44 50 L 44 32 L 52 36 L 56 24 L 48 18 L 39 21 Q 32 26 25 21 Z";

// Each pattern is a self-contained fragment painted in `pattern_colour` and
// clipped to the silhouette by the caller. Adding a pattern = one case here +
// one slug in lib/shirts.ts.
function PatternFragment({ pattern, colour }: { pattern: string; colour: string }) {
  switch (pattern) {
    case "stripes":
      return (
        <>
          {[8, 16, 24, 32, 40, 48].map((x) => (
            <rect key={x} x={x} y={14} width={4} height={40} fill={colour} />
          ))}
        </>
      );
    case "hoops":
      return (
        <>
          {[18, 26, 34, 42].map((y) => (
            <rect key={y} x={4} y={y} width={56} height={4} fill={colour} />
          ))}
        </>
      );
    case "sash":
      return <polygon points="8,18 18,14 56,46 46,50" fill={colour} />;
    case "halves":
      return <rect x={32} y={12} width={32} height={44} fill={colour} />;
    case "plain":
    default:
      return null;
  }
}

interface ShirtGraphicProps {
  shirt: Shirt;
  size?: ShirtSize;
  className?: string;
}

export function ShirtGraphic({ shirt, size = "md", className }: ShirtGraphicProps) {
  const uid = useId();
  const clipId = `shirt-clip-${uid}`;
  const motifId = `shirt-motif-${uid}`;

  const bg = SHIRT_COLOURS[shirt.background];
  const body = SHIRT_COLOURS[shirt.body];
  const patternColour = SHIRT_COLOURS[shirt.pattern_colour];
  const motifEmoji = shirt.motif ? SHIRT_MOTIFS[shirt.motif] : null;
  // Below md the tiled emoji reads as noise, so drop it — body/pattern still show.
  const showMotif = size !== "sm" && !!motifEmoji;
  const px = SIZE_PX[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      className={cn("shrink-0", className)}
      role="img"
      aria-label="Player shirt"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={SILHOUETTE} />
        </clipPath>
        {showMotif && (
          <pattern id={motifId} width={14} height={14} patternUnits="userSpaceOnUse">
            <text x={7} y={11} fontSize={9} textAnchor="middle">
              {motifEmoji}
            </text>
          </pattern>
        )}
      </defs>

      <circle
        cx={32}
        cy={32}
        r={32}
        fill={bg}
        stroke={shirt.background === "white" ? "#e5e7eb" : "none"}
        strokeWidth={1}
      />

      <g clipPath={`url(#${clipId})`}>
        <rect x={0} y={0} width={64} height={64} fill={body} />
        <PatternFragment pattern={shirt.pattern} colour={patternColour} />
        {showMotif && (
          <rect x={0} y={0} width={64} height={64} fill={`url(#${motifId})`} opacity={0.85} />
        )}
      </g>

      <path
        d={SILHOUETTE}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={1}
        strokeLinejoin="round"
      />
    </svg>
  );
}
