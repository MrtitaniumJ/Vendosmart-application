import type { BomRow, SupplierRateKey } from "../../../types/bom";

export interface HeatmapColor {
  backgroundColor: string;
  textColor: string;
}

/**
 * Gets all non-null supplier rates from a row
 * @param row - The BOM row to extract supplier rates from
 * @returns Array of tuples containing [supplierKey, rateValue]
 */
function getSupplierRates(row: BomRow): Array<[SupplierRateKey, number]> {
  const supplierKeys: SupplierRateKey[] = [
    "Supplier 1 (Rate)",
    "Supplier 2 (Rate)",
    "Supplier 3 (Rate)",
    "Supplier 4 (Rate)",
    "Supplier 5 (Rate)",
  ];

  return supplierKeys
    .map((key) => [key, row.suppliers[key]] as [SupplierRateKey, number | null])
    .filter(([, value]) => value !== null) as Array<[SupplierRateKey, number]>;
}

/**
 * Converts HSL color to RGB
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns RGB color string
 */
function hslToRgb(h: number, s: number, l: number): string {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

/**
 * Calculates heatmap color for a supplier rate value.
 * 
 * **Heatmap Logic (Per Row):**
 * - The maximum rate in each row is colored red (most expensive)
 * - The minimum rate in each row is colored green (least expensive)
 * - Intermediate values use a smooth gradient from green → yellow → red
 * - The middle value (average of min and max) is colored yellow
 * - Percentage difference from estimated rate is also displayed (separate from color)
 * 
 * **Color Gradient:**
 * - Position 0.0 (min) → Green (HSL: 120°)
 * - Position 0.5 (middle) → Yellow (HSL: 60°)
 * - Position 1.0 (max) → Red (HSL: 0°)
 * 
 * @param value - The supplier rate value to color (can be null)
 * @param row - The BOM row containing all supplier rates and estimated rate
 * @returns HeatmapColor object with backgroundColor and textColor
 * 
 * @example
 * ```ts
 * const row: BomRow = {
 *   estimatedRate: 100,
 *   suppliers: {
 *     "Supplier 1 (Rate)": 90,  // Min - will be green
 *     "Supplier 2 (Rate)": 95,  // Intermediate - yellow-green
 *     "Supplier 3 (Rate)": 100, // Middle - yellow
 *     "Supplier 4 (Rate)": 105,  // Intermediate - yellow-red
 *     "Supplier 5 (Rate)": 110, // Max - will be red
 *   }
 * };
 * const color = calculateHeatmapColor(90, row); // Returns green color
 * ```
 */
export function calculateHeatmapColor(
  value: number | null,
  row: BomRow
): HeatmapColor {
  // Handle null or invalid values
  if (value === null) {
    return {
      backgroundColor: "#ffffff",
      textColor: "#6b7280",
    };
  }

  // Get all non-null supplier rates for this row
  const supplierRates = getSupplierRates(row);

  // If no valid supplier rates, return default
  if (supplierRates.length === 0) {
    return {
      backgroundColor: "#ffffff",
      textColor: "#6b7280",
    };
  }

  // Find min and max rates in this row
  const rates = supplierRates.map(([, rate]) => rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);

  // If all rates are the same, use neutral yellow color
  if (minRate === maxRate) {
    return {
      backgroundColor: "#fef3c7", // amber-100 (light yellow)
      textColor: "#92400e",
    };
  }

  // Calculate position in the range (0 = min/green, 0.5 = middle/yellow, 1 = max/red)
  const range = maxRate - minRate;
  const position = range > 0 ? (value - minRate) / range : 0;

  // Map position to HSL color space for smooth gradient
  // Green (120°) → Yellow (60°) → Red (0°)
  // We use a smooth transition through the color wheel
  let hue: number;
  if (position <= 0.5) {
    // Green to Yellow: 120° → 60° (first half)
    hue = 120 - (position * 2 * 60); // position 0 → 120°, position 0.5 → 60°
  } else {
    // Yellow to Red: 60° → 0° (second half)
    hue = 60 - ((position - 0.5) * 2 * 60); // position 0.5 → 60°, position 1 → 0°
  }

  // Use high saturation and medium lightness for vibrant colors
  const saturation = 85; // High saturation for vivid colors
  const lightness = 75; // Medium lightness for good contrast with black text

  const backgroundColor = hslToRgb(hue, saturation, lightness);
  const textColor = "#000000"; // Black for maximum contrast

  return {
    backgroundColor,
    textColor,
  };
}
