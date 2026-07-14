import { useId } from "react";
import { cn } from "@/lib/utils";
import { SHIRT_COLOURS, type Shirt } from "@/lib/shirts";

type ShirtSize = "sm" | "md" | "lg";

const SIZE_PX: Record<ShirtSize, number> = { sm: 24, md: 32, lg: 64 };

// Short-sleeve kit silhouette in a 0 0 64 64 box: flat top edge between
// rounded shoulders, sleeves splaying down with rounded tips and cuffs, soft
// hem corners. Drawn once; the disc sits behind it and every pattern clips
// to it.
const SILHOUETTE =
  "M 23 16 L 41 16 Q 46 16 49 19 L 55 26 Q 57 28 56 30 L 51 36 Q 49 38 47 37 L 44 34 L 44 48 Q 44 50 42 50 L 22 50 Q 20 50 20 48 L 20 34 L 17 37 Q 15 38 13 36 L 8 30 Q 7 28 9 26 L 15 19 Q 18 16 23 16 Z";

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
    case "quarters":
      // Diagonal 2×2 blocks (Blackburn/Bristol Rovers) — body shows through the
      // other diagonal.
      return (
        <>
          <rect x={32} y={0} width={32} height={32} fill={colour} />
          <rect x={0} y={32} width={32} height={32} fill={colour} />
        </>
      );
    case "chevron":
      return <polygon points="8,18 32,40 56,18 56,28 32,50 8,28" fill={colour} />;
    case "band":
      return <rect x={0} y={27} width={64} height={10} fill={colour} />;
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

  const bg = SHIRT_COLOURS[shirt.background];
  const body = SHIRT_COLOURS[shirt.body];
  const patternColour = SHIRT_COLOURS[shirt.pattern_colour];
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
