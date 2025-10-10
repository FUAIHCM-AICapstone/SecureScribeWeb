'use client';

import React from 'react';
import {
  Card,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '280px',
    maxWidth: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.overflow('hidden'),
  },
  header: {
    ...shorthands.padding('16px', '16px', '10px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  body: {
    ...shorthands.padding('0', '16px', '16px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    flexGrow: 1,
  },
  footer: {
    ...shorthands.padding('12px', '16px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  skeleton: {
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    position: 'relative',
    ...shorthands.overflow('hidden'),
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, transparent, ${tokens.colorNeutralBackground1}, transparent)`,
      animationName: {
        from: { left: '-100%' },
        to: { left: '100%' },
      },
      animationDuration: '1.5s',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
    },
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
  skeletonText: {
    height: '14px',
    width: '100%',
  },
  skeletonTextShort: {
    height: '14px',
    width: '60%',
  },
  skeletonCircle: {
    width: '28px',
    height: '28px',
    ...shorthands.borderRadius('50%'),
  },
  skeletonAvatar: {
    height: '12px',
    width: '100px',
    flexGrow: 1,
  },
});

export function MeetingCardSkeleton() {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonBadge}`} />
      </div>
      <div className={styles.body}>
        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
        <div className={`${styles.skeleton} ${styles.skeletonTextShort}`} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
      </div>
      <div className={styles.footer}>
        <div className={`${styles.skeleton} ${styles.skeletonCircle}`} />
        <div className={`${styles.skeleton} ${styles.skeletonAvatar}`} />
      </div>
    </Card>
  );
}
