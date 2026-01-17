export type SupplierRateKey =
  | "Supplier 1 (Rate)"
  | "Supplier 2 (Rate)"
  | "Supplier 3 (Rate)"
  | "Supplier 4 (Rate)"
  | "Supplier 5 (Rate)";

export interface BomRow {
  category?: string;
  subCategory1?: string;
  subCategory2?: string;
  itemCode: string;
  material: string;
  description?: string;
  quantity: number | null;
  estimatedRate: number | null;
  suppliers: Record<SupplierRateKey, number | null>;
  // For tree structure
  level?: number;
  isExpanded?: boolean;
  children?: BomRow[];
  parentId?: string;
  id?: string;
}

export const REQUIRED_HEADERS = [
  "Category",
  "Sub Category 1",
  "Sub Category 2",
  "Item Code",
  "Description",
  "Quantity",
  "Estimated Rate",
  "Supplier 1 (Rate)",
  "Supplier 2 (Rate)",
  "Supplier 3 (Rate)",
  "Supplier 4 (Rate)",
  "Supplier 5 (Rate)",
] as const;
