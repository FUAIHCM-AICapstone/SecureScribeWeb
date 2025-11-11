'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { showToast } from '@/hooks/useShowToast';
import { queryKeys } from '@/lib/queryClient';
import { moveFile } from '@/services/api/file';
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
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { ArrowMove24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';
import type { FileResponse } from 'types/file.type';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    minWidth: '400px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
    },
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  info: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});

interface FileMoveModalProps {
  open: boolean;
  onClose: () => void;
  file: FileResponse | null;
  onMoveSuccess?: () => void;
}

export function FileMoveModal({
  open,
  onClose,
  file,
  onMoveSuccess,
}: FileMoveModalProps) {
  const styles = useStyles();
  const t = useTranslations('Files');
  const tMeetings = useTranslations('Meetings');
  const queryClient = useQueryClient();

  const [projectId, setProjectId] = useState<string | undefined>(
    file?.project_id,
  );
  const [meetingId, setMeetingId] = useState<string | undefined>(
    file?.meeting_id,
  );

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

  // Reset search when closing modal
  useEffect(() => {
    if (!open) {
      setProjectSearchQuery('');
      setMeetingSearchQuery('');
    }
  }, [open]);

  // Move mutation
  const moveMutation = useMutation({
    mutationFn: async () => {
      if (!file?.id) throw new Error('File ID is required');

      return moveFile(file.id, {
        project_id: projectId,
        meeting_id: meetingId,
      });
    },
    onSuccess: () => {
      showToast('success', t('move.moveSuccess'));

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.files });

      if (file?.project_id) {
        queryClient.invalidateQueries({
          queryKey: ['projects', file.project_id, 'files'],
        });
      }
      if (file?.meeting_id) {
        queryClient.invalidateQueries({
          queryKey: ['meetings', file.meeting_id, 'files'],
        });
      }

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

      onMoveSuccess?.();
      handleClose();
    },
    onError: (error: any) => {
      showToast('error', error.message || t('move.moveError'));
    },
  });

  const handleClose = useCallback(() => {
    setProjectId(file?.project_id);
    setMeetingId(file?.meeting_id);
    onClose();
  }, [onClose, file?.project_id, file?.meeting_id]);

  const handleMove = () => {
    moveMutation.mutate();
  };

  // Check if moved
  const hasMoved =
    projectId !== file?.project_id || meetingId !== file?.meeting_id;

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) =>
        !data.open && !moveMutation.isPending && handleClose()
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
                disabled={moveMutation.isPending}
              />
            }
          >
            {t('move.title')}
          </DialogTitle>

          <DialogContent className={styles.content}>
            <Text className={styles.info}>
              {t('move.currentFile')}: <strong>{file?.filename}</strong>
            </Text>

            {/* Project Selection with Search */}
            <div className={styles.filterSection}>
              <label className={styles.label}>{t('selectProject')}</label>
              <Combobox
                placeholder={t('selectProject')}
                value={
                  projectId && projects.length > 0
                    ? projects.find((p: any) => p.id === projectId)?.name || ''
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
                disabled={false}
                listbox={{
                  onScroll: handleProjectsListScroll,
                }}
              >
                <Option value="" key="no-project">
                  {t('move.noProject')}
                </Option>
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
                    ? meetings.find((m: any) => m.id === meetingId)?.title || ''
                    : meetingSearchQuery
                }
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setMeetingSearchQuery(e.target.value);
                }}
                onOptionSelect={(_: any, data: any) => {
                  setMeetingId((data.optionValue as string) || undefined);
                  setMeetingSearchQuery('');
                }}
                disabled={false}
                listbox={{
                  onScroll: handleMeetingsListScroll,
                }}
              >
                <Option value="" key="no-meeting">
                  {t('move.noMeeting')}
                </Option>
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
                      <Caption1>{tMeetings('noAvailableMeetings')}</Caption1>
                    </div>
                  )}
              </Combobox>
            </div>
          </DialogContent>

          <DialogActions className={styles.actions}>
            <Button
              appearance="secondary"
              onClick={handleClose}
              disabled={moveMutation.isPending}
            >
              {t('move.cancel')}
            </Button>
            <Button
              appearance="primary"
              onClick={handleMove}
              disabled={!hasMoved || moveMutation.isPending}
              icon={moveMutation.isPending ? undefined : <ArrowMove24Regular />}
            >
              {moveMutation.isPending ? t('move.moving') : t('move.move')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
