'use client';

import React, { useState } from 'react';
import { Text, Button, makeStyles, shorthands, tokens, Spinner } from '@fluentui/react-components';
import { useTranslations } from 'next-intl';
import { Edit20Regular } from '@/lib/icons';
import { parseMarkdownNote } from './meetingNoteUtils';
import { AgendaModal } from './AgendaModal';

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
}: {
  agenda: any;
  isLoading: boolean;
  error: string | null;
  onUpdateAgenda: (content: string) => Promise<void>;
  onGenerateAgenda: (customPrompt?: string) => Promise<void>;
  isUpdating: boolean;
  isGenerating: boolean;
}) {
  const styles = useStyles();
  const t = useTranslations('MeetingDetail');
  const [showEditModal, setShowEditModal] = useState(false);
  const [agendaContent, setAgendaContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Use real agenda content or show empty state
  const displayContent = agenda?.content || '';
  const parsed = parseMarkdownNote(displayContent);

  // Handlers
  const handleEditAgenda = () => {
    setAgendaContent(displayContent);
    setShowEditModal(true);
  };

  const handleSaveAgenda = async () => {
    try {
      await onUpdateAgenda(agendaContent);
      setShowEditModal(false);
    } catch (error) {
      console.error('Failed to update agenda:', error);
    }
  };

  const handleGenerateAgenda = async (customPrompt?: string) => {
    try {
      await onGenerateAgenda(customPrompt);
    } catch (error) {
      console.error('Failed to generate agenda:', error);
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
            icon={<Edit20Regular />}
            onClick={handleEditAgenda}
            disabled={isUpdating}
          >
            {t('edit')}
          </Button>
          <Button
            appearance="primary"
            onClick={() => handleGenerateAgenda()}
            disabled={isUpdating || isGenerating}
          >
            Generate Agenda
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

      {/* Agenda Edit Modal */}
      <AgendaModal
        isOpen={showEditModal}
        agendaContent={agendaContent}
        isSaving={isUpdating}
        isLoading={isLoading}
        error={error || null}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) {
            setAgendaContent('');
          }
        }}
        onAgendaContentChange={setAgendaContent}
        onSaveAgenda={handleSaveAgenda}
      />
    </div>
  );
}
