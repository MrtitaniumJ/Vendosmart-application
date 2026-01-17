import type { Meta, StoryObj } from '@storybook/react';
import { BomTable } from './BomTable';
import type { BomRow } from '../../../types/bom';

const meta = {
  title: 'Features/BomTable',
  component: BomTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BomTable>;

export default meta;
type Story = StoryObj<typeof meta>;

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
  {
    itemCode: 'ITEM-002',
    material: 'Aluminum',
    quantity: 50,
    estimatedRate: 75,
    suppliers: {
      'Supplier 1 (Rate)': 70,
      'Supplier 2 (Rate)': 75,
      'Supplier 3 (Rate)': 80,
      'Supplier 4 (Rate)': 72,
      'Supplier 5 (Rate)': 78,
    },
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
