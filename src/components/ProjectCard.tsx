import React from 'react';
import { Download, Calendar, FileCode } from 'lucide-react';

export interface Project {
    id: string;
    name: string;
    outputType: 'html' | 'js';
    createdAt: Date;
    fileCount: number;
    content?: string;
}

interface ProjectCardProps {
    project: Project;
    onDownload: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDownload }) => {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <div className="card group hover:border-amber-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                        <FileCode className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-amber-900 text-lg">
                            {project.name}
                        </h3>
                        <span className="text-xs text-amber-600 uppercase font-medium">
                            {project.outputType === 'html' ? 'Standalone HTML' : 'Web Component'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onDownload(project)}
                    className="p-2 hover:bg-amber-100 rounded-lg transition-colors duration-200 group-hover:scale-110 transform"
                    title="Download"
                >
                    <Download className="w-5 h-5 text-amber-600" />
                </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-amber-700">
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                    <FileCode className="w-4 h-4" />
                    <span>{project.fileCount} files</span>
                </div>
            </div>
        </div>
    );
};
