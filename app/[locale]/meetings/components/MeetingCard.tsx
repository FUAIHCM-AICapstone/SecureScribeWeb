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
} from '@/lib/components';
import { formatStartTime } from '@/lib/dateFormatter';
import {
  CalendarClock20Regular,
  PersonCircle20Regular,
} from '@/lib/icons';
import type { MeetingResponse } from 'types/meeting.type';
import { useAuth } from 'context/AuthContext';
import { isUserMeetingOwner } from 'lib/utils';
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
    fontSize: tokens.fontSizeBase300,
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
    fontSize: tokens.fontSizeBase200,
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    ...shorthands.overflow('hidden'),
  },
  projectsInfo: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase100,
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
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
  },
  creatorAvatar: {
    flexShrink: 0,
  },
  projectBadgesContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...shorthands.gap('6px'),
  },
  projectBadge: {
    fontSize: tokens.fontSizeBase100,
  },
  actionsMenu: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 10,
  },
});

interface MeetingCardProps {
  meeting: MeetingResponse;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const styles = useStyles();
  const t = useTranslations('Meetings');
  const { user } = useAuth();
  const isOwner = isUserMeetingOwner(user?.id, meeting.created_by);

  const getStatusBadge = () => {
    switch (meeting.status) {
      case 'active':
        return (
          <Badge appearance="filled" color="success" size="small">
            {t('status.active')}
          </Badge>
        );
      case 'completed':
        return (
          <Badge appearance="filled" color="informative" size="small">
            {t('status.completed')}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge appearance="filled" color="danger" size="small">
            {t('status.cancelled')}
          </Badge>
        );
      case 'archived':
        return (
          <Badge appearance="filled" color="warning" size="small">
            {t('status.archived')}
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

  const formatStartTimeLocal = () => {
    if (!meeting.start_time) return t('noDateSet');
    try {
      return formatStartTime(meeting.start_time);
    } catch {
      return t('invalidDate');
    }
  };

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        header={
          <Text className={styles.title}>
            {meeting.title || t('untitledMeeting')}
          </Text>
        }
      />

      <div className={styles.actionsMenu}>
        <MeetingActionsMenu meeting={meeting} />
      </div>

      <div className={styles.body}>
        <div className={styles.badgeRow}>
          {getStatusBadge()}
          {meeting.is_personal && (
            <Badge appearance="outline" size="small" color="brand">
              {t('badges.personal')}
            </Badge>
          )}
          {isOwner && (
            <Badge appearance="filled" size="small" color="brand">
              {t('badges.owner')}
            </Badge>
          )}
        </div>

        <div className={styles.timeRow}>
          <CalendarClock20Regular />
          <Caption1>{formatStartTimeLocal()}</Caption1>
        </div>

        {meeting.description && (
          <Caption1 className={styles.description}>
            {meeting.description}
          </Caption1>
        )}

        {meeting.projects && meeting.projects.length > 0 && (
          <div className={styles.projectBadgesContainer}>
            {meeting.projects.map((project) => (
              <Badge
                key={project.id}
                appearance="outline"
                size="small"
                className={styles.projectBadge}
              >
                {project.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <CardFooter className={styles.footer}>
        <div className={styles.creatorInfo}>
          <Avatar
            size={28}
            image={
              meeting.creator?.avatar_url
                ? { src: meeting.creator.avatar_url }
                : undefined
            }
            icon={<PersonCircle20Regular />}
            aria-label={meeting.creator?.name || 'Meeting creator'}
            className={styles.creatorAvatar}
          />
          <Caption1 className={styles.creatorName}>
            {meeting.creator?.name || t('unknownCreator')}
          </Caption1>
        </div>
      </CardFooter>
    </Card>
  );
}
