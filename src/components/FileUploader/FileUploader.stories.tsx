import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileUploader } from './FileUploader';

const meta: Meta<typeof FileUploader> = {
  title: 'Components/FileUploader',
  component: FileUploader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onFilesSelected: (files: File[]) => console.log('Files selected:', files),
    accept: '.html,.css,.js,.jsx,.ts,.tsx,.jpg,.jpeg,.png,.gif,.svg,.webp,.mp4,.webm',
    resetTrigger: 0,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomAccept: Story = {
  args: {
    accept: '.html,.css,.js',
  },
};

export const AfterReset: Story = {
  args: {
    resetTrigger: 1,
  },
};
