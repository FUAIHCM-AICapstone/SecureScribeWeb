'use client';

import React from 'react';
import {
  Card,
  CardHeader,
  CardPreview,
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    height: '100%',
  },
  preview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '160px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    ...shorthands.padding('12px'),
  },
});

export function FileCardSkeleton() {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <CardPreview className={styles.preview}>
        <Skeleton>
          <SkeletonItem size={64} />
        </Skeleton>
      </CardPreview>
      <CardHeader
        header={
          <div className={styles.content}>
            <Skeleton>
              <SkeletonItem />
            </Skeleton>
            <Skeleton>
              <SkeletonItem size={16} />
            </Skeleton>
            <Skeleton>
              <SkeletonItem size={16} />
            </Skeleton>
          </div>
        }
      />
    </Card>
  );
}
