'use client';

import React from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import type { TaskResponse } from 'types/task.type';
import { TaskRow } from './TaskRow';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
});

interface TasksListProps {
  tasks: TaskResponse[];
}

export function TasksList({ tasks }: TasksListProps) {
  const styles = useStyles();

  return (
    <div className={styles.list}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  );
}
