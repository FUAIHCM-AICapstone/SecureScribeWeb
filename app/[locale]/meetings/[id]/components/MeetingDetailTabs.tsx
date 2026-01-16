'use client';

import {
    Add20Regular,
    ClipboardTaskListLtrRegular,
    Document20Regular,
    DocumentPdf20Regular,
    FolderOpen24Regular,
} from '@/lib/icons';
import {
    Button,
    Spinner,
    Tab,
    TabList,
    Text,
    makeStyles,
    shorthands,
    tokens,
} from '@fluentui/react-components';
import { useTranslations } from 'next-intl';
import { Suspense, useState } from 'react';
import type { MeetingNoteResponse } from 'types/meeting_note.type';
import type { TranscriptResponse } from 'types/transcript.type';
import type { MeetingAgendaResponse } from 'types/agenda.type';
import { MeetingAgenda } from './MeetingAgenda';
import { MeetingFilesTable } from './MeetingFilesTable';
import { MeetingNotes } from './MeetingNotes';
import { MeetingTranscripts } from './MeetingTranscripts';

const useStyles = makeStyles({
  tabsContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  tabListWrapper: {
    ...shorthands.padding('0px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow2,
  },
  tabContent: {
    ...shorthands.padding('28px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow4,
    minHeight: '400px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    ...shorthands.gap('16px'),
  },
});

interface MeetingDetailTabsProps {
  note: MeetingNoteResponse | null;
  isLoadingNote: boolean;
  noteError: string | null;
  onCreateNote: () => void;
  onEditNote: () => void;
  onShowTasks?: () => void;
  isCreating: boolean;
  isUpdating: boolean;
  analysisProgress?: {
    progress: number;
    status: string;
    task_id: string;
  } | null;

  transcripts: TranscriptResponse[] | null;
  isLoadingTranscripts: boolean;
  transcriptError: string | null;
  onDeleteTranscript: (transcriptId: string) => void;
  onReindexTranscript: (transcriptId: string) => void;
  onUploadAudio: () => void;
  isDeletingTranscript: boolean;
  isUploadingAudio: boolean;
  isReindexing: boolean;

  files: any[] | null;
  isLoadingFiles: boolean;
  onFileModalOpen: () => void;

  agenda: MeetingAgendaResponse | null;
  isLoadingAgenda: boolean;
  agendaError: string | null;
  onUpdateAgenda: (content: string) => Promise<void>;
  onGenerateAgenda: (customPrompt?: string) => Promise<void>;
  isUpdatingAgenda: boolean;
  isGeneratingAgenda: boolean;
}

export function MeetingDetailTabs({
  note,
  isLoadingNote,
  noteError,
  onCreateNote,
  onEditNote,
  onShowTasks,
  isCreating,
  isUpdating,
  analysisProgress,
  transcripts,
  isLoadingTranscripts,
  transcriptError,
  onDeleteTranscript,
  onReindexTranscript,
  onUploadAudio,
  isDeletingTranscript,
  isUploadingAudio,
  isReindexing,
  files,
  isLoadingFiles,
  onFileModalOpen,
  agenda,
  isLoadingAgenda,
  agendaError,
  onUpdateAgenda,
  onGenerateAgenda,
  isUpdatingAgenda,
  isGeneratingAgenda,
}: MeetingDetailTabsProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingDetail');
  const [selectedTab, setSelectedTab] = useState<string>('notes');

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabListWrapper}>
        <TabList
          selectedValue={selectedTab}
          onTabSelect={(event, data) => setSelectedTab(data.value as string)}
          appearance="subtle"
        >
          <Tab value="notes" icon={<Document20Regular />}>
            {t('meetingNote')}
          </Tab>
          <Tab value="transcripts" icon={<DocumentPdf20Regular />}>
            {t('transcripts')}
          </Tab>
          <Tab value="files" icon={<FolderOpen24Regular />}>
            {t('files')}
          </Tab>
          <Tab value="agenda" icon={<ClipboardTaskListLtrRegular />}>
            Agenda
          </Tab>
        </TabList>
      </div>

      {/* Notes Tab */}
      {selectedTab === 'notes' && (
        <div className={styles.tabContent}>
          <Suspense
            fallback={
              <div className={styles.loadingContainer}>
                <Spinner size="large" />
                <Text>{t('loading')}</Text>
              </div>
            }
          >
            <MeetingNotes
              note={note}
              isLoading={isLoadingNote}
              error={noteError}
              onCreateNote={onCreateNote}
              onEditNote={onEditNote}
              onShowTasks={onShowTasks}
              isCreating={isCreating}
              isUpdating={isUpdating}
              analysisProgress={analysisProgress}
            />
          </Suspense>
        </div>
      )}

      {/* Transcripts Tab */}
      {selectedTab === 'transcripts' && (
        <div className={styles.tabContent}>
          <Suspense
            fallback={
              <div className={styles.loadingContainer}>
                <Spinner size="large" />
                <Text>{t('loading')}</Text>
              </div>
            }
          >
            <MeetingTranscripts
              transcripts={transcripts || []}
              isLoading={isLoadingTranscripts}
              error={transcriptError}
              onDeleteTranscript={onDeleteTranscript}
              onReindexTranscript={onReindexTranscript}
              onUploadAudio={onUploadAudio}
              isDeleting={isDeletingTranscript}
              isUploading={isUploadingAudio}
              isReindexing={isReindexing}
            />
          </Suspense>
        </div>
      )}

      {/* Files Tab */}
      {selectedTab === 'files' && (
        <div className={styles.tabContent}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Text style={{ fontWeight: 700, fontSize: tokens.fontSizeBase400 }}>
              {t('files')}
            </Text>
            <Button
              appearance="primary"
              icon={<Add20Regular />}
              onClick={onFileModalOpen}
            >
              {t('uploadFile')}
            </Button>
          </div>
          <MeetingFilesTable
            files={files || []}
            isLoading={isLoadingFiles}
            page={1}
            onPageChange={() => {}}
            hasMore={false}
          />
        </div>
      )}

      {/* Agenda Tab */}
      {selectedTab === 'agenda' && (
        <div className={styles.tabContent}>
          <Suspense
            fallback={
              <div className={styles.loadingContainer}>
                <Spinner size="large" />
                <Text>{t('loading')}</Text>
              </div>
            }
          >
            <MeetingAgenda
              agenda={agenda}
              isLoading={isLoadingAgenda}
              error={agendaError}
              onUpdateAgenda={onUpdateAgenda}
              onGenerateAgenda={onGenerateAgenda}
              isUpdating={isUpdatingAgenda}
              isGenerating={isGeneratingAgenda}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
