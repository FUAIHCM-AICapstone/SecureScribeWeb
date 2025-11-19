'use client';

import React from 'react';
import {
    Text,
    makeStyles,
    tokens,
    shorthands,
} from '@fluentui/react-components';
import {
    Mic24Regular,
} from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';

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
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding(tokens.spacingVerticalXL),
        textAlign: 'center',
        color: tokens.colorNeutralForeground2,
    },
});

interface AudioFilesPanelProps {
    meetingId: string;
}

export function AudioFilesPanel({ meetingId }: AudioFilesPanelProps) {
    const styles = useStyles();
    const t = useTranslations('Bots');

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Mic24Regular />
                <Text className={styles.title}>
                    {t('audioFiles')}
                </Text>
            </div>

            <div className={styles.emptyState}>
                <Text>{t('recordingWillAppearHere')}</Text>
            </div>
        </div>
    );
}
