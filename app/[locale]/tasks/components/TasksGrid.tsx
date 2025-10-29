'use client';

import React from 'react';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import type { TaskResponse } from 'types/task.type';
import { TaskCard } from './TaskCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    ...shorthands.gap(tokens.spacingHorizontalL),
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      ...shorthands.gap(tokens.spacingHorizontalXL),
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
});

interface TasksGridProps {
  tasks: TaskResponse[];
}

export function TasksGrid({ tasks }: TasksGridProps) {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
