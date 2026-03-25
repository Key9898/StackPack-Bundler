import type { FooterProps } from './Footer.types';

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full py-4 mt-auto border-t border-amber-100 bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 dark:border-gray-800 transition-colors duration-200">
      <div className="mx-auto max-w-6xl px-4 text-center sm:flex sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-amber-900/60 dark:text-gray-400">
          © 2025{' '}
          <span className="font-bold text-amber-700 dark:text-amber-500">StackPack Bundler</span> •
          Developed By{' '}
          <span className="font-bold text-amber-600 dark:text-amber-400">Wunna Aung</span>
        </p>

        <div className="mt-4 flex justify-center gap-4 sm:mt-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 dark:text-gray-600">
            Premium Tool Selection
          </span>
        </div>
      </div>
    </footer>
  );
};
