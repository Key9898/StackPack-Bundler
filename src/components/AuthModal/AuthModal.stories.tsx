import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthModal } from './AuthModal';

const meta: Meta<typeof AuthModal> = {
  title: 'Components/AuthModal',
  component: AuthModal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: () => console.log('Close modal'),
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

export const Default: Story = {};

export const Closed: Story = {
  args: {
    isOpen: false,
  },
};
