import { useEffect } from 'react';

interface ShortcutHandlers {
  onNavigateUpload?: () => void;
  onNavigateDashboard?: () => void;
  onGenerate?: () => void;
  onReset?: () => void;
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === '1') {
        e.preventDefault();
        handlers.onNavigateUpload?.();
      } else if (ctrl && e.key === '2') {
        e.preventDefault();
        handlers.onNavigateDashboard?.();
      } else if (ctrl && e.key === 'Enter') {
        e.preventDefault();
        handlers.onGenerate?.();
      } else if (ctrl && e.key === 'r') {
        e.preventDefault();
        handlers.onReset?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
};
