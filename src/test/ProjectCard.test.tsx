import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectCard, type Project } from '../components/ProjectCard';

const mockProject: Project = {
  id: 'test-id-123',
  name: 'My Test Bundle',
  outputType: 'html',
  createdAt: new Date('2024-06-01T10:00:00'),
  fileCount: 5,
  content: '<html>...</html>',
  isPublic: false,
};

describe('ProjectCard', () => {
  it('renders the project name', () => {
    render(<ProjectCard project={mockProject} onDownload={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('My Test Bundle')).toBeInTheDocument();
  });

  it('renders the HTML output type badge', () => {
    render(<ProjectCard project={mockProject} onDownload={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/HTML/)).toBeInTheDocument();
  });

  it('renders the Web Component badge for js type', () => {
    const jsProject: Project = { ...mockProject, outputType: 'js' };
    render(<ProjectCard project={jsProject} onDownload={() => {}} onDelete={() => {}} />);
    expect(screen.getByText(/Component/)).toBeInTheDocument();
  });

  it('renders the file count', () => {
    render(<ProjectCard project={mockProject} onDownload={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onDownload with the project when download button is clicked', () => {
    const mockDownload = vi.fn();
    render(<ProjectCard project={mockProject} onDownload={mockDownload} onDelete={() => {}} />);
    fireEvent.click(screen.getByTitle('Download Project'));
    expect(mockDownload).toHaveBeenCalledWith(mockProject);
  });

  it('calls onDelete with the project when delete button is clicked', () => {
    const mockDelete = vi.fn();
    render(<ProjectCard project={mockProject} onDownload={() => {}} onDelete={mockDelete} />);
    fireEvent.click(screen.getByTitle('Delete Project'));
    expect(mockDelete).toHaveBeenCalledWith(mockProject);
  });

  it('shows share button when onShare prop is provided', () => {
    render(
      <ProjectCard
        project={mockProject}
        onDownload={() => {}}
        onDelete={() => {}}
        onShare={() => {}}
      />
    );
    expect(screen.getByTitle('Copy shareable link')).toBeInTheDocument();
  });

  it('does not show share button when onShare is not provided', () => {
    render(<ProjectCard project={mockProject} onDownload={() => {}} onDelete={() => {}} />);
    expect(screen.queryByTitle('Copy shareable link')).not.toBeInTheDocument();
  });

  it('shows lock icon when project is private', () => {
    render(
      <ProjectCard
        project={{ ...mockProject, isPublic: false }}
        onDownload={() => {}}
        onDelete={() => {}}
        onToggleVisibility={() => {}}
      />
    );
    expect(screen.getByTitle(/Private/)).toBeInTheDocument();
  });

  it('shows globe icon when project is public', () => {
    render(
      <ProjectCard
        project={{ ...mockProject, isPublic: true }}
        onDownload={() => {}}
        onDelete={() => {}}
        onToggleVisibility={() => {}}
      />
    );
    expect(screen.getByTitle(/Public/)).toBeInTheDocument();
  });

  it('calls onToggleVisibility when visibility button is clicked', () => {
    const mockToggle = vi.fn();
    render(
      <ProjectCard
        project={mockProject}
        onDownload={() => {}}
        onDelete={() => {}}
        onToggleVisibility={mockToggle}
      />
    );
    fireEvent.click(screen.getByTitle(/Private/));
    expect(mockToggle).toHaveBeenCalledWith(mockProject);
  });
});
