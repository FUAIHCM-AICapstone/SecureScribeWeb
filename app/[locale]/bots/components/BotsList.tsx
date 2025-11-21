'use client';

import {
  TableCell,
  TableHeaderCell,
  TableRow,
  Text,
  Tooltip,
  makeStyles,
  shorthands,
  tokens
} from '@fluentui/react-components';
import {
  CheckmarkCircle20Filled,
  Clock20Filled,
  ErrorCircle20Filled,
  Info20Regular,
  Play20Filled,
  Warning20Filled,
} from '@fluentui/react-icons';
import type { BotResponse } from 'types/meetingBot.type';
import { BotActionsMenu } from './BotActionsMenu';

const useStyles = makeStyles({
  tableWrapper: {
    width: '100%',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    overflow: 'hidden',
    boxShadow: tokens.shadow4,
    transition: 'all 0.3s ease',
  },
  table: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    borderCollapse: 'collapse' as const,
  },
  headerCell: {
    fontWeight: 700,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    fontSize: '12px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  row: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
      boxShadow: `inset 0 0 0 1px ${tokens.colorNeutralStroke2}`,
    },
    ':last-child': {
      borderBottom: 'none',
    },
  },
  cell: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    verticalAlign: 'middle' as const,
    fontSize: '13px',
    color: tokens.colorNeutralForeground1,
  },
  statusCell: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    ...shorthands.padding('6px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: 'fit-content',
    boxShadow: tokens.shadow2,
    transition: 'all 0.2s ease',
  },
  statusPending: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground1,
  },
  statusScheduled: {
    backgroundColor: tokens.colorPaletteLightTealBackground2,
    color: tokens.colorPaletteLightTealForeground2,
  },
  statusActive: {
    backgroundColor: tokens.colorPaletteGreenBackground2,
    color: tokens.colorPaletteGreenForeground1,
    boxShadow: `${tokens.shadow2}, 0 0 8px ${tokens.colorPaletteGreenBackground1}`,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  statusCompleted: {
    backgroundColor: tokens.colorPaletteLightGreenBackground2,
    color: tokens.colorPaletteLightGreenForeground1,
  },
  statusFailed: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground1,
  },
  statusIcon: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  errorCell: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: '12px',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: 500,
  },
  errorIcon: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding(tokens.spacingVerticalXXL),
    gap: tokens.spacingVerticalL,
    color: tokens.colorNeutralForeground3,
  },
  emptyStateIcon: {
    fontSize: '48px',
    opacity: 0.5,
  },
  textMuted: {
    color: tokens.colorNeutralForeground2,
    fontSize: '12px',
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock20Filled />;
      case 'scheduled':
        return <Warning20Filled />;
      case 'active':
        return <Play20Filled />;
      case 'completed':
        return <CheckmarkCircle20Filled />;
      case 'failed':
        return <ErrorCircle20Filled />;
      default:
        return null;
    }
  };

  const getStatusStyleClass = (status: string) => {
    switch (status) {
      case 'pending':
      case 'scheduled':
        return styles.statusPending;
      case 'active':
        return styles.statusActive;
      case 'completed':
        return styles.statusCompleted;
      case 'failed':
        return styles.statusFailed;
      default:
        return '';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!bots || bots.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Info20Regular />
          </div>
          <Text>No meeting bots yet</Text>
          <Text className={styles.textMuted}>
            Create a new bot to start recording meetings
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} role="grid" aria-label="Meeting bots table">
        <thead>
          <TableRow className={styles.row}>
            <TableHeaderCell className={styles.headerCell}>Meeting</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>Status</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>Created</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>Retries</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>Error</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>Actions</TableHeaderCell>
          </TableRow>
        </thead>
        <tbody>
          {bots.map((bot) => (
            <TableRow key={bot.id} className={styles.row}>
              <TableCell className={styles.cell}>
                <Tooltip
                  content={bot.meeting?.title || '-'}
                  relationship="label"
                  withArrow
                >
                  <Text>{bot.meeting?.title || '-'}</Text>
                </Tooltip>
              </TableCell>
              <TableCell className={styles.cell}>
                <div className={`${styles.statusCell} ${getStatusStyleClass(bot.status)}`}>
                  <span className={styles.statusIcon}>{getStatusIcon(bot.status)}</span>
                  <span>{bot.status}</span>
                </div>
              </TableCell>
              <TableCell className={styles.cell}>
                <Text>{formatDate(bot.created_at)}</Text>
              </TableCell>
              <TableCell className={styles.cell}>
                <Text>{bot.retry_count}</Text>
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
                  <Text className={styles.textMuted}>-</Text>
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
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}
