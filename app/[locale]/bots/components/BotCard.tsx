'use client';

import {
  ArrowClockwise20Regular,
  Calendar20Regular,
  CheckmarkCircle20Filled,
  Clock20Filled,
  ErrorCircle20Filled,
  Link20Regular,
  Play20Filled,
  Warning20Filled,
} from '@/lib/icons';
import {
  Badge,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import { useTranslations } from 'next-intl';
import { BotResponse } from 'types/meetingBot.type';
import { BotActionsMenu } from './BotActionsMenu';

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
    ...shorthands.overflow('hidden'),
    ...shorthands.transition('all', '0.2s', 'ease'),
    boxShadow: tokens.shadow4,
    ':hover': {
      boxShadow: tokens.shadow16,
    },
  },
  header: {
    ...shorthands.padding('20px'),
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.gap('12px'),
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    ...shorthands.overflow('hidden'),
  },
  url: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
  },
  body: {
    ...shorthands.padding('0', '20px', '20px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    flexGrow: 1,
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    color: tokens.colorNeutralForeground2,
  },
  detailIcon: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  detailText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  errorSection: {
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorPaletteRedBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    display: 'flex',
    ...shorthands.gap('8px'),
    alignItems: 'flex-start',
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    wordBreak: 'break-word',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  errorIcon: {
    flexShrink: 0,
    marginTop: '2px',
    color: tokens.colorPaletteRedForeground1,
  },
  footer: {
    ...shorthands.padding('12px', '20px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: tokens.colorNeutralBackground1,
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
  const t = useTranslations('Bots');

  const getStatusBadge = () => {
    switch (bot.status) {
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

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        header={<Text className={styles.title}>{meetingTitle}</Text>}
      />

      <div className={styles.body}>
        <div className={styles.badgeRow}>{getStatusBadge()}</div>

        {bot.meeting_url && (
          <div className={styles.detailRow}>
            <Link20Regular className={styles.detailIcon} />
            <Caption1 className={styles.url}>{bot.meeting_url}</Caption1>
          </div>
        )}

        <div className={styles.detailRow}>
          <Calendar20Regular className={styles.detailIcon} />
          <Caption1 className={styles.detailText}>
            {t('created')}: {formatDate(bot.created_at)}
          </Caption1>
        </div>

        {bot.actual_start_time && (
          <div className={styles.detailRow}>
            <Play20Filled className={styles.detailIcon} />
            <Caption1 className={styles.detailText}>
              {t('started')}: {formatDate(bot.actual_start_time)}
            </Caption1>
          </div>
        )}

        {bot.retry_count > 0 && (
          <div className={styles.detailRow}>
            <ArrowClockwise20Regular className={styles.detailIcon} />
            <Caption1 className={styles.detailText}>
              {t('retries')}: {bot.retry_count}
            </Caption1>
          </div>
        )}

        {bot.last_error && (
          <div className={styles.errorSection}>
            <ErrorCircle20Filled className={styles.errorIcon} />
            <Caption1 className={styles.errorText}>{bot.last_error}</Caption1>
          </div>
        )}
      </div>

      <CardFooter className={styles.footer}>
        <BotActionsMenu
          botId={bot.id}
          status={bot.status}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onViewLogs={onViewLogs}
        />
      </CardFooter>
    </Card>
  );
}
