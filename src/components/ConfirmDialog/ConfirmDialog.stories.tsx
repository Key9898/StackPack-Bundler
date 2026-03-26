import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmDialog } from './ConfirmDialog';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    isOpen: true,
    title: 'Delete Project',
    message: 'Are you sure you want to delete this project? This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled'),
    variant: 'danger',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Delete Project',
    message: 'Are you sure you want to delete this project? This action cannot be undone.',
    confirmLabel: 'Delete',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Unsaved Changes',
    message: 'You have unsaved changes. Are you sure you want to leave?',
    confirmLabel: 'Leave',
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};
