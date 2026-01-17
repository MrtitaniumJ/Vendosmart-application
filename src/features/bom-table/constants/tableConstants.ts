/**
 * Table configuration constants
 * These values control pagination, UI behavior, and performance settings
 */

/** Default page size for table pagination */
export const DEFAULT_PAGE_SIZE = 10;

/** Available page size options for user selection */
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100] as const;

/** Indentation per level in tree view (in pixels) */
export const TREE_INDENT_PER_LEVEL = 20;

/** Minimum row height in pixels */
export const MIN_ROW_HEIGHT = 60;

/** Processing animation delay before redirect (in milliseconds) */
export const PROCESSING_REDIRECT_DELAY_MS = 1500;

/** Maximum file size for CSV upload (in bytes) - 10MB */
export const MAX_CSV_FILE_SIZE = 10 * 1024 * 1024;

/** Debounce delay for search input (in milliseconds) */
export const SEARCH_DEBOUNCE_MS = 300;
