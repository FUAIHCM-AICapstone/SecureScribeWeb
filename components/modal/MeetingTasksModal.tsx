'use client';

import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogSurface,
    DialogTitle,
    makeStyles,
    shorthands,
    Spinner,
    Text,
    tokens,
} from '@fluentui/react-components';
import { ClipboardTaskListLtrRegular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/services/api/task';
import { TaskRow } from '@/app/[locale]/tasks/components/TaskRow';
import type { TaskResponse } from 'types/task.type';
import { queryKeys } from '@/lib/queryClient';

const useStyles = makeStyles({
    dialog: {
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        minWidth: '80%',
        '@media (max-width: 768px)': {
            minWidth: '100%',
            height: '90vh',
        },
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'auto',
        ...shorthands.gap(tokens.spacingVerticalM),
        padding: tokens.spacingVerticalM,
    },
    taskList: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalS),
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.spacingVerticalXXL,
        textAlign: 'center',
        color: tokens.colorNeutralForeground3,
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        ...shorthands.gap(tokens.spacingHorizontalS),
        padding: tokens.spacingVerticalM,
        borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    },
});

interface MeetingTasksModalProps {
    isOpen: boolean;
    meetingId: string;
    onOpenChange: (open: boolean) => void;
}


export function MeetingTasksModal({
    isOpen,
    meetingId,
    onOpenChange,
}: MeetingTasksModalProps) {
    const styles = useStyles();
    const t = useTranslations();
    const tTasks = useTranslations('Tasks');

    const { data: tasksData, isLoading, error } = useQuery({
        queryKey: queryKeys.meetingTasks(meetingId),
        queryFn: () => getTasks({ meeting_id: meetingId }),
        enabled: isOpen && !!meetingId,
    });

    const tasks = tasksData?.data || [];

    const handleOpenChange = (event: any, data: { open: boolean }) => {
        onOpenChange(data.open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogSurface className={styles.dialog}>
                <DialogTitle>
                    <ClipboardTaskListLtrRegular style={{ marginRight: tokens.spacingHorizontalS }} />
                    {tTasks('meetingTasksTitle')} ({tasks.length})
                </DialogTitle>
                <DialogBody className={styles.content}>
                    {isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                            <Spinner size="medium" />
                        </div>
                    ) : error ? (
                        <div style={{ color: tokens.colorPaletteRedForeground1, padding: '16px', textAlign: 'center' }}>
                            <Text>{tTasks('errorTitle')}</Text>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className={styles.emptyState}>
                            <ClipboardTaskListLtrRegular style={{ fontSize: '48px', color: tokens.colorNeutralForeground3, marginBottom: tokens.spacingVerticalM }} />
                            <Text style={{ fontSize: tokens.fontSizeBase300, fontWeight: 600 }}>
                                {tTasks('noTasksYet')}
                            </Text>
                            <Text style={{ fontSize: tokens.fontSizeBase200 }}>
                                {tTasks('emptyUnfilteredDescription')}
                            </Text>
                        </div>
                    ) : (
                        <div className={styles.taskList}>
                            {tasks.map((task: TaskResponse) => (
                                <TaskRow key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </DialogBody>
                <DialogActions className={styles.actions}>
                    <Button
                        appearance="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        {t('Common.cancel')}
                    </Button>
                </DialogActions>
            </DialogSurface>
        </Dialog>
    );
}
