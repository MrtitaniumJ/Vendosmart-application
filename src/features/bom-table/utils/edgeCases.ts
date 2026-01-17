import type { BomRow } from "../../../types/bom";

/**
 * Edge case handling utilities for BOM data
 * These functions validate and sanitize data to prevent runtime errors
 */

/**
 * Validates that a numeric value is within acceptable bounds
 * @param value - The value to validate
 * @param min - Minimum allowed value (default: 0)
 * @param max - Maximum allowed value (default: Number.MAX_SAFE_INTEGER)
 * @returns true if value is valid, false otherwise
 */
export function isValidNumericRange(
  value: number | null,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): boolean {
  if (value === null) return true; // null is valid (represents missing data)
  return value >= min && value <= max && isFinite(value);
}

/**
 * Safely divides two numbers, handling edge cases
 * @param numerator - The number to divide
 * @param denominator - The number to divide by
 * @returns The result of division, or null if division is invalid
 */
export function safeDivide(
  numerator: number,
  denominator: number
): number | null {
  if (denominator === 0 || !isFinite(denominator) || !isFinite(numerator)) {
    return null;
  }
  const result = numerator / denominator;
  return isFinite(result) ? result : null;
}

/**
 * Validates a BOM row for data integrity
 * @param row - The BOM row to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validateBomRow(row: BomRow): string[] {
  const errors: string[] = [];

  // Validate quantity
  if (row.quantity !== null && !isValidNumericRange(row.quantity, 0)) {
    errors.push(`Invalid quantity for item ${row.itemCode}: ${row.quantity}`);
  }

  // Validate estimated rate
  if (row.estimatedRate !== null && !isValidNumericRange(row.estimatedRate, 0)) {
    errors.push(`Invalid estimated rate for item ${row.itemCode}: ${row.estimatedRate}`);
  }

  // Validate supplier rates
  const supplierKeys: Array<keyof typeof row.suppliers> = [
    "Supplier 1 (Rate)",
    "Supplier 2 (Rate)",
    "Supplier 3 (Rate)",
    "Supplier 4 (Rate)",
    "Supplier 5 (Rate)",
  ];

  for (const key of supplierKeys) {
    const rate = row.suppliers[key];
    if (rate !== null && !isValidNumericRange(rate, 0)) {
      errors.push(`Invalid ${key} for item ${row.itemCode}: ${rate}`);
    }
  }

  // Validate required fields
  if (!row.itemCode || row.itemCode.trim() === "") {
    errors.push("Item Code is required");
  }

  return errors;
}

/**
 * Sanitizes a BOM row by fixing common data issues
 * @param row - The BOM row to sanitize
 * @returns Sanitized BOM row
 */
export function sanitizeBomRow(row: BomRow): BomRow {
  return {
    ...row,
    // Ensure itemCode is not empty
    itemCode: row.itemCode?.trim() || "Unknown",
    material: row.material?.trim() || row.itemCode?.trim() || "Unknown",
    description: row.description?.trim() || row.material?.trim() || "",
    category: row.category?.trim() || "",
    subCategory1: row.subCategory1?.trim() || "",
    subCategory2: row.subCategory2?.trim() || "",
    // Clamp numeric values to valid ranges
    quantity: row.quantity !== null && row.quantity >= 0 ? row.quantity : null,
    estimatedRate: row.estimatedRate !== null && row.estimatedRate >= 0 ? row.estimatedRate : null,
    suppliers: {
      "Supplier 1 (Rate)": row.suppliers["Supplier 1 (Rate)"] !== null && row.suppliers["Supplier 1 (Rate)"]! >= 0
        ? row.suppliers["Supplier 1 (Rate)"]
        : null,
      "Supplier 2 (Rate)": row.suppliers["Supplier 2 (Rate)"] !== null && row.suppliers["Supplier 2 (Rate)"]! >= 0
        ? row.suppliers["Supplier 2 (Rate)"]
        : null,
      "Supplier 3 (Rate)": row.suppliers["Supplier 3 (Rate)"] !== null && row.suppliers["Supplier 3 (Rate)"]! >= 0
        ? row.suppliers["Supplier 3 (Rate)"]
        : null,
      "Supplier 4 (Rate)": row.suppliers["Supplier 4 (Rate)"] !== null && row.suppliers["Supplier 4 (Rate)"]! >= 0
        ? row.suppliers["Supplier 4 (Rate)"]
        : null,
      "Supplier 5 (Rate)": row.suppliers["Supplier 5 (Rate)"] !== null && row.suppliers["Supplier 5 (Rate)"]! >= 0
        ? row.suppliers["Supplier 5 (Rate)"]
        : null,
    },
  };
}
