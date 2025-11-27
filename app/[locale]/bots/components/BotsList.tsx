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
  Record24Regular,
} from '@fluentui/react-icons';
import type { BotResponse } from 'types/meetingBot.type';
import { BotActionsMenu } from './BotActionsMenu';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const useStyles = makeStyles({
  tableWrapper: {
    width: '100%',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    overflow: 'hidden',
    boxShadow: tokens.shadow8,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
    ...shorthands.padding('16px', '20px'),
    fontSize: tokens.fontSizeBase200,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
  },
  row: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    transitionProperty: 'background-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
    ':last-child': {
      borderBottom: 'none',
    },
  },
  cell: {
    ...shorthands.padding('16px', '20px'),
    verticalAlign: 'middle' as const,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  meetingCell: {
    fontWeight: tokens.fontWeightMedium,
  },
  statusCell: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    ...shorthands.padding('6px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: 'fit-content',
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
    ...shorthands.gap('8px'),
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    fontSize: tokens.fontSizeBase200,
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontWeight: tokens.fontWeightMedium,
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
  },
  emptyStateIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '96px',
    height: '96px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
  },
  emptyStateIcon: {
    fontSize: '48px',
  },
  emptyStateTitle: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  emptyStateMessage: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
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
        return styles.statusPending;
      case 'scheduled':
        return styles.statusScheduled;
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return t('statusPending');
      case 'scheduled':
        return t('statusScheduled');
      case 'active':
        return t('statusInProgress');
      case 'completed':
        return t('statusCompleted');
      case 'failed':
        return t('statusFailed');
      default:
        return t('statusUnknown');
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
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.emptyStateIconWrapper}>
          <Record24Regular className={styles.emptyStateIcon} />
        </div>
        <Text className={styles.emptyStateTitle}>{t('noMeetings')}</Text>
        <Text className={styles.emptyStateMessage}>
          {t('createMeetingToRecord')}
        </Text>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.tableWrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <table className={styles.table} role="grid" aria-label={t('title')}>
        <thead>
          <TableRow className={styles.row}>
            <TableHeaderCell className={styles.headerCell}>{t('meeting')}</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>{t('status')}</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>{t('created')}</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>{t('retries')}</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>{t('error')}</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>{t('actions')}</TableHeaderCell>
          </TableRow>
        </thead>
        <tbody>
          {bots.map((bot, index) => (
            <motion.tr
              key={bot.id}
              className={styles.row}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
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
                <div className={`${styles.statusCell} ${getStatusStyleClass(bot.status)}`}>
                  <span className={styles.statusIcon}>{getStatusIcon(bot.status)}</span>
                  <span>{getStatusLabel(bot.status)}</span>
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
                  <Text className={styles.textMuted}>{t('noError')}</Text>
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
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
