'use client';
import React from 'react';
import { RiMoonFill, RiSunLine } from 'react-icons/ri';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Button } from '@fluentui/react-components';

const ThemeToggle = () => {
  const t = useTranslations('ThemeToggle');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <Button
      aria-label={t('toggleTheme')}
      appearance="secondary"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      icon={resolvedTheme === 'light' ? <RiMoonFill size={18} /> : <RiSunLine size={18} />}
    />
  );
};

export default ThemeToggle;
