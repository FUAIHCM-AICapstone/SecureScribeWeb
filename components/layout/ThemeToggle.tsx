"use client";
import React from 'react';
import { RiMoonFill, RiSunLine } from 'react-icons/ri';
import { useTranslations } from 'next-intl';
import { ToggleButton, Tooltip } from '@/lib/components';
import { useAppTheme } from '@/app/providers';

const ThemeToggle = () => {
  const t = useTranslations('ThemeToggle');
  const { theme, toggle } = useAppTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const isDark = theme === 'dark';
  return (
    <Tooltip content={t('toggleTheme')} relationship="label">
      <ToggleButton
        aria-label={t('toggleTheme')}
        title={t('toggleTheme')}
        appearance="secondary"
        size="large"
        checked={isDark}
        onClick={toggle}
        icon={isDark ? <RiSunLine size={18} /> : <RiMoonFill size={18} />}
      />
    </Tooltip>
  );
};

export default ThemeToggle;
