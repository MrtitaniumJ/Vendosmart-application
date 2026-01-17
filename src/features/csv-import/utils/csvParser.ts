import Papa from "papaparse";
import type { BomRow } from "../../../types/bom";
import { parseNumeric } from "../../../lib/numbers";
import { sanitizeBomRow, validateBomRow } from "../../bom-table/utils/edgeCases";

export interface ParseResult {
  success: boolean;
  data: BomRow[];
  errors: string[];
}

/**
 * Parses CSV file and converts to BomRow array
 * 
 * **Edge Cases Handled**:
 * - Empty files
 * - Missing headers
 * - Invalid numeric values (converted to null)
 * - Empty rows (skipped)
 * - Whitespace trimming
 * - Data validation and sanitization
 * 
 * @param file - The CSV file to parse
 * @returns Promise resolving to ParseResult with data and errors
 * 
 * @example
 * ```ts
 * const result = await parseCsvFile(file);
 * if (result.success) {
 *   console.log(`Parsed ${result.data.length} rows`);
 * } else {
 *   console.error(result.errors);
 * }
 * ```
 */
export async function parseCsvFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = [];
        const data: BomRow[] = [];

        if (results.errors.length > 0) {
          errors.push(...results.errors.map((e) => e.message || "Parse error"));
        }

        if (!results.data || results.data.length === 0) {
          resolve({
            success: false,
            data: [],
            errors: ["CSV file is empty or contains no data rows"],
          });
          return;
        }

        // Validate headers
        const headers = results.meta.fields || [];
        const missingHeaders = [
          "Category",
          "Sub Category 1",
          "Sub Category 2",
          "Item Code",
          "Description",
          "Quantity",
          "Estimated Rate",
          "Supplier 1 (Rate)",
          "Supplier 2 (Rate)",
          "Supplier 3 (Rate)",
          "Supplier 4 (Rate)",
          "Supplier 5 (Rate)",
        ].filter((h) => !headers.includes(h));

        if (missingHeaders.length > 0) {
          resolve({
            success: false,
            data: [],
            errors: [
              `Missing required headers: ${missingHeaders.join(", ")}`,
              `Expected headers: ${[
                "Category",
                "Sub Category 1",
                "Sub Category 2",
                "Item Code",
                "Description",
                "Quantity",
                "Estimated Rate",
                "Supplier 1 (Rate)",
                "Supplier 2 (Rate)",
                "Supplier 3 (Rate)",
                "Supplier 4 (Rate)",
                "Supplier 5 (Rate)",
              ].join(", ")}`,
            ],
          });
          return;
        }

        // Parse rows with validation and sanitization
        for (let i = 0; i < results.data.length; i++) {
          const row = results.data[i] as Record<string, string>;

          // Skip completely empty rows
          const hasData = Object.values(row).some((val) => val && val.trim() !== "");
          if (!hasData) {
            continue;
          }

          const bomRow: BomRow = {
            category: row["Category"]?.trim() || "",
            subCategory1: row["Sub Category 1"]?.trim() || "",
            subCategory2: row["Sub Category 2"]?.trim() || "",
            itemCode: row["Item Code"]?.trim() || "",
            material: row["Item Code"]?.trim() || "", // Keep for backward compatibility
            description: row["Description"]?.trim() || "",
            quantity: parseNumeric(row["Quantity"]),
            estimatedRate: parseNumeric(row["Estimated Rate"]),
            suppliers: {
              "Supplier 1 (Rate)": parseNumeric(row["Supplier 1 (Rate)"]),
              "Supplier 2 (Rate)": parseNumeric(row["Supplier 2 (Rate)"]),
              "Supplier 3 (Rate)": parseNumeric(row["Supplier 3 (Rate)"]),
              "Supplier 4 (Rate)": parseNumeric(row["Supplier 4 (Rate)"]),
              "Supplier 5 (Rate)": parseNumeric(row["Supplier 5 (Rate)"]),
            },
            id: `row-${i}`,
          };

          // Validate and sanitize the row
          const validationErrors = validateBomRow(bomRow);
          if (validationErrors.length > 0) {
            // Log validation errors but don't fail parsing
            errors.push(`Row ${i + 1}: ${validationErrors.join(", ")}`);
          }

          // Sanitize the row (fixes common data issues)
          const sanitizedRow = sanitizeBomRow(bomRow);
          data.push(sanitizedRow);
        }

        resolve({
          success: true,
          data,
          errors,
        });
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          errors: [error.message || "Failed to parse CSV file"],
        });
      },
    });
  });
}
