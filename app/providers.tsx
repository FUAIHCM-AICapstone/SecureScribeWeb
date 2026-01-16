"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FluentProvider, webDarkTheme, webLightTheme } from '@/lib/components';
import { ReactQueryProvider } from '../context/ReactQueryProvider';

type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggle: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export function useAppTheme(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within Providers');
  }
  return ctx;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  // Restore persisted theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('theme') as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      setThemeState(stored);
    } else {
      setThemeState('light');
    }
  }, []);

  // Persist theme
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => setThemeState(mode), []);
  const toggle = useCallback(() => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light')), []);

  const themeValue = useMemo<ThemeModeContextValue>(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  const fluentTheme = theme === 'dark' ? webDarkTheme : webLightTheme;

  return (
    <ThemeModeContext.Provider value={themeValue}>
      <FluentProvider theme={fluentTheme}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </FluentProvider>
    </ThemeModeContext.Provider>
  );
}
