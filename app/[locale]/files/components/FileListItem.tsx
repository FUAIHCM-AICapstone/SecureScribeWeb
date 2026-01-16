'use client';

import {
  formatFileSize,
  getFileIcon,
  getFileTypeBadgeColor,
  getFileTypeFromMime,
} from '@/lib/fileUtils';
import {
  Badge,
  Caption1,
  makeStyles,
  shorthands,
  TableCell,
  TableRow,
  Text,
  tokens,
} from '@fluentui/react-components';
import { formatDate } from '@/lib/dateFormatter';
import { useTranslations } from 'next-intl';
import type { FileResponse } from 'types/file.type';
import { FileActionsMenu } from './FileActionsMenu';

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
  onFileDeleted?: () => void;
  onFileRenamed?: () => void;
  onFileMoved?: () => void;
}

export function FileListItem({ file, onFileDeleted, onFileRenamed, onFileMoved }: FileListItemProps) {
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
            ? formatDate(file.created_at, 'long')
            : t('noDateSet')}
        </Caption1>
      </TableCell>
      <TableCell>
        <FileActionsMenu
          file={file}
          onDeleteSuccess={onFileDeleted}
          onRenameSuccess={onFileRenamed}
          onMoveSuccess={onFileMoved}
        />
      </TableCell>
    </TableRow>
  );
}
