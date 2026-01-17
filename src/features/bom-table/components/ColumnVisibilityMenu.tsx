import { useState, useRef, useEffect } from "react";
import { Card } from "../../../components/ui/Card";

interface ColumnVisibilityMenuProps {
  columns: { id: string; label: string }[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnId: string) => void;
}

export function ColumnVisibilityMenu({
  columns,
  visibleColumns,
  onToggleColumn,
}: ColumnVisibilityMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

          return (
            <div className="relative z-50" ref={menuRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                title="Columns"
              >
                <svg className="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 z-[9999]">
          <Card className="min-w-[220px] shadow-2xl border-slate-200">
            <div className="p-2 max-h-96 overflow-y-auto">
              <div className="px-3 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 bg-slate-50">
                Show/Hide Columns
              </div>
              {columns.map((column) => (
                <label
                  key={column.id}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns[column.id] !== false}
                    onChange={() => onToggleColumn(column.id)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-700 font-medium">{column.label}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
