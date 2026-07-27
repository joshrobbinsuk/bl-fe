const formatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

/**
 * Format a Decimal-as-string money value as GBP, guarding against missing or
 * non-numeric input (returns "£--" rather than "£NaN").
 */
export function formatMoney(value: string | null | undefined): string {
  if (value == null) return "£--";
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return "£--";
  return formatter.format(parsed);
}
