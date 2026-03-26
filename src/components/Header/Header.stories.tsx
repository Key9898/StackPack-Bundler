import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    currentPage: 'upload',
    onNavigate: (page: 'upload' | 'dashboard') => console.log('Navigate to:', page),
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50">
        <Story />
        <div className="p-8 text-center text-gray-500">Page content goes here...</div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const OnUploadPage: Story = {
  args: {
    currentPage: 'upload',
  },
};

export const OnDashboardPage: Story = {
  args: {
    currentPage: 'dashboard',
  },
};
