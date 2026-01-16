'use client';

import { Body1, Button, Card, ProgressBar, Spinner, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { ArrowClockwise20Regular, ChevronDown20Regular, CloudAdd20Regular, Delete20Regular, Document20Regular } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useTaskProgress } from '@/context/WebSocketContext';
import type { TranscriptResponse } from 'types/transcript.type';
import { formatDateTime } from './meetingDetailUtils';
import { parseTranscriptContent, formatSpeakerLabel, useSpeakerSegmentStyles, type SpeakerSegment } from './transcriptUtils';

const useStyles = makeStyles({
    section: {
        ...shorthands.padding('28px'),
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        boxShadow: tokens.shadow4,
        ...shorthands.transition('box-shadow', '0.2s', 'ease'),
        ':hover': {
            boxShadow: tokens.shadow8,
        },
    },
    sectionTitle: {
        marginBottom: '20px',
        paddingBottom: '16px',
        ...shorthands.borderBottom('2px', 'solid', tokens.colorNeutralStroke2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...shorthands.gap('12px'),
    },
    sectionIcon: {
        color: tokens.colorBrandForeground2,
        opacity: 0.8,
    },
    sectionHeading: {
        fontSize: tokens.fontSizeBase400,
        fontWeight: 700,
        color: tokens.colorNeutralForeground1,
    },
    placeholder: {
        ...shorthands.padding('48px', '32px'),
        textAlign: 'center',
        color: tokens.colorNeutralForeground3,
        backgroundColor: tokens.colorNeutralBackground3,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
    },
    placeholderText: {
        fontSize: tokens.fontSizeBase300,
    },
    transcriptItem: {
        ...shorthands.padding('16px'),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        marginBottom: '12px',
        ...shorthands.transition('all', '0.2s', 'ease'),
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground3,
            boxShadow: tokens.shadow4,
        },
    },
    transcriptHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
    },
    transcriptPreview: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground2,
        lineHeight: '1.5',
        marginBottom: '12px',
        maxHeight: '60px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
    },
    transcriptExpanded: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
        lineHeight: '1.6',
        marginBottom: '12px',
        padding: '12px',
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        maxHeight: '600px',
        overflowY: 'auto',
    },
    transcriptMeta: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('16px'),
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
    },
    expandButton: {
        minWidth: '32px',
    },
    actionButtonSmall: {
        minWidth: '40px',
    },
});

interface MeetingTranscriptsProps {
    transcripts: TranscriptResponse[];
    isLoading: boolean;
    error: string | null;
    onDeleteTranscript: (transcriptId: string) => void;
    onReindexTranscript: (transcriptId: string) => void;
    onUploadAudio: () => void;
    isDeleting: boolean;
    isUploading: boolean;
    isReindexing: boolean;
}

// Component to render speaker segments
function SpeakerSegmentView({ segment }: { segment: SpeakerSegment }) {
    const segmentStyles = useSpeakerSegmentStyles();
    return (
        <div className={segmentStyles.speakerSegment}>
            <div className={segmentStyles.speakerLabel}>
                <span>{formatSpeakerLabel(segment.speaker)}</span>
                <span className={segmentStyles.speakerTimestamp}>{segment.startTime} - {segment.endTime}</span>
            </div>
            <div className={segmentStyles.speakerContent}>
                <Text>{segment.content}</Text>
            </div>
        </div>
    );
}

// Component to render preview of speaker segments
function SpeakerSegmentsPreview({ segments }: { segments: SpeakerSegment[] }) {
    const styles = useStyles();
    if (segments.length === 0) {
        return <div className={styles.transcriptPreview}>No transcripts available</div>;
    }

    // Show first 2 segments as preview
    return (
        <div className={styles.transcriptPreview}>
            {segments.slice(0, 2).map((segment, idx) => (
                <div key={idx} style={{ marginBottom: '8px' }}>
                    <Text>
                        <strong>{formatSpeakerLabel(segment.speaker)}</strong>: {segment.content.substring(0, 100)}...
                    </Text>
                </div>
            ))}
            {segments.length > 2 && <Text style={{ fontSize: '0.85em', color: 'var(--colorNeutralForeground3)' }}>+{segments.length - 2} more segments</Text>}
        </div>
    );
}

