'use client';

import React, { useState, useMemo } from 'react';
import {
    Button,
    Card,
    Spinner,
    Text,
    makeStyles,
    tokens,
    shorthands,
    Input,
    Field,
} from '@fluentui/react-components';
import { Search24Regular, Record24Regular } from '@fluentui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getMeetings } from '@/services/api/meeting';
import { queryKeys } from '@/lib/queryClient';
import { RecordingButton } from '@/components/modal/RecordingButton';
import { RecordingStatus } from '@/components/modal/RecordingStatus';
import { AudioFilesPanel } from '@/components/modal/AudioFilesPanel';
import { BotJoinTaskResponse } from 'types/meetingBot.type';

const useStyles = makeStyles({
    container: {
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        ...shorthands.padding('40px', '32px', '24px'),
        '@media (max-width: 768px)': {
            ...shorthands.padding('24px', '16px', '16px'),
        },
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
        '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: tokens.spacingVerticalL,
        },
    },
    title: {
        fontSize: '28px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalM,
    },
    searchContainer: {
        display: 'flex',
        gap: tokens.spacingHorizontalM,
        width: '100%',
        maxWidth: '400px',
        '@media (max-width: 768px)': {
            maxWidth: '100%',
        },
    },
    content: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: tokens.spacingHorizontalXL,
        marginBottom: '32px',
        '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
            gap: tokens.spacingHorizontalL,
        },
    },
    meetingCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
        ...shorthands.padding(tokens.spacingVerticalL),
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        boxShadow: tokens.shadow4,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    meetingTitle: {
        fontSize: '16px',
        fontWeight: 600,
        color: tokens.colorNeutralForeground1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    meetingUrl: {
        fontSize: '12px',
        color: tokens.colorNeutralForeground2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    meetingTime: {
        fontSize: '12px',
        color: tokens.colorNeutralForeground3,
    },
    recordingSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
        ...shorthands.padding(tokens.spacingVerticalM),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('64px', '24px'),
        minHeight: '400px',
        textAlign: 'center',
        gap: tokens.spacingVerticalL,
    },
    emptyIcon: {
        fontSize: '48px',
        color: tokens.colorNeutralForeground2,
    },
    emptyTitle: {
        fontSize: '20px',
        fontWeight: 600,
        color: tokens.colorNeutralForeground1,
    },
    emptyMessage: {
        fontSize: '14px',
        color: tokens.colorNeutralForeground2,
        maxWidth: '400px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('64px', '24px'),
        minHeight: '400px',
        gap: tokens.spacingVerticalM,
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('64px', '24px'),
        minHeight: '400px',
        textAlign: 'center',
        gap: tokens.spacingVerticalL,
    },
    errorTitle: {
        fontSize: '20px',
        fontWeight: 600,
        color: tokens.colorPaletteRedForeground1,
    },
    errorMessage: {
        fontSize: '14px',
        color: tokens.colorNeutralForeground2,
        maxWidth: '400px',
    },
});

interface MeetingWithRecording {
    id: string;
    title: string;
    url?: string;
    start_time: string;
    recordingTaskId?: string;
    recordingBotId?: string;
}

export function BotsPageClient() {
    const styles = useStyles();
    const t = useTranslations('Bots');
    const [searchQuery, setSearchQuery] = useState('');
    const [recordingStates, setRecordingStates] = useState<
        Record<string, { taskId: string; botId: string }>
    >({});

    // Fetch meetings
    const { data: meetingsData, isLoading, isError, error, refetch } = useQuery({
        queryKey: [...queryKeys.meetings, {}, { page: 1, limit: 50 }],
        queryFn: () => getMeetings({}, { page: 1, limit: 50 }),
        staleTime: 2 * 60 * 1000,
    });

    const meetings = meetingsData?.data || [];

    // Filter meetings based on search query
    const filteredMeetings = useMemo(() => {
        return meetings.filter((meeting: any) =>
            meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [meetings, searchQuery]);

    const handleRecordingStarted = (
        meetingId: string,
        taskId: string,
        botId: string
    ) => {
        setRecordingStates((prev) => ({
            ...prev,
            [meetingId]: { taskId, botId },
        }));
    };

    const handleRecordingStatusChange = (
        meetingId: string,
        status: BotJoinTaskResponse
    ) => {
        // Update recording state based on status
        if (status.status === 'completed' || status.status === 'failed') {
            // Keep the state for display purposes
        }
    };

    const handleCloseRecording = (meetingId: string) => {
        setRecordingStates((prev) => {
            const newState = { ...prev };
            delete newState[meetingId];
            return newState;
        });
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

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Record24Regular />
                        <span>{t('meetingRecordings')}</span>
                    </div>
                </div>
                <div className={styles.loadingContainer}>
                    <Spinner size="extra-large" />
                    <Text>{t('loading')}</Text>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <Record24Regular />
                        <span>{t('meetingRecordings')}</span>
                    </div>
                </div>
                <div className={styles.errorContainer}>
                    <Text className={styles.errorTitle}>{t('errorTitle')}</Text>
                    <Text className={styles.errorMessage}>
                        {error instanceof Error ? error.message : t('errorLoadingMeetings')}
                    </Text>
                    <Button appearance="primary" onClick={() => refetch()}>
                        {t('retry')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.title}>
                    <Record24Regular />
                    <span>{t('meetingRecordings')}</span>
                </div>
                <div className={styles.searchContainer}>
                    <Field>
                        <Input
                            placeholder={t('searchMeetings')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            contentBefore={<Search24Regular />}
                            appearance="outline"
                        />
                    </Field>
                </div>
            </div>

            {/* Content */}
            {filteredMeetings.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Record24Regular />
                    </div>
                    <Text className={styles.emptyTitle}>
                        {searchQuery ? t('noSearchResults') : t('noMeetings')}
                    </Text>
                    <Text className={styles.emptyMessage}>
                        {searchQuery
                            ? t('tryDifferentSearch')
                            : t('createMeetingToRecord')}
                    </Text>
                </div>
            ) : (
                <div className={styles.content}>
                    {filteredMeetings.map((meeting: any) => (
                        <Card key={meeting.id} className={styles.meetingCard}>
                            {/* Meeting Info */}
                            <div>
                                <Text className={styles.meetingTitle}>{meeting.title}</Text>
                                {meeting.url && (
                                    <Text className={styles.meetingUrl}>{meeting.url}</Text>
                                )}
                                <Text className={styles.meetingTime}>
                                    {formatDate(meeting.start_time)}
                                </Text>
                            </div>

                            {/* Recording Section */}
                            <div className={styles.recordingSection}>
                                <RecordingButton
                                    meetingId={meeting.id}
                                    isAuthorized={true}
                                    onRecordingStarted={(taskId, botId) =>
                                        handleRecordingStarted(meeting.id, taskId, botId)
                                    }
                                />

                                {/* Recording Status */}
                                {recordingStates[meeting.id] && (
                                    <RecordingStatus
                                        taskId={recordingStates[meeting.id].taskId}
                                        onStatusChange={(status) =>
                                            handleRecordingStatusChange(meeting.id, status)
                                        }
                                        onClose={() => handleCloseRecording(meeting.id)}
                                    />
                                )}
                            </div>

                            {/* Audio Files */}
                            <AudioFilesPanel meetingId={meeting.id} />
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
