import { type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-9 w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Dropdown.displayName = "Dropdown";
