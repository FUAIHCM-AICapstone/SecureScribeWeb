'use client';

import React from 'react';
import { Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Record24Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('64px', '24px'),
    minHeight: '400px',
    textAlign: 'center',
    gap: tokens.spacingVerticalL,
  },
  icon: {
    fontSize: '48px',
    color: tokens.colorNeutralForeground2,
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  message: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    maxWidth: '400px',
  },
});

interface EmptyBotsStateProps {
  isFiltered: boolean;
}

export function EmptyBotsState({ isFiltered }: EmptyBotsStateProps) {
  const styles = useStyles();
  const t = useTranslations('Bots');

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <Record24Regular />
      </div>
      <Text className={styles.title}>
        {isFiltered ? t('noSearchResults') : t('noMeetings')}
      </Text>
      <Text className={styles.message}>
        {isFiltered ? t('tryDifferentSearch') : t('createMeetingToRecord')}
      </Text>
    </div>
  );
}
