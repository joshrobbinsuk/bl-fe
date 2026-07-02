"use client";

import { useEffect, useState } from "react";

type ViewportRect = { height: number; offsetTop: number };

function readViewport(): ViewportRect | null {
  if (typeof window === "undefined" || !window.visualViewport) return null;
  const vp = window.visualViewport;
  return { height: vp.height, offsetTop: vp.offsetTop };
}

/**
 * Tracks the visual viewport (the area not covered by the on-screen keyboard).
 * Returns null where visualViewport is unsupported, so callers fall back to CSS.
 */
export function useVisualViewport(): ViewportRect | null {
  const [rect, setRect] = useState<ViewportRect | null>(readViewport);

  useEffect(() => {
    const vp = window.visualViewport;
    if (!vp) return;
    const update = () => setRect({ height: vp.height, offsetTop: vp.offsetTop });
    vp.addEventListener("resize", update);
    vp.addEventListener("scroll", update);
    return () => {
      vp.removeEventListener("resize", update);
      vp.removeEventListener("scroll", update);
    };
  }, []);

  return rect;
}
