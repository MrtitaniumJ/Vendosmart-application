import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUploadCard } from "../components/FileUploadCard";
import { useBomStore } from "../../../store/useBomStore";
import { useToast } from "../../../lib/toast";
import { ProcessingAnimation } from "../../../components/ui/ProcessingAnimation";
import type { BomRow } from "../../../types/bom";

export function UploadPage() {
  const navigate = useNavigate();
  const { setBomData } = useBomStore();
  const { error: showError, success: showSuccess } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileName, setProcessingFileName] = useState<string | null>(null);

  const handleFileParsed = (data: BomRow[], file: string) => {
    setIsProcessing(true);
    setProcessingFileName(file);
    
    // Show success toast
    showSuccess("File uploaded successfully", `${data.length} rows parsed from ${file}`);
    
    // Save data to store
    setBomData(data, file);
    
    // Wait a moment to show the processing animation, then redirect
    setTimeout(() => {
      navigate("/table");
    }, 1500);
  };

  const handleError = (errorMessages: string[]) => {
    setIsProcessing(false);
    setProcessingFileName(null);
    
    // Show first error as main toast
    if (errorMessages.length > 0) {
      const firstError = errorMessages[0];
      const hasHeaderError = firstError.includes("Missing required headers");
      
      if (hasHeaderError) {
        showError(
          "Validation Error",
          "Missing required headers. Expected: Category, Sub Category 1, Sub Category 2, Item Code, Description, Quantity, Estimated Rate, Supplier 1-5 (Rate)"
        );
      } else {
        showError("Validation Error", firstError);
      }
      
      // Show additional errors if any
      if (errorMessages.length > 1) {
        errorMessages.slice(1).forEach((err) => {
          setTimeout(() => {
            showError("Validation Error", err);
          }, 100);
        });
      }
    }
  };

  return (
    <div className="min-h-screen animate-slide-up">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex-shrink-0">
              <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
                Upload BOM CSV
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-1.5 font-medium">
                Import your bill of materials data from a CSV file
              </p>
            </div>
          </div>
        </div>

        <FileUploadCard onFileParsed={handleFileParsed} onError={handleError} />
      </div>
      
      {/* Processing Animation Overlay */}
      {isProcessing && processingFileName && (
        <ProcessingAnimation fileName={processingFileName} />
      )}
    </div>
  );
}
