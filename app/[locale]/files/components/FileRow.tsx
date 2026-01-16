'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Text,
  Badge,
  Caption1,
  makeStyles,
  tokens,
  shorthands,
} from '@/lib/components';
import { formatDate } from '@/lib/dateFormatter';
import type { FileResponse } from 'types/file.type';
import type { ProjectResponse } from 'types/project.type';
import type { MeetingResponse } from 'types/meeting.type';
import {
  formatFileSize,
  getFileIcon,
  getFileTypeBadgeColor,
  getFileTypeFromMime,
} from '@/lib/fileUtils';
import { FileActionsMenu } from './FileActionsMenu';

const useStyles = makeStyles({
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1.5fr auto',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.transition('all', '0.2s', 'ease'),
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
    },
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '2fr 1fr 1fr auto',
      ...shorthands.gap('12px'),
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr auto',
      ...shorthands.gap('8px'),
    },
  },
  nameCell: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    minWidth: 0,
  },
  fileIcon: {
    fontSize: '24px',
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  fileNameWrapper: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    minWidth: 0,
  },
  fileName: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  projectInfo: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  hiddenOnMobile: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  hiddenOnTablet: {
    '@media (max-width: 1024px)': {
      display: 'none',
    },
  },
});

interface FileRowProps {
  file: FileResponse;
  projects?: ProjectResponse[];
  meetings?: MeetingResponse[];
  onFileDeleted?: () => void;
  onFileRenamed?: () => void;
  onFileMoved?: () => void;
}

export function FileRow({
  file,
  projects,
  meetings,
  onFileDeleted,
  onFileRenamed,
  onFileMoved,
}: FileRowProps) {
  const styles = useStyles();
  const t = useTranslations('Files');

  const FileIcon = getFileIcon(file.mime_type || '');
  const fileType = getFileTypeFromMime(file.mime_type || '');
  const badgeColor = getFileTypeBadgeColor(file.mime_type || '');

  // Helper function to get project or meeting name
  const getProjectOrMeetingName = (): string => {
    if (file.project_id && projects) {
      const project = projects.find((p) => p.id === file.project_id);
      return project?.name || t('noProject');
    }
    if (file.meeting_id && meetings) {
      const meeting = meetings.find((m) => m.id === file.meeting_id);
      return meeting?.title || t('noMeeting');
    }
    return t('noProject');
  };

  return (
    <div className={styles.row}>
      {/* Name Column */}
      <div className={styles.nameCell}>
        <FileIcon className={styles.fileIcon} />
        <div className={styles.fileNameWrapper}>
          <Text className={styles.fileName}>
            {file.filename || t('untitled')}
          </Text>
        </div>
      </div>

      {/* Type Column */}
      <div className={styles.hiddenOnTablet}>
        <Badge color={badgeColor} size="small">
          {t(`fileTypes.${fileType}`)}
        </Badge>
      </div>

      {/* Size Column */}
      <div className={styles.hiddenOnMobile}>
        <Caption1>{formatFileSize(file.size_bytes || 0)}</Caption1>
      </div>

      {/* Project/Meeting Column (hidden on tablet) */}
      <div className={styles.hiddenOnTablet}>
        <Caption1>{getProjectOrMeetingName()}</Caption1>
      </div>

      {/* Upload Date Column (hidden on mobile) */}
      <div className={styles.hiddenOnMobile}>
        <Caption1>
          {file.created_at
            ? formatDate(file.created_at, 'long')
            : t('noDateSet')}
        </Caption1>
      </div>

      {/* Actions Column */}
      <FileActionsMenu
        file={file}
        onDeleteSuccess={onFileDeleted}
        onRenameSuccess={onFileRenamed}
        onMoveSuccess={onFileMoved}
      />
    </div>
  );
}
