import { useState } from "react";
import { cn } from "@/lib/utils";
import { SHIRT_COLOURS, SHIRT_PATTERNS, type Shirt } from "@/lib/shirts";
import { ShirtGraphic } from "@/components/profile/shirt";

interface ShirtPickerProps {
  value: Shirt;
  onChange: (shirt: Shirt) => void;
}

// The three shirt slots that share one colour palette. The toggle picks which
// one the palette below edits, so we show one swatch grid instead of three.
type ColourSlot = "background" | "body" | "pattern_colour";
const COLOUR_SLOTS: { slot: ColourSlot; label: string }[] = [
  { slot: "background", label: "Background" },
  { slot: "body", label: "Body" },
  { slot: "pattern_colour", label: "Pattern" },
];

function SwatchRow({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(SHIRT_COLOURS).map(([slug, hex]) => (
        <button
          key={slug}
          type="button"
          onClick={() => onSelect(slug)}
          aria-pressed={slug === selected}
          aria-label={slug}
          className={cn(
            "size-8 rounded-full border-2 transition-transform",
            slug === selected
              ? "border-foreground scale-110"
              : slug === "white"
                ? "border-border"
                : "border-transparent",
          )}
          style={{ backgroundColor: hex }}
        />
      ))}
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export function ShirtPicker({ value, onChange }: ShirtPickerProps) {
  const set = (patch: Partial<Shirt>) => onChange({ ...value, ...patch });
  const [activeSlot, setActiveSlot] = useState<ColourSlot>("background");

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <ShirtGraphic shirt={value} size="lg" />
      </div>

      <Section label="Colour">
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {COLOUR_SLOTS.map(({ slot, label }) => (
            <button
              key={slot}
              type="button"
              onClick={() => setActiveSlot(slot)}
              aria-pressed={slot === activeSlot}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                slot === activeSlot
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "size-3 shrink-0 rounded-full border",
                  value[slot] === "white" ? "border-border" : "border-transparent",
                )}
                style={{ backgroundColor: SHIRT_COLOURS[value[slot]] }}
              />
              {label}
            </button>
          ))}
        </div>
        <SwatchRow
          selected={value[activeSlot]}
          onSelect={(colour) => set({ [activeSlot]: colour })}
        />
      </Section>

      <Section label="Design">
        <div className="flex flex-wrap gap-2">
          {SHIRT_PATTERNS.map((pattern) => (
            <button
              key={pattern}
              type="button"
              onClick={() => set({ pattern })}
              aria-pressed={pattern === value.pattern}
              aria-label={pattern}
              className={cn(
                "rounded-md border p-1 transition-colors hover:bg-accent",
                pattern === value.pattern && "border-primary bg-accent",
              )}
            >
              <ShirtGraphic shirt={{ ...value, pattern }} size="sm" />
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
