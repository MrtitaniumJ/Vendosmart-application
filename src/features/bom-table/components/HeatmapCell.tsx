import { memo } from "react";
import type { BomRow, SupplierRateKey } from "../../../types/bom";
import { calculateHeatmapColor } from "../utils/heatmap";
import { formatCurrency, formatPercentageDiff, calculatePercentageDiff } from "../../../lib/numbers";
import { Tooltip } from "../../../components/ui/Tooltip";

interface HeatmapCellProps {
  row: BomRow;
  supplierKey: SupplierRateKey;
}

export const HeatmapCell = memo(function HeatmapCell({
  row,
  supplierKey,
}: HeatmapCellProps) {
  const value = row.suppliers[supplierKey];
  const color = calculateHeatmapColor(value, row);
  const diff = calculatePercentageDiff(value, row.estimatedRate);
  const diffStr = formatPercentageDiff(diff);
  
  const tooltipText = value !== null && row.estimatedRate !== null
    ? `Estimated: ${formatCurrency(row.estimatedRate)}\nSupplier: ${formatCurrency(value)}\nDiff: ${diffStr}`
    : value === null
    ? "No supplier rate available"
    : "No estimated rate available";

  const getArrowIcon = (diff: number | null) => {
    if (diff === null || diff === 0) return null;
    if (diff > 0) {
      return (
        <svg className="h-3 w-3 inline-block ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="h-3 w-3 inline-block ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  // Determine text color based on percentage difference
  const getTextColor = (diff: number | null) => {
    if (diff === null) return "#000000";
    if (diff < 0) {
      // Green for negative (decrease)
      return "#166534"; // green-800
    } else if (diff > 0) {
      // Red for positive (increase)
      return "#991b1b"; // red-800
    }
    return "#000000";
  };

  return (
    <Tooltip content={tooltipText} position="top">
      <div
        className="h-full w-full min-h-[60px] flex flex-col justify-center items-center px-2 sm:px-4 py-2 sm:py-2.5 cursor-help"
        style={{
          color: color.textColor,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div 
          className="text-xs sm:text-sm font-bold leading-tight"
          style={{ 
            textAlign: "center",
            width: "100%",
          }}
        >
          {formatCurrency(value)}
        </div>
        {value !== null && diff !== null && (
          <div 
            className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-bold flex items-center justify-center gap-0.5"
            style={{ 
              color: getTextColor(diff),
              textAlign: "center",
              width: "100%",
            }}
          >
            {diffStr}
            {getArrowIcon(diff)}
          </div>
        )}
      </div>
    </Tooltip>
  );
});
