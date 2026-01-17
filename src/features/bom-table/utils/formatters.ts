import { formatCurrency, formatPercentageDiff, calculatePercentageDiff } from "../../../lib/numbers";
import type { SupplierRateKey } from "../../../types/bom";

/**
 * Formats supplier rate with percentage difference
 */
export function formatSupplierRate(
  supplierRate: number | null,
  estimatedRate: number | null,
  _supplierKey: SupplierRateKey
): string {
  if (supplierRate === null) {
    return "—";
  }

  const diff = calculatePercentageDiff(supplierRate, estimatedRate);
  const diffStr = formatPercentageDiff(diff);
  const currencyStr = formatCurrency(supplierRate);

  return `${currencyStr} (${diffStr})`;
}
