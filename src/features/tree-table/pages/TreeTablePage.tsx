import { TreeTable } from "../components/TreeTable";
import { buildTreeData, sampleTreeData } from "../utils/treeBuilder";
import { useMemo } from "react";
import { EmptyState } from "../../../components/ui/EmptyState";

export function TreeTablePage() {
  const treeData = useMemo(() => buildTreeData(sampleTreeData), []);

  return (
    <div className="min-h-screen animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                Tree Table View
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 font-medium">
                Hierarchical view of categories, sub-categories, and items
              </p>
            </div>
          </div>
        </div>
        {treeData.length === 0 ? (
          <EmptyState
            title="No tree data available"
            description="Tree table data will be displayed here when available"
          />
        ) : (
          <TreeTable data={treeData} />
        )}
      </div>
    </div>
  );
}
