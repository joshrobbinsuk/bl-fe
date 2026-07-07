import { cn } from "@/lib/utils";
import { AVATAR_COLOURS, AVATAR_ICONS, fallbackColourFor, parseAvatar } from "@/lib/avatars";

type AvatarSize = "sm" | "md" | "lg";

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "size-6 text-sm",
  md: "size-8 text-base",
  lg: "size-16 text-3xl",
};

interface UserAvatarProps {
  avatar: string | null;
  userId: string;
  username: string | null;
  size?: AvatarSize;
  className?: string;
}

export function UserAvatar({
  avatar,
  userId,
  username,
  size = "md",
  className,
}: UserAvatarProps) {
  const parsed = avatar ? parseAvatar(avatar) : null;
  const backgroundColor = parsed
    ? AVATAR_COLOURS[parsed.colour]
    : fallbackColourFor(userId);
  const content = parsed
    ? AVATAR_ICONS[parsed.icon]
    : (username?.[0]?.toUpperCase() ?? "?");

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        parsed?.colour === "white" && "border border-border",
        SIZE_CLASSES[size],
        className,
      )}
      style={{ backgroundColor }}
    >
      {content}
    </div>
  );
}
