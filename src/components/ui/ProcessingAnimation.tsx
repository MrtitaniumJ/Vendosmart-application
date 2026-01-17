export function ProcessingAnimation({ fileName }: { fileName: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Animated spinner */}
        <div className="flex items-center justify-center">
          <div className="relative">
            {/* Outer ring */}
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            {/* Inner ring */}
            <div 
              className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-r-purple-400" 
              style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
            ></div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <svg className="h-5 w-5 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Processing text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Processing File</h3>
          <p className="text-sm text-slate-600 font-medium">{fileName}</p>
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
