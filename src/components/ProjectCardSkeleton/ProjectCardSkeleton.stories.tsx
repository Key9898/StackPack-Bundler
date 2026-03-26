import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';

const meta: Meta<typeof ProjectCardSkeleton> = {
  title: 'Components/ProjectCardSkeleton',
  component: ProjectCardSkeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  ),
};
