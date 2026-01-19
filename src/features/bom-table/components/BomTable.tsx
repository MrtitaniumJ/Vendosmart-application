import { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type PaginationState,
} from "@tanstack/react-table";
import type { BomRow, SupplierRateKey } from "../../../types/bom";
import { formatCurrency } from "../../../lib/numbers";
import { calculateHeatmapColor } from "../utils/heatmap";
import { HeatmapCell } from "./HeatmapCell";
import { buildTreeFromBomData, type TreeNode } from "../utils/treeBuilder";

interface BomTableProps {
  data: BomRow[];
}

const SUPPLIER_KEYS: SupplierRateKey[] = [
  "Supplier 1 (Rate)",
  "Supplier 2 (Rate)",
  "Supplier 3 (Rate)",
  "Supplier 4 (Rate)",
  "Supplier 5 (Rate)",
];

export function BomTable({ data }: BomTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [freezeColumnId, setFreezeColumnId] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isTreeView, setIsTreeView] = useState(false);

  // Build tree structure from flat data
  const treeData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return buildTreeFromBomData(data);
  }, [data]);

  // Auto-expand all categories and subcategories by default when tree view is enabled
  // In table view, start with all collapsed
  useEffect(() => {
    if (isTreeView && treeData.length > 0) {
      // Tree view: auto-expand all
      const allNodeIds = new Set<string>();
      const collectIds = (nodes: TreeNode[]) => {
        for (const node of nodes) {
          allNodeIds.add(node.id);
          if (node.children && node.children.length > 0) {
            collectIds(node.children);
          }
        }
      };
      collectIds(treeData);
      setExpandedNodes(allNodeIds);
    } else if (!isTreeView && treeData.length > 0) {
      // Table view: start collapsed (only top-level categories visible)
      setExpandedNodes(new Set());
    }
  }, [isTreeView, treeData]);

  // Flatten tree for display based on expanded state
  // Works for both table view and tree view
  const flattenedData = useMemo(() => {
    if (treeData.length === 0) return [];
    const flatten = (nodes: TreeNode[], result: BomRow[] = []): BomRow[] => {
      for (const node of nodes) {
        result.push(node);
        if (node.children && node.children.length > 0 && expandedNodes.has(node.id || "")) {
          flatten(node.children, result);
        }
      }
      return result;
    };
    return flatten(treeData);
  }, [treeData, expandedNodes]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Check if we should show tree view (only if tree data exists and user toggled it)
  const showTreeView = isTreeView && treeData.length > 0 && treeData[0].level !== undefined;
  
  // Check if we have hierarchical data (for table view with expand/collapse)
  const hasHierarchicalData = treeData.length > 0 && treeData[0].level !== undefined;

  const columns = useMemo<ColumnDef<BomRow>[]>(
    () => {
      const baseColumns: ColumnDef<BomRow>[] = [
        {
          accessorKey: "itemCode",
          header: "Category / Item",
          enableHiding: false,
          cell: (info) => {
            const row = info.row.original;
            const itemCode = info.getValue() as string;
            const level = row.level || 0;
            const hasChildren = row.children && row.children.length > 0;
            const isExpanded = expandedNodes.has(row.id || "");
            // In table view with hierarchical data, show indentation. In tree view, always show indentation.
            const indent = (showTreeView || (hasHierarchicalData && !showTreeView)) ? level * 20 : 0;
            // Show arrow in tree view OR in table view if it has hierarchical data and children
            const showArrow = (showTreeView || (hasHierarchicalData && !showTreeView)) && hasChildren;

            // Determine what to display as primary text
            // For leaf nodes (items), show description or material name
            // For parent nodes (categories/subcategories), show the category/subcategory name (itemCode)
            const isLeafNode = !hasChildren;
            const displayName = isLeafNode 
              ? (row.description || row.material || itemCode)
              : itemCode;
            const secondaryText = isLeafNode && row.description && row.description !== itemCode
              ? itemCode
              : null;

            return (
              <div className="px-2 sm:px-4 py-2 sm:py-2.5 h-full min-h-[60px] flex items-center justify-start">
                <div className="flex items-center gap-1.5 sm:gap-2" style={{ paddingLeft: `${indent}px` }}>
                  {showArrow ? (
                    <button
                      onClick={() => toggleNode(row.id || "")}
                      className="text-slate-600 hover:text-slate-900 active:text-slate-700 focus:outline-none transition-colors flex-shrink-0 p-1 sm:p-0 min-w-[32px] min-h-[32px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-target sm:touch-target-auto"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (showTreeView || (hasHierarchicalData && !showTreeView)) ? (
                    <span className="w-4 flex-shrink-0" />
                  ) : null}
                  <div className="text-left min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold text-black leading-tight break-words">{displayName}</div>
                    {secondaryText && (
                      <div className="text-[10px] sm:text-xs font-medium text-slate-700 mt-0.5 leading-tight break-words">{secondaryText}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          },
        },
      ];

      // In tree view, only show 3 columns: Category/Item, Est. Rate, Qty
      if (showTreeView) {
        return [
          ...baseColumns,
          {
            accessorKey: "estimatedRate",
            header: "Est. Rate",
            enableHiding: false,
            cell: (info) => {
              const value = info.getValue() as number | null;
              return (
                <div className="px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-black text-center font-bold whitespace-nowrap h-full min-h-[60px] flex items-center justify-center">
                  {value === null ? <span className="text-slate-400">—</span> : formatCurrency(value)}
                </div>
              );
            },
            sortingFn: (rowA, rowB) => {
              const a = rowA.original.estimatedRate;
              const b = rowB.original.estimatedRate;
              if (a === null && b === null) return 0;
              if (a === null) return 1;
              if (b === null) return -1;
              return a - b;
            },
          },
          {
            accessorKey: "quantity",
            header: "Qty",
            enableHiding: false,
            cell: (info) => {
              const value = info.getValue() as number | null;
              return (
                <div className="px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 text-center font-semibold whitespace-nowrap h-full min-h-[60px] flex items-center justify-center">
                  {value === null ? <span className="text-slate-400">—</span> : value.toLocaleString()}
                </div>
              );
            },
            sortingFn: (rowA, rowB) => {
              const a = rowA.original.quantity;
              const b = rowB.original.quantity;
              if (a === null && b === null) return 0;
              if (a === null) return 1;
              if (b === null) return -1;
              return a - b;
            },
          },
        ];
      }

      // In regular mode, show all columns including suppliers
      return [
        ...baseColumns,
        ...SUPPLIER_KEYS.map((supplierKey) => ({
          id: supplierKey,
          accessorKey: `suppliers.${supplierKey}`,
          header: supplierKey.replace(" (Rate)", ""),
          enableHiding: true,
          cell: (info: { row: { original: BomRow } }) => {
            return (
              <HeatmapCell
                row={info.row.original}
                supplierKey={supplierKey}
              />
            );
          },
          sortingFn: (rowA: { original: BomRow }, rowB: { original: BomRow }) => {
            const a = rowA.original.suppliers[supplierKey];
            const b = rowB.original.suppliers[supplierKey];
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
          },
        })),
        {
          accessorKey: "estimatedRate",
          header: "Est. Rate",
          enableHiding: true,
          cell: (info) => {
            const value = info.getValue() as number | null;
            return (
              <div className="px-4 py-2.5 text-sm text-black text-center font-bold whitespace-nowrap h-full min-h-[60px] flex items-center justify-center">
                {formatCurrency(value)}
              </div>
            );
          },
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.estimatedRate;
            const b = rowB.original.estimatedRate;
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
          },
        },
        {
          accessorKey: "quantity",
          header: "Qty",
          enableHiding: true,
          cell: (info) => {
            const value = info.getValue() as number | null;
            return (
              <div className="px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 text-center font-semibold whitespace-nowrap h-full min-h-[60px] flex items-center justify-center">
                {value === null ? <span className="text-slate-400">—</span> : value.toLocaleString()}
              </div>
            );
          },
          sortingFn: (rowA, rowB) => {
            const a = rowA.original.quantity;
            const b = rowB.original.quantity;
            if (a === null && b === null) return 0;
            if (a === null) return 1;
            if (b === null) return -1;
            return a - b;
          },
        },
      ];
    },
    [showTreeView, hasHierarchicalData, expandedNodes]
  );

  // Use tree data if in tree view OR if we have hierarchical data in table view, otherwise use flat data
  const displayData = useMemo(() => {
    if (showTreeView) {
      return flattenedData;
    } else if (hasHierarchicalData) {
      // Table view with hierarchical data: use flattened tree
      return flattenedData;
    } else {
      // Table view without hierarchical data: use flat data
      return data;
    }
  }, [showTreeView, hasHierarchicalData, flattenedData, data]);

  const filteredData = useMemo(() => {
    if (!globalFilter) return displayData;
    const filter = globalFilter.toLowerCase();
    return displayData.filter(
      (row) =>
        row.itemCode.toLowerCase().includes(filter) ||
        row.material.toLowerCase().includes(filter) ||
        row.category?.toLowerCase().includes(filter) ||
        row.subCategory1?.toLowerCase().includes(filter) ||
        row.subCategory2?.toLowerCase().includes(filter) ||
        row.description?.toLowerCase().includes(filter)
    );
  }, [displayData, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    enableSorting: true,
    enableRowSelection: false,
    enableColumnResizing: false,
    enableHiding: true,
    globalFilterFn: (row, _columnId, filterValue) => {
      const rowData = row.original;
      const search = filterValue.toLowerCase();
      return (
        rowData.itemCode.toLowerCase().includes(search) ||
        rowData.material.toLowerCase().includes(search)
      );
    },
  });

  const columnDefinitions = useMemo(
    () =>
      table
        .getAllColumns()
        .filter((col) => col.getCanHide())
        .map((col) => ({
          id: col.id,
          label: (col.columnDef.header as string) || col.id,
        })),
    [table]
  );

  const freezeColumnIndex = useMemo(() => {
    if (!freezeColumnId) return -1;
    const allColumns = table.getAllColumns();
    return allColumns.findIndex((col) => col.id === freezeColumnId);
  }, [freezeColumnId, table]);

  const getColumnLeftOffset = (columnIndex: number): number => {
    if (freezeColumnIndex === -1 || columnIndex >= freezeColumnIndex) {
      return 0;
    }

    // Calculate accumulated width of frozen columns
    const headerCells = document.querySelectorAll("thead th");
    let offset = 0;
    for (let i = 0; i < columnIndex && i < headerCells.length; i++) {
      const cell = headerCells[i] as HTMLElement;
      offset += cell.offsetWidth;
    }
    return offset;
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prev: VisibilityState) => ({
      ...prev,
      [columnId]: prev[columnId] === false,
    }));
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const columnMenu = document.getElementById('column-visibility-menu');
      const target = event.target as Node;

      if (columnMenu && !columnMenu.contains(target) && !(target as Element).closest('button[title="Show/Hide Columns"]')) {
        columnMenu.style.display = 'none';
      }
      const settingsMenu = document.getElementById('table-settings-menu');
      if (settingsMenu && !settingsMenu.contains(target) && !(target as Element).closest('button[title="Table Settings"]')) {
        settingsMenu.style.display = 'none';
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No data available. Please upload a CSV file first.
      </div>
    );
  }


  return (
    <div className="animate-fade-in">
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-lg relative z-10">
        {/* First row: Search bar (aligned left) */}
        <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 sm:py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 bg-white min-h-[44px] sm:min-h-0"
          />
        </div>

        {/* Second row: Three icons (aligned right) */}
        <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center justify-end gap-2 flex-wrap">
          {/* First icon: Toggle between table view and tree view - Down in table view, Up in tree view */}
          <button
            onClick={() => setIsTreeView(!isTreeView)}
            className="p-2.5 sm:p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded-full border border-slate-300 transition-colors relative min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-target"
            title={showTreeView ? "Switch to Table View" : "Switch to Tree View"}
            aria-label={showTreeView ? "Switch to Table View" : "Switch to Tree View"}
          >
            {showTreeView ? (
              // Tree view: Show upward chevrons
              <svg className="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7" />
              </svg>
            ) : (
              // Table view: Show downward chevrons
              <svg className="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 15l-7 7-7-7" />
              </svg>
            )}
          </button>
          {/* Second icon: Show/Hide Columns - Always visible */}
          <div className="relative">
            <button
              onClick={() => {
                // Toggle column visibility menu
                const menu = document.getElementById('column-visibility-menu');
                if (menu) {
                  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                }
              }}
              className="p-2.5 sm:p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded-full border border-slate-300 transition-colors relative min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-target"
              title="Show/Hide Columns"
              aria-label="Show/Hide Columns"
            >
              <svg className="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h6M4 10h6M4 14h6M14 6h6M14 10h6M14 14h6" />
              </svg>
            </button>
            <div
              id="column-visibility-menu"
              className="hidden absolute right-0 sm:right-0 left-auto sm:left-auto top-full mt-1 bg-white border border-slate-300 rounded shadow-lg z-50 min-w-[220px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="p-2 max-h-96 overflow-y-auto">
                <div className="px-3 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 bg-slate-50 mb-1">
                  Show/Hide Columns
                </div>
                {columnDefinitions.map((column) => (
                  <label
                    key={column.id}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={columnVisibility[column.id] !== false}
                      onChange={() => {
                        toggleColumnVisibility(column.id);
                        const menu = document.getElementById('column-visibility-menu');
                        if (menu) menu.style.display = 'none';
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                    />
                    <span className="text-sm text-slate-700 font-medium">{column.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => {
                // Toggle table settings menu
                const menu = document.getElementById('table-settings-menu');
                if (menu) {
                  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                }
              }}
              className="p-2.5 sm:p-1.5 hover:bg-slate-100 active:bg-slate-200 rounded-full border border-slate-300 transition-colors relative min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-target"
              title="Table Settings"
              aria-label="Table Settings"
            >
              <svg className="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <div
              id="table-settings-menu"
              className="hidden absolute right-0 sm:right-0 left-auto sm:left-auto top-full mt-1 bg-white border border-slate-300 rounded shadow-lg z-50 min-w-[200px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 bg-slate-50 mb-1">
                  Table Settings
                </div>
                <div className="px-2 py-1 text-xs font-semibold text-slate-700 border-b border-slate-200 mb-1">
                  Freeze Columns
                </div>
                <button
                  onClick={() => {
                    setFreezeColumnId(null);
                    const menu = document.getElementById('table-settings-menu');
                    if (menu) menu.style.display = 'none';
                  }}
                  className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-100 ${!freezeColumnId ? 'bg-slate-100 font-medium' : ''}`}
                >
                  None
                </button>
                {columnDefinitions.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setFreezeColumnId(col.id);
                      const menu = document.getElementById('table-settings-menu');
                      if (menu) menu.style.display = 'none';
                    }}
                    className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-100 ${freezeColumnId === col.id ? 'bg-slate-100 font-medium' : ''}`}
                  >
                    Before {col.label}
                  </button>
                ))}
                <div className="border-t border-slate-200 my-1"></div>
                <button
                  onClick={() => {
                    // Reset all table settings
                    setSorting([]);
                    setGlobalFilter("");
                    setFreezeColumnId(null);
                    setColumnVisibility({});
                    const menu = document.getElementById('table-settings-menu');
                    if (menu) menu.style.display = 'none';
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors"
                >
                  Reset All Settings
                </button>
                <button
                  onClick={() => {
                    // Show all columns
                    setColumnVisibility({});
                    const menu = document.getElementById('table-settings-menu');
                    if (menu) menu.style.display = 'none';
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors"
                >
                  Show All Columns
                </button>
                <button
                  onClick={() => {
                    // Hide all supplier columns except first one
                    const supplierColumns = columnDefinitions.filter(col => 
                      col.id.includes('Supplier') && col.id !== 'Supplier 1 (Rate)'
                    );
                    const newVisibility: VisibilityState = {};
                    supplierColumns.forEach(col => {
                      newVisibility[col.id] = false;
                    });
                    setColumnVisibility(newVisibility);
                    const menu = document.getElementById('table-settings-menu');
                    if (menu) menu.style.display = 'none';
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded transition-colors"
                >
                  Show Only First Supplier
                </button>
                <div className="border-t border-slate-200 my-1"></div>
                <div className="px-3 py-2 text-xs text-slate-600">
                  <div className="font-medium mb-1">Current Status:</div>
                  <div className="text-xs space-y-0.5">
                    <div>Rows: {table.getRowModel().rows.length} of {data.length}</div>
                    <div>Sorting: {sorting.length > 0 ? `${sorting.length} column(s)` : 'None'}</div>
                    <div>Frozen: {freezeColumnId ? 'Yes' : 'No'}</div>
                    <div>Hidden: {Object.values(columnVisibility).filter(v => v === false).length} column(s)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 ${showTreeView ? 'overflow-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-250px)]' : 'overflow-x-auto -mx-1 sm:mx-0'}`}>
          <table className="w-full border-separate border-spacing-0 min-w-full">
            <thead className="bg-slate-50 sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => {
                    const isFrozen = freezeColumnIndex !== -1 && idx < freezeColumnIndex;
                    const leftOffset = isFrozen ? getColumnLeftOffset(idx) : 0;
                    const isLast = idx === headerGroup.headers.length - 1;
                    const isFirst = idx === 0;

                    return (
                      <th
                        key={header.id}
                        className={`
                          px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-extrabold uppercase tracking-wider whitespace-nowrap
                          border-r border-b-2 border-slate-200
                          ${isFirst ? "border-l-0" : ""}
                          ${isLast ? "border-r-0" : ""}
                          ${header.column.getCanSort() ? "cursor-pointer select-none hover:bg-slate-100 active:bg-slate-200 transition-colors group touch-target sm:touch-target-auto" : ""}
                        `}
                        style={{
                          position: isFrozen ? "sticky" : "relative",
                          left: isFrozen ? `${leftOffset}px` : "auto",
                          zIndex: isFrozen ? 30 : 2,
                          backgroundColor: isFrozen ? "#f8fafc" : undefined,
                          color: "#000000",
                          fontWeight: 900,
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <span style={{ fontWeight: 900, color: "#000000" }}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {header.column.getCanSort() && (
                            <span className="text-slate-600 text-xs font-bold group-hover:text-black transition-colors">
                              {{
                                asc: "↑",
                                desc: "↓",
                              }[header.column.getIsSorted() as string] ?? "⇅"}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => {
                const isLastRow = idx === table.getRowModel().rows.length - 1;
                return (
                  <tr key={row.id} className={`hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/20"}`}>
                    {row.getVisibleCells().map((cell, cellIdx) => {
                      const columnId = cell.column.id;
                      const allColumns = table.getAllColumns();
                      const columnIndex = allColumns.findIndex((col) => col.id === columnId);
                      const isFrozen = freezeColumnIndex !== -1 && columnIndex < freezeColumnIndex;
                      const leftOffset = isFrozen ? getColumnLeftOffset(columnIndex) : 0;
                      const isLastCell = cellIdx === row.getVisibleCells().length - 1;
                      const isFirstCell = cellIdx === 0;

                      // Check if this is a supplier column (heatmap cell)
                      const isSupplierColumn = SUPPLIER_KEYS.includes(cell.column.id as SupplierRateKey);
                      const rowData = row.original;
                      let cellBackgroundColor: string | undefined = undefined;
                      
                      if (isSupplierColumn && !isFrozen) {
                        const supplierKey = cell.column.id as SupplierRateKey;
                        const supplierValue = rowData.suppliers[supplierKey];
                        const heatmapColor = calculateHeatmapColor(supplierValue, rowData);
                        cellBackgroundColor = heatmapColor.backgroundColor;
                      } else if (isFrozen) {
                        cellBackgroundColor = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
                      }

                      // Determine text alignment - left for Category/Item, center for others
                      const isCategoryColumn = cell.column.id === "itemCode";
                      const textAlign = isCategoryColumn ? "left" : "center";

                      return (
                        <td
                          key={cell.id}
                          className={`
                            border-r border-b border-slate-200
                            ${isFirstCell ? "border-l-0" : ""}
                            ${isLastCell ? "border-r-0" : ""}
                            ${isLastRow ? "border-b-0" : ""}
                            p-0 align-top
                          `}
                          style={{
                            position: isFrozen ? "sticky" : "relative",
                            left: isFrozen ? `${leftOffset}px` : "auto",
                            zIndex: isFrozen ? 20 : 1,
                            backgroundColor: cellBackgroundColor,
                            minHeight: "60px",
                            height: "auto",
                            margin: 0,
                            padding: 0,
                            textAlign: textAlign as "left" | "center" | "right",
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls - Only show in table view */}
        {!showTreeView && (
          <div className="bg-white border-t border-slate-200 px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2">
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <span className="text-xs sm:text-sm text-slate-700 whitespace-nowrap">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} entries
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap order-1 sm:order-2">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] sm:min-h-0 touch-target"
                aria-label="First page"
              >
                <span className="hidden sm:inline">First</span>
                <span className="sm:hidden">«</span>
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] sm:min-h-0 touch-target"
                aria-label="Previous page"
              >
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">‹</span>
              </button>
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-sm text-slate-700 hidden sm:inline">Page</span>
                <input
                  type="number"
                  min={1}
                  max={table.getPageCount()}
                  value={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    table.setPageIndex(page);
                  }}
                  className="w-12 sm:w-14 px-2 py-2 sm:py-1 text-xs sm:text-sm border border-slate-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-slate-400 min-h-[44px] sm:min-h-0"
                  aria-label="Page number"
                />
                <span className="text-xs sm:text-sm text-slate-700">of {table.getPageCount()}</span>
              </div>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] sm:min-h-0 touch-target"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">›</span>
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-2.5 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm border border-slate-300 rounded hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] sm:min-h-0 touch-target"
                aria-label="Last page"
              >
                <span className="hidden sm:inline">Last</span>
                <span className="sm:hidden">»</span>
              </button>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="px-2 sm:px-2.5 py-2 sm:py-1.5 text-xs sm:text-sm border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 min-h-[44px] sm:min-h-0"
                aria-label="Items per page"
              >
                {[10, 20, 30, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
