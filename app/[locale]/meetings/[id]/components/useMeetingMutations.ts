'use client';

import {
  showErrorToast,
  showSuccessToast,
  showToast,
} from '@/hooks/useShowToast';
import { queryKeys } from '@/lib/queryClient';
import {
  deleteAudioFile,
  uploadAndTranscribeAudio,
} from '@/services/api/audio';
import {
  generateMeetingAgenda,
  updateMeetingAgenda,
} from '@/services/api/agenda';
import {
  archiveMeeting,
  deleteMeeting,
  unarchiveMeeting,
} from '@/services/api/meeting';
import {
  createMeetingNote,
  updateMeetingNote,
} from '@/services/api/meetingNote';
import { deleteTranscript, reindexTranscript } from '@/services/api/transcript';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';

export const useMeetingMutations = (
  meetingId: string,
  tMeetings: (key: string) => string,
  t: (key: string) => string,
  onUploadModalClose?: () => void,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Delete meeting mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteMeeting(meetingId),
    onSuccess: () => {
      showToast('success', tMeetings('actions.deleteSuccess'));
      router.push('/meetings');
    },
    onError: (error: any) => {
      showToast(
        'error',
        error?.response?.data?.detail || tMeetings('actions.deleteError'),
      );
      setIsDeleting(false);
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: () => archiveMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({
        queryKey: queryKeys.meeting(meetingId),
      });
      showToast('success', tMeetings('actions.archiveSuccess'), {
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error('Error archiving meeting:', error);
      showToast('error', error?.message || tMeetings('actions.archiveError'), {
        duration: 5000,
      });
    },
  });

  // Unarchive mutation
  const unarchiveMutation = useMutation({
    mutationFn: () => unarchiveMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({
        queryKey: queryKeys.meeting(meetingId),
      });
      showToast('success', tMeetings('actions.unarchiveSuccess'), {
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error('Error unarchiving meeting:', error);
      showToast(
        'error',
        error?.message || tMeetings('actions.unarchiveError'),
        {
          duration: 5000,
        },
      );
    },
  });

  // Delete audio file mutation
  const deleteAudioMutation = useMutation({
    mutationFn: (audioId: string) => deleteAudioFile(audioId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioFiles', meetingId] });
      queryClient.invalidateQueries({ queryKey: ['meetingFiles', meetingId] });
      showSuccessToast(
        tMeetings('actions.deleteAudioSuccess') ||
          'Audio file deleted successfully',
      );
    },
    onError: (error: any) => {
      showErrorToast(
        error?.response?.data?.detail ||
          tMeetings('actions.deleteAudioError') ||
          'Failed to delete audio file',
      );
    },
  });

  // Delete transcript mutation
  const deleteTranscriptMutation = useMutation({
    mutationFn: (transcriptId: string) => deleteTranscript(transcriptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts', meetingId] });
      showSuccessToast(
        tMeetings('actions.deleteSuccess') || 'Transcript deleted successfully',
      );
    },
    onError: (error: any) => {
      showErrorToast(
        error?.response?.data?.detail ||
          tMeetings('actions.deleteError') ||
          'Failed to delete transcript',
      );
    },
  });

  // Create meeting note mutation
  const createNoteMutation = useMutation({
    mutationFn: (customPrompt?: string) =>
      createMeetingNote({
        meeting_id: meetingId,
        custom_prompt: customPrompt || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingNote', meetingId] });
      showSuccessToast(t('createNoteSuccess'));
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.detail || 'Failed to create note');
    },
  });

  // Update meeting note mutation
  const updateNoteMutation = useMutation({
    mutationFn: (noteContent: string) =>
      updateMeetingNote(meetingId, {
        content: noteContent,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingNote', meetingId] });
      showSuccessToast(t('updateNoteSuccess'));
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.detail || 'Failed to update note');
    },
  });

  // Upload audio and transcribe mutation
  const uploadAudioMutation = useMutation({
    mutationFn: (file: File) => uploadAndTranscribeAudio(meetingId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts', meetingId] });
      showSuccessToast(t('uploadAudioSuccess'));
      onUploadModalClose?.();
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.detail || 'Failed to upload audio');
    },
  });

  // Reindex transcript mutation
  const reindexTranscriptMutation = useMutation({
    mutationFn: ({ transcriptId, force }: { transcriptId: string; force?: boolean }) =>
      reindexTranscript(meetingId, transcriptId, { force }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts', meetingId] });
      showSuccessToast(tMeetings('actions.reindexStarted') || 'Transcript reindex started');
    },
    onError: (error: any) => {
      showErrorToast(
        error?.response?.data?.detail ||
          tMeetings('actions.reindexFailed') ||
          'Failed to reindex transcript',
      );
    },
  });

  // Update meeting agenda mutation
  const updateAgendaMutation = useMutation({
    mutationFn: (content: string) =>
      updateMeetingAgenda(meetingId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingAgenda', meetingId] });
      showSuccessToast(t('updateAgendaSuccess') || 'Agenda updated successfully');
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.detail || 'Failed to update agenda');
    },
  });

  // Generate meeting agenda mutation
  const generateAgendaMutation = useMutation({
    mutationFn: (customPrompt?: string) =>
      generateMeetingAgenda({
        meeting_id: meetingId,
        custom_prompt: customPrompt || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetingAgenda', meetingId] });
      showSuccessToast(t('generateAgendaSuccess') || 'Agenda generated successfully');
    },
    onError: (error: any) => {
      showErrorToast(error?.response?.data?.detail || 'Failed to generate agenda');
    },
  });

  return {
    isDeleting,
    setIsDeleting,
    deleteMutation,
    archiveMutation,
    unarchiveMutation,
    deleteAudioMutation,
    deleteTranscriptMutation,
    createNoteMutation,
    updateNoteMutation,
    uploadAudioMutation,
    reindexTranscriptMutation,
    updateAgendaMutation,
    generateAgendaMutation,
  };
};
