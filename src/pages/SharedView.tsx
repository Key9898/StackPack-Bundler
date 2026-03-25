import React, { useEffect, useState } from 'react';
import { FirebaseService } from '../services/FirebaseService';
import { downloadFile } from '../utils/BundlerLogic';
import type { Project } from '../components/ProjectCard';
import { Package, Download, AlertCircle, Loader2, Lock } from 'lucide-react';

interface SharedViewProps {
  projectId: string;
}

export const SharedView: React.FC<SharedViewProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProject = async (): Promise<void> => {
      try {
        const fetchedProject = await FirebaseService.getPublicProject(projectId);

        if (!fetchedProject) {
          setError('Project not found. The link may be invalid or expired.');
          return;
        }

        if (!fetchedProject.isPublic) {
          setError('This project is private and cannot be viewed publicly.');
          return;
        }

        setProject(fetchedProject);
      } catch (err) {
        console.error('Error loading shared project:', err);
        setError('Failed to load project. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleDownload = (): void => {
    if (project?.content) {
      downloadFile(project.content, project.name);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          <p className="text-amber-700 dark:text-amber-300 font-medium">
            Loading shared project...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            {error.includes('private') ? (
              <Lock className="w-10 h-10 text-red-400" />
            ) : (
              <AlertCircle className="w-10 h-10 text-red-400" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {error.includes('private') ? 'Private Project' : 'Project Not Found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              StackPack Bundler
            </h1>
          </div>
          <p className="text-amber-600 dark:text-amber-400 text-sm">Shared Project</p>
        </div>

        {/* Project Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-amber-100 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl">
              <Package className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {project.name}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2 py-0.5 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-md font-medium uppercase tracking-wide">
                  {project.outputType === 'html' ? '📄 HTML Bundle' : '⚙️ Web Component'}
                </span>
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  {project.fileCount} files
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-amber-200 dark:via-gray-600 to-transparent mb-6" />

          <p className="text-amber-700 dark:text-amber-300 text-sm mb-6">
            This project was bundled and shared with StackPack Bundler. Click the button below to
            download it.
          </p>

          <button
            onClick={handleDownload}
            disabled={!project.content}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Download {project.name}
          </button>
        </div>
      </div>
    </div>
  );
};
