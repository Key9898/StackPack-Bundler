import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useToast } from '../contexts/ToastContext';
import { FirebaseService } from '../services/FirebaseService';
import { ProjectCard, type Project } from '../components/ProjectCard';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton';
import { downloadFile } from '../utils/BundlerLogic';
import { FolderOpen } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const fetchedProjects = await FirebaseService.fetchUserProjects(user.uid);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        showToast('Failed to load projects. Please try refreshing.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, showToast]);

  const handleDownload = (project: Project): void => {
    if (project.content) {
      downloadFile(project.content, project.name);
    } else {
      showToast('This project file is not saved in the database.', 'error');
    }
  };

  const handleShare = async (project: Project): Promise<void> => {
    const shareUrl = `${window.location.origin}?project=${project.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Share link copied to clipboard!', 'success');
    } catch {
      showToast('Could not copy link. Try manually: ' + shareUrl, 'info');
    }
  };

  const handleToggleVisibility = async (project: Project): Promise<void> => {
    const newValue = !project.isPublic;
    try {
      await FirebaseService.updateVisibility(project.id, newValue);
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isPublic: newValue } : p))
      );
      showToast(
        newValue ? `"${project.name}" is now public.` : `"${project.name}" is now private.`,
        'success'
      );
    } catch (error) {
      console.error('Error updating visibility:', error);
      showToast('Failed to update visibility. Please try again.', 'error');
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!confirmDelete) return;

    try {
      await FirebaseService.deleteProject(confirmDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== confirmDelete.id));
      showToast('Project deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast('Failed to delete project.', 'error');
    } finally {
      setConfirmDelete(null);
    }
  };

  if (!user && !loading) {
    return (
      <div className="pt-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-amber-100 dark:border-gray-700">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
            My Projects
          </h2>
          <p className="text-amber-700 dark:text-amber-300 mb-6">
            Please sign in to view and manage your bundled projects.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-2">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              My Projects
            </h1>
          </div>
          <p className="text-amber-700 dark:text-amber-300">
            {loading ? 'Loading your projects...' : `${projects.length} bundles saved.`}
          </p>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <ProjectCardSkeleton key={n} />
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDownload={handleDownload}
                onDelete={(p) => setConfirmDelete(p)}
                onShare={handleShare}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-amber-200 dark:border-gray-700">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-amber-300" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-1">
              No projects yet
            </h3>
            <p className="text-amber-700 dark:text-amber-400 mb-6 max-w-xs mx-auto">
              Start by uploading and bundling your files on the Upload page!
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
        variant="danger"
      />
    </div>
  );
};
