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
import { ClipboardTaskListLtrRegular, ArrowLeft20Regular, ArrowRight20Regular } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
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
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingHorizontalS),
        padding: tokens.spacingVerticalM,
        borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...shorthands.gap('12px'),
    },
    pageInfo: {
        minWidth: '120px',
        textAlign: 'center',
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase200,
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: tokens.spacingVerticalL,
    },
});

interface MeetingTasksModalProps {
    isOpen: boolean;
    meetingId: string;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_PAGE_SIZE = 10;


export function MeetingTasksModal({
    isOpen,
    meetingId,
    onOpenChange,
}: MeetingTasksModalProps) {
    const styles = useStyles();
    const t = useTranslations();
    const tTasks = useTranslations('Tasks');
    const [currentPage, setCurrentPage] = React.useState(1);

    const { data: tasksData, isLoading, error } = useQuery({
        queryKey: queryKeys.meetingTasks(meetingId, currentPage),
        queryFn: () => getTasks(
            { meeting_id: meetingId },
            { page: currentPage, limit: DEFAULT_PAGE_SIZE }
        ),
        enabled: isOpen && !!meetingId,
        placeholderData: keepPreviousData,
    });

    const tasks = tasksData?.data || [];
    const pagination = tasksData?.pagination || {};
    const totalCount = pagination?.total || 0;
    const totalPages = pagination?.total_pages || 1;
    const hasNext = pagination?.has_next || false;
    const hasPrev = pagination?.has_prev || false;

    const handleOpenChange = (event: any, data: { open: boolean }) => {
        onOpenChange(data.open);
        // Reset page when modal closes
        if (!data.open) {
            setCurrentPage(1);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogSurface className={styles.dialog}>
                <DialogTitle>
                    <ClipboardTaskListLtrRegular style={{ marginRight: tokens.spacingHorizontalS }} />
                    {tTasks('meetingTasksTitle')} ({totalCount})
                </DialogTitle>
                <DialogBody className={styles.content}>
                    {isLoading ? (
                        <div className={styles.loadingContainer}>
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
                    {tasks.length > 0 && totalPages > 1 && (
                        <div className={styles.pagination}>
                            <Button
                                appearance="secondary"
                                icon={<ArrowLeft20Regular />}
                                disabled={!hasPrev || isLoading}
                                onClick={() => handlePageChange(currentPage - 1)}
                                size="small"
                            >
                                {t('Common.previous')}
                            </Button>
                            <Text className={styles.pageInfo}>
                                {t('Common.pageInfo', { current: currentPage, total: totalPages })}
                            </Text>
                            <Button
                                appearance="secondary"
                                icon={<ArrowRight20Regular />}
                                iconPosition="after"
                                disabled={!hasNext || isLoading}
                                onClick={() => handlePageChange(currentPage + 1)}
                                size="small"
                            >
                                {t('Common.next')}
                            </Button>
                        </div>
                    )}
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
