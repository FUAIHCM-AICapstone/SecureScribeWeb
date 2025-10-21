'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Text,
  Button,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import {
  DocumentFolder48Regular,
  ArrowUpload24Regular,
} from '@fluentui/react-icons';

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
  icon: {
    fontSize: '96px',
    color: tokens.colorNeutralForeground4,
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 600,
    marginBottom: '12px',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    marginBottom: '32px',
    maxWidth: '400px',
  },
});

interface EmptyFilesStateProps {
  isFiltered: boolean;
  onUploadClick: () => void;
}

export function EmptyFilesState({
  isFiltered,
  onUploadClick,
}: EmptyFilesStateProps) {
  const styles = useStyles();
  const t = useTranslations('Files');

  return (
    <div className={styles.container}>
      <DocumentFolder48Regular className={styles.icon} />
      <Text className={styles.title}>
        {isFiltered ? t('noFilesFound') : t('noFilesYet')}
      </Text>
      <Text className={styles.description}>
        {isFiltered
          ? t('emptyFilteredDescription')
          : t('emptyUnfilteredDescription')}
      </Text>
      {!isFiltered && (
        <Button
          appearance="primary"
          icon={<ArrowUpload24Regular />}
          onClick={onUploadClick}
        >
          {t('uploadFile')}
        </Button>
      )}
    </div>
  );
}
