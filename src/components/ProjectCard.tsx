import React from 'react';
import { Download, Calendar, FileCode, Files } from 'lucide-react';

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
        <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-amber-400 transition-all duration-300 group cursor-pointer">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl group-hover:from-amber-200 group-hover:to-orange-200 transition-colors duration-300 flex-shrink-0">
                        <FileCode className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-amber-900 text-lg truncate mb-1">
                            {project.name}
                        </h3>
                        <span className="inline-block px-2 py-1 text-xs text-amber-700 bg-amber-50 rounded-md font-medium uppercase tracking-wide">
                            {project.outputType === 'html' ? '📄 HTML' : '⚙️ Component'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onDownload(project)}
                    className="p-2.5 hover:bg-amber-100 rounded-xl transition-all duration-200 group-hover:scale-110 transform flex-shrink-0 ml-2"
                    title="Download Project"
                >
                    <Download className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
                </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent mb-4"></div>

            {/* Footer Section */}
            <div className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-amber-700">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    <Files className="w-4 h-4 flex-shrink-0" />
                    <span className="font-semibold">{project.fileCount}</span>
                </div>
            </div>
        </div>
    );
};
