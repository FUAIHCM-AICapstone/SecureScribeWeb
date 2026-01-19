'use client';

import React, { useState } from 'react';
import { Text, Button, makeStyles, shorthands, tokens, Spinner } from '@/lib/components';
import { useTranslations } from 'next-intl';
import { Edit20Regular, ArrowDownload20Regular } from '@/lib/icons';
import { parseMarkdownNote } from './meetingNoteUtils';
import { AgendaModal } from './AgendaModal';
import { downloadMeetingAgenda } from '@/services/api/agenda';
import type { MeetingWithProjects } from 'types/meeting.type';

// Helper function to generate a clean filename from meeting data for agenda
function generateMeetingAgendaFilename(meeting: MeetingWithProjects | undefined): string {
    if (!meeting) {
        return 'meeting-agenda.md';
    }

    const title = meeting.title || 'Untitled Meeting';
    const date = meeting.start_time ? new Date(meeting.start_time) : new Date(meeting.created_at);

    // Format date as YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];

    // Clean title: remove special characters and limit length
    const cleanTitle = title
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
        .substring(0, 50); // Limit to 50 characters

    return `${cleanTitle} - Agenda - ${formattedDate}.md`;
}

interface MarkdownSection {
  type: string;
  content: string;
  children?: MarkdownSection[];
}

const useStyles = makeStyles({
  sectionTitle: {
    marginBottom: '20px',
    paddingBottom: '16px',
    ...shorthands.borderBottom('2px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('12px'),
  },
  sectionTitleContent: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  agendaContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  agendaEmpty: {
    ...shorthands.padding('48px', '32px'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
  },
  agendaPreview: {
    maxHeight: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  expandedContent: {
    maxHeight: '600px',
    overflowY: 'auto',
  },
  expandButton: {
    minWidth: '32px',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('20px'),
    ...shorthands.gap('8px'),
  },
  errorContainer: {
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorStatusDangerBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorStatusDangerBorder1),
  },
});

export function MeetingAgenda({
  agenda,
  isLoading,
  error,
  onUpdateAgenda,
  onGenerateAgenda,
  isUpdating,
  isGenerating,
  meetingId,
  meeting,
}: {
  agenda: any;
  isLoading: boolean;
  error: string | null;
  onUpdateAgenda: (content: string) => Promise<void>;
  onGenerateAgenda: (customPrompt?: string) => Promise<void>;
  isUpdating: boolean;
  isGenerating: boolean;
  meetingId: string;
  meeting: MeetingWithProjects | undefined;
}) {
  const styles = useStyles();
  const t = useTranslations('MeetingDetail');
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('edit');
  const [agendaContent, setAgendaContent] = useState('');
  const [customAgendaPrompt, setCustomAgendaPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Use real agenda content or show empty state
  const displayContent = agenda?.content || '';
  const parsed = parseMarkdownNote(displayContent);

  // Handlers
  const handleEditAgenda = () => {
    setModalMode('edit');
    setAgendaContent(displayContent);
    setCustomAgendaPrompt('');
    setShowEditModal(true);
  };

  const handleGenerateAgenda = () => {
    setModalMode('create');
    setAgendaContent('');
    setCustomAgendaPrompt('');
    setShowEditModal(true);
  };

  const handleSaveAgenda = async () => {
    try {
      if (modalMode === 'edit') {
        await onUpdateAgenda(agendaContent);
      } else {
        // For create mode, generate using custom prompt
        await onGenerateAgenda(customAgendaPrompt);
      }
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to save/generate agenda:', error);
    }
  };

  const handleDownloadAgenda = async () => {
    if (!displayContent) return;

    setIsDownloading(true);
    try {
      const blob = await downloadMeetingAgenda(meetingId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateMeetingAgendaFilename(meeting);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download agenda:', error);
      // You might want to show a toast notification here
    } finally {
      setIsDownloading(false);
    }
  };

interface MarkdownSectionViewProps {
  section: MarkdownSection;
}

  // Component to render a single markdown section
  function MarkdownSectionView({ section }: MarkdownSectionViewProps) {
    switch (section.type) {
      case 'heading1':
        return (
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: tokens.colorBrandForeground1,
              marginTop: '20px',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottomStyle: 'solid',
              borderBottomWidth: '2px',
              borderBottomColor: tokens.colorBrandForeground1,
            }}
          >
            {section.content}
          </div>
        );
      case 'heading2':
        return (
          <div
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: tokens.colorBrandForeground1,
              marginTop: '16px',
              marginBottom: '10px',
              paddingBottom: '6px',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1px',
              borderBottomColor: tokens.colorBrandForeground2,
            }}
          >
            {section.content}
          </div>
        );
      case 'heading3':
        return (
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: tokens.colorBrandForeground2,
              marginTop: '12px',
              marginBottom: '6px',
            }}
          >
            {section.content}
          </div>
        );
      case 'paragraph':
        return (
          <div
            style={{
              fontSize: tokens.fontSizeBase300,
              color: tokens.colorNeutralForeground1,
              lineHeight: '1.6',
              marginBottom: '10px',
            }}
          >
            {section.children && section.children.length > 0 ? (
              <InlineContent sections={section.children} />
            ) : (
              section.content
            )}
          </div>
        );
      case 'list':
        return (
          <ul
            style={{
              fontSize: tokens.fontSizeBase300,
              color: tokens.colorNeutralForeground1,
              lineHeight: '1.6',
              marginBottom: '10px',
              marginLeft: '20px',
            }}
          >
            {section.children?.map((item: any, idx: number) => (
              <li key={idx} style={{ marginBottom: '6px' }}>
                {item.children && item.children.length > 0 ? (
                  <InlineContent sections={item.children} />
                ) : (
                  item.content
                )}
              </li>
            ))}
          </ul>
        );
      default:
        return (
          <div
            style={{
              fontSize: tokens.fontSizeBase300,
              color: tokens.colorNeutralForeground1,
            }}
          >
            {section.content}
          </div>
        );
    }
  }

