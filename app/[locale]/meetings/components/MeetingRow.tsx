'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Text,
  Badge,
  Caption1,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import { format } from 'date-fns';
import type { MeetingResponse } from 'types/meeting.type';
import { MeetingActionsMenu } from './MeetingActionsMenu';

const useStyles = makeStyles({
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1fr auto',
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
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  description: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  personalBadge: {
    marginLeft: '4px',
  },
  hiddenOnMobile: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  hiddenOnTablet: {
    '@media (max-width: 1024px)': {
      display: 'none',
    },
  },
});

interface MeetingRowProps {
  meeting: MeetingResponse;
}

export function MeetingRow({ meeting }: MeetingRowProps) {
  const styles = useStyles();
  const t = useTranslations('Meetings');

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
      default:
        return (
          <Badge appearance="outline" size="small">
            {meeting.status}
          </Badge>
        );
    }
  };

  const formatStartTime = () => {
    if (!meeting.start_time) return t('noDateSet');
    try {
      return format(new Date(meeting.start_time), 'PPp');
    } catch {
      return t('invalidDate');
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.titleCell}>
        <div className={styles.titleRow}>
          <Text className={styles.title}>
            {meeting.title || t('untitledMeeting')}
          </Text>
          {meeting.is_personal && (
            <Badge
              appearance="outline"
              size="small"
              color="brand"
              className={styles.personalBadge}
            >
              {t('badges.personal')}
            </Badge>
          )}
        </div>
        {meeting.description && (
          <Caption1 className={styles.description}>
            {meeting.description}
          </Caption1>
        )}
      </div>
      <div className={styles.hiddenOnMobile}>
        <Caption1>{formatStartTime()}</Caption1>
      </div>
      <div className={styles.hiddenOnMobile}>{getStatusBadge()}</div>
      <div className={styles.hiddenOnTablet}>
        <Caption1>
          {t('projectCount', { count: meeting.projects?.length || 0 })}
        </Caption1>
      </div>
      <div>
        <MeetingActionsMenu meeting={meeting} />
      </div>
    </div>
  );
}
