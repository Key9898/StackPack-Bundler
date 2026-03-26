import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProjectCard } from './ProjectCard';
import type { Project } from './ProjectCard.types';

const mockProject: Project = {
  id: 'demo-project-123',
  name: 'My Awesome Bundle',
  outputType: 'html',
  createdAt: new Date('2024-06-15T10:30:00'),
  fileCount: 5,
  content: '<html>...</html>',
  isPublic: false,
};

const mockPublicProject: Project = {
  id: 'public-project-456',
  name: 'Shared Component Library',
  outputType: 'js',
  createdAt: new Date('2024-07-20T14:45:00'),
  fileCount: 12,
  content: 'export default {}',
  isPublic: true,
};

const meta: Meta<typeof ProjectCard> = {
  title: 'Components/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    project: mockProject,
    onDownload: (project: Project) => console.log('Download:', project),
    onDelete: (project: Project) => console.log('Delete:', project),
  },
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

export const PublicProject: Story = {
  args: {
    project: mockPublicProject,
    onShare: (project: Project) => console.log('Share:', project),
    onToggleVisibility: (project: Project) => console.log('Toggle visibility:', project),
  },
};

export const PrivateProject: Story = {
  args: {
    project: { ...mockProject, isPublic: false },
    onToggleVisibility: (project: Project) => console.log('Toggle visibility:', project),
  },
};

export const WithShare: Story = {
  args: {
    onShare: (project: Project) => console.log('Share:', project),
  },
};

export const WebComponent: Story = {
  args: {
    project: { ...mockProject, outputType: 'js', name: 'Custom Web Component' },
  },
};

export const LongName: Story = {
  args: {
    project: {
      ...mockProject,
      name: 'This is a very long project name that should be truncated properly',
    },
  },
};