export function MeetingTranscripts({
    transcripts,
    isLoading,
    error,
    onDeleteTranscript,
    onReindexTranscript,
    onUploadAudio,
    isDeleting,
    isUploading,
    isReindexing,
}: MeetingTranscriptsProps) {
    const styles = useStyles();
    const [expandedTranscriptId, setExpandedTranscriptId] = React.useState<string | null>(null);
    const t = useTranslations('MeetingDetail');

    // Get task progress for audio transcription and reindexing
    const { taskProgress } = useTaskProgress();
    const transcribingTasks = Array.from(taskProgress.values()).filter(
        (task) => task.task_type === 'audio_asr' && task.progress < 100
    );
    const reindexingTasks = Array.from(taskProgress.values()).filter(
        (task) => task.task_type === 'transcript_reindex' && task.progress < 100
    );

    return (
        <Card className={styles.section}>
            <div className={styles.sectionTitle}>
                <div>
                    <Document20Regular className={styles.sectionIcon} />
                    <Text className={styles.sectionHeading}>{t('transcripts')}</Text>
                </div>
                <Button
                    appearance="primary"
                    icon={<CloudAdd20Regular />}
                    onClick={onUploadAudio}
                    disabled={isUploading}
                >
                    {t('uploadAudio')}
                </Button>
            </div>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                    <Spinner size="small" />
                </div>
            ) : error ? (
                <div style={{ color: tokens.colorPaletteRedForeground1, padding: '16px', textAlign: 'center' }}>
                    <Body1>{error}</Body1>
                </div>
            ) : (
                <div>
                    {/* Transcribing Progress */}
                    {transcribingTasks.length > 0 && (
                        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium }}>
                            <Text style={{ fontWeight: 600, marginBottom: '8px' }}>
                                {t('transcribingInProgress')}
                            </Text>
                            {transcribingTasks.map((task) => (
                                <div key={task.task_id} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <Text style={{ fontSize: tokens.fontSizeBase200 }}>
                                            {task.task_type === 'audio_asr' ? t('audioTranscription') : task.task_type}
                                        </Text>
                                        <Text style={{ fontSize: tokens.fontSizeBase200 }}>
                                            {task.progress}% • {task.estimated_time}
                                        </Text>
                                    </div>
                                    <ProgressBar value={task.progress / 100} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Reindexing Progress */}
                    {reindexingTasks.length > 0 && (
                        <div style={{ marginBottom: '16px', padding: '16px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium }}>
                            <Text style={{ fontWeight: 600, marginBottom: '8px' }}>
                                {t('reindexingInProgress') || 'Reindexing in progress'}
                            </Text>
                            {reindexingTasks.map((task) => (
                                <div key={task.task_id} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <Text style={{ fontSize: tokens.fontSizeBase200 }}>
                                            {t('transcriptReindex') || 'Transcript reindex'}
                                        </Text>
                                        <Text style={{ fontSize: tokens.fontSizeBase200 }}>
                                            {task.progress}% • {task.estimated_time}
                                        </Text>
                                    </div>
                                    <ProgressBar value={task.progress / 100} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Existing transcripts */}
                    {transcripts && transcripts.length > 0 ? (
                        <div>
                            {transcripts.map((transcript) => {
                                const { segments, error: parseError } = parseTranscriptContent(transcript.content as string);
                                if (parseError) {
                                    console.warn(`[MeetingTranscripts] Parse error for transcript ${transcript.id}:`, parseError);
                                } else {
                                }
                                return (
                                    <div key={transcript.id} className={styles.transcriptItem}>
                                        <div className={styles.transcriptHeader}>
                                            <div style={{ flex: 1 }}>
                                                <Button
                                                    appearance="subtle"
                                                    icon={
                                                        <ChevronDown20Regular
                                                            style={{
                                                                transform:
                                                                    expandedTranscriptId === transcript.id
                                                                        ? 'rotate(180deg)'
                                                                        : 'rotate(0deg)',
                                                                transition: 'transform 0.2s ease',
                                                            }}
                                                        />
                                                    }
                                                    onClick={() => {
                                                        setExpandedTranscriptId(
                                                            expandedTranscriptId === transcript.id ? null : transcript.id
                                                        );
                                                    }}
                                                    className={styles.expandButton}
                                                />
                                            </div>
                                            <Button
                                                appearance="subtle"
                                                icon={<ArrowClockwise20Regular />}
                                                onClick={() => {
                                                    onReindexTranscript(transcript.id);
                                                }}
                                                disabled={isReindexing}
                                                className={styles.actionButtonSmall}
                                                title={t('reindexTranscript') || 'Reindex transcript'}
                                            />
                                            <Button
                                                appearance="subtle"
                                                icon={<Delete20Regular />}
                                                onClick={() => {
                                                    onDeleteTranscript(transcript.id);
                                                }}
                                                disabled={isDeleting}
                                                className={styles.actionButtonSmall}
                                            />
                                        </div>

                                        {expandedTranscriptId === transcript.id ? (
                                            <div className={styles.transcriptExpanded}>
                                                {parseError ? (
                                                    <Text>{parseError}</Text>
                                                ) : segments.length > 0 ? (
                                                    <div>
                                                        {segments.map((segment, idx) => (
                                                            <SpeakerSegmentView key={idx} segment={segment} />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Text>{transcript.content || 'No content available'}</Text>
                                                )}
                                            </div>
                                        ) : segments.length > 0 ? (
                                            <SpeakerSegmentsPreview segments={segments} />
                                        ) : (
                                            <div className={styles.transcriptPreview}>
                                                <Text>
                                                    {transcript.content
                                                        ? transcript.content.substring(0, 200) + '...'
                                                        : 'No content available'}
                                                </Text>
                                            </div>
                                        )}

                                        {transcript.created_at && (
                                            <div className={styles.transcriptMeta}>
                                                <span>{t('createdAt')}: {formatDateTime(transcript.created_at, t)}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.placeholder}>
                            <Body1 className={styles.placeholderText}>
                                {t('noTranscripts')}
                            </Body1>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
