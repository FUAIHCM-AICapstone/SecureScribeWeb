'use client';
import React from 'react';
import { RiMoonFill, RiSunLine } from 'react-icons/ri';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { ToggleButton, Tooltip } from '@fluentui/react-components';

const ThemeToggle = () => {
  const t = useTranslations('ThemeToggle');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const isDark = resolvedTheme === 'dark';
  return (
    <Tooltip content={t('toggleTheme')} relationship="label">
      <ToggleButton
        aria-label={t('toggleTheme')}
        title={t('toggleTheme')}
        appearance="secondary"
        size="large"
        checked={isDark}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        icon={isDark ? <RiSunLine size={18} /> : <RiMoonFill size={18} />}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
