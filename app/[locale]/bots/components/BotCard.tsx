'use client';

import {
  Card,
  CardHeader,
  CardFooter,
  Divider,
  makeStyles,
  shorthands,
  Text,
  Caption1,
  Badge,
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
  Calendar20Regular,
  ArrowClockwise20Regular,
} from '@fluentui/react-icons';
import { BotResponse } from 'types/meetingBot.type';
import { BotActionsMenu } from './BotActionsMenu';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '280px',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow4,
    transitionProperty: 'transform, box-shadow, border-color',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    position: 'relative',
    overflow: 'hidden',
    ':hover': {
      boxShadow: tokens.shadow16,
      transform: 'translateY(-4px)',
      ...shorthands.border('1px', 'solid', tokens.colorBrandStroke1),
    },
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    backgroundColor: tokens.colorBrandBackground,
  },
  cardAccentActive: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
  },
  cardAccentFailed: {
    backgroundColor: tokens.colorPaletteRedBackground3,
  },
  cardAccentPending: {
    backgroundColor: tokens.colorPaletteYellowBackground3,
  },
  header: {
    ...shorthands.padding('20px', '20px', '12px'),
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
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineHeight: tokens.lineHeightBase500,
  },
  url: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    ...shorthands.padding('6px', '12px'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    flexShrink: 0,
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
    justifyContent: 'center',
    fontSize: '14px',
  },
  body: {
    ...shorthands.padding('0', '20px', '16px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    flexGrow: 1,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  detailIcon: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  detailLabel: {
    fontWeight: tokens.fontWeightMedium,
    color: tokens.colorNeutralForeground1,
  },
  detailValue: {
    color: tokens.colorNeutralForeground2,
    marginLeft: 'auto',
  },
  errorSection: {
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorPaletteRedBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorPaletteRedBorder1),
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    wordBreak: 'break-word',
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
    display: 'flex',
    ...shorthands.gap('8px'),
    alignItems: 'flex-start',
  },
  errorIcon: {
    flexShrink: 0,
    marginTop: '2px',
  },
  footer: {
    ...shorthands.padding('12px', '20px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: tokens.colorNeutralBackground2,
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

  const getAccentClass = (status: string) => {
    switch (status) {
      case 'active':
        return styles.cardAccentActive;
      case 'failed':
        return styles.cardAccentFailed;
      case 'pending':
      case 'scheduled':
        return styles.cardAccentPending;
      default:
        return styles.cardAccent;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={styles.card}>
        <div className={`${styles.cardAccent} ${getAccentClass(bot.status)}`} />
        
        <CardHeader
          className={styles.header}
          header={
            <div className={styles.headerContent}>
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
                <span>{getStatusLabel(bot.status)}</span>
              </div>
            </div>
          }
        />

        <div className={styles.body}>
          <div className={styles.detailRow}>
            <Calendar20Regular className={styles.detailIcon} />
            <span className={styles.detailLabel}>{t('created')}</span>
            <span className={styles.detailValue}>{formatDate(bot.created_at)}</span>
          </div>
          
          {bot.actual_start_time && (
            <div className={styles.detailRow}>
              <Play20Filled className={styles.detailIcon} />
              <span className={styles.detailLabel}>{t('started')}</span>
              <span className={styles.detailValue}>{formatDate(bot.actual_start_time)}</span>
            </div>
          )}
          
          <div className={styles.detailRow}>
            <ArrowClockwise20Regular className={styles.detailIcon} />
            <span className={styles.detailLabel}>{t('retries')}</span>
            <span className={styles.detailValue}>
              {bot.retry_count}
              {bot.retry_count > 0 && <Checkmark20Regular />}
            </span>
          </div>

          {bot.last_error && (
            <div className={styles.errorSection}>
              <div className={styles.errorText}>
                <span className={styles.errorIcon}>
                  <ErrorCircle20Filled />
                </span>
                <span>{bot.last_error}</span>
              </div>
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
    </motion.div>
  );
}
