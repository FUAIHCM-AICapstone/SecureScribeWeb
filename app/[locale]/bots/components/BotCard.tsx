'use client';

import {
  Card,
  Divider,
  makeStyles,
  shorthands,
  Text,
  tokens
} from '@fluentui/react-components';
import {
  Checkmark20Regular,
  CheckmarkCircle20Filled,
  Clock20Filled,
  ErrorCircle20Filled,
  Link20Regular,
  Play20Filled,
  Warning20Filled,
} from '@fluentui/react-icons';
import { BotResponse } from 'types/meetingBot.type';
import { BotActionsMenu } from './BotActionsMenu';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow4,
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    position: 'relative',
    overflow: 'hidden',
    ':before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      backgroundColor: tokens.colorBrandBackground,
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    ':hover': {
      boxShadow: tokens.shadow8,
      transform: 'translateY(-2px)',
      ':before': {
        opacity: 1,
      },
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalXS,
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: '24px',
  },
  url: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    ...shorthands.padding('6px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    flexShrink: 0,
    boxShadow: tokens.shadow2,
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
    justifyContent: 'center',
    fontSize: '16px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    color: tokens.colorNeutralForeground2,
    paddingBottom: tokens.spacingVerticalXS,
  },
  detailLabel: {
    fontWeight: 500,
    color: tokens.colorNeutralForeground1,
  },
  detailValue: {
    color: tokens.colorNeutralForeground2,
    textAlign: 'right',
    maxWidth: '50%',
  },
  errorSection: {
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalS),
    backgroundColor: tokens.colorPaletteRedBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.border('1px', 'solid', tokens.colorPaletteRedBorder1),
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    wordBreak: 'break-word',
    fontSize: '12px',
    lineHeight: '16px',
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    alignItems: 'flex-start',
  },
  errorIcon: {
    flexShrink: 0,
    marginTop: '2px',
  },
  divider: {
    marginTop: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalXS,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: tokens.spacingVerticalXS,
  },
});

interface BotCardProps {
  bot: BotResponse;
  meetingTitle: string;
  onStatusChange?: (botId: string, status: string) => void;
  onDelete?: (botId: string) => void;
  onViewLogs?: (botId: string) => void;
}

export function BotCard({
  bot,
  meetingTitle,
  onStatusChange,
  onDelete,
  onViewLogs,
}: BotCardProps) {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.info}>
          <Text className={styles.title}>{meetingTitle}</Text>
          {bot.meeting_url && (
            <Text className={styles.url}>
              <Link20Regular />
              {bot.meeting_url}
            </Text>
          )}
        </div>
        <div className={`${styles.statusBadge} ${getStatusStyleClass(bot.status)}`}>
          <span className={styles.statusIcon}>{getStatusIcon(bot.status)}</span>
          <span>{bot.status}</span>
        </div>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.details}>
        <div className={styles.detailsSection}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Created</span>
            <span className={styles.detailValue}>{formatDate(bot.created_at)}</span>
          </div>
          {bot.actual_start_time && (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Started</span>
              <span className={styles.detailValue}>{formatDate(bot.actual_start_time)}</span>
            </div>
          )}
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Retries</span>
            <span className={styles.detailValue}>
              {bot.retry_count}
              {bot.retry_count > 0 && <Checkmark20Regular />}
            </span>
          </div>
        </div>

        {bot.last_error && (
          <>
            <Divider className={styles.divider} />
            <div className={styles.errorSection}>
              <div className={styles.errorText}>
                <span className={styles.errorIcon}>
                  <ErrorCircle20Filled />
                </span>
                <span>{bot.last_error}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <Divider className={styles.divider} />

      <div className={styles.footer}>
        <BotActionsMenu
          botId={bot.id}
          status={bot.status}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onViewLogs={onViewLogs}
        />
      </div>
    </Card>
  );
}
