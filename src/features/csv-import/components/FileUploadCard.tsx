import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { parseCsvFile } from "../utils/csvParser";
import type { BomRow } from "../../../types/bom";

interface FileUploadCardProps {
  onFileParsed: (data: BomRow[], fileName: string) => void;
  onError: (errors: string[]) => void;
}

export function FileUploadCard({ onFileParsed, onError }: FileUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        onError(["Please select a CSV file"]);
        return;
      }

      setSelectedFile(file);
      setIsProcessing(true);

      try {
        const result = await parseCsvFile(file);
        if (result.success) {
          onFileParsed(result.data, file.name);
        } else {
          onError(result.errors);
          setSelectedFile(null);
        }
      } catch (error) {
        onError([error instanceof Error ? error.message : "Failed to process file"]);
        setSelectedFile(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [onFileParsed, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleReset = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle>Import CSV File</CardTitle>
        <p className="text-sm text-slate-600 mt-1.5 font-medium">Upload your BOM data in CSV format</p>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 relative overflow-hidden
            ${
              isDragging
                ? "border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 scale-[1.01] shadow-lg"
                : "border-slate-300 bg-gradient-to-br from-slate-50/50 to-white hover:border-indigo-400 hover:bg-gradient-to-br hover:from-indigo-50/30 hover:to-purple-50/20 hover:shadow-md"
            }
          `}
        >
          {selectedFile && !isProcessing ? (
            <div className="space-y-5 animate-scale-in">
              <div className="flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
                  <svg
                    className="h-7 w-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">{selectedFile.name}</p>
                <p className="text-sm text-slate-600 mt-1 font-medium">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button onClick={handleReset} variant="outline" size="sm" className="shadow-sm">
                Replace File
              </Button>
            </div>
          ) : !isProcessing ? (
            <div className="space-y-5">
              <div className="flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-indigo-200/50">
                  <svg
                    className="h-7 w-7 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="file-upload" className="cursor-pointer group">
                  <span className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Click to upload
                  </span>
                  <span className="text-base text-slate-600"> or </span>
                  <span className="text-base font-semibold text-indigo-600">drag and drop</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileInput}
                  disabled={isProcessing}
                />
                <p className="text-xs text-slate-500 font-medium">CSV files only • Max 10MB</p>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
