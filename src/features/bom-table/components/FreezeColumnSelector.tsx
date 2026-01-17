import { Dropdown } from "../../../components/ui/Dropdown";

interface FreezeColumnSelectorProps {
  columns: { id: string; label: string }[];
  selectedColumn: string | null;
  onSelectColumn: (columnId: string | null) => void;
}

export function FreezeColumnSelector({
  columns,
  selectedColumn,
  onSelectColumn,
}: FreezeColumnSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      <Dropdown
        id="freeze-column"
        value={selectedColumn || ""}
        onChange={(e) => onSelectColumn(e.target.value || null)}
        className="min-w-[140px] h-7 text-xs border-slate-300"
        title="Freeze columns"
      >
        <option value="">None</option>
        {columns.map((col) => (
          <option key={col.id} value={col.id}>
            Before {col.label}
          </option>
        ))}
      </Dropdown>
    </div>
  );
}
