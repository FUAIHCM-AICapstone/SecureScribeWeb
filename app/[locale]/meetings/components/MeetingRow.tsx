'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  TableRow,
  TableCell,
  Text,
  Badge,
  Caption1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { format } from 'date-fns';
import type { MeetingResponse } from 'types/meeting.type';
import { MeetingActionsMenu } from './MeetingActionsMenu';

const useStyles = makeStyles({
  row: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  titleCell: {
    fontWeight: 600,
  },
  personalBadge: {
    marginLeft: '8px',
  },
});

interface MeetingRowProps {
  meeting: MeetingResponse;
}

export function MeetingRow({ meeting }: MeetingRowProps) {
  const styles = useStyles();
  const t = useTranslations('Meetings');
  const router = useRouter();

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

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the actions menu
    if ((e.target as HTMLElement).closest('[role="button"]')) {
      return;
    }
    router.push(`/meetings/${meeting.id}`);
  };

  return (
    <TableRow className={styles.row} onClick={handleRowClick}>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text className={styles.titleCell}>
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
          <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>
            {meeting.description}
          </Caption1>
        )}
      </TableCell>
      <TableCell>
        <Caption1>{formatStartTime()}</Caption1>
      </TableCell>
      <TableCell>{getStatusBadge()}</TableCell>
      <TableCell>
        <Caption1>
          {t('projectCount', { count: meeting.projects?.length || 0 })}
        </Caption1>
      </TableCell>
      <TableCell>
        <MeetingActionsMenu meeting={meeting} />
      </TableCell>
    </TableRow>
  );
}
