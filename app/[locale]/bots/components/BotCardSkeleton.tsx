'use client';

import React from 'react';
import {
  Card,
  Skeleton,
  SkeletonItem,
  makeStyles,
  shorthands,
  tokens,
} from '@/lib/components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '280px',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.overflow('hidden'),
  },
  header: {
    ...shorthands.padding('20px'),
  },
  body: {
    ...shorthands.padding('0', '20px', '20px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    flexGrow: 1,
  },
  footer: {
    ...shorthands.padding('12px', '20px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  skeletonTitle: {
    height: '20px',
    width: '70%',
  },
  skeletonBadge: {
    height: '24px',
    width: '80px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  skeletonRow: {
    height: '16px',
    width: '100%',
  },
  skeletonRowShort: {
    height: '16px',
    width: '60%',
  },
  skeletonButton: {
    height: '32px',
    width: '32px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
});

export function BotCardSkeleton() {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Skeleton>
          <SkeletonItem className={styles.skeletonTitle} />
        </Skeleton>
      </div>

      <div className={styles.body}>
        <Skeleton>
          <SkeletonItem className={styles.skeletonBadge} />
        </Skeleton>
        <Skeleton>
          <SkeletonItem className={styles.skeletonRow} />
        </Skeleton>
        <Skeleton>
          <SkeletonItem className={styles.skeletonRow} />
        </Skeleton>
        <Skeleton>
          <SkeletonItem className={styles.skeletonRowShort} />
        </Skeleton>
      </div>

      <div className={styles.footer}>
        <Skeleton>
          <SkeletonItem className={styles.skeletonButton} />
        </Skeleton>
      </div>
    </Card>
  );
}
