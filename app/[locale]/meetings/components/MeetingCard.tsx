'use client';

import React from 'react';
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
import { format } from 'date-fns';
import {
  CalendarClock20Regular,
  PersonCircle20Regular,
} from '@fluentui/react-icons';
import type { MeetingResponse } from 'types/meeting.type';
import { MeetingActionsMenu } from './MeetingActionsMenu';

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
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.4',
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
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    color: tokens.colorNeutralForeground2,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    fontSize: '13px',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    ...shorthands.overflow('hidden'),
  },
  projectsInfo: {
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
  },
  footer: {
    ...shorthands.padding('12px', '16px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('8px'),
  },
  creatorInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  creatorName: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
});

interface MeetingCardProps {
  meeting: MeetingResponse;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const styles = useStyles();

  const getStatusBadge = () => {
    switch (meeting.status) {
      case 'active':
        return (
          <Badge appearance="filled" color="success" size="small">
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge appearance="filled" color="informative" size="small">
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge appearance="filled" color="danger" size="small">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge appearance="outline" size="small">
            {meeting.status}
          </Badge>
        );
    }
  };

  const formatStartTime = () => {
    if (!meeting.start_time) return 'No date set';
    try {
      return format(new Date(meeting.start_time), 'PPp');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        header={
          <div className={styles.headerContent}>
            <Text className={styles.title}>
              {meeting.title || 'Untitled Meeting'}
            </Text>
            <MeetingActionsMenu meeting={meeting} />
          </div>
        }
      />

      <div className={styles.body}>
        <div className={styles.badgeRow}>
          {getStatusBadge()}
          {meeting.is_personal && (
            <Badge appearance="outline" size="small" color="brand">
              Personal
            </Badge>
          )}
        </div>

        <div className={styles.timeRow}>
          <CalendarClock20Regular />
          <Caption1>{formatStartTime()}</Caption1>
        </div>

        {meeting.description && (
          <Caption1 className={styles.description}>
            {meeting.description}
          </Caption1>
        )}

        {meeting.projects && meeting.projects.length > 0 && (
          <Caption1 className={styles.projectsInfo}>
            {meeting.projects.length}{' '}
            {meeting.projects.length === 1 ? 'project' : 'projects'}
          </Caption1>
        )}
      </div>

      <CardFooter className={styles.footer}>
        <div className={styles.creatorInfo}>
          <Avatar
            size={28}
            icon={<PersonCircle20Regular />}
            aria-label="Meeting creator"
          />
          <Caption1 className={styles.creatorName}>Created by user</Caption1>
        </div>
      </CardFooter>
    </Card>
  );
}
