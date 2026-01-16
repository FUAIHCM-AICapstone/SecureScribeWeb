'use client';

import React, { useState } from 'react';
import { Button, Spinner, makeStyles, tokens } from '@/lib/components';
import { Record24Regular } from '@/lib/icons';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { meetingBotApi } from '@/services/api/meetingBot';
import { showToast } from '@/hooks/useShowToast';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
    },
    button: {
        minWidth: '140px',
    },
});

interface RecordingButtonProps {
    meetingId: string;
    isAuthorized: boolean;
    onRecordingStarted?: (taskId: string, botId: string) => void;
}

export function RecordingButton({
    meetingId,
    isAuthorized,
    onRecordingStarted,
}: RecordingButtonProps) {
    const styles = useStyles();
    const t = useTranslations('Bots');
    const [isLoading, setIsLoading] = useState(false);

    const triggerBotMutation = useMutation({
        mutationFn: () => meetingBotApi.triggerBotJoin(meetingId),
        onSuccess: (response) => {
            showToast('success', t('recordingStarted'), {
                duration: 4000,
            });
            onRecordingStarted?.(response.data.task_id, response.data.bot_id);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || t('recordingFailed');
            showToast('error', errorMessage);
        },
    });

    const handleRecordClick = async () => {
        if (!isAuthorized) {
            showToast('error', t('notAuthorized'));
            return;
        }

        setIsLoading(true);
        try {
            await triggerBotMutation.mutateAsync();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Button
                className={styles.button}
                appearance="primary"
                icon={isLoading ? <Spinner size="tiny" /> : <Record24Regular />}
                onClick={handleRecordClick}
                disabled={!isAuthorized || isLoading || triggerBotMutation.isPending}
            >
                {isLoading || triggerBotMutation.isPending
                    ? t('starting')
                    : t('recordMeeting')}
            </Button>
        </div>
    );
}
