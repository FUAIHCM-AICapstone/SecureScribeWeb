/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Badge, Button, Spinner, Text, tokens } from '@fluentui/react-components';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import type { TaskResponse } from 'types/task.type';
import { TaskActionsMenu } from '@/app/[locale]/tasks/components/TaskActionsMenu';

interface TasksTableProps {
    data: TaskResponse[];
    isLoading: boolean;
    page: number;
    onPageChange: (page: number) => void;
    hasMore: boolean;
    projectId?: string;
    onTaskDeleted?: () => void;
    onTaskUpdated?: () => void;
    onTaskRefetch?: () => void;
}

export function TasksTable({ data, isLoading, page, onPageChange, hasMore, projectId, onTaskDeleted, onTaskUpdated, onTaskRefetch }: TasksTableProps) {
    const t = useTranslations('ProjectDetail');

    // Create columns with translations
    const taskColumnHelper = useMemo(() => createColumnHelper<TaskResponse>(), []);

    const columns = useMemo(
        () => [
            taskColumnHelper.accessor('title', {
                header: t('tableHeaders.taskTitle'),
                cell: (info) => info.getValue() || t('untitledFile'),
                size: 250,
            }),
            taskColumnHelper.accessor('status', {
                header: t('tableHeaders.status'),
                cell: (info) => {
                    const status = info.getValue();
                    return (
                        <Badge
                            appearance={
                                status === 'done'
                                    ? 'filled'
                                    : status === 'in_progress'
                                        ? 'outline'
                                        : 'tint'
                            }
                            color={
                                status === 'done'
                                    ? 'success'
                                    : status === 'in_progress'
                                        ? 'brand'
                                        : 'warning'
                            }
                        >
                            {status?.replace('_', ' ').charAt(0).toUpperCase() +
                                status?.replace('_', ' ').slice(1).toLowerCase()}
                        </Badge>
                    );
                },
                size: 120,
            }),
            taskColumnHelper.accessor('due_date', {
                header: t('dueDate'),
                cell: (info) => {
                    const dateStr = info.getValue();
                    return dateStr ? format(new Date(dateStr), 'PPP') : '—';
                },
                size: 150,
            }),
            taskColumnHelper.display({
                id: 'actions',
                header: '',
                cell: (info) => {
                    if (!projectId) return null;
                    return (
                        <TaskActionsMenu
                            task={info.row.original}
                            onTaskDeleted={onTaskDeleted}
                            onTaskUpdated={onTaskUpdated}
                            onTaskRefetch={onTaskRefetch}
                        />
                    );
                },
                size: 50,
            }),
        ],
        [taskColumnHelper, t, projectId]
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '16px' }}>
                <Spinner size="small" />
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div
                style={{
                    padding: '48px 32px',
                    textAlign: 'center',
                    color: tokens.colorNeutralForeground3,
                    backgroundColor: tokens.colorNeutralBackground3,
                    borderRadius: tokens.borderRadiusMedium,
                    border: `2px dashed ${tokens.colorNeutralStroke2}`,
                }}
            >
                <Text>{t('tasksPlaceholder')}</Text>
            </div>
        );
    }

    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: `2px solid ${tokens.colorNeutralStroke2}` }}>
                        {table.getHeaderGroups().map((headerGroup) =>
                            headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    style={{
                                        textAlign: 'left',
                                        padding: '12px',
                                        fontWeight: 600,
                                        color: tokens.colorNeutralForeground1,
                                        fontSize: tokens.fontSizeBase300,
                                    }}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))
                        )}
                    </tr>
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            style={{
                                borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
                            }}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    style={{
                                        padding: '12px',
                                        color: tokens.colorNeutralForeground1,
                                        fontSize: tokens.fontSizeBase300,
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
                <Button
                    appearance="secondary"
                    disabled={page === 1}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                >
                    {t('pagination.previous')}
                </Button>
                <Text style={{ fontSize: tokens.fontSizeBase300, minWidth: '80px' }}>
                    {t('pagination.page')} {page}
                </Text>
                <Button appearance="secondary" disabled={!hasMore} onClick={() => onPageChange(page + 1)}>
                    {t('pagination.next')}
                </Button>
            </div>
        </div>
    );
}
