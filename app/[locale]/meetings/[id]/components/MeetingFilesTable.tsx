'use client';

import { Button, Spinner, Text, tokens } from '@fluentui/react-components';
import { ArrowDownload20Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import React from 'react';
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
            <th
              style={{
                textAlign: 'left',
                padding: '12px',
                fontWeight: 600,
                color: tokens.colorNeutralForeground1,
                fontSize: tokens.fontSizeBase300,
              }}
            >
              {tProject('tableHeaders.fileName')}
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '12px',
                fontWeight: 600,
                color: tokens.colorNeutralForeground1,
                fontSize: tokens.fontSizeBase300,
              }}
            >
              {tProject('tableHeaders.type')}
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '12px',
                fontWeight: 600,
                color: tokens.colorNeutralForeground1,
                fontSize: tokens.fontSizeBase300,
              }}
            >
              {tProject('tableHeaders.size')}
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '12px',
                fontWeight: 600,
                color: tokens.colorNeutralForeground1,
                fontSize: tokens.fontSizeBase300,
              }}
            >
              {tProject('tableHeaders.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id} style={{ borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
              <td
                style={{
                  padding: '12px',
                  color: tokens.colorNeutralForeground1,
                  fontSize: tokens.fontSizeBase300,
                }}
              >
                {file.filename || tMeeting('untitledFile')}
              </td>
              <td
                style={{
                  padding: '12px',
                  color: tokens.colorNeutralForeground1,
                  fontSize: tokens.fontSizeBase300,
                }}
              >
                {file.mime_type?.split('/')[1]?.toUpperCase() || '—'}
              </td>
              <td
                style={{
                  padding: '12px',
                  color: tokens.colorNeutralForeground1,
                  fontSize: tokens.fontSizeBase300,
                }}
              >
                {formatFileSize(file.size_bytes)}
              </td>
              <td
                style={{
                  padding: '12px',
                  color: tokens.colorNeutralForeground1,
                  fontSize: tokens.fontSizeBase300,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {file.storage_url && (
                    <Button
                      appearance="subtle"
                      icon={<ArrowDownload20Regular />}
                      as="a"
                      href={file.storage_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  )}
                  <FileActionsMenu
                    file={file}
                    onDeleteSuccess={onFileDeleted}
                    onRenameSuccess={onFileRenamed}
                    onMoveSuccess={onFileMoved}
                  />
                </div>
              </td>
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
