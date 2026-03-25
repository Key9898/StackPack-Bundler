import React, { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import type { ShortcutItem, KeyboardHintsProps } from './KeyboardHints.types';

const SHORTCUTS: ShortcutItem[] = [
  { keys: ['Ctrl', '1'], description: 'Go to Upload' },
  { keys: ['Ctrl', '2'], description: 'Go to Dashboard' },
  { keys: ['Ctrl', 'Enter'], description: 'Generate & Download' },
  { keys: ['Ctrl', 'R'], description: 'Reset files' },
];

export const KeyboardHints: React.FC<KeyboardHintsProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 bg-amber-50 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-gray-600 border border-amber-200 dark:border-gray-600 rounded-lg transition-all duration-200"
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Shortcuts</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          {/* Tooltip panel */}
          <div className="absolute bottom-full right-0 mb-2 z-50 bg-white dark:bg-gray-800 border border-amber-200 dark:border-gray-600 rounded-xl shadow-lg p-4 min-w-[220px] animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-amber-900 dark:text-amber-100 uppercase tracking-wide">
                Keyboard Shortcuts
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-0.5 hover:bg-amber-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </button>
            </div>
            <div className="space-y-2">
              {SHORTCUTS.map((shortcut, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, j) => (
                      <React.Fragment key={j}>
                        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-amber-50 dark:bg-gray-700 border border-amber-300 dark:border-gray-500 rounded text-amber-800 dark:text-amber-200">
                          {key}
                        </kbd>
                        {j < shortcut.keys.length - 1 && (
                          <span className="text-xs text-amber-400 dark:text-amber-500">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-xs text-amber-700 dark:text-amber-300 text-right">
                    {shortcut.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
