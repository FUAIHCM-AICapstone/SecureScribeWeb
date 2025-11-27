'use client';

import React from 'react';
import { Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Record48Regular, Search24Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

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
    width: '96px',
    height: '96px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
  },
  icon: {
    fontSize: '48px',
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
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
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.iconWrapper}>
        {isFiltered ? (
          <Search24Regular className={styles.icon} />
        ) : (
          <Record48Regular className={styles.icon} />
        )}
      </div>
      <Text className={styles.title}>
        {isFiltered ? t('noSearchResults') : t('noMeetings')}
      </Text>
      <Text className={styles.message}>
        {isFiltered ? t('tryDifferentSearch') : t('createMeetingToRecord')}
      </Text>
    </motion.div>
  );
}
