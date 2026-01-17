import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + 8;
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          break;
        case "left":
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case "right":
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          left = triggerRect.right + 8;
          break;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  const tooltipElement = isVisible ? (
    <div
      ref={tooltipRef}
      className="fixed px-2 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded shadow-lg whitespace-pre-line max-w-xs animate-fade-in pointer-events-none"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        zIndex: 999999,
      }}
    >
      {content}
      <div
        className={cn(
          "absolute w-1.5 h-1.5 bg-neutral-900 rotate-45",
          position === "top" && "top-full left-1/2 -translate-x-1/2 -mt-0.5",
          position === "bottom" && "bottom-full left-1/2 -translate-x-1/2 -mb-0.5",
          position === "left" && "left-full top-1/2 -translate-y-1/2 -ml-0.5",
          position === "right" && "right-full top-1/2 -translate-y-1/2 -mr-0.5"
        )}
      />
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-block w-full h-full"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {typeof document !== "undefined" && createPortal(tooltipElement, document.body)}
    </>
  );
}
