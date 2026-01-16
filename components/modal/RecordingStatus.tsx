'use client';

import React from 'react';
import {
    Button,
    Text,
    makeStyles,
    tokens,
    shorthands,
} from '@fluentui/react-components';
import {
    CheckmarkCircle24Regular,
    Dismiss24Regular,
} from '@/lib/icons';
import { useTranslations } from 'next-intl';

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
    successMessage: {
        color: tokens.colorPaletteGreenForeground1,
        fontSize: '13px',
    },
    actions: {
        display: 'flex',
        gap: tokens.spacingHorizontalS,
    },
});

interface RecordingStatusProps {
    taskId: string;
    onClose?: () => void;
}

export function RecordingStatus({
    onClose,
}: RecordingStatusProps) {
    const styles = useStyles();
    const t = useTranslations('Bots');

    return (
        <div className={styles.container}>
            <div className={styles.statusRow}>
                <div className={styles.statusIcon}>
                    <CheckmarkCircle24Regular
                        style={{ color: tokens.colorPaletteGreenForeground1 }}
                    />
                </div>
                <div className={styles.statusContent}>
                    <Text className={styles.statusText}>{t('statusCompleted')}</Text>
                    <Text className={styles.successMessage}>
                        {t('recordingStarted')}
                    </Text>
                </div>
            </div>

            <div className={styles.actions}>
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
