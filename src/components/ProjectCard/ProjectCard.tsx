import React from 'react';
import { Download, Calendar, FileCode, Files, Trash2, Share2, Globe, Lock } from 'lucide-react';
import type { ProjectCardProps } from './ProjectCard.types';

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onDownload,
  onDelete,
  onShare,
  onToggleVisibility,
}) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 group cursor-pointer">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl group-hover:from-amber-200 group-hover:to-orange-200 dark:group-hover:from-amber-900/50 dark:group-hover:to-orange-900/50 transition-colors duration-300 flex-shrink-0">
            <FileCode className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-amber-900 dark:text-amber-100 text-lg truncate mb-1">
              {project.name}
            </h3>
            <span className="inline-block px-2 py-1 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-md font-medium uppercase tracking-wide">
              {project.outputType === 'html' ? '📄 HTML' : '⚙️ Component'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {onToggleVisibility && (
            <button
              onClick={() => onToggleVisibility(project)}
              className={`p-2.5 rounded-xl transition-all duration-200 ${project.isPublic ? 'hover:bg-green-100 dark:hover:bg-green-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              title={
                project.isPublic
                  ? 'Public — click to make private'
                  : 'Private — click to make public'
              }
            >
              {project.isPublic ? (
                <Globe className="w-5 h-5 text-green-500" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              )}
            </button>
          )}
          {onShare && (
            <button
              onClick={() => onShare(project)}
              className="p-2.5 hover:bg-blue-100 rounded-xl transition-all duration-200"
              title="Copy shareable link"
            >
              <Share2 className="w-5 h-5 text-blue-400 hover:text-blue-600" />
            </button>
          )}
          <button
            onClick={() => onDownload(project)}
            className="p-2.5 hover:bg-amber-100 rounded-xl transition-all duration-200 group-hover:scale-110 transform"
            title="Download Project"
          >
            <Download className="w-5 h-5 text-amber-600 group-hover:text-amber-700" />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-2.5 hover:bg-red-100 rounded-xl transition-all duration-200"
            title="Delete Project"
          >
            <Trash2 className="w-5 h-5 text-red-400 hover:text-red-600" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-200 dark:via-gray-600 to-transparent mb-4"></div>

      {/* Footer Section */}
      <div className="flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{formatDate(project.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
          <Files className="w-4 h-4 flex-shrink-0" />
          <span className="font-semibold">{project.fileCount}</span>
        </div>
      </div>
    </div>
  );
};
