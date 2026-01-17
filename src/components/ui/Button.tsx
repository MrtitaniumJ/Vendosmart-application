import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]";
    
    const variants = {
      primary: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 shadow-indigo-500/20 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
      outline: "border-2 border-slate-300 bg-white text-slate-900 hover:bg-slate-50 hover:border-indigo-400 active:bg-slate-100 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-1",
      ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
      danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 active:from-red-800 active:to-rose-800 shadow-red-500/20 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
