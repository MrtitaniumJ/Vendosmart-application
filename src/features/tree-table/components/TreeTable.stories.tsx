import type { Meta, StoryObj } from '@storybook/react';
import { TreeTable } from './TreeTable';
import type { TreeItem } from '../../../types/tree';

const meta = {
  title: 'Features/TreeTable',
  component: TreeTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TreeTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData: TreeItem[] = [
  {
    id: 'cat-1',
    children: [
      {
        id: 'sub-1',
        children: [
          {
            id: 'item-1',
            itemCode: 'ITEM-001',
            description: 'Sample Item 1',
            quantity: 100,
            rate: 50,
          },
          {
            id: 'item-2',
            itemCode: 'ITEM-002',
            description: 'Sample Item 2',
            quantity: 50,
            rate: 75,
          },
        ],
      },
    ],
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
