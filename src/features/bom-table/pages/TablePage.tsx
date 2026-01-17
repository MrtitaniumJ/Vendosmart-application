import { BomTable } from "../components/BomTable";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Button } from "../../../components/ui/Button";
import { useBomStore } from "../../../store/useBomStore";
import { useNavigate } from "react-router-dom";

export function TablePage() {
  const { rows, fileName, clearBomData } = useBomStore();
  const navigate = useNavigate();

  const handleUploadNew = () => {
    clearBomData();
    navigate("/upload");
  };

  if (rows.length === 0) {
    return (
      <div className="min-h-screen py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <EmptyState
            title="No data available"
            description="Please upload a CSV file to view the BOM table"
            action={
              <Button onClick={handleUploadNew}>Upload CSV File</Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex-shrink-0">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                    BOM Heatmap Table
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                    Interactive table with supplier rate comparison and heatmap visualization
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleUploadNew} 
              variant="outline" 
              className="shadow-md w-full sm:w-auto min-h-[44px] touch-target"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="hidden sm:inline">Upload New File</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </div>
          {fileName && (
            <div className="inline-flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm max-w-full">
              <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium truncate">{fileName}</span>
            </div>
          )}
        </div>
        <BomTable data={rows} />
      </div>
    </div>
  );
}
