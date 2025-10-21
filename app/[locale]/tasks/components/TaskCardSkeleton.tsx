'use client';

import React from 'react';
import {
  Card,
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '280px',
    maxWidth: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.overflow('hidden'),
    ...shorthands.padding('16px'),
    ...shorthands.gap('12px'),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.gap('8px'),
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    flexGrow: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

export function TaskCardSkeleton() {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Skeleton>
          <SkeletonItem style={{ width: '70%', height: '24px' }} />
        </Skeleton>
        <Skeleton>
          <SkeletonItem style={{ width: '24px', height: '24px' }} />
        </Skeleton>
      </div>

      <div className={styles.body}>
        <Skeleton>
          <SkeletonItem style={{ width: '80px', height: '20px' }} />
        </Skeleton>

        <Skeleton>
          <SkeletonItem style={{ width: '100%', height: '16px' }} />
        </Skeleton>
        <Skeleton>
          <SkeletonItem style={{ width: '90%', height: '16px' }} />
        </Skeleton>

        <Skeleton>
          <SkeletonItem style={{ width: '120px', height: '16px' }} />
        </Skeleton>
      </div>

      <div className={styles.footer}>
        <Skeleton>
          <SkeletonItem style={{ width: '100px', height: '20px' }} />
        </Skeleton>
        <Skeleton>
          <SkeletonItem style={{ width: '80px', height: '16px' }} />
        </Skeleton>
      </div>
    </Card>
  );
}
