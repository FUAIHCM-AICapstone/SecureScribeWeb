'use client';

import React, { useEffect, useState } from 'react';
import {
    Button,
    Spinner,
    Text,
    makeStyles,
    tokens,
    shorthands,
} from '@fluentui/react-components';
import {
    CheckmarkCircle24Regular,
    ErrorCircle24Regular,
    Download24Regular,
    Dismiss24Regular,
} from '@fluentui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { meetingBotApi } from '@/services/api/meetingBot';
import { showToast } from '@/hooks/useShowToast';
import { BotJoinTaskResponse } from '@/types/meetingBot.type';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
        ...shorthands.padding(tokens.spacingVerticalM),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    },
    statusRow: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
    },
    statusIcon: {
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px',
    },
    statusContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalXS,
        flex: 1,
    },
    statusText: {
        fontSize: '14px',
        fontWeight: 500,
    },
    progressBar: {
        width: '100%',
        height: '4px',
        backgroundColor: tokens.colorNeutralStroke2,
        ...shorthands.borderRadius('2px'),
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: tokens.colorBrandForeground1,
        transition: 'width 0.3s ease',
    },
    actions: {
        display: 'flex',
        gap: tokens.spacingHorizontalS,
    },
    errorMessage: {
        color: tokens.colorPaletteRedForeground1,
        fontSize: '13px',
    },
    successMessage: {
        color: tokens.colorPaletteGreenForeground1,
        fontSize: '13px',
    },
});

interface RecordingStatusProps {
    taskId: string;
    onStatusChange?: (status: BotJoinTaskResponse) => void;
    onClose?: () => void;
}

export function RecordingStatus({
    taskId,
    onStatusChange,
    onClose,
}: RecordingStatusProps) {
    const styles = useStyles();
    const t = useTranslations('Bots');
    const [pollInterval, setPollInterval] = useState(5000);

    const { data: taskStatus, isLoading, refetch } = useQuery({
        queryKey: ['botTask', taskId],
        queryFn: () => meetingBotApi.getBotJoinStatus(taskId),
        refetchInterval: pollInterval,
        staleTime: 0,
    });

    // Stop polling when task is completed or failed
    useEffect(() => {
        if (taskStatus?.status === 'completed' || taskStatus?.status === 'failed') {
            setPollInterval(false as any);
        }
    }, [taskStatus?.status]);

    // Notify parent of status changes
    useEffect(() => {
        if (taskStatus) {
            onStatusChange?.(taskStatus);
        }
    }, [taskStatus, onStatusChange]);

    const getStatusIcon = () => {
        switch (taskStatus?.status) {
            case 'completed':
                return (
                    <CheckmarkCircle24Regular
                        style={{ color: tokens.colorPaletteGreenForeground1 }}
                    />
                );
            case 'failed':
                return (
                    <ErrorCircle24Regular
                        style={{ color: tokens.colorPaletteRedForeground1 }}
                    />
                );
            case 'in_progress':
            case 'pending':
            case 'scheduled':
                return <Spinner size="small" />;
            default:
                return null;
        }
    };

    const getStatusLabel = () => {
        switch (taskStatus?.status) {
            case 'pending':
                return t('statusPending');
            case 'scheduled':
                return t('statusScheduled');
            case 'in_progress':
                return t('statusInProgress');
            case 'completed':
                return t('statusCompleted');
            case 'failed':
                return t('statusFailed');
            default:
                return t('statusUnknown');
        }
    };

    const handleRetry = () => {
        refetch();
    };

    const handleDownload = async () => {
        if (!taskStatus?.meeting_id) return;

        try {
            const audioFiles = await meetingBotApi.getAudioFilesForMeeting(
                taskStatus.meeting_id
            );

            if (audioFiles.length === 0) {
                showToast('error', t('noAudioFiles'));
                return;
            }

            // Get the most recent audio file
            const latestFile = audioFiles[0];
            const downloadUrl = await meetingBotApi.getAudioFileDownloadUrl(
                latestFile.id
            );

            // Trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `recording-${latestFile.id}.webm`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('success', t('downloadStarted'));
        } catch (error) {
            showToast('error', t('downloadFailed'));
        }
    };

    if (isLoading && !taskStatus) {
        return (
            <div className={styles.container}>
                <div className={styles.statusRow}>
                    <Spinner size="small" />
                    <Text>{t('loadingStatus')}</Text>
                </div>
            </div>
        );
    }

    if (!taskStatus) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.statusRow}>
                <div className={styles.statusIcon}>{getStatusIcon()}</div>
                <div className={styles.statusContent}>
                    <Text className={styles.statusText}>{getStatusLabel()}</Text>
                    {taskStatus.status === 'in_progress' && (
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: '50%' }}
                            />
                        </div>
                    )}
                    {taskStatus.status === 'failed' && taskStatus.error_message && (
                        <Text className={styles.errorMessage}>
                            {taskStatus.error_message}
                        </Text>
                    )}
                    {taskStatus.status === 'completed' && (
                        <Text className={styles.successMessage}>
                            {t('recordingReady')}
                        </Text>
                    )}
                </div>
            </div>

            <div className={styles.actions}>
                {taskStatus.status === 'failed' && (
                    <Button
                        appearance="secondary"
                        size="small"
                        onClick={handleRetry}
                    >
                        {t('retry')}
                    </Button>
                )}
                {taskStatus.status === 'completed' && (
                    <Button
                        appearance="primary"
                        size="small"
                        icon={<Download24Regular />}
                        onClick={handleDownload}
                    >
                        {t('download')}
                    </Button>
                )}
                {onClose && (
                    <Button
                        appearance="secondary"
                        size="small"
                        icon={<Dismiss24Regular />}
                        onClick={onClose}
                    />
                )}
            </div>
        </div>
    );
}
