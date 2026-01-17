import type { Meta, StoryObj } from '@storybook/react';
import { HeatmapCell } from './HeatmapCell';
import type { BomRow } from '../../../types/bom';

const meta = {
  title: 'Features/HeatmapCell',
  component: HeatmapCell,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeatmapCell>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleRow: BomRow = {
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
};

export const MinValue: Story = {
  args: {
    row: sampleRow,
    supplierKey: 'Supplier 1 (Rate)',
  },
  render: (args) => (
    <table>
      <tbody>
        <tr>
          <HeatmapCell {...args} />
        </tr>
      </tbody>
    </table>
  ),
};

export const MaxValue: Story = {
  args: {
    row: sampleRow,
    supplierKey: 'Supplier 3 (Rate)',
  },
  render: (args) => (
    <table>
      <tbody>
        <tr>
          <HeatmapCell {...args} />
        </tr>
      </tbody>
    </table>
  ),
};

export const NullValue: Story = {
  args: {
    row: {
      ...sampleRow,
      suppliers: {
        ...sampleRow.suppliers,
        'Supplier 1 (Rate)': null,
      },
    },
    supplierKey: 'Supplier 1 (Rate)',
  },
  render: (args) => (
    <table>
      <tbody>
        <tr>
          <HeatmapCell {...args} />
        </tr>
      </tbody>
    </table>
  ),
};
