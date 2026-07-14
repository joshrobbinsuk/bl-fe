import { Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { SHIRT_COLOURS, SHIRT_MOTIFS, SHIRT_PATTERNS, type Shirt } from "@/lib/shirts";
import { ShirtGraphic } from "@/components/profile/shirt";

interface ShirtPickerProps {
  value: Shirt;
  onChange: (shirt: Shirt) => void;
}

function SwatchRow({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="flex gap-2">
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

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <ShirtGraphic shirt={value} size="lg" />
      </div>

      <Section label="Background">
        <SwatchRow
          selected={value.background}
          onSelect={(background) => set({ background })}
        />
      </Section>

      <Section label="Body">
        <SwatchRow selected={value.body} onSelect={(body) => set({ body })} />
      </Section>

      <Section label="Pattern">
        <div className="flex gap-2">
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
              <ShirtGraphic shirt={{ ...value, pattern, motif: null }} size="sm" />
            </button>
          ))}
        </div>
      </Section>

      <Section label="Pattern colour">
        <SwatchRow
          selected={value.pattern_colour}
          onSelect={(pattern_colour) => set({ pattern_colour })}
        />
      </Section>

      <Section label="Motif">
        <div className="grid grid-cols-8 gap-2">
          <button
            type="button"
            onClick={() => set({ motif: null })}
            aria-pressed={value.motif === null}
            aria-label="No motif"
            className={cn(
              "flex aspect-square items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent",
              value.motif === null && "border-primary bg-accent",
            )}
          >
            <Ban className="size-4" />
          </button>
          {Object.entries(SHIRT_MOTIFS).map(([slug, emoji]) => (
            <button
              key={slug}
              type="button"
              onClick={() => set({ motif: slug })}
              aria-pressed={slug === value.motif}
              aria-label={slug}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md border text-xl transition-colors hover:bg-accent",
                slug === value.motif && "border-primary bg-accent",
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
