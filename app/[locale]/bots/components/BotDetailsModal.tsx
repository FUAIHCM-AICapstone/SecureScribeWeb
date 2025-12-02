'use client';

import React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Text,
  Spinner,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { meetingBotApi } from '@/services/api/meetingBot';
import { queryKeys } from '@/lib/queryClient';

const useStyles = makeStyles({
  dialogContent: {
    minWidth: '500px',
    '@media (max-width: 768px)': {
      minWidth: '100vw',
    },
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('16px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    minWidth: '150px',
  },
  value: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    wordBreak: 'break-word',
  },
  errorValue: {
    color: tokens.colorPaletteRedForeground1,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding(tokens.spacingVerticalXL),
    gap: tokens.spacingVerticalM,
  },
});

interface BotDetailsModalProps {
  botId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BotDetailsModal({
  botId,
  open,
  onOpenChange,
}: BotDetailsModalProps) {
  const styles = useStyles();
  const t = useTranslations('Bots');

  const { data: bot, isLoading } = useQuery({
    queryKey: [...queryKeys.bot(botId)],
    queryFn: () => meetingBotApi.getBot(botId),
    enabled: open && !!botId,
    staleTime: 2 * 60 * 1000,
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(e, data) => onOpenChange(data.open)}>
      <DialogSurface className={styles.dialogContent}>
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                icon={<Dismiss24Regular />}
                onClick={() => onOpenChange(false)}
              />
            }
          >
            {t('botDetails')}
          </DialogTitle>
          <DialogContent>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <Spinner size="medium" />
                <Text>{t('loading')}</Text>
              </div>
            ) : bot ? (
              <div className={styles.detailsContainer}>
                <div className={styles.detailRow}>
                  <Text className={styles.label}>ID</Text>
                  <Text className={styles.value}>{bot.id}</Text>
                </div>
                <div className={styles.detailRow}>
                  <Text className={styles.label}>Meeting ID</Text>
                  <Text className={styles.value}>{bot.meeting_id}</Text>
                </div>
                <div className={styles.detailRow}>
                  <Text className={styles.label}>Status</Text>
                  <Text className={styles.value}>{bot.status}</Text>
                </div>
                <div className={styles.detailRow}>
                  <Text className={styles.label}>Meeting URL</Text>
                  <Text className={styles.value}>
                    {bot.meeting_url || '-'}
                  </Text>
                </div>
                <div className={styles.detailRow}>
                  <Text className={styles.label}>Retries</Text>
                  <Text className={styles.value}>{bot.retry_count}</Text>
                </div>
                <div className={styles.detailRow}>
                  <Text className={styles.label}>Created</Text>
                  <Text className={styles.value}>
                    {formatDate(bot.created_at)}
                  </Text>
                </div>
                <div className={styles.detailRow}>
                  <Text className={styles.label}>Started</Text>
                  <Text className={styles.value}>
                    {formatDate(bot.actual_start_time)}
                  </Text>
                </div>
                <div className={styles.detailRow}>
                  <Text className={styles.label}>Ended</Text>
                  <Text className={styles.value}>
                    {formatDate(bot.actual_end_time)}
                  </Text>
                </div>
                {bot.last_error && (
                  <div className={styles.detailRow}>
                    <Text className={styles.label}>Last Error</Text>
                    <Text className={`${styles.value} ${styles.errorValue}`}>
                      {bot.last_error}
                    </Text>
                  </div>
                )}
              </div>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => onOpenChange(false)}>
              {t('close')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
