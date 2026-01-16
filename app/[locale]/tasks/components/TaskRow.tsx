'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Text,
  Caption1,
  Badge,
  Avatar,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import {
  formatDate,
  isPast,
  isToday,
  isTomorrow,
} from '@/lib/dateFormatter';
import { PersonCircle20Regular } from '@fluentui/react-icons';
import type { TaskResponse } from 'types/task.type';
import { TaskActionsMenu } from './TaskActionsMenu';

const useStyles = makeStyles({
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1.5fr 1.5fr auto',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.transition('all', '0.2s', 'ease'),
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
    },
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '2fr 1fr 1fr auto',
      ...shorthands.gap('12px'),
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr auto',
      ...shorthands.gap('8px'),
    },
  },
  titleCell: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    minWidth: 0,
  },
  title: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusCell: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  assigneeCell: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    '@media (max-width: 1024px)': {
      display: 'none',
    },
  },
  assigneeName: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  dueDateCell: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  dueDateOverdue: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: 600,
  },
  dueDateToday: {
    color: tokens.colorPaletteDarkOrangeForeground1,
    fontWeight: 600,
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

interface TaskRowProps {
  task: TaskResponse;
}

export function TaskRow({ task }: TaskRowProps) {
  const styles = useStyles();
  const t = useTranslations('Tasks');

  const getStatusBadge = () => {
    switch (task.status) {
      case 'todo':
        return (
          <Badge appearance="filled" color="warning" size="small">
            {t('status.todo')}
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge appearance="filled" color="informative" size="small">
            {t('status.in_progress')}
          </Badge>
        );
      case 'done':
        return (
          <Badge appearance="filled" color="success" size="small">
            {t('status.done')}
          </Badge>
        );
      default:
        return (
          <Badge appearance="outline" size="small">
            {task.status}
          </Badge>
        );
    }
  };

  const formatDueDate = () => {
    if (!task.due_date) return { text: t('noDateSet'), className: '' };

    try {
      const dueDate = new Date(task.due_date);

      if (isPast(dueDate) && !isToday(dueDate)) {
        return {
          text: `${t('overdue')} - ${formatDate(dueDate, 'short')}`,
          className: styles.dueDateOverdue,
        };
      }

      if (isToday(dueDate)) {
        return {
          text: t('dueToday'),
          className: styles.dueDateToday,
        };
      }

      if (isTomorrow(dueDate)) {
        return {
          text: t('dueTomorrow'),
          className: styles.dueDateToday,
        };
      }

      return {
        text: formatDate(dueDate, 'short'),
        className: '',
      };
    } catch {
      return { text: t('invalidDate'), className: '' };
    }
  };

  const dueDateInfo = formatDueDate();

  return (
    <div className={styles.row}>
      <div className={styles.titleCell}>
        <Text className={styles.title}>{task.title || t('untitledTask')}</Text>
        {task.description && (
          <Caption1 className={styles.description}>{task.description}</Caption1>
        )}
      </div>

      <div className={styles.statusCell}>{getStatusBadge()}</div>

      <div className={styles.assigneeCell}>
        {task.assignee ? (
          <>
            <Avatar
              name={task.assignee.name || task.assignee.email}
              size={24}
              image={
                task.assignee.avatar_url
                  ? { src: task.assignee.avatar_url }
                  : undefined
              }
            />
            <span className={styles.assigneeName}>
              {task.assignee.name || task.assignee.email}
            </span>
          </>
        ) : (
          <>
            <PersonCircle20Regular />
            <span className={styles.assigneeName}>{t('unassigned')}</span>
          </>
        )}
      </div>

      <div className={`${styles.dueDateCell} ${dueDateInfo.className}`}>
        {dueDateInfo.text}
      </div>

      <div className={styles.actionsCell}>
        <TaskActionsMenu task={task} />
      </div>
    </div>
  );
}
