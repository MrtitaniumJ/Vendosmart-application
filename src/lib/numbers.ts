/**
 * Safely parses a numeric value from a string
 * Returns null if the value cannot be parsed or is empty
 */
export function parseNumeric(value: string | undefined | null): number | null {
  if (!value || value.trim() === "") return null;
  const parsed = parseFloat(value.replace(/,/g, ""));
  return isNaN(parsed) ? null : parsed;
}

/**
 * Formats a number as currency with ₹ symbol
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `₹ ${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Formats a number as currency without symbol (for display)
 */
export function formatCurrencyValue(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Calculates percentage difference between supplier rate and estimated rate
 * Returns null if calculation cannot be performed
 */
export function calculatePercentageDiff(
  supplierRate: number | null,
  estimatedRate: number | null
): number | null {
  if (supplierRate === null || estimatedRate === null || estimatedRate === 0) {
    return null;
  }
  return ((supplierRate - estimatedRate) / estimatedRate) * 100;
}

/**
 * Formats percentage difference with sign
 */
export function formatPercentageDiff(diff: number | null): string {
  if (diff === null) return "—";
  const sign = diff >= 0 ? "+" : "";
  return `${sign}${diff.toFixed(1)}%`;
}
