'use client';

import { Body1, Button, Card, Spinner, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Delete20Regular, Document20Regular } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import type { AudioFileResponse } from 'types/audio_file.type';
import { formatDateTime, formatDuration, getAudioFileName } from './meetingDetailUtils';

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
    audioFileItem: {
        ...shorthands.padding('12px', '16px'),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        ...shorthands.transition('all', '0.2s', 'ease'),
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground3,
            boxShadow: tokens.shadow4,
        },
    },
    audioMetadata: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('4px'),
        flex: 1,
    },
    audioLabel: {
        fontWeight: 600,
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
    },
    audioDetail: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
    },
    actionButtonSmall: {
        minWidth: '40px',
    },
});

interface MeetingAudioFilesProps {
    audioFiles: AudioFileResponse[];
    isLoading: boolean;
    error: string | null;
    onDeleteAudio: (audioId: string) => void;
    isDeleting: boolean;
}

export function MeetingAudioFiles({
    audioFiles,
    isLoading,
    error,
    onDeleteAudio,
    isDeleting,
}: MeetingAudioFilesProps) {
    const styles = useStyles();
    const t = useTranslations('MeetingDetail');

    return (
        <Card className={styles.section}>
            <div className={styles.sectionTitle}>
                <div>
                    <Document20Regular className={styles.sectionIcon} />
                    <Text className={styles.sectionHeading}>{t('files')}</Text>
                </div>
            </div>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                    <Spinner size="small" />
                </div>
            ) : error ? (
                <div style={{ color: tokens.colorPaletteRedForeground1, padding: '16px', textAlign: 'center' }}>
                    <Body1>{error}</Body1>
                </div>
            ) : audioFiles && audioFiles.length > 0 ? (
                <div>
                    {audioFiles.map((file) => (
                        <div key={file.id} className={styles.audioFileItem}>
                            <div className={styles.audioMetadata}>
                                <Text className={styles.audioLabel}>
                                    {getAudioFileName(file.file_url)}
                                </Text>
                                <div className={styles.audioDetail}>
                                    {file.duration_seconds && (
                                        <span>
                                            {t('duration')}: {formatDuration(file.duration_seconds)}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.audioDetail}>
                                    {file.uploaded_by && <span>{t('uploadedBy')}: {file.uploaded_by}</span>}
                                </div>
                                <div className={styles.audioDetail}>
                                    {file.created_at && (
                                        <span>{t('uploadedAt')}: {formatDateTime(file.created_at, t)}</span>
                                    )}
                                </div>
                            </div>
                            <Button
                                appearance="subtle"
                                icon={<Delete20Regular />}
                                onClick={() => onDeleteAudio(file.id)}
                                disabled={isDeleting}
                                className={styles.actionButtonSmall}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.placeholder}>
                    <Body1 className={styles.placeholderText}>
                        {t('filesCount', { count: 0 })}
                    </Body1>
                </div>
            )}
        </Card>
    );
}
