import { useState, useMemo } from "react";
import type React from "react";
import type { TreeItem } from "../../../types/tree";
import { TreeRow } from "./TreeRow";
import { Button } from "../../../components/ui/Button";

interface TreeTableProps {
  data: TreeItem[];
}

export function TreeTable({ data }: TreeTableProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const getAllItemIds = (items: TreeItem[]): string[] => {
    return items.flatMap((item) => {
      const ids = [item.id];
      if (item.children) {
        ids.push(...getAllItemIds(item.children));
      }
      return ids;
    });
  };

  const allItemIds = useMemo(() => getAllItemIds(data), [data]);
  const allExpanded = allItemIds.every((id) => expandedItems.has(id));

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedItems(new Set(allItemIds));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  const renderRows = (items: TreeItem[], level: number = 0): React.ReactElement[] => {
    return items.flatMap((item) => {
      const isExpanded = expandedItems.has(item.id);
      const rows: React.ReactElement[] = [
        <TreeRow
          key={item.id}
          item={item}
          level={level}
          isExpanded={isExpanded}
          onToggle={() => toggleItem(item.id)}
        />,
      ];

      if (isExpanded && item.children && item.children.length > 0) {
        rows.push(...renderRows(item.children, level + 1));
      }

      return rows;
    });
  };

  if (data.length === 0) {
    return null; // Let parent handle empty state
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={allExpanded ? collapseAll : expandAll}
          className="shadow-sm"
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </Button>
      </div>
      <div className="border border-slate-200/60 rounded-xl overflow-hidden bg-white shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 via-slate-50/80 to-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Item / Category
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-5 py-4 text-right text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-5 py-4 text-right text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {renderRows(data)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
