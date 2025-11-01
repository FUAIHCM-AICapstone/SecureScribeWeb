'use client';

import React, { useState, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Dropdown,
  Option,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  Dismiss24Regular,
  ArrowMove24Regular,
} from '@fluentui/react-icons';
import { moveFile } from '@/services/api/file';
import { getProjects } from '@/services/api/project';
import { getMeetings } from '@/services/api/meeting';
import { queryKeys } from '@/lib/queryClient';
import { showToast } from '@/hooks/useShowToast';
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
  const queryClient = useQueryClient();

  const [projectId, setProjectId] = useState<string | undefined>(
    file?.project_id
  );
  const [meetingId, setMeetingId] = useState<string | undefined>(
    file?.meeting_id
  );

  // Fetch projects
  const { data: projectsData } = useQuery({
    queryKey: [...queryKeys.projects],
    queryFn: () => getProjects({}, { limit: 100 }),
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  // Fetch meetings - filter by project if selected
  const { data: meetingsData } = useQuery({
    queryKey: projectId
      ? [...queryKeys.projectMeetings(projectId)]
      : [...queryKeys.meetings],
    queryFn: () =>
      getMeetings(projectId ? { project_id: projectId } : {}, { limit: 100 }),
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const projects = projectsData?.data || [];
  const meetings = meetingsData?.data || [];

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
          queryKey: queryKeys.projectFiles(file.project_id),
        });
      }
      if (file?.meeting_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.meetingFiles(file.meeting_id),
        });
      }

      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projectFiles(projectId),
        });
      }
      if (meetingId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.meetingFiles(meetingId),
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

            {/* Project Selection */}
            <div className={styles.filterSection}>
              <label className={styles.label}>
                {t('selectProject')}
              </label>
              <Dropdown
                placeholder={t('selectProject')}
                value={
                  projectId
                    ? projects.find((p) => p.id === projectId)?.name || ''
                    : ''
                }
                onOptionSelect={(_, data) => {
                  const newProjectId = data.optionValue as string;
                  setProjectId(newProjectId || undefined);
                  // Reset meeting if project changes
                  if (newProjectId !== projectId) {
                    setMeetingId(undefined);
                  }
                }}
                disabled={moveMutation.isPending}
              >
                <Option value="" text={t('move.noProject')}>
                  {t('move.noProject')}
                </Option>
                {projects.map((project) => (
                  <Option key={project.id} value={project.id} text={project.name}>
                    {project.name}
                  </Option>
                ))}
              </Dropdown>
            </div>

            {/* Meeting Selection */}
            <div className={styles.filterSection}>
              <label className={styles.label}>
                {t('selectMeeting')}
              </label>
              <Dropdown
                placeholder={t('selectMeeting')}
                value={
                  meetingId
                    ? meetings.find((m) => m.id === meetingId)?.title || ''
                    : ''
                }
                onOptionSelect={(_, data) =>
                  setMeetingId((data.optionValue as string) || undefined)
                }
                disabled={moveMutation.isPending}
              >
                <Option value="" text={t('move.noMeeting')}>
                  {t('move.noMeeting')}
                </Option>
                {meetings.map((meeting) => (
                  <Option
                    key={meeting.id}
                    value={meeting.id}
                    text={meeting.title || t('noMeeting')}
                  >
                    {meeting.title || t('noMeeting')}
                  </Option>
                ))}
              </Dropdown>
            </div>
          </DialogContent>

          <DialogActions>
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
              icon={
                moveMutation.isPending ? undefined : <ArrowMove24Regular />
              }
            >
              {moveMutation.isPending ? t('move.moving') : t('move.move')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