interface InlineContentProps {
  sections: MarkdownSection[];
}

  function InlineContent({ sections }: InlineContentProps) {
    return (
      <>
        {sections.map((section: any, idx: number) => (
          <span key={idx}>
            {section.type === 'bold' ? (
              <strong>{section.content}</strong>
            ) : (
              section.content
            )}
          </span>
        ))}
      </>
    );
  }

  return (
    <div>
      <div className={styles.sectionTitle}>
        <div className={styles.sectionTitleContent}>
          <Text className={styles.sectionHeading}>Agenda</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            appearance="secondary"
            icon={<ArrowDownload20Regular />}
            onClick={handleDownloadAgenda}
            disabled={isUpdating || isGenerating || isDownloading || !displayContent}
          >
            {isDownloading ? t('downloading') || 'Downloading...' : t('downloadAgenda') || 'Download'}
          </Button>
          <Button
            appearance="secondary"
            icon={<Edit20Regular />}
            onClick={handleEditAgenda}
            disabled={isUpdating || isGenerating || isDownloading || !displayContent}
          >
            {isUpdating ? t('saving') : t('edit')}
          </Button>
          <Button
            appearance="primary"
            onClick={handleGenerateAgenda}
            disabled={isUpdating || isGenerating || isDownloading}
          >
            {isGenerating ? t('generating') || 'Generating...' : t('generateAgenda') || 'Generate'}
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className={styles.loadingContainer}>
          <Spinner size="small" />
          <Text style={{ marginLeft: '8px' }}>Loading agenda...</Text>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <Text style={{ color: tokens.colorStatusDangerForeground1 }}>
            {error || 'Failed to load agenda'}
          </Text>
        </div>
      )}

      {!isLoading && !error && (
        <div className={styles.agendaContainer}>
        <div
          className={isExpanded ? styles.expandedContent : styles.agendaPreview}
          style={{
            fontSize: tokens.fontSizeBase300,
            color: tokens.colorNeutralForeground1,
            lineHeight: '1.8',
          }}
        >
          {parsed.sections && parsed.sections.length > 0 ? (
            parsed.sections.map((section: any, idx: number) => (
              <MarkdownSectionView key={idx} section={section} />
            ))
          ) : (
            <div className={styles.agendaEmpty}>
              <Text style={{ fontSize: tokens.fontSizeBase300 }}>
                No agenda items yet
              </Text>
            </div>
          )}
        </div>
        {parsed.sections && parsed.sections.length > 0 && (
          <Button
            appearance="subtle"
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.expandButton}
          >
            {isExpanded ? t('showLess') || 'Show Less' : t('showMore') || 'Show More'}
          </Button>
        )}
      </div>
      )}

      {/* Agenda Modal */}
      <AgendaModal
        isOpen={showEditModal}
        mode={modalMode}
        agendaContent={agendaContent}
        customAgendaPrompt={customAgendaPrompt}
        isSaving={isUpdating || isGenerating}
        isLoading={isLoading}
        error={error || null}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) {
            setAgendaContent('');
            setCustomAgendaPrompt('');
          }
        }}
        onAgendaContentChange={setAgendaContent}
        onCustomPromptChange={setCustomAgendaPrompt}
        onSaveAgenda={handleSaveAgenda}
      />
    </div>
  );
}
