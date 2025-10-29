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
} from '@fluentui/react-components';
import { TaskListSquareLtr48Regular } from '@fluentui/react-icons';

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

interface EmptyTasksStateProps {
  isFiltered: boolean;
  onCreateClick?: () => void;
}

export function EmptyTasksState({
  isFiltered,
  onCreateClick,
}: EmptyTasksStateProps) {
  const styles = useStyles();
  const t = useTranslations('Tasks');

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <TaskListSquareLtr48Regular style={{ width: '96px', height: '96px' }} />
      </div>
      <Text className={styles.title}>
        {isFiltered ? t('noTasksFound') : t('noTasksYet')}
      </Text>
      <Caption1 className={styles.description}>
        {isFiltered
          ? t('emptyFilteredDescription')
          : t('emptyUnfilteredDescription')}
      </Caption1>
      {!isFiltered && onCreateClick && (
        <Button appearance="primary" size="large" onClick={onCreateClick}>
          {t('createTask')}
        </Button>
      )}
    </div>
  );
}
