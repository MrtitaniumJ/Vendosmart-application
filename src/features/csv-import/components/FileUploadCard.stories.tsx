import type { Meta, StoryObj } from '@storybook/react';
import { FileUploadCard } from './FileUploadCard';
import { fn } from '@storybook/test';

const meta = {
  title: 'Features/FileUploadCard',
  component: FileUploadCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onFileParsed: fn(),
    onError: fn(),
  },
} satisfies Meta<typeof FileUploadCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    onFileParsed: fn(),
    onError: fn(),
  },
};
