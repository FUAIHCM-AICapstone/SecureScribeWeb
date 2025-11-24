'use client';

import { Button, Spinner, Text, tokens } from '@fluentui/react-components';
import { ArrowDownload20Regular } from '@fluentui/react-icons';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import type { FileResponse } from 'types/file.type';
import { FileActionsMenu } from '@/app/[locale]/files/components/FileActionsMenu';

interface MeetingFilesTableProps {
  files: FileResponse[];
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
  onFileDeleted?: () => void;
  onFileRenamed?: () => void;
  onFileMoved?: () => void;
}

const formatFileSize = (bytes: number | undefined): string => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`;
};

export function MeetingFilesTable({
  files,
  isLoading,
  page,
  onPageChange,
  hasMore,
  onFileDeleted,
  onFileRenamed,
  onFileMoved,
}: MeetingFilesTableProps) {
  const tProject = useTranslations('ProjectDetail');
  const tMeeting = useTranslations('MeetingDetail');

  const columnHelper = useMemo(() => createColumnHelper<FileResponse>(), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor('filename', {
        header: tProject('tableHeaders.fileName'),
        cell: (info) => info.getValue() || tMeeting('untitledFile'),
        size: 250,
      }),
      columnHelper.accessor('mime_type', {
        header: tProject('tableHeaders.type'),
        cell: (info) => {
          const mime = info.getValue();
          return mime?.split('/')[1]?.toUpperCase() || '—';
        },
        size: 100,
      }),
      columnHelper.accessor('size_bytes', {
        header: tProject('tableHeaders.size'),
        cell: (info) => formatFileSize(info.getValue()),
        size: 120,
      }),
      columnHelper.display({
        id: 'download',
        header: tProject('tableHeaders.actions'),
        cell: (info) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {info.row.original.storage_url && (
              <Button
                appearance="subtle"
                icon={<ArrowDownload20Regular />}
                as="a"
                href={info.row.original.storage_url}
                target="_blank"
                rel="noopener noreferrer"
              />
            )}
            <FileActionsMenu
              file={info.row.original}
              onDeleteSuccess={onFileDeleted}
              onRenameSuccess={onFileRenamed}
              onMoveSuccess={onFileMoved}
            />
          </div>
        ),
        size: 140,
      }),
    ],
    [columnHelper, tProject, tMeeting, onFileDeleted, onFileRenamed, onFileMoved]
  );

  const table = useReactTable({ data: files, columns, getCoreRowModel: getCoreRowModel() });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <Spinner size="small" />
      </div>
    );
  }

  if (!files || files.length === 0) {
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
        <Text>{tMeeting('filesCount', { count: 0 })}</Text>
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
            <tr key={row.id} style={{ borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
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
        <Button appearance="secondary" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
          {tProject('pagination.previous')}
        </Button>
        <Text style={{ fontSize: tokens.fontSizeBase300, minWidth: '80px' }}>
          {tProject('pagination.page')} {page}
        </Text>
        <Button appearance="secondary" disabled={!hasMore} onClick={() => onPageChange(page + 1)}>
          {tProject('pagination.next')}
        </Button>
      </div>
    </div>
  );
}
