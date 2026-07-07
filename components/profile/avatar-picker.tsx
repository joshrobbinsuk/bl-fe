import { cn } from "@/lib/utils";
import { AVATAR_COLOURS, AVATAR_ICONS, parseAvatar } from "@/lib/avatars";

interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
}

export function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  const parsed = parseAvatar(value);
  const icon = parsed?.icon ?? Object.keys(AVATAR_ICONS)[0];
  const colour = parsed?.colour ?? Object.keys(AVATAR_COLOURS)[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-2">
        {Object.entries(AVATAR_ICONS).map(([slug, emoji]) => (
          <button
            key={slug}
            type="button"
            onClick={() => onChange(`${slug}-${colour}`)}
            aria-pressed={slug === icon}
            aria-label={slug}
            className={cn(
              "flex aspect-square items-center justify-center rounded-md border text-xl transition-colors hover:bg-accent",
              slug === icon && "border-primary bg-accent",
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {Object.entries(AVATAR_COLOURS).map(([slug, hex]) => (
          <button
            key={slug}
            type="button"
            onClick={() => onChange(`${icon}-${slug}`)}
            aria-pressed={slug === colour}
            aria-label={slug}
            className={cn(
              "size-8 rounded-full border-2 transition-transform",
              slug === colour
                ? "border-foreground scale-110"
                : "border-transparent",
            )}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>
  );
}
