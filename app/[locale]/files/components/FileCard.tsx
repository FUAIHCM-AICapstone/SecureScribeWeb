'use client';

import {
  formatFileSize,
  getFileIcon,
  getFileTypeBadgeColor,
  getFileTypeFromMime,
  truncateFilename,
} from '@/lib/fileUtils';
import {
  Badge,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { FileResponse } from 'types/file.type';
import { FileActionsMenu } from './FileActionsMenu';

const useStyles = makeStyles({
  card: {
    height: '100%',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: tokens.shadow16,
    },
  },
  preview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '160px',
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  fileIcon: {
    fontSize: '64px',
    color: tokens.colorBrandForeground1,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.gap('8px'),
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    fontSize: '14px',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'block',
    marginBottom: '4px',
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  metadataRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
  },
  caption: {
    color: tokens.colorNeutralForeground3,
  },
  actionsContainer: {
    flexShrink: 0,
  },
});

interface FileCardProps {
  file: FileResponse;
  onPreview?: (file: FileResponse) => void;
  onFileDeleted?: () => void;
  onFileRenamed?: () => void;
  onFileMoved?: () => void;
}

export function FileCard({ file, onPreview, onFileDeleted, onFileRenamed, onFileMoved }: FileCardProps) {
  const styles = useStyles();
  const t = useTranslations('Files');

  const FileIcon = getFileIcon(file.mime_type || '');
  const fileType = getFileTypeFromMime(file.mime_type || '');
  const badgeColor = getFileTypeBadgeColor(file.mime_type || '');
  const isImage = file.mime_type?.startsWith('image/');

  const handleCardClick = () => {
    if (onPreview && (isImage || file.mime_type === 'application/pdf')) {
      onPreview(file);
    }
  };

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      <CardPreview className={styles.preview}>
        {isImage && file.storage_url ? (
          <Image
            src={file.storage_url}
            alt={file.filename || 'File'}
            className={styles.imagePreview}
            width={400}
            height={300}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <FileIcon className={styles.fileIcon} />
        )}
      </CardPreview>

      <CardHeader
        header={
          <div className={styles.header}>
            <div className={styles.fileInfo}>
              <Text className={styles.fileName} title={file.filename || ''}>
                {truncateFilename(file.filename || 'Untitled', 25)}
              </Text>
              <div className={styles.metadata}>
                <div className={styles.metadataRow}>
                  <Badge color={badgeColor} size="small">
                    {t(`fileTypes.${fileType}`)}
                  </Badge>
                  <Caption1 className={styles.caption}>
                    {formatFileSize(file.size_bytes || 0)}
                  </Caption1>
                </div>
                <Caption1 className={styles.caption}>
                  {file.created_at
                    ? format(new Date(file.created_at), 'MMM dd, yyyy')
                    : t('noDateSet')}
                </Caption1>
              </div>
            </div>
            <div className={styles.actionsContainer}>
              <FileActionsMenu
                file={file}
                onDeleteSuccess={onFileDeleted}
                onRenameSuccess={onFileRenamed}
                onMoveSuccess={onFileMoved}
              />
            </div>
          </div>
        }
      />
    </Card>
  );
}
