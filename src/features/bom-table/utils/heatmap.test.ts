import { describe, it, expect } from 'vitest';
import { calculateHeatmapColor } from './heatmap';
import type { BomRow } from '../../../types/bom';

describe('heatmap', () => {
  describe('calculateHeatmapColor', () => {
    it('should return neutral color for null values', () => {
      const row: BomRow = {
        itemCode: 'TEST',
        material: 'Test',
        quantity: 1,
        estimatedRate: 100,
        suppliers: {
          'Supplier 1 (Rate)': null,
          'Supplier 2 (Rate)': null,
          'Supplier 3 (Rate)': null,
          'Supplier 4 (Rate)': null,
          'Supplier 5 (Rate)': null,
        },
      };
      const color = calculateHeatmapColor(null, row);
      expect(color.backgroundColor).toBe('#ffffff');
      expect(color.textColor).toBe('#6b7280');
    });

    it('should return green for min value', () => {
      const row: BomRow = {
        itemCode: 'TEST',
        material: 'Test',
        quantity: 1,
        estimatedRate: 100,
        suppliers: {
          'Supplier 1 (Rate)': 50,
          'Supplier 2 (Rate)': 60,
          'Supplier 3 (Rate)': 70,
          'Supplier 4 (Rate)': 80,
          'Supplier 5 (Rate)': 90,
        },
      };
      const color = calculateHeatmapColor(50, row);
      expect(color.backgroundColor).toContain('rgb');
      expect(color.textColor).toBeDefined();
    });

    it('should return neutral yellow when all values are equal', () => {
      const row: BomRow = {
        itemCode: 'TEST',
        material: 'Test',
        quantity: 1,
        estimatedRate: 100,
        suppliers: {
          'Supplier 1 (Rate)': 50,
          'Supplier 2 (Rate)': 50,
          'Supplier 3 (Rate)': 50,
          'Supplier 4 (Rate)': 50,
          'Supplier 5 (Rate)': 50,
        },
      };
      const color = calculateHeatmapColor(50, row);
      expect(color.backgroundColor).toBe('#fef3c7');
      expect(color.textColor).toBe('#92400e');
    });
  });
});
