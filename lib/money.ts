const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Format a Decimal-as-string money value as USD, guarding against missing or
 * non-numeric input (returns "$--" rather than "$NaN").
 */
export function formatMoney(value: string | null | undefined): string {
  if (value == null) return "$--";
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) return "$--";
  return formatter.format(parsed);
}
