import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-neutral-100 text-neutral-800",
      success: "bg-green-50 text-green-700 border border-green-200",
      warning: "bg-amber-50 text-amber-700 border border-amber-200",
      error: "bg-red-50 text-red-700 border border-red-200",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
