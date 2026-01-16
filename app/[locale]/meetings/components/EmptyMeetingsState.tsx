'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Text,
  Caption1,
  makeStyles,
  tokens,
  shorthands,
} from '@/lib/components';
import { CalendarEmpty48Regular } from '@/lib/icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('64px', '24px'),
    minHeight: '400px',
    textAlign: 'center',
  },
  iconWrapper: {
    marginBottom: '24px',
    color: tokens.colorNeutralForeground3,
    opacity: 0.6,
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  description: {
    maxWidth: '400px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '24px',
    lineHeight: '1.5',
  },
});

interface EmptyMeetingsStateProps {
  isFiltered: boolean;
  onCreateClick?: () => void;
}

export function EmptyMeetingsState({
  isFiltered,
  onCreateClick,
}: EmptyMeetingsStateProps) {
  const styles = useStyles();
  const t = useTranslations('Meetings');

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <CalendarEmpty48Regular style={{ width: '96px', height: '96px' }} />
      </div>
      <Text className={styles.title}>
        {isFiltered ? t('noMeetingsFound') : t('noMeetingsYet')}
      </Text>
      <Caption1 className={styles.description}>
        {isFiltered
          ? t('emptyFilteredDescription')
          : t('emptyUnfilteredDescription')}
      </Caption1>
      {!isFiltered && onCreateClick && (
        <Button appearance="primary" size="large" onClick={onCreateClick}>
          {t('createMeeting')}
        </Button>
      )}
    </div>
  );
}
