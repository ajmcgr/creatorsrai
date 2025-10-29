import { useState, useCallback } from 'react';
import type { Theme } from '@/lib/themeUtils';
import { defaultTheme } from '@/lib/themeUtils';

export function useTheme(initialTheme?: Partial<Theme>) {
  const [theme, setTheme] = useState<Theme>({
    ...defaultTheme,
    ...initialTheme,
  });

  const [history, setHistory] = useState<Theme[]>([theme]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateTheme = useCallback((updates: Partial<Theme>) => {
    setTheme(prev => {
      const newTheme = { ...prev, ...updates };
      setHistory(h => [...h.slice(0, historyIndex + 1), newTheme]);
      setHistoryIndex(i => i + 1);
      return newTheme;
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(i => i - 1);
      setTheme(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(i => i + 1);
      setTheme(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const reset = useCallback(() => {
    setTheme(defaultTheme);
    setHistory([defaultTheme]);
    setHistoryIndex(0);
  }, []);

  return {
    theme,
    updateTheme,
    undo,
    redo,
    reset,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
}
