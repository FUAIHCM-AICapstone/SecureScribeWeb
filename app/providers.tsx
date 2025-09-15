'use client';
import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { ThemeProvider, useTheme } from 'next-themes';
import { ReactQueryProvider } from '../context/ReactQueryProvider';

function FluentThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  // Use Fluent UI default themes without custom brand overrides
  const fluentTheme = theme === 'dark' ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider theme={fluentTheme}>
      {children}
    </FluentProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
      <FluentThemeProvider>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </FluentThemeProvider>
    </ThemeProvider>
  );
}
