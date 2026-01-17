import { create } from "zustand";
import type { BomRow } from "../types/bom";

interface BomStore {
  rows: BomRow[];
  fileName: string | null;
  setBomData: (rows: BomRow[], fileName: string) => void;
  clearBomData: () => void;
}

export const useBomStore = create<BomStore>((set) => ({
  rows: [],
  fileName: null,
  setBomData: (rows, fileName) => set({ rows, fileName }),
  clearBomData: () => set({ rows: [], fileName: null }),
}));
