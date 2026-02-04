import { useState, useEffect, useRef } from "react";
import type { BomRow, SupplierRateKey } from "../../../types/bom";
import { calculateHeatmapColor, type HeatmapStrategy } from "../utils/heatmap";
import { formatCurrency, formatPercentageDiff, calculatePercentageDiff } from "../../../lib/numbers";
import { Tooltip } from "../../../components/ui/Tooltip";

interface HeatmapCellProps {
  row: BomRow;
  supplierKey: SupplierRateKey;
  heatmapStrategy?: HeatmapStrategy;
  isSandboxMode?: boolean;
  onUpdate?: (rowId: string, supplierKey: SupplierRateKey, value: number) => void;
  originalValue?: number | null;
}

export function HeatmapCell({
  row,
  supplierKey,
  heatmapStrategy = "value",
  isSandboxMode = false,
  onUpdate,
  originalValue
}: HeatmapCellProps) {
  const value = row.suppliers[supplierKey];

  // Use local state to display value immediately after edit, before props update
  const [displayValue, setDisplayValue] = useState<number | null>(value);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync displayValue with prop value when it changes from parent
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const color = calculateHeatmapColor(displayValue, row, heatmapStrategy);
  const diff = calculatePercentageDiff(displayValue, row.estimatedRate);
  const diffStr = formatPercentageDiff(diff);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    if (!isSandboxMode) return;
    setEditValue(displayValue?.toString() || "");
    setIsEditing(true);
  };

  const handleFinishEdit = () => {
    if (editValue.trim() === "") {
      setIsEditing(false);
      return;
    }

    const numValue = parseFloat(editValue);
    if (!isNaN(numValue) && onUpdate && row.id) {
      // Update display value immediately for instant feedback
      setDisplayValue(numValue);
      onUpdate(row.id, supplierKey, numValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFinishEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const isModified = originalValue !== undefined && displayValue !== originalValue;

  const tooltipText = (() => {
    let text = "";
    if (displayValue !== null && row.estimatedRate !== null) {
      text = `Estimated: ${formatCurrency(row.estimatedRate)}\nSupplier: ${formatCurrency(displayValue)}\nDiff: ${diffStr}`;
    } else {
      text = displayValue === null ? "No supplier rate available" : "No estimated rate available";
    }

    if (isModified && originalValue !== null && originalValue !== undefined) {
      text += `\nOriginal: ${formatCurrency(originalValue)}`;
    }
    return text;
  })();

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

  if (isEditing) {
    return (
      <div className="h-full w-full min-h-[60px] p-1 flex items-center justify-center bg-white border border-blue-500 rounded z-20 relative">
        <input
          ref={inputRef}
          type="number"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleFinishEdit}
          onKeyDown={handleKeyDown}
          className="w-full h-full text-center text-sm font-bold bg-transparent outline-none p-0"
          step="0.01"
        />
      </div>
    );
  }

  return (
    <Tooltip content={tooltipText} position="top">
      <div
        onClick={handleStartEdit}
        className={`h-full w-full min-h-[60px] flex flex-col justify-center items-center px-2 sm:px-4 py-2 sm:py-2.5 ${isSandboxMode ? "cursor-text hover:brightness-95" : "cursor-help"} transition-all relative`}
        style={{
          color: color.textColor,
          backgroundColor: color.backgroundColor, // Applied here safely
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isModified && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-sm ring-1 ring-white" title="Modified value" />
        )}
        <div
          className="text-xs sm:text-sm font-bold leading-tight"
          style={{
            textAlign: "center",
            width: "100%",
          }}
        >
          {formatCurrency(displayValue)}
        </div>
        {displayValue !== null && diff !== null && (
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
}
