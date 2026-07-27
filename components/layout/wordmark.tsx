import { cn } from "@/lib/utils";

/**
 * The BROKELADS wordmark. Uppercased in CSS rather than in the text so the
 * accessible name stays "BrokeLads". Colour comes from the caller.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-black italic uppercase tracking-tight leading-none",
        className,
      )}
    >
      BrokeLads
    </span>
  );
}
