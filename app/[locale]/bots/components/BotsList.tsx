'use client';

import {
  CheckmarkCircle20Filled,
  Clock20Filled,
  ErrorCircle20Filled,
  Play20Filled,
  Record20Regular,
  Warning20Filled,
} from '@/lib/icons';
import {
  Badge,
  Caption1,
  makeStyles,
  shorthands,
  TableCell,
  TableHeaderCell,
  TableRow,
  Text,
  tokens,
  Tooltip
} from '@fluentui/react-components';
import { useTranslations } from 'next-intl';
import type { BotResponse } from 'types/meetingBot.type';
import { BotActionsMenu } from './BotActionsMenu';

const useStyles = makeStyles({
  tableWrapper: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.overflow('hidden'),
    boxShadow: tokens.shadow4,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  headerCell: {
    fontWeight: 600,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    ...shorthands.padding('16px'),
    fontSize: tokens.fontSizeBase200,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  row: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ...shorthands.transition('background-color', '0.2s', 'ease'),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
    ':last-child': {
      borderBottom: 'none',
    },
  },
  cell: {
    ...shorthands.padding('16px'),
    verticalAlign: 'middle' as const,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  meetingCell: {
    fontWeight: 500,
    maxWidth: '250px',
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  errorCell: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  errorIcon: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    color: tokens.colorPaletteRedForeground1,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('80px', '24px'),
    ...shorthands.gap('20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.border('1px', 'dashed', tokens.colorNeutralStroke2),
    textAlign: 'center',
  },
  emptyStateIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
  },
  emptyStateIcon: {
    fontSize: '40px',
  },
  emptyStateTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  emptyStateMessage: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
    maxWidth: '400px',
  },
  textMuted: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  actionsCell: {
    textAlign: 'center' as const,
  },
});

interface BotsListProps {
  bots: BotResponse[];
  onStatusChange?: (botId: string, status: string) => void;
  onDelete?: (botId: string) => void;
  onViewLogs?: (botId: string) => void;
}

export function BotsList({
  bots,
  onStatusChange,
  onDelete,
  onViewLogs,
}: BotsListProps) {
  const styles = useStyles();
  const t = useTranslations('Bots');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            appearance="filled"
            color="warning"
            size="small"
            icon={<Clock20Filled />}
          >
            {t('statusPending')}
          </Badge>
        );
      case 'scheduled':
      case 'waiting_for_host':
      case 'joined':
        return (
          <Badge
            appearance="filled"
            color="informative"
            size="small"
            icon={<Warning20Filled />}
          >
            {t('statusScheduled')}
          </Badge>
        );
      case 'active':
      case 'recording':
        return (
          <Badge
            appearance="filled"
            color="success"
            size="small"
            icon={<Play20Filled />}
          >
            {t('statusInProgress')}
          </Badge>
        );
      case 'completed':
      case 'complete':
        return (
          <Badge
            appearance="filled"
            color="success"
            size="small"
            icon={<CheckmarkCircle20Filled />}
          >
            {t('statusCompleted')}
          </Badge>
        );
      case 'failed':
      case 'error':
        return (
          <Badge
            appearance="filled"
            color="danger"
            size="small"
            icon={<ErrorCircle20Filled />}
          >
            {t('statusFailed')}
          </Badge>
        );
      default:
        return (
          <Badge appearance="outline" size="small">
            {t('statusUnknown')}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!bots || bots.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyStateIconWrapper}>
          <Record20Regular className={styles.emptyStateIcon} />
        </div>
        <Text className={styles.emptyStateTitle}>{t('noMeetings')}</Text>
        <Caption1 className={styles.emptyStateMessage}>
          {t('createMeetingToRecord')}
        </Caption1>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} role="grid" aria-label={t('title')}>
        <thead>
          <TableRow className={styles.row}>
            <TableHeaderCell className={styles.headerCell}>
              {t('meeting')}
            </TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>
              {t('status')}
            </TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>
              {t('created')}
            </TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>
              {t('retries')}
            </TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>
              {t('error')}
            </TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>
              {t('actions')}
            </TableHeaderCell>
          </TableRow>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <tr key={bot.id} className={styles.row}>
              <TableCell className={`${styles.cell} ${styles.meetingCell}`}>
                <Tooltip
                  content={bot.meeting?.title || '-'}
                  relationship="label"
                  withArrow
                >
                  <Text>{bot.meeting?.title || '-'}</Text>
                </Tooltip>
              </TableCell>
              <TableCell className={styles.cell}>
                {getStatusBadge(bot.status)}
              </TableCell>
              <TableCell className={styles.cell}>
                <Caption1>{formatDate(bot.created_at)}</Caption1>
              </TableCell>
              <TableCell className={styles.cell}>
                <Caption1>{bot.retry_count}</Caption1>
              </TableCell>
              <TableCell className={styles.cell}>
                {bot.last_error ? (
                  <div className={styles.errorCell}>
                    <span className={styles.errorIcon}>
                      <ErrorCircle20Filled />
                    </span>
                    <Tooltip
                      content={bot.last_error}
                      relationship="label"
                      withArrow
                    >
                      <Text className={styles.errorText}>{bot.last_error}</Text>
                    </Tooltip>
                  </div>
                ) : (
                  <Caption1 className={styles.textMuted}>{t('noError')}</Caption1>
                )}
              </TableCell>
              <TableCell className={`${styles.cell} ${styles.actionsCell}`}>
                <BotActionsMenu
                  botId={bot.id}
                  status={bot.status}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  onViewLogs={onViewLogs}
                />
              </TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
