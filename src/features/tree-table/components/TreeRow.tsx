import type { TreeItem } from "../../../types/tree";
import { formatCurrency } from "../../../lib/numbers";

interface TreeRowProps {
  item: TreeItem;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export function TreeRow({ item, level, isExpanded, onToggle }: TreeRowProps) {
  const hasChildren = item.children && item.children.length > 0;
  const indent = level * 24;

  const getRowCount = (item: TreeItem): number => {
    if (!item.children || item.children.length === 0) return 1;
    return item.children.reduce((sum, child) => sum + getRowCount(child), 1);
  };

  const rowCount = hasChildren ? getRowCount(item) : 1;

  const isGroup = hasChildren;

  return (
    <>
      <tr className={`hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-teal-50/20 transition-all ${isGroup ? "bg-emerald-50/20" : ""}`}>
        <td className="px-5 py-3">
          <div className="flex items-center" style={{ paddingLeft: `${indent}px` }}>
            {hasChildren ? (
              <button
                onClick={onToggle}
                className="mr-3 text-slate-400 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 rounded transition-colors"
              >
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <span className="w-7 mr-3" />
            )}
            <span className={`text-sm font-semibold ${isGroup ? "text-slate-900" : "text-slate-700"}`}>
              {item.itemCode || item.description || "Unnamed"}
            </span>
            {hasChildren && (
              <span className="ml-2.5 px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-100 rounded-md border border-emerald-200">
                {rowCount} items
              </span>
            )}
          </div>
        </td>
        <td className="px-5 py-3 text-sm text-slate-600">
          {item.description || <span className="text-slate-400">—</span>}
        </td>
        <td className="px-5 py-3 text-sm text-slate-900 text-right font-semibold">
          {item.quantity !== undefined ? item.quantity.toLocaleString() : <span className="text-slate-400">—</span>}
        </td>
        <td className="px-5 py-3 text-sm text-slate-900 text-right font-semibold">
          {formatCurrency(item.rate)}
        </td>
      </tr>
    </>
  );
}
