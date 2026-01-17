import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export function ToastComponent({ toast, onRemove }: ToastProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const duration = toast.duration ?? 5000;
    const timer = setTimeout(() => {
      setIsRemoving(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const variants = {
    success: {
      bg: "bg-gradient-to-r from-emerald-50 to-teal-50",
      border: "border-emerald-200",
      icon: "text-emerald-600",
      title: "text-emerald-900",
      description: "text-emerald-800",
      iconBg: "bg-emerald-100",
      iconSvg: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: "bg-gradient-to-r from-red-50 to-rose-50",
      border: "border-red-200",
      icon: "text-red-600",
      title: "text-red-900",
      description: "text-red-800",
      iconBg: "bg-red-100",
      iconSvg: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    warning: {
      bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      title: "text-amber-900",
      description: "text-amber-800",
      iconBg: "bg-amber-100",
      iconSvg: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg: "bg-gradient-to-r from-indigo-50 to-purple-50",
      border: "border-indigo-200",
      icon: "text-indigo-600",
      title: "text-indigo-900",
      description: "text-indigo-800",
      iconBg: "bg-indigo-100",
      iconSvg: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const variant = variants[toast.type];

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 rounded-xl border-2 p-4 shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-up",
        variant.bg,
        variant.border,
        isRemoving && "opacity-0 translate-x-full"
      )}
    >
      <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg", variant.iconBg, variant.icon)}>
        {variant.iconSvg}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={cn("text-sm font-bold", variant.title)}>{toast.title}</h4>
        {toast.description && (
          <p className={cn("mt-1 text-sm", variant.description)}>{toast.description}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
