'use client';

import React, { useMemo } from 'react';
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
import type { MeetingBotLogResponse } from 'types/meetingBot.type';

const useStyles = makeStyles({
  dialogContent: {
    minWidth: '600px',
    maxHeight: '600px',
    '@media (max-width: 768px)': {
      minWidth: '100vw',
      maxHeight: '80vh',
    },
  },
  logsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxHeight: '400px',
    overflowY: 'auto',
  },
  logEntry: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  logTime: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    fontWeight: 600,
  },
  logAction: {
    fontSize: '13px',
    fontWeight: 500,
    color: tokens.colorNeutralForeground1,
  },
  logMessage: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
    wordBreak: 'break-word',
  },
  emptyLogs: {
    textAlign: 'center',
    ...shorthands.padding(tokens.spacingVerticalXL),
    color: tokens.colorNeutralForeground2,
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

interface BotLogsModalProps {
  botId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BotLogsModal({
  botId,
  open,
  onOpenChange,
}: BotLogsModalProps) {
  const styles = useStyles();
  const t = useTranslations('Bots');

  const { data: logsData, isLoading } = useQuery({
    queryKey: [...queryKeys.botLogs(botId)],
    queryFn: () => meetingBotApi.getBotLogs(botId, { page: 1, limit: 100 }),
    enabled: open && !!botId,
    staleTime: 5 * 60 * 1000,
  });

  const logs = useMemo(
    () => logsData?.data || [],
    [logsData]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
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
            {t('botLogs')}
          </DialogTitle>
          <DialogContent>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <Spinner size="medium" />
                <Text>{t('loading')}</Text>
              </div>
            ) : logs.length === 0 ? (
              <div className={styles.emptyLogs}>
                <Text>{t('noLogs')}</Text>
              </div>
            ) : (
              <div className={styles.logsContainer}>
                {logs.map((log: MeetingBotLogResponse) => (
                  <div key={log.id} className={styles.logEntry}>
                    <Text className={styles.logTime}>
                      {formatDate(log.created_at)}
                    </Text>
                    {log.action && (
                      <Text className={styles.logAction}>{log.action}</Text>
                    )}
                    {log.message && (
                      <Text className={styles.logMessage}>{log.message}</Text>
                    )}
                  </div>
                ))}
              </div>
            )}
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
