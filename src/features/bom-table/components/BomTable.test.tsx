import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BomTable } from './BomTable';
import type { BomRow } from '../../../types/bom';

describe('BomTable', () => {
  const sampleData: BomRow[] = [
    {
      itemCode: 'ITEM-001',
      material: 'Steel',
      quantity: 100,
      estimatedRate: 50,
      suppliers: {
        'Supplier 1 (Rate)': 45,
        'Supplier 2 (Rate)': 50,
        'Supplier 3 (Rate)': 55,
        'Supplier 4 (Rate)': 48,
        'Supplier 5 (Rate)': 52,
      },
    },
  ];

  it('should render empty state when no data', () => {
    render(<BomTable data={[]} />);
    expect(screen.getByText(/No data available/)).toBeInTheDocument();
  });

  it('should render table with data', () => {
    render(<BomTable data={sampleData} />);
    expect(screen.getByText('ITEM-001')).toBeInTheDocument();
    expect(screen.getByText('Steel')).toBeInTheDocument();
  });
});
