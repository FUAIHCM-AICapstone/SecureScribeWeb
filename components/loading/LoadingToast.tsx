'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Spinner,
  Text,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  toast: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('12px', '20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: `0 8px 24px ${tokens.colorNeutralShadowAmbient}, 0 2px 8px ${tokens.colorNeutralShadowKey}`,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    opacity: 0,
    transform: 'translateY(-10px)',
    ...shorthands.transition('all', '300ms', 'ease-in-out'),
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '0ms',
    },
  },
  toastVisible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  text: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: 500,
    color: tokens.colorNeutralForeground1,
  },
  spinner: {
    color: tokens.colorBrandForeground1,
  },
  '@media (max-width: 768px)': {
    toast: {
      top: '16px',
      right: '16px',
      left: '16px',
      maxWidth: 'calc(100vw - 32px)',
    },
  },
});

interface LoadingToastProps {
  message: string;
  show: boolean;
}

export function LoadingToast({ message, show }: LoadingToastProps) {
  const styles = useStyles();
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!mounted || !shouldRender) {
    return null;
  }

  const toastElement = (
    <div className={`${styles.toast} ${show ? styles.toastVisible : ''}`}>
      <Spinner size="extra-small" className={styles.spinner} />
      <Text className={styles.text}>{message}</Text>
    </div>
  );

  return createPortal(toastElement, document.body);
}
