'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { showToast } from '@/hooks/useShowToast';
import { useRouter } from '@/i18n/navigation';
import { formatFileSize, getFileIcon, validateFile } from '@/lib/fileUtils';
import { queryKeys } from '@/lib/queryClient';
import { uploadFile } from '@/services/api/file';
import { getMeetings } from '@/services/api/meeting';
import { getProjects } from '@/services/api/project';
import {
  Button,
  Caption1,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Option,
  ProgressBar,
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  ArrowUpload24Regular,
  CheckmarkCircle24Filled,
  Dismiss24Regular,
  Document24Regular,
} from '@fluentui/react-icons';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useCallback, useRef, useState } from 'react';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
    minWidth: '550px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
    },
  },
  uploadArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('40px', '24px'),
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke1),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorNeutralBackground2,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
      ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
  },
  uploadAreaActive: {
    backgroundColor: tokens.colorBrandBackground2,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
  },
  uploadIcon: {
    fontSize: '48px',
    color: tokens.colorBrandForeground1,
    marginBottom: '16px',
  },
  uploadText: {
    fontSize: '16px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  uploadHint: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
    marginBottom: '12px',
  },
  supportedFormats: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  fileIcon: {
    fontSize: '32px',
    color: tokens.colorBrandForeground1,
  },
  fileDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  fileName: {
    fontSize: '14px',
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileSize: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  removeButton: {
    minWidth: 'auto',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  hiddenInput: {
    display: 'none',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  successSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.padding('24px'),
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '64px',
    color: tokens.colorPaletteGreenForeground1,
  },
  successTitle: {
    fontSize: '18px',
    fontWeight: 600,
  },
  successActions: {
    display: 'flex',
    ...shorthands.gap('12px'),
    marginTop: '8px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});

interface FileUploadModalProps {
  open: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  defaultMeetingId?: string;
}

export function FileUploadModal({
  open,
  onClose,
  defaultProjectId,
  defaultMeetingId,
}: FileUploadModalProps) {
  const styles = useStyles();
  const t = useTranslations('Files');
  const tMeetings = useTranslations('Meetings');
  const queryClient = useQueryClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectId, setProjectId] = useState<string | undefined>(
    defaultProjectId,
  );
  const [meetingId, setMeetingId] = useState<string | undefined>(
    defaultMeetingId,
  );
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Search states for Combobox
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [meetingSearchQuery, setMeetingSearchQuery] = useState('');

  // Debounce search queries
  const debouncedProjectQuery = useDebounce(projectSearchQuery, 400);
  const debouncedMeetingQuery = useDebounce(meetingSearchQuery, 400);

  // Fetch projects with search and pagination
  const {
    data: projectsData,
    fetchNextPage: fetchNextProjectsPage,
    hasNextPage: hasNextProjectsPage,
    isFetchingNextPage: isFetchingNextProjectsPage,
    isLoading: isLoadingProjects,
  } = useInfiniteQuery({
    queryKey: ['projects', debouncedProjectQuery],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      getProjects(
        debouncedProjectQuery ? { name: debouncedProjectQuery } : {},
        { limit: 50, page: pageParam },
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage.data && lastPage.data.length === 50) {
        return pages.length + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  // Fetch meetings with search and pagination - filter by project if selected
  const {
    data: meetingsData,
    fetchNextPage: fetchNextMeetingsPage,
    hasNextPage: hasNextMeetingsPage,
    isFetchingNextPage: isFetchingNextMeetingsPage,
    isLoading: isLoadingMeetings,
  } = useInfiniteQuery({
    queryKey: ['meetings', debouncedMeetingQuery, projectId],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      getMeetings(
        {
          ...(projectId ? { project_id: projectId } : {}),
          ...(debouncedMeetingQuery ? { title: debouncedMeetingQuery } : {}),
        },
        { limit: 50, page: pageParam },
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage.data && lastPage.data.length === 50) {
        return pages.length + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const projects = projectsData?.pages.flatMap((page: any) => page.data) || [];
  const meetings = meetingsData?.pages.flatMap((page: any) => page.data) || [];

  // Handle scroll pagination for projects
  const handleProjectsListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      hasNextProjectsPage &&
      !isFetchingNextProjectsPage &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    ) {
      fetchNextProjectsPage();
    }
  };

  // Handle scroll pagination for meetings
  const handleMeetingsListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      hasNextMeetingsPage &&
      !isFetchingNextMeetingsPage &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    ) {
      fetchNextMeetingsPage();
    }
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Simulate progress
      setUploadProgress(10);
      const result = await uploadFile({
        file,
        project_id: projectId,
        meeting_id: meetingId,
      });
      setUploadProgress(100);
      return result;
    },
    onSuccess: () => {
      setUploadSuccess(true);
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.files });
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', projectId, 'files'],
        });
      }
      if (meetingId) {
        queryClient.invalidateQueries({
          queryKey: ['meetings', meetingId, 'files'],
        });
      }
    },
    onError: (error: any) => {
      showToast('error', error.message || t('uploadError'));
      setUploadProgress(0);
    },
  });

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    setProjectId(defaultProjectId);
    setMeetingId(defaultMeetingId);
    setUploadProgress(0);
    setUploadSuccess(false);
    onClose();
  }, [onClose, defaultProjectId, defaultMeetingId]);

  const handleFileSelect = (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      showToast('error', validation.error || t('validation.invalidType'));
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleViewFiles = () => {
    router.push('/files');
    handleClose();
  };

  const handleUploadAnother = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const FileIcon = selectedFile
    ? getFileIcon(selectedFile.type)
    : Document24Regular;

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) =>
        !data.open && !uploadMutation.isPending && handleClose()
      }
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                icon={<Dismiss24Regular />}
                onClick={handleClose}
                disabled={uploadMutation.isPending}
              />
            }
          >
            {t('uploadFile')}
          </DialogTitle>

          <DialogContent className={styles.content}>
            {uploadSuccess ? (
              // Success State
              <div className={styles.successSection}>
                <CheckmarkCircle24Filled className={styles.successIcon} />
                <Text className={styles.successTitle}>
                  {t('uploadSuccess')}
                </Text>
                <Caption1>{selectedFile?.name}</Caption1>
                <div className={styles.successActions}>
                  <Button appearance="primary" onClick={handleViewFiles}>
                    {t('viewFiles')}
                  </Button>
                  <Button appearance="secondary" onClick={handleUploadAnother}>
                    {t('uploadAnother')}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* File Selection Area */}
                {!selectedFile ? (
                  <div
                    className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaActive : ''}`}
                    onClick={handleUploadClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleUploadClick();
                      }
                    }}
                  >
                    <ArrowUpload24Regular className={styles.uploadIcon} />
                    <Text className={styles.uploadText}>{t('selectFile')}</Text>
                    <Caption1 className={styles.uploadHint}>
                      {t('dragDropHere')}
                    </Caption1>
                    <Caption1 className={styles.supportedFormats}>
                      {t('supportedFormats')}
                    </Caption1>
                    <Caption1 className={styles.supportedFormats}>
                      {t('maxFileSize')}
                    </Caption1>
                  </div>
                ) : (
                  <div className={styles.fileInfo}>
                    <FileIcon className={styles.fileIcon} />
                    <div className={styles.fileDetails}>
                      <Text className={styles.fileName}>
                        {selectedFile.name}
                      </Text>
                      <Caption1 className={styles.fileSize}>
                        {formatFileSize(selectedFile.size)}
                      </Caption1>
                    </div>
                    <Button
                      appearance="subtle"
                      icon={<Dismiss24Regular />}
                      onClick={handleRemoveFile}
                      className={styles.removeButton}
                      disabled={uploadMutation.isPending}
                    />
                  </div>
                )}

                {/* Upload Progress */}
                {uploadMutation.isPending && (
                  <div className={styles.progressSection}>
                    <Text>{t('uploading')}</Text>
                    <ProgressBar value={uploadProgress / 100} />
                  </div>
                )}

                {/* Project Selection with Search */}
                <div className={styles.filterSection}>
                  <label className={styles.label}>{t('selectProject')}</label>
                  <Combobox
                    placeholder={
                      isLoadingProjects ? t('loading') : t('selectProject')
                    }
                    value={
                      projectId && projects.length > 0
                        ? projects.find((p: any) => p.id === projectId)?.name ||
                          ''
                        : projectSearchQuery
                    }
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setProjectSearchQuery(e.target.value);
                    }}
                    onOptionSelect={(_: any, data: any) => {
                      const newProjectId = data.optionValue as string;
                      setProjectId(newProjectId || undefined);
                      setProjectSearchQuery('');
                      // Reset meeting if project changes
                      if (newProjectId !== projectId) {
                        setMeetingId(undefined);
                      }
                    }}
                    disabled={!!defaultProjectId || uploadMutation.isPending}
                    listbox={{
                      onScroll: handleProjectsListScroll,
                    }}
                  >
                    {projects.map((project: any) => (
                      <Option key={project.id} value={project.id}>
                        {project.name}
                      </Option>
                    ))}
                    {isFetchingNextProjectsPage && (
                      <div
                        style={{
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Spinner size="small" />
                        <Caption1>{t('loading')}</Caption1>
                      </div>
                    )}
                    {!isLoadingProjects &&
                      projects.length === 0 &&
                      debouncedProjectQuery && (
                        <div style={{ padding: '12px', textAlign: 'center' }}>
                          <Caption1>{t('noResults')}</Caption1>
                        </div>
                      )}
                  </Combobox>
                </div>

                {/* Meeting Selection with Search */}
                <div className={styles.filterSection}>
                  <label className={styles.label}>{t('selectMeeting')}</label>
                  <Combobox
                    placeholder={t('selectMeeting')}
                    value={
                      meetingId
                        ? meetings.find((m: any) => m.id === meetingId)
                            ?.title || t('noMeeting')
                        : meetingSearchQuery
                    }
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setMeetingSearchQuery(e.target.value);
                    }}
                    onOptionSelect={(_: any, data: any) => {
                      setMeetingId((data.optionValue as string) || undefined);
                      setMeetingSearchQuery('');
                    }}
                    disabled={uploadMutation.isPending}
                    listbox={{
                      onScroll: handleMeetingsListScroll,
                    }}
                  >
                    {meetings.map((meeting: any) => (
                      <Option key={meeting.id} value={meeting.id}>
                        {meeting.title || t('noMeeting')}
                      </Option>
                    ))}
                    {isFetchingNextMeetingsPage && (
                      <div
                        style={{
                          padding: '8px 12px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Spinner size="small" />
                        <Caption1>{t('loading')}</Caption1>
                      </div>
                    )}
                    {!isLoadingMeetings &&
                      meetings.length === 0 &&
                      debouncedMeetingQuery && (
                        <div style={{ padding: '12px', textAlign: 'center' }}>
                          <Caption1>{t('noResults')}</Caption1>
                        </div>
                      )}
                    {!isLoadingMeetings &&
                      meetings.length === 0 &&
                      !debouncedMeetingQuery && (
                        <div style={{ padding: '12px', textAlign: 'center' }}>
                          <Caption1>
                            {tMeetings('noAvailableMeetings')}
                          </Caption1>
                        </div>
                      )}
                  </Combobox>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  className={styles.hiddenInput}
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.txt,.csv"
                />
              </>
            )}
          </DialogContent>

          {!uploadSuccess && (
            <DialogActions className={styles.actions}>
              <Button
                appearance="secondary"
                onClick={handleClose}
                disabled={uploadMutation.isPending}
              >
                {t('cancel')}
              </Button>
              <Button
                appearance="primary"
                onClick={handleUpload}
                disabled={!selectedFile || uploadMutation.isPending}
                icon={
                  uploadMutation.isPending ? undefined : (
                    <ArrowUpload24Regular />
                  )
                }
              >
                {uploadMutation.isPending ? t('uploading') : t('upload')}
              </Button>
            </DialogActions>
          )}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
