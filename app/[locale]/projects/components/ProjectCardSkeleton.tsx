'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardFooter,
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
  },
  header: {
    ...shorthands.padding('16px', '16px', '8px'),
  },
  body: {
    ...shorthands.padding('0', '16px', '16px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    flexGrow: 1,
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  footer: {
    ...shorthands.padding('12px', '16px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export function ProjectCardSkeleton() {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        header={
          <Skeleton>
            <SkeletonItem size={16} style={{ width: '70%' }} />
          </Skeleton>
        }
      />

      <div className={styles.body}>
        <div className={styles.badgeRow}>
          <Skeleton>
            <SkeletonItem size={20} style={{ width: '60px' }} />
          </Skeleton>
        </div>

        <Skeleton>
          <SkeletonItem size={12} style={{ width: '100%' }} />
          <SkeletonItem size={12} style={{ width: '90%', marginTop: '4px' }} />
        </Skeleton>

        <Skeleton>
          <SkeletonItem size={12} style={{ width: '40%' }} />
        </Skeleton>
      </div>

      <CardFooter className={styles.footer}>
        <Skeleton>
          <SkeletonItem size={12} style={{ width: '100px' }} />
        </Skeleton>
      </CardFooter>
    </Card>
  );
}
