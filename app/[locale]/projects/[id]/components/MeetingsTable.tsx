'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Button, Text, Spinner, tokens } from '@fluentui/react-components';
import type { MeetingResponse } from '../../../../../types/meeting.type';

interface MeetingsTableProps {
    data: MeetingResponse[];
    isLoading: boolean;
    page: number;
    onPageChange: (page: number) => void;
    hasMore: boolean;
}

export function MeetingsTable({
    data,
    isLoading,
    page,
    onPageChange,
    hasMore,
}: MeetingsTableProps) {
    const t = useTranslations('ProjectDetail');

    // Create columns with translations
    const meetingColumnHelper = useMemo(() => createColumnHelper<MeetingResponse>(), []);

    const columns = useMemo(
        () => [
            meetingColumnHelper.accessor('title', {
                header: t('tableHeaders.title'),
                cell: (info) => info.getValue() || t('untitledMeeting'),
                size: 250,
            }),
            meetingColumnHelper.accessor('start_time', {
                header: t('tableHeaders.startTime'),
                cell: (info) => {
                    const dateStr = info.getValue();
                    return dateStr ? format(new Date(dateStr), 'PPpp') : '—';
                },
                size: 200,
            }),
        ],
        [meetingColumnHelper, t]
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
                <Text>{t('meetingsPlaceholder')}</Text>
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
