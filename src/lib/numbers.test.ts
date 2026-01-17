import { describe, it, expect } from 'vitest';
import {
  parseNumeric,
  formatCurrency,
  calculatePercentageDiff,
  formatPercentageDiff,
} from './numbers';

describe('numbers', () => {
  describe('parseNumeric', () => {
    it('should parse valid numbers', () => {
      expect(parseNumeric('123')).toBe(123);
      expect(parseNumeric('123.45')).toBe(123.45);
      expect(parseNumeric('1,234.56')).toBe(1234.56);
    });

    it('should return null for invalid values', () => {
      expect(parseNumeric('')).toBe(null);
      expect(parseNumeric('abc')).toBe(null);
      expect(parseNumeric(null)).toBe(null);
      expect(parseNumeric(undefined)).toBe(null);
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers as currency', () => {
      expect(formatCurrency(123.45)).toContain('₹');
      expect(formatCurrency(1234.56)).toContain('1,234.56');
    });

    it('should return — for null/undefined', () => {
      expect(formatCurrency(null)).toBe('—');
      expect(formatCurrency(undefined)).toBe('—');
    });
  });

  describe('calculatePercentageDiff', () => {
    it('should calculate percentage difference correctly', () => {
      expect(calculatePercentageDiff(110, 100)).toBe(10);
      expect(calculatePercentageDiff(90, 100)).toBe(-10);
      expect(calculatePercentageDiff(100, 100)).toBe(0);
    });

    it('should return null for invalid inputs', () => {
      expect(calculatePercentageDiff(null, 100)).toBe(null);
      expect(calculatePercentageDiff(100, null)).toBe(null);
      expect(calculatePercentageDiff(100, 0)).toBe(null);
    });
  });

  describe('formatPercentageDiff', () => {
    it('should format positive percentages with + sign', () => {
      expect(formatPercentageDiff(10)).toBe('+10.0%');
      expect(formatPercentageDiff(5.5)).toBe('+5.5%');
    });

    it('should format negative percentages without + sign', () => {
      expect(formatPercentageDiff(-10)).toBe('-10.0%');
    });

    it('should return — for null', () => {
      expect(formatPercentageDiff(null)).toBe('—');
    });
  });
});
