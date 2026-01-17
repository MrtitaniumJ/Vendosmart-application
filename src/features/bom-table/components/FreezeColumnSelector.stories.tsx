import type { Meta, StoryObj } from '@storybook/react';
import { FreezeColumnSelector } from './FreezeColumnSelector';
import { fn } from '@storybook/test';

const meta = {
  title: 'Features/FreezeColumnSelector',
  component: FreezeColumnSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FreezeColumnSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = [
  { id: 'itemCode', label: 'Item Code' },
  { id: 'material', label: 'Material' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'estimatedRate', label: 'Estimated Rate' },
];

export const Default: Story = {
  args: {
    columns,
    selectedColumn: null,
    onSelectColumn: fn(),
  },
};

export const WithSelection: Story = {
  args: {
    columns,
    selectedColumn: 'quantity',
    onSelectColumn: fn(),
  },
};
