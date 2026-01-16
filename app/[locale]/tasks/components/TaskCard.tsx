'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Card,
  CardHeader,
  CardFooter,
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
import {
  CalendarClock20Regular,
  PersonCircle20Regular,
} from '@fluentui/react-icons';
import type { TaskResponse } from 'types/task.type';
import { TaskActionsMenu } from './TaskActionsMenu';

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
    ...shorthands.transition('all', '0.3s', 'ease'),
    ...shorthands.overflow('hidden'),
    position: 'relative',
    cursor: 'pointer',
    boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px ${tokens.colorNeutralShadowAmbient}, 0 0 0 1px ${tokens.colorBrandBackground}`,
    },
  },
  header: {
    ...shorthands.padding('16px', '16px', '8px'),
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.gap('8px'),
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    lineHeight: '2.0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    ...shorthands.overflow('hidden'),
    flexGrow: 1,
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
    flexWrap: 'wrap',
  },
  dueDateRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    color: tokens.colorNeutralForeground2,
  },
  dueDateRowOverdue: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    color: tokens.colorPaletteRedForeground1,
  },
  dueDateRowToday: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    color: tokens.colorPaletteDarkOrangeForeground1,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    ...shorthands.overflow('hidden'),
  },
  footer: {
    ...shorthands.padding('12px', '16px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('8px'),
  },
  assigneeInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  assigneeName: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
  },
  creatorInfo: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
});

interface TaskCardProps {
  task: TaskResponse;
}

export function TaskCard({ task }: TaskCardProps) {
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
    if (!task.due_date) return null;
    try {
      const dueDate = new Date(task.due_date);

      if (isPast(dueDate) && !isToday(dueDate)) {
        return {
          text: `${t('overdue')} - ${formatDate(dueDate, 'datetime')}`,
          isOverdue: true,
          isToday: false,
        };
      }

      if (isToday(dueDate)) {
        return {
          text: `${t('dueToday')} - ${formatDate(dueDate, 'short')}`,
          isOverdue: false,
          isToday: true,
        };
      }

      if (isTomorrow(dueDate)) {
        return {
          text: `${t('dueTomorrow')} - ${formatDate(dueDate, 'short')}`,
          isOverdue: false,
          isToday: false,
        };
      }

      return {
        text: formatDate(dueDate, 'datetime'),
        isOverdue: false,
        isToday: false,
      };
    } catch {
      return {
        text: t('invalidDate'),
        isOverdue: false,
        isToday: false,
      };
    }
  };

  const dueDateInfo = formatDueDate();
  const dueDateRowStyle = dueDateInfo?.isOverdue
    ? styles.dueDateRowOverdue
    : dueDateInfo?.isToday
      ? styles.dueDateRowToday
      : styles.dueDateRow;

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        header={
          <div className={styles.headerContent}>
            <Text className={styles.title}>
              {task.title || t('untitledTask')}
            </Text>
            <TaskActionsMenu task={task} />
          </div>
        }
      />

      <div className={styles.body}>
        <div className={styles.badgeRow}>
          {getStatusBadge()}
          {dueDateInfo?.isOverdue && (
            <Badge appearance="filled" color="danger" size="small">
              {t('overdue')}
            </Badge>
          )}
        </div>

        {dueDateInfo ? (
          <div className={dueDateRowStyle}>
            <CalendarClock20Regular />
            <Caption1>{dueDateInfo.text}</Caption1>
          </div>
        ) : (
          <div className={styles.dueDateRow}>
            <CalendarClock20Regular />
            <Caption1>{t('noDateSet')}</Caption1>
          </div>
        )}

        {task.description && (
          <Caption1 className={styles.description}>{task.description}</Caption1>
        )}
      </div>

      <CardFooter className={styles.footer}>
        <div className={styles.assigneeInfo}>
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
        {task.creator && (
          <Caption1 className={styles.creatorInfo}>
            {t('createdBy')} {task.creator.name || task.creator.email}
          </Caption1>
        )}
      </CardFooter>
    </Card>
  );
}
