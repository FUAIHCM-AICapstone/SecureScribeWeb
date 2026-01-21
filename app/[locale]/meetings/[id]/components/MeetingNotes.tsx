'use client';

import { Body1, Button, Spinner, Text, makeStyles, shorthands, tokens, ProgressBar } from '@/lib/components';
import { Edit20Regular, ClipboardTaskListLtrRegular, ArrowDownload20Regular } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import React from 'react';
import type { MeetingNoteResponse } from 'types/meeting_note.type';
import type { MeetingWithProjects } from 'types/meeting.type';
import { MeetingNoteContent } from './meetingNoteUtils';
import { downloadMeetingNote } from '@/services/api/meetingNote';

// Helper function to generate a clean filename from meeting data
function generateMeetingNoteFilename(meeting: MeetingWithProjects | undefined): string {
    if (!meeting) {
        return 'meeting-note.pdf';
    }

    const title = meeting.title || 'Untitled Meeting';
    const date = meeting.start_time ? new Date(meeting.start_time) : new Date(meeting.created_at);

    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];

    // Clean title: remove special characters and limit length
    const cleanTitle = title
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
        .substring(0, 50); // Limit to 50 characters

    return `${cleanTitle} - ${formattedDate}.pdf`;
}

const useStyles = makeStyles({
    sectionTitle: {
        marginBottom: '20px',
        paddingBottom: '16px',
        ...shorthands.borderBottom('2px', 'solid', tokens.colorNeutralStroke2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...shorthands.gap('12px'),
    },
    sectionTitleContent: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('12px'),
    },
    headingSizeSelector: {
        minWidth: '80px',
    },
    sectionHeading: {
        fontSize: tokens.fontSizeBase400,
        fontWeight: 700,
        color: tokens.colorNeutralForeground1,
    },
    noteContent: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
        lineHeight: '1.6',
        ...shorthands.padding('16px'),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        marginBottom: '16px',
    },
    noteEmpty: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground3,
        fontStyle: 'italic',
        textAlign: 'center',
        ...shorthands.padding('24px'),
    },
    expandButton: {
        minWidth: '32px',
    },
    notePreview: {
        maxHeight: '120px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
    },
    expandedContent: {
        maxHeight: '600px',
        overflowY: 'auto',
    },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('12px'),
        ...shorthands.padding('20px'),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        marginBottom: '16px',
    },
    progressText: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground2,
    },
});

interface MeetingNotesProps {
    note: MeetingNoteResponse | null;
    isLoading: boolean;
    error: string | null;
    onCreateNote: () => void;
    onEditNote: () => void;
    onShowTasks?: () => void;
    isCreating: boolean;
    isUpdating: boolean;
    analysisProgress?: {
        progress: number;
        status: string;
        task_id: string;
    } | null;
    meetingId: string;
    meeting: MeetingWithProjects | undefined;
}


export function MeetingNotes({
    note,
    isLoading,
    error,
    onCreateNote,
    onEditNote,
    onShowTasks,
    isCreating,
    isUpdating,
    analysisProgress,
    meetingId,
    meeting,
}: MeetingNotesProps) {
    const styles = useStyles();
    const t = useTranslations('MeetingDetail');
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isDownloading, setIsDownloading] = React.useState(false);

    // Check if analysis is in progress
    const isAnalyzing = analysisProgress && analysisProgress.status === 'processing';

    // Download handler
    const handleDownloadNote = React.useCallback(async () => {
        if (!meetingId || !note) return;

        setIsDownloading(true);
        try {
            const blob = await downloadMeetingNote(meetingId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = generateMeetingNoteFilename(meeting);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download meeting note:', error);
            // TODO: Add proper error handling/toast notification
        } finally {
            setIsDownloading(false);
        }
    }, [meetingId, note, meeting]);

    return (
        <div>
            <div className={styles.sectionTitle}>
                <div className={styles.sectionTitleContent}>
                    <Text className={styles.sectionHeading}>{t('notes')}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {onShowTasks && (
                        <Button
                            appearance="outline"
                            icon={<ClipboardTaskListLtrRegular />}
                            onClick={onShowTasks}
                        >
                            {t('tasks')}
                        </Button>
                    )}
                    {note ? (
                        <>
                            <Button
                                appearance="outline"
                                icon={<ArrowDownload20Regular />}
                                onClick={handleDownloadNote}
                                disabled={isDownloading || !!isAnalyzing}
                            >
                                {isDownloading ? t('downloading') : t('downloadNote')}
                            </Button>
                            <Button
                                appearance="secondary"
                                icon={<Edit20Regular />}
                                onClick={onEditNote}
                                disabled={isUpdating || !!isAnalyzing}
                            >
                                {t('edit')}
                            </Button>
                            <Button
                                appearance="primary"
                                onClick={onCreateNote}
                                disabled={isCreating || !!isAnalyzing}
                            >
                                {t('regenerateNote')}
                            </Button>
                        </>
                    ) : (
                        <Button
                            appearance="primary"
                            onClick={onCreateNote}
                            disabled={isCreating || !!isAnalyzing}
                        >
                            {t('createNote')}
                        </Button>
                    )}
                </div>
            </div>
            {/* Show analysis progress if in progress */}
            {isAnalyzing && (
                <div className={styles.progressContainer}>
                    <div className={styles.progressText}>
                        <Text weight="semibold">
                            {t('taskMessages.taskStarted', { taskType: t('taskTypes.meeting_analysis') })}
                        </Text>
                        <Text>{analysisProgress?.progress || 0}%</Text>
                    </div>
                    <ProgressBar
                        value={analysisProgress?.progress || 0}
                        max={100}
                        thickness="large"
                        color="brand"
                    />
                </div>
            )}
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                    <Spinner size="small" />
                </div>
            ) : error ? (
                <div style={{ color: tokens.colorPaletteRedForeground1, padding: '16px', textAlign: 'center' }}>
                    <Body1>{error}</Body1>
                </div>
            ) : note ? (
                <div>
                    <div className={isExpanded ? styles.expandedContent : styles.notePreview}>
                        <MeetingNoteContent content={note.content as string} />
                    </div>
                    <Button
                        appearance="subtle"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={styles.expandButton}
                    >
                        {isExpanded ? t('showLess') || 'Show Less' : t('showMore') || 'Show More'}
                    </Button>
                </div>
            ) : (
                <div className={styles.noteEmpty}>
                    <Body1>{t('noNotes')}</Body1>
                </div>
            )}
        </div>
    );
}
