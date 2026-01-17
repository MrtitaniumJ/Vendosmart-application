import { useRef, useEffect, useCallback, useState } from "react";

/**
 * Custom hook for managing dropdown menu visibility
 * Handles click-outside detection and menu state management
 * 
 * @returns Object containing ref and toggle function
 * 
 * @example
 * ```tsx
 * const { menuRef, isOpen, toggle, close } = useDropdownMenu();
 * 
 * return (
 *   <div>
 *     <button onClick={toggle}>Toggle Menu</button>
 *     {isOpen && (
 *       <div ref={menuRef}>
 *         Menu content
 *       </div>
 *     )}
 *   </div>
 * );
 * ```
 */
export function useDropdownMenu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Don't close if clicking inside menu or trigger button
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }

      close();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, close]);

  return {
    menuRef,
    triggerRef,
    isOpen,
    toggle,
    close,
  };
}
