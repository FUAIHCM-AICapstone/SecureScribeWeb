'use client';
import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { ThemeProvider, useTheme } from 'next-themes';
import { ReactQueryProvider } from '../context/ReactQueryProvider';
import { theme as appTheme } from '../config/theme';

function FluentThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  // Map config/theme.ts colors to Fluent v9 alias tokens (minimal, high-impact overrides)
  const lightOverrides = {
    colorBrandBackground: appTheme.light.colors.primary,
    colorBrandBackgroundHover: appTheme.light.colors.linkHover,
    colorBrandForeground1: appTheme.light.colors.primary,
    colorNeutralBackground1: appTheme.light.colors.background,
    colorNeutralBackground2: appTheme.light.colors.surface,
    colorNeutralCardBackground: appTheme.light.colors.cardBg,
    colorNeutralForeground1: appTheme.light.colors.text,
    colorNeutralForeground2: appTheme.light.colors.mutedText,
    colorNeutralStroke1: appTheme.light.colors.border,
    colorLink: appTheme.light.colors.link,
    colorLinkHover: appTheme.light.colors.linkHover,
  } as const;

  const darkOverrides = {
    colorBrandBackground: appTheme.dark.colors.primary,
    colorBrandBackgroundHover: appTheme.dark.colors.linkHover,
    colorBrandForeground1: appTheme.dark.colors.primary,
    colorNeutralBackground1: appTheme.dark.colors.background,
    colorNeutralBackground2: appTheme.dark.colors.surface,
    colorNeutralCardBackground: appTheme.dark.colors.cardBg,
    colorNeutralForeground1: appTheme.dark.colors.text,
    colorNeutralForeground2: appTheme.dark.colors.mutedText,
    colorNeutralStroke1: appTheme.dark.colors.border,
    colorLink: appTheme.dark.colors.link,
    colorLinkHover: appTheme.dark.colors.linkHover,
  } as const;

  const fluentTheme = theme === 'dark'
    ? { ...webDarkTheme, ...darkOverrides }
    : { ...webLightTheme, ...lightOverrides };

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
