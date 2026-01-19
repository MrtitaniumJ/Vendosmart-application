import { describe, it, expect } from 'vitest';
import { validateHeaders } from './csvValidation';

describe('csvValidation', () => {
  describe('validateHeaders', () => {
    it('should validate correct headers', () => {
      const headers = [
        'Category',
        'Sub Category 1',
        'Sub Category 2',
        'Item Code',
        'Material',
        'Description',
        'Quantity',
        'Estimated Rate',
        'Supplier 1 (Rate)',
        'Supplier 2 (Rate)',
        'Supplier 3 (Rate)',
        'Supplier 4 (Rate)',
        'Supplier 5 (Rate)',
      ];
      const result = validateHeaders(headers);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing headers', () => {
      const headers = ['Item Code', 'Material'];
      const result = validateHeaders(headers);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Missing required headers');
    });

    it('should handle headers with extra whitespace', () => {
      const headers = [
        ' Category ',
        'Sub Category 1',
        'Sub Category 2',
        ' Item Code ',
        'Material',
        'Description',
        'Quantity',
        'Estimated Rate',
        'Supplier 1 (Rate)',
        'Supplier 2 (Rate)',
        'Supplier 3 (Rate)',
        'Supplier 4 (Rate)',
        'Supplier 5 (Rate)',
      ];
      const result = validateHeaders(headers);
      expect(result.isValid).toBe(true);
    });
  });
});
