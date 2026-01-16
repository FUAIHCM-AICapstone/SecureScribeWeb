'use client';

import {
  Body1,
  Button,
  Card,
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  Delete20Regular,
  Document20Regular,
  DocumentPdf20Regular,
  Image20Regular,
  Video20Regular,
  MusicNote220Regular,
  ArrowDownload20Regular,
} from '@/lib/icons';
import { useTranslations } from 'next-intl';
import type { AudioFileResponse } from 'types/audio_file.type';
import type { FileResponse } from 'types/file.type';
import {
  formatDateTime,
  formatDuration,
  getAudioFileName,
} from './meetingDetailUtils';

const useStyles = makeStyles({
  section: {
    ...shorthands.padding('28px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow4,
    ...shorthands.transition('box-shadow', '0.2s', 'ease'),
    ':hover': {
      boxShadow: tokens.shadow8,
    },
  },
  sectionTitle: {
    marginBottom: '20px',
    paddingBottom: '16px',
    ...shorthands.borderBottom('2px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('12px'),
  },
  sectionIcon: {
    color: tokens.colorBrandForeground2,
    opacity: 0.8,
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  placeholder: {
    ...shorthands.padding('48px', '32px'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
  },
  placeholderText: {
    fontSize: tokens.fontSizeBase300,
  },
  fileItem: {
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    ...shorthands.transition('all', '0.2s', 'ease'),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
      boxShadow: tokens.shadow4,
    },
  },
  fileMetadata: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    flex: 1,
  },
  fileLabel: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  fileDetail: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  fileActions: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  actionButtonSmall: {
    minWidth: '40px',
  },
  fileIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '12px',
  },
});

interface MeetingFilesProps {
  audioFiles: AudioFileResponse[];
  files: FileResponse[];
  isLoadingAudio: boolean;
  isLoadingFiles: boolean;
  audioError: string | null;
  filesError: string | null;
  onDeleteAudio: (audioId: string) => void;
  isDeleting: boolean;
}

const getFileIcon = (
  mimeType: string | undefined,
  fileType: string | undefined,
) => {
  if (!mimeType && !fileType) return <Document20Regular />;

  const type = mimeType || fileType || '';

  if (type.includes('image')) return <Image20Regular />;
  if (type.includes('pdf')) return <DocumentPdf20Regular />;
  if (type.includes('video')) return <Video20Regular />;
  if (type.includes('audio')) return <MusicNote220Regular />;

  return <Document20Regular />;
};

const formatFileSize = (bytes: number | undefined): string => {
  if (!bytes) return 'Unknown size';

  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;

  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;

  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

export function MeetingFiles({
  audioFiles,
  files,
  isLoadingAudio,
  isLoadingFiles,
  audioError,
  filesError,
  onDeleteAudio,
  isDeleting,
}: MeetingFilesProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingDetail');

  const isLoading = isLoadingAudio || isLoadingFiles;
  const error = audioError || filesError;
  const totalFiles = audioFiles.length + files.length;

  return (
    <Card className={styles.section}>
      <div className={styles.sectionTitle}>
        <div>
          <Document20Regular className={styles.sectionIcon} />
          <Text className={styles.sectionHeading}>{t('files')}</Text>
        </div>
      </div>
      {isLoading ? (
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}
        >
          <Spinner size="small" />
        </div>
      ) : error ? (
        <div
          style={{
            color: tokens.colorPaletteRedForeground1,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <Body1>{error}</Body1>
        </div>
      ) : totalFiles > 0 ? (
        <div>
          {/* Render audio files */}
          {audioFiles.map((file) => (
            <div key={`audio-${file.id}`} className={styles.fileItem}>
              <div className={styles.fileIconWrapper}>
                <MusicNote220Regular />
              </div>
              <div className={styles.fileMetadata}>
                <Text className={styles.fileLabel}>
                  {getAudioFileName(file.file_url)}
                </Text>
                <div className={styles.fileDetail}>
                  {file.duration_seconds && (
                    <span>
                      {t('duration')}: {formatDuration(file.duration_seconds)}
                    </span>
                  )}
                </div>
                <div className={styles.fileDetail}>
                  {file.uploaded_by && (
                    <span>
                      {t('uploadedBy')}: {file.uploaded_by}
                    </span>
                  )}
                </div>
                <div className={styles.fileDetail}>
                  {file.created_at && (
                    <span>
                      {t('uploadedAt')}: {formatDateTime(file.created_at, t)}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.fileActions}>
                {file.file_url && (
                  <Button
                    appearance="subtle"
                    icon={<ArrowDownload20Regular />}
                    as="a"
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionButtonSmall}
                  />
                )}
                <Button
                  appearance="subtle"
                  icon={<Delete20Regular />}
                  onClick={() => onDeleteAudio(file.id)}
                  disabled={isDeleting}
                  className={styles.actionButtonSmall}
                />
              </div>
            </div>
          ))}

          {/* Render other files */}
          {files.map((file) => (
            <div key={`file-${file.id}`} className={styles.fileItem}>
              <div className={styles.fileIconWrapper}>
                {getFileIcon(file.mime_type, file.file_type)}
              </div>
              <div className={styles.fileMetadata}>
                <Text className={styles.fileLabel}>
                  {file.filename || 'Unknown file'}
                </Text>
                {file.size_bytes && (
                  <div className={styles.fileDetail}>
                    <span>{formatFileSize(file.size_bytes)}</span>
                  </div>
                )}
                <div className={styles.fileDetail}>
                  {file.created_at && (
                    <span>
                      {t('uploadedAt')}: {formatDateTime(file.created_at, t)}
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.fileActions}>
                {file.storage_url && (
                  <Button
                    appearance="subtle"
                    icon={<ArrowDownload20Regular />}
                    as="a"
                    href={file.storage_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionButtonSmall}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.placeholder}>
          <Body1 className={styles.placeholderText}>
            {t('filesCount', { count: 0 })}
          </Body1>
        </div>
      )}
    </Card>
  );
}
