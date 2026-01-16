'use client';

import { Suspense } from 'react';
const MeetingEditModal = React.lazy(() => import('@/components/modal/MeetingEditModal'));
const FileUploadModalComponent = React.lazy(() => import('@/components/modal/FileUploadModal').then(m => ({ default: m.FileUploadModal })));
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
import { ArrowLeft20Regular } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/context/WebSocketContext';
import { MeetingHeader } from './MeetingHeader';
import { MeetingFiles } from './MeetingFiles';
import { MeetingModals } from './MeetingModals';
import { MeetingDetailTabs } from './MeetingDetailTabs';

// Lazy load LinkedProjectsSection to save ~40-50 kB on initial meeting detail load
const LinkedProjectsSection = React.lazy(() => import('./LinkedProjectsSection').then(m => ({ default: m.LinkedProjectsSection })));
import { useMeetingQueries } from './useMeetingQueries';
import { useMeetingMutations } from './useMeetingMutations';

const useStyles = makeStyles({
  container: {
    margin: '0 auto',
    ...shorthands.padding('24px', '24px', '16px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('16px', '12px', '12px'),
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  section: {
    ...shorthands.padding('28px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow4,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    ...shorthands.gap('16px'),
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    textAlign: 'center',
    ...shorthands.gap('16px'),
  },
  errorTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: tokens.colorPaletteRedForeground1,
  },
});

interface MeetingDetailClientProps {
  meetingId: string;
}

export function MeetingDetailClient({ meetingId }: MeetingDetailClientProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingDetail');
  const tMeetings = useTranslations('Meetings');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { lastMessage } = useWebSocket();

  // Track meeting_analysis task progress
  const [analysisProgress, setAnalysisProgress] = React.useState<{
    progress: number;
    status: string;
    task_id: string;
  } | null>(null);

  // Fetch all data using custom hooks
  const {
    meeting,
    isLoadingMeeting,
    isErrorMeeting,
    audioFiles,
    isLoadingAudio,
    audioError,
    files,
    isLoadingFiles,
    filesError,
    transcripts,
    isLoadingTranscripts,
    transcriptError,
    meetingNote,
    isLoadingNote,
    noteError,
    meetingAgenda,
    isLoadingAgenda,
    agendaError,
  } = useMeetingQueries(meetingId);

  // Get all mutations using custom hook
  const {
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
  } = useMeetingMutations(meetingId, tMeetings, t, () => {
    setShowUploadModal(false);
    setUploadedFile(null);
    setIsUploadingAudio(false);
  });

  // Listen for task completion messages to invalidate queries
  React.useEffect(() => {
    if (lastMessage?.type === 'task_progress') {
      const { task_type, status } = lastMessage.data || {};

      // Handle audio transcription completion
      if (status === 'completed' && task_type === 'audio_asr') {
        console.log('[MeetingDetailClient] Audio transcription completed, invalidating transcripts query');
        queryClient.invalidateQueries({ queryKey: ['transcripts', meetingId] });
      }

      // Handle transcript reindex completion
      if (status === 'completed' && task_type === 'transcript_reindex') {
        console.log('[MeetingDetailClient] Transcript reindex completed, invalidating transcripts query');
        queryClient.invalidateQueries({ queryKey: ['transcripts', meetingId] });
      }

      // Handle meeting_analysis progress and completion
      if (task_type === 'meeting_analysis') {
        const progressData = lastMessage.data;
        console.log('[MeetingDetailClient] Meeting analysis progress:', progressData);

        setAnalysisProgress({
          progress: progressData.progress || 0,
          status: progressData.status || 'processing',
          task_id: progressData.task_id || '',
        });

        // When analysis completes, invalidate meeting note and tasks queries
        if (status === 'completed') {
          console.log('[MeetingDetailClient] Meeting analysis completed, refetching note and tasks');
          queryClient.invalidateQueries({ queryKey: ['meetingNote', meetingId] });
          queryClient.invalidateQueries({ queryKey: ['tasks', { meeting_id: meetingId }] });

          // Clear progress state after a short delay
          setTimeout(() => setAnalysisProgress(null), 2000);
        }
      }
    }
  }, [lastMessage, queryClient, meetingId]);

  // UI state
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showNoteModal, setShowNoteModal] = React.useState(false);
  const [noteModalMode, setNoteModalMode] = React.useState<'create' | 'edit'>(
    'create',
  );
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<{
    type: 'audio' | 'transcript';
    id: string;
  } | null>(null);
  const [customNotePrompt, setCustomNotePrompt] = React.useState('');
  const [noteContent, setNoteContent] = React.useState('');
  const [isUploadingAudio, setIsUploadingAudio] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const [showFileModal, setShowFileModal] = React.useState(false);

  // Handlers
  const handleEdit = () => setShowEditModal(true);

  const handleDelete = () => setShowDeleteModal(true);

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    setShowDeleteModal(false);
    deleteMutation.mutate();
  };

  const handleArchiveToggle = () => {
    if (meeting?.status === 'archived') {
      unarchiveMutation.mutate();
    } else {
      archiveMutation.mutate();
    }
  };

  const handleCreateNote = () => {
    setNoteModalMode('create');
    setNoteContent('');
    setCustomNotePrompt('');
    setShowNoteModal(true);
  };

  const handleEditNote = () => {
    setNoteModalMode('edit');
    setNoteContent(meetingNote?.content || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = () => {
    if (noteModalMode === 'create') {
      createNoteMutation.mutate(customNotePrompt);
      setShowNoteModal(false);
      setCustomNotePrompt('');
      setNoteContent('');
    } else {
      updateNoteMutation.mutate(noteContent);
      setShowNoteModal(false);
      setCustomNotePrompt('');
      setNoteContent('');
    }
  };

  const handleDeleteAudio = (audioId: string) => {
    setDeleteTarget({ type: 'audio', id: audioId });
    setShowDeleteConfirm(true);
  };

  const handleDeleteTranscript = (transcriptId: string) => {
    setDeleteTarget({ type: 'transcript', id: transcriptId });
    setShowDeleteConfirm(true);
  };

  const handleReindexTranscript = (transcriptId: string) => {
    reindexTranscriptMutation.mutate({ transcriptId });
  };

  const handleUploadAudio = () => setShowUploadModal(true);

  const handleShowTasks = () => setShowTaskModal(true);

  const handleFileModalOpen = () => setShowFileModal(true);

  const handleFileModalClose = () => {
    setShowFileModal(false);
    queryClient.invalidateQueries({ queryKey: ['files', meetingId] });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'audio') {
      deleteAudioMutation.mutate(deleteTarget.id);
    } else if (deleteTarget.type === 'transcript') {
      deleteTranscriptMutation.mutate(deleteTarget.id);
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsUploadingAudio(true);
    uploadAudioMutation.mutate(file);
  };

  if (isLoadingMeeting) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spinner size="extra-large" />
          <Text>{t('loading')}</Text>
        </div>
      </div>
    );
  }

  if (isErrorMeeting || !meeting) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <Text className={styles.errorTitle}>{t('notFound')}</Text>
          <Body1>{t('notFoundDescription')}</Body1>
          <Button
            appearance="primary"
            icon={<ArrowLeft20Regular />}
            onClick={() => router.push('/meetings')}
          >
            {t('backToMeetings')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <MeetingHeader
        meeting={meeting}
        onEdit={handleEdit}
        onArchiveToggle={handleArchiveToggle}
        onDelete={handleDelete}
        isArchiving={archiveMutation.isPending}
        isUnarchiving={unarchiveMutation.isPending}
        isDeleting={isDeleting}
        tMeetings={tMeetings}
      />

      {/* Main Content - Single Column with Tabs */}
      <div className={styles.content}>
        {/* Tab Component for Notes, Transcripts, Files, Agenda */}
        <MeetingDetailTabs
          note={meetingNote}
          isLoadingNote={isLoadingNote}
          noteError={noteError}
          onCreateNote={handleCreateNote}
          onEditNote={handleEditNote}
          onShowTasks={handleShowTasks}
          isCreating={createNoteMutation.isPending}
          isUpdating={updateNoteMutation.isPending}
          analysisProgress={analysisProgress}
          transcripts={transcripts}
          isLoadingTranscripts={isLoadingTranscripts}
          transcriptError={transcriptError}
          onDeleteTranscript={handleDeleteTranscript}
          onReindexTranscript={handleReindexTranscript}
          onUploadAudio={handleUploadAudio}
          isDeletingTranscript={deleteTranscriptMutation.isPending}
          isUploadingAudio={isUploadingAudio || uploadAudioMutation.isPending}
          isReindexing={reindexTranscriptMutation.isPending}
          files={files}
          isLoadingFiles={isLoadingFiles}
          onFileModalOpen={handleFileModalOpen}
          agenda={meetingAgenda}
          isLoadingAgenda={isLoadingAgenda}
          agendaError={agendaError}
          onUpdateAgenda={async (content: string) => {
            await updateAgendaMutation.mutateAsync(content);
          }}
          onGenerateAgenda={async (customPrompt?: string) => {
            await generateAgendaMutation.mutateAsync(customPrompt);
          }}
          isUpdatingAgenda={updateAgendaMutation.isPending}
          isGeneratingAgenda={generateAgendaMutation.isPending}
        />

        {/* Audio Files Section */}
        <MeetingFiles
          audioFiles={audioFiles}
          files={files}
          isLoadingAudio={isLoadingAudio}
          isLoadingFiles={isLoadingFiles}
          audioError={audioError}
          filesError={filesError}
          onDeleteAudio={handleDeleteAudio}
          isDeleting={deleteAudioMutation.isPending}
        />

        {/* Related Projects */}
        {meeting.projects && meeting.projects.length > 0 && (
          <Suspense fallback={null}>
            <LinkedProjectsSection projects={meeting.projects} />
          </Suspense>
        )}

        {/* Meeting URL */}
        {meeting.url && (
          <Card className={styles.section}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <Text
                style={{ fontWeight: 700, fontSize: tokens.fontSizeBase400 }}
              >
                {t('meetingUrl')}
              </Text>
            </div>
            <Button
              appearance="primary"
              onClick={() => window.open(meeting.url, '_blank')}
              style={{ width: '100%' }}
            >
              {t('openUrl')}
            </Button>
          </Card>
        )}
      </div>

      {/* Edit Modal */}
      {meeting && (
        <Suspense fallback={null}>
          <MeetingEditModal
            open={showEditModal}
            onOpenChange={setShowEditModal}
            meeting={meeting}
            onEditSuccess={() => setShowEditModal(false)}
          />
        </Suspense>
      )}

      {/* Delete & Upload Modals */}
      <MeetingModals
        showNoteModal={showNoteModal}
        noteModalMode={noteModalMode}
        customNotePrompt={customNotePrompt}
        noteContent={noteContent}
        isCreatingNote={createNoteMutation.isPending}
        isUpdatingNote={updateNoteMutation.isPending}
        onNoteModalOpenChange={setShowNoteModal}
        onCustomPromptChange={setCustomNotePrompt}
        onNoteContentChange={setNoteContent}
        onSaveNote={handleSaveNote}
        showUploadModal={showUploadModal}
        uploadedFile={uploadedFile}
        isUploadingAudio={isUploadingAudio}
        onUploadModalOpenChange={setShowUploadModal}
        onUploadedFileChange={setUploadedFile}
        onFileUpload={handleFileUpload}
        showDeleteConfirm={showDeleteConfirm}
        deleteTarget={deleteTarget}
        isDeletingAudio={deleteAudioMutation.isPending}
        isDeletingTranscript={deleteTranscriptMutation.isPending}
        onDeleteConfirmOpenChange={setShowDeleteConfirm}
        onConfirmDelete={handleConfirmDelete}
        deleteTitle={
          deleteTarget?.type === 'audio'
            ? t('deleteAudioFile')
            : t('deleteTranscript')
        }
        deleteItemName={
          deleteTarget?.type === 'audio' ? t('audioFile') : t('transcript')
        }
        showDeleteModal={showDeleteModal}
        isDeleting={isDeleting}
        onDeleteModalOpenChange={setShowDeleteModal}
        onConfirmMeetingDelete={handleDeleteConfirm}
        meetingDeleteTitle={tMeetings('actions.deleteConfirmTitle')}
        meetingDeleteItemName={meeting.title || tMeetings('untitledMeeting')}
        showTaskModal={showTaskModal}
        meetingId={meetingId}
        onTaskModalOpenChange={setShowTaskModal}
      />

      {/* File Upload Modal */}
      <Suspense fallback={null}>
        <FileUploadModalComponent
          open={showFileModal}
          onClose={handleFileModalClose}
          defaultMeetingId={meetingId}
        />
      </Suspense>
    </div>
  );
}
