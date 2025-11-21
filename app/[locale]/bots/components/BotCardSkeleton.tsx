'use client';

import React from 'react';
import {
  Card,
  Skeleton,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalL),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },
  skeleton: {
    height: '20px',
    borderRadius: tokens.borderRadiusSmall,
  },
  skeletonShort: {
    height: '16px',
    borderRadius: tokens.borderRadiusSmall,
    maxWidth: '70%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
});

export function BotCardSkeleton() {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div style={{ flex: 1 }}>
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeletonShort} style={{ marginTop: '8px' }} />
        </div>
      </div>

      <div className={styles.details}>
        <Skeleton className={styles.skeleton} />
        <Skeleton className={styles.skeleton} />
        <Skeleton className={styles.skeletonShort} />
      </div>

      <Skeleton className={styles.skeleton} />
    </Card>
  );
}
