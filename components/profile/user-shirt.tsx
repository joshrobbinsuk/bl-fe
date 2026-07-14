import { cn } from "@/lib/utils";
import { fallbackColourFor, type Shirt } from "@/lib/shirts";
import { ShirtGraphic } from "@/components/profile/shirt";

type ShirtSize = "sm" | "md" | "lg";

const FALLBACK_SIZE_CLASSES: Record<ShirtSize, string> = {
  sm: "size-6 text-sm",
  md: "size-8 text-base",
  lg: "size-16 text-3xl",
};

interface UserShirtProps {
  shirt: Shirt | null;
  userId: string;
  username: string | null;
  size?: ShirtSize;
  className?: string;
}

export function UserShirt({
  shirt,
  userId,
  username,
  size = "md",
  className,
}: UserShirtProps) {
  if (shirt) {
    return <ShirtGraphic shirt={shirt} size={size} className={className} />;
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        FALLBACK_SIZE_CLASSES[size],
        className,
      )}
      style={{ backgroundColor: fallbackColourFor(userId) }}
    >
      {username?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}
