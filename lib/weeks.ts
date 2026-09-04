/** "25 Aug" for a cup's `week_start`, for the "Week of …" labels. */
export function formatWeekStart(weekStart: string): string {
  return new Date(weekStart).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
