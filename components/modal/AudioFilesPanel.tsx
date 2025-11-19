'use client';

import React from 'react';
import {
    Button,
    Spinner,
    Text,
    makeStyles,
    tokens,
    shorthands,
} from '@fluentui/react-components';
import {
    Download24Regular,
    Delete24Regular,
    DocumentAudio24Regular,
} from '@fluentui/react-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { meetingBotApi } from '@/services/api/meetingBot';
import { showToast } from '@/hooks/useShowToast';
import { AudioFileResponse } from '@/types/meetingBot.type';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
        marginBottom: tokens.spacingVerticalS,
    },
    title: {
        fontSize: '16px',
        fontWeight: 600,
    },
    filesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalS,
    },
    fileItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        transition: 'all 0.2s ease',
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground3,
            borderColor: tokens.colorNeutralStroke1,
        },
    },
    fileInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
        flex: 1,
    },
    fileIcon: {
        fontSize: '24px',
        color: tokens.colorBrandForeground1,
    },
    fileDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalXS,
    },
    fileName: {
        fontSize: '14px',
        fontWeight: 500,
    },
    fileMetadata: {
        fontSize: '12px',
        color: tokens.colorNeutralForeground2,
    },
    fileActions: {
        display: 'flex',
        gap: tokens.spacingHorizontalS,
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding(tokens.spacingVerticalXL),
        textAlign: 'center',
        color: tokens.colorNeutralForeground2,
    },
    loadingContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: tokens.spacingHorizontalS,
        ...shorthands.padding(tokens.spacingVerticalL),
    },
});

interface AudioFilesPanelProps {
    meetingId: string;
}

export function AudioFilesPanel({ meetingId }: AudioFilesPanelProps) {
    const styles = useStyles();
    const t = useTranslations('Bots');
    const queryClient = useQueryClient();

    const { data: audioFiles, isLoading, error } = useQuery({
        queryKey: ['audioFiles', meetingId],
        queryFn: () => meetingBotApi.getAudioFilesForMeeting(meetingId),
        staleTime: 2 * 60 * 1000,
    });

    const deleteAudioMutation = useMutation({
        mutationFn: (audioFileId: string) =>
            meetingBotApi.deleteAudioFile(audioFileId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['audioFiles', meetingId],
            });
            showToast('success', t('audioFileDeleted'));
        },
        onError: () => {
            showToast('error', t('deleteAudioFileFailed'));
        },
    });

    const handleDownload = async (audioFile: AudioFileResponse) => {
        try {
            const downloadUrl = await meetingBotApi.getAudioFileDownloadUrl(
                audioFile.id
            );

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `recording-${audioFile.id}.webm`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('success', t('downloadStarted'));
        } catch (error) {
            showToast('error', t('downloadFailed'));
        }
    };

    const handleDelete = (audioFileId: string) => {
        if (confirm(t('confirmDeleteAudio'))) {
            deleteAudioMutation.mutate(audioFileId);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'Unknown';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        }
        return `${secs}s`;
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <DocumentAudio24Regular />
                    <Text className={styles.title}>{t('audioFiles')}</Text>
                </div>
                <div className={styles.loadingContainer}>
                    <Spinner size="small" />
                    <Text>{t('loading')}</Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <DocumentAudio24Regular />
                    <Text className={styles.title}>{t('audioFiles')}</Text>
                </div>
                <div className={styles.emptyState}>
                    <Text>{t('errorLoadingAudioFiles')}</Text>
                </div>
            </div>
        );
    }

    const files = audioFiles || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <DocumentAudio24Regular />
                <Text className={styles.title}>
                    {t('audioFiles')} ({files.length})
                </Text>
            </div>

            {files.length === 0 ? (
                <div className={styles.emptyState}>
                    <Text>{t('noAudioFiles')}</Text>
                </div>
            ) : (
                <div className={styles.filesList}>
                    {files.map((file) => (
                        <div key={file.id} className={styles.fileItem}>
                            <div className={styles.fileInfo}>
                                <DocumentAudio24Regular className={styles.fileIcon} />
                                <div className={styles.fileDetails}>
                                    <Text className={styles.fileName}>
                                        Recording {files.indexOf(file) + 1}
                                    </Text>
                                    <Text className={styles.fileMetadata}>
                                        {formatDate(file.created_at)} •{' '}
                                        {formatDuration(file.duration_seconds)}
                                    </Text>
                                </div>
                            </div>
                            <div className={styles.fileActions}>
                                <Button
                                    appearance="secondary"
                                    size="small"
                                    icon={<Download24Regular />}
                                    onClick={() => handleDownload(file)}
                                    title={t('download')}
                                />
                                <Button
                                    appearance="secondary"
                                    size="small"
                                    icon={<Delete24Regular />}
                                    onClick={() => handleDelete(file.id)}
                                    disabled={deleteAudioMutation.isPending}
                                    title={t('delete')}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
