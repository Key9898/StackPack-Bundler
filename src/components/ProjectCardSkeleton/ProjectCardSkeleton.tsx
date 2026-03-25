import type { ProjectCardSkeletonProps } from './ProjectCardSkeleton.types';

export const ProjectCardSkeleton: React.FC<ProjectCardSkeletonProps> = () => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-orange-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-amber-100 dark:bg-gray-700 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-amber-100 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-amber-50 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
        <div className="w-9 h-9 bg-amber-50 dark:bg-gray-700 rounded-xl flex-shrink-0 ml-2" />
      </div>
      <div className="h-px bg-amber-50 dark:bg-gray-700 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-amber-100 dark:bg-gray-700 rounded w-2/5" />
        <div className="h-7 bg-amber-50 dark:bg-gray-700 rounded-lg w-12" />
      </div>
    </div>
  );
};
