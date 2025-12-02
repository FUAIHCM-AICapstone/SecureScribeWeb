'use client';

import React from 'react';
import { Text, Caption1, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Record20Regular, Search20Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('80px', '24px'),
    minHeight: '400px',
    textAlign: 'center',
    ...shorthands.gap('20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.border('1px', 'dashed', tokens.colorNeutralStroke2),
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
  },
  icon: {
    fontSize: '40px',
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  message: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    maxWidth: '400px',
    lineHeight: tokens.lineHeightBase300,
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
      <div className={styles.iconWrapper}>
        {isFiltered ? (
          <Search20Regular className={styles.icon} />
        ) : (
          <Record20Regular className={styles.icon} />
        )}
      </div>
      <Text className={styles.title}>
        {isFiltered ? t('noSearchResults') : t('noMeetings')}
      </Text>
      <Caption1 className={styles.message}>
        {isFiltered ? t('tryDifferentSearch') : t('createMeetingToRecord')}
      </Caption1>
    </div>
  );
}
