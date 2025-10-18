'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  TableRow,
  TableCell,
  Text,
  Badge,
  Caption1,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import { format } from 'date-fns';
import type { FileResponse } from 'types/file.type';
import { FileActionsMenu } from './FileActionsMenu';
import {
  getFileIcon,
  formatFileSize,
  getFileTypeBadgeColor,
  getFileTypeFromMime,
} from '@/lib/fileUtils';

const useStyles = makeStyles({
  row: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  fileIcon: {
    fontSize: '24px',
    color: tokens.colorBrandForeground1,
  },
  fileName: {
    fontWeight: 600,
  },
});

interface FileListItemProps {
  file: FileResponse;
}

export function FileListItem({ file }: FileListItemProps) {
  const styles = useStyles();
  const t = useTranslations('Files');

  const FileIcon = getFileIcon(file.mime_type || '');
  const fileType = getFileTypeFromMime(file.mime_type || '');
  const badgeColor = getFileTypeBadgeColor(file.mime_type || '');

  return (
    <TableRow className={styles.row}>
      <TableCell>
        <div className={styles.nameCell}>
          <FileIcon className={styles.fileIcon} />
          <Text className={styles.fileName}>{file.filename || 'Untitled'}</Text>
        </div>
      </TableCell>
      <TableCell>
        <Badge color={badgeColor} size="small">
          {t(`fileTypes.${fileType}`)}
        </Badge>
      </TableCell>
      <TableCell>
        <Caption1>{formatFileSize(file.size_bytes || 0)}</Caption1>
      </TableCell>
      <TableCell>
        <Caption1>
          {file.created_at
            ? format(new Date(file.created_at), 'MMM dd, yyyy')
            : t('noDateSet')}
        </Caption1>
      </TableCell>
      <TableCell>
        <FileActionsMenu file={file} />
      </TableCell>
    </TableRow>
  );
}
