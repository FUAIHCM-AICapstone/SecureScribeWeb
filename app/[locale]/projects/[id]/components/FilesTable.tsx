'use client';

import { Button, Spinner, Text, tokens } from '@fluentui/react-components';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { FileResponse } from 'types/file.type';

interface FilesTableProps {
    data: FileResponse[];
    isLoading: boolean;
    page: number;
    onPageChange: (page: number) => void;
    hasMore: boolean;
}

export function FilesTable({ data, isLoading, page, onPageChange, hasMore }: FilesTableProps) {
    const t = useTranslations('ProjectDetail');

    // Create columns with translations
    const fileColumnHelper = useMemo(() => createColumnHelper<FileResponse>(), []);

    const columns = useMemo(
        () => [
            fileColumnHelper.accessor('filename', {
                header: t('tableHeaders.fileName'),
                cell: (info) => info.getValue() || t('untitledFile'),
                size: 250,
            }),
            fileColumnHelper.accessor('mime_type', {
                header: t('tableHeaders.type'),
                cell: (info) => {
                    const mime = info.getValue();
                    return mime?.split('/')[1]?.toUpperCase() || 'Unknown';
                },
                size: 100,
            }),
            fileColumnHelper.accessor('size_bytes', {
                header: t('tableHeaders.size'),
                cell: (info) => {
                    const bytes = info.getValue();
                    if (!bytes) return '—';
                    if (bytes < 1024) return `${bytes}B`;
                    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
                    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
                },
                size: 100,
            }),
        ],
        [fileColumnHelper, t]
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // Removed getPaginationRowModel() for server-side pagination
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
                <Text>{t('filesPlaceholder')}</Text>
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
