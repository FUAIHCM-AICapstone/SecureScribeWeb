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
  onEditSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onUpdateSuccess?: () => void;
}

export function TasksList({
  tasks,
  onEditSuccess,
  onDeleteSuccess,
  onUpdateSuccess,
}: TasksListProps) {
  const styles = useStyles();

  return (
    <div className={styles.list}>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onEditSuccess={onEditSuccess}
          onDeleteSuccess={onDeleteSuccess}
          onUpdateSuccess={onUpdateSuccess}
        />
      ))}
    </div>
  );
}
