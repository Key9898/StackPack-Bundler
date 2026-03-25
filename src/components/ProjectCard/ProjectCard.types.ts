export interface Project {
  id: string;
  name: string;
  outputType: 'html' | 'js';
  createdAt: Date;
  fileCount: number;
  content?: string;
  isPublic?: boolean;
}

export interface ProjectCardProps {
  project: Project;
  onDownload: (project: Project) => void;
  onDelete: (project: Project) => void;
  onShare?: (project: Project) => void;
  onToggleVisibility?: (project: Project) => void;
}
