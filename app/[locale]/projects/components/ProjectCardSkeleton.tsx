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
} from '@/lib/components';

const useStyles = makeStyles({
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-1000px 0',
    },
    '100%': {
      backgroundPosition: '1000px 0',
    },
  },
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
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `linear-gradient(90deg, transparent, ${tokens.colorNeutralBackground1Hover}, transparent)`,
      backgroundSize: '1000px 100%',
      backgroundRepeat: 'no-repeat',
      animationName: 'shimmer',
      animationDuration: '2s',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      pointerEvents: 'none',
      '@media (prefers-reduced-motion: reduce)': {
        animationDuration: '0s',
      },
    },
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
