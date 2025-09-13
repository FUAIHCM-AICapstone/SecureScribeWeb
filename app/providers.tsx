'use client';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '../context/AuthContext';
import { WebSocketProvider } from '../context/WebSocketContext';
import { ReactQueryProvider } from '../context/ReactQueryProvider';
import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { useTheme } from 'next-themes';

function FluentThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

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
          <AuthProvider>
            <WebSocketProvider>
              {children}
            </WebSocketProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </FluentThemeProvider>
    </ThemeProvider>
  );
}
