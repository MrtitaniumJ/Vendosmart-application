import type { Meta, StoryObj } from '@storybook/react';
import { ColumnVisibilityMenu } from './ColumnVisibilityMenu';
import { fn } from '@storybook/test';

const meta = {
  title: 'Features/ColumnVisibilityMenu',
  component: ColumnVisibilityMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ColumnVisibilityMenu>;

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
    visibleColumns: { itemCode: true, material: true, quantity: true, estimatedRate: true },
    onToggleColumn: fn(),
  },
};

export const SomeHidden: Story = {
  args: {
    columns,
    visibleColumns: { itemCode: true, material: false, quantity: true, estimatedRate: false },
    onToggleColumn: fn(),
  },
};
