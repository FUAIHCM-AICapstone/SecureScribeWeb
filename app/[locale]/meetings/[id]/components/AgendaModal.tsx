'use client';

import {
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  Field,
  makeStyles,
  shorthands,
  Spinner,
  Textarea,
  tokens,
} from '@/lib/components';
import MDEditor from '@uiw/react-md-editor';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

// Normalize escaped newlines (\\n -> \n) from API responses
const normalizeContent = (content: string): string => {
  if (!content) return '';
  return content.replace(/\\n/g, '\n');
};

// Preset configurations for meeting agenda generation
const PRESET_CONFIGS = {
  languages: [
    { key: 'vietnamese', label: 'Tiếng Việt', prompt: 'trên tiếng Việt' },
    { key: 'english', label: 'English', prompt: 'in English' },
    { key: 'japanese', label: '日本語', prompt: 'in Japanese' },
  ],
  styles: [
    {
      key: 'formal',
      label: 'Chính thức',
      prompt: 'với phong cách trang trọng, chuyên nghiệp',
    },
    {
      key: 'casual',
      label: 'Thân thiện',
      prompt: 'với phong cách thân thiện, dễ tiếp cận',
    },
    { key: 'concise', label: 'Ngắn gọn', prompt: 'tóm tắt ngắn gọn, súc tích' },
    { key: 'detailed', label: 'Chi tiết', prompt: 'chi tiết và toàn diện' },
  ],
  meetingTypes: [
    { key: 'business', label: 'Kinh doanh', prompt: 'cuộc họp kinh doanh' },
    { key: 'technical', label: 'Kỹ thuật', prompt: 'cuộc họp kỹ thuật' },
    {
      key: 'brainstorming',
      label: 'Brainstorming',
      prompt: 'phiên brainstorming',
    },
    { key: 'review', label: 'Đánh giá', prompt: 'cuộc họp đánh giá' },
    { key: 'planning', label: 'Lập kế hoạch', prompt: 'cuộc họp lập kế hoạch' },
    { key: 'training', label: 'Đào tạo', prompt: 'buổi đào tạo' },
  ],
};

const useStyles = makeStyles({
  dialog: {
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    minWidth: '80%',
    '@media (max-width: 768px)': {
      minWidth: '100%',
      height: '90vh',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'auto',
    ...shorthands.gap(tokens.spacingVerticalL),
    padding: tokens.spacingVerticalM,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ...shorthands.gap(tokens.spacingVerticalXS),
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: '400px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden',
  },
  presetsSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalM),
  },
  presetGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
  },
  presetBadges: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  presetBadge: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'scale(1.05)',
    },
    ':active': {
      transform: 'scale(0.95)',
    },
  },
  presetBadgeSelected: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});

interface AgendaModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  agendaContent: string;
  customAgendaPrompt: string;
  isSaving: boolean;
  isLoading?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onAgendaContentChange: (value: string) => void;
  onCustomPromptChange: (value: string) => void;
  onSaveAgenda: () => void;
}

export function AgendaModal({
  isOpen,
  mode,
  agendaContent,
  customAgendaPrompt,
  isSaving,
  isLoading = false,
  error = null,
  onOpenChange,
  onAgendaContentChange,
  onCustomPromptChange,
  onSaveAgenda,
}: AgendaModalProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingDetail');

  // Preset selection state
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState<string | null>(
    null,
  );

  // Handle preset selection
  const handlePresetSelect = (
    category: 'language' | 'style' | 'meetingType',
    key: string,
  ) => {
    const setters = {
      language: setSelectedLanguage,
      style: setSelectedStyle,
      meetingType: setSelectedMeetingType,
    };
    const currentValues = {
      language: selectedLanguage,
      style: selectedStyle,
      meetingType: selectedMeetingType,
    };

    // Toggle selection - if already selected, deselect it
    if (currentValues[category] === key) {
      setters[category](null);
    } else {
      setters[category](key);
    }
  };

  // Compose prompt from selected presets
  const composePresetPrompt = useCallback(() => {
    const parts: string[] = [];

    if (selectedMeetingType) {
      const meetingType = PRESET_CONFIGS.meetingTypes.find(
        (m) => m.key === selectedMeetingType,
      );
      if (meetingType) {
        parts.push(`Tạo chương trình họp cho ${meetingType.prompt}`);
      }
    }

    if (selectedStyle) {
      const style = PRESET_CONFIGS.styles.find((s) => s.key === selectedStyle);
      if (style) {
        parts.push(style.prompt);
      }
    }

    if (selectedLanguage) {
      const language = PRESET_CONFIGS.languages.find(
        (l) => l.key === selectedLanguage,
      );
      if (language) {
        parts.push(language.prompt);
      }
    }

    return parts.join(', ') + (parts.length > 0 ? '.' : '');
  }, [selectedLanguage, selectedStyle, selectedMeetingType]);

  // Update custom prompt when presets change
  useEffect(() => {
    if (mode === 'create') {
      const presetPrompt = composePresetPrompt();
      if (presetPrompt && !customAgendaPrompt) {
        onCustomPromptChange(presetPrompt);
      } else if (presetPrompt) {
        // If user has typed something, append preset to existing prompt
        const currentPrompt = customAgendaPrompt.trim();
        if (!currentPrompt.includes(presetPrompt.split('.')[0])) {
          onCustomPromptChange(presetPrompt);
        }
      }
    }
  }, [
    selectedLanguage,
    selectedStyle,
    selectedMeetingType,
    mode,
    customAgendaPrompt,
    onCustomPromptChange,
    composePresetPrompt,
  ]);

  // Reset preset selections when modal opens
  useEffect(() => {
    if (isOpen && mode === 'create') {
      setSelectedLanguage(null);
      setSelectedStyle(null);
      setSelectedMeetingType(null);
    }
  }, [isOpen, mode]);

  // Normalize escaped newlines in edit mode on mount
  useEffect(() => {
    if (mode === 'edit' && agendaContent && agendaContent.includes('\\n')) {
      const normalized = normalizeContent(agendaContent);
      if (normalized !== agendaContent) {
        onAgendaContentChange(normalized);
      }
    }
  }, [mode, isOpen, agendaContent, onAgendaContentChange]);

  // Auto switch to create mode if edit has error and no content
  const displayMode =
    mode === 'edit' && error && !agendaContent ? 'create' : mode;

  // Determine if save button should be disabled
  const isSaveDisabled =
    isSaving || (displayMode === 'edit' && agendaContent.trim() === '');

  // Determine modal title
  const modalTitle =
    displayMode === 'create'
      ? t('generateAgenda') || 'Generate Agenda'
      : t('edit') || 'Edit';

  const handleOpenChange = (event: any, data: { open: boolean }) => {
    onOpenChange(data.open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogBody className={styles.content}>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              <Spinner size="small" />
            </div>
          ) : displayMode === 'create' ? (
            <>
              <div className={styles.presetsSection}>
                <div className={styles.presetGroup}>
                  <h4
                    style={{
                      fontWeight: '600',
                      marginBottom: tokens.spacingVerticalXS,
                      marginTop: 0,
                    }}
                  >
                    Loại cuộc họp
                  </h4>
                  <div className={styles.presetBadges}>
                    {PRESET_CONFIGS.meetingTypes.map((meetingType) => (
                      <Badge
                        key={meetingType.key}
                        className={`${styles.presetBadge} ${selectedMeetingType === meetingType.key ? styles.presetBadgeSelected : ''}`}
                        onClick={() =>
                          handlePresetSelect('meetingType', meetingType.key)
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        {meetingType.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className={styles.presetGroup}>
                  <h4
                    style={{
                      fontWeight: '600',
                      marginBottom: tokens.spacingVerticalXS,
                      marginTop: 0,
                    }}
                  >
                    Phong cách
                  </h4>
                  <div className={styles.presetBadges}>
                    {PRESET_CONFIGS.styles.map((style) => (
                      <Badge
                        key={style.key}
                        className={`${styles.presetBadge} ${selectedStyle === style.key ? styles.presetBadgeSelected : ''}`}
                        onClick={() => handlePresetSelect('style', style.key)}
                        style={{ cursor: 'pointer' }}
                      >
                        {style.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className={styles.presetGroup}>
                  <h4
                    style={{
                      fontWeight: '600',
                      marginBottom: tokens.spacingVerticalXS,
                      marginTop: 0,
                    }}
                  >
                    Ngôn ngữ
                  </h4>
                  <div className={styles.presetBadges}>
                    {PRESET_CONFIGS.languages.map((language) => (
                      <Badge
                        key={language.key}
                        className={`${styles.presetBadge} ${selectedLanguage === language.key ? styles.presetBadgeSelected : ''}`}
                        onClick={() =>
                          handlePresetSelect('language', language.key)
                        }
                        style={{ cursor: 'pointer' }}
                      >
                        {language.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Field
                label={t('customPrompt') || 'Custom Prompt'}
                className={styles.field}
              >
                <Textarea
                  value={customAgendaPrompt}
                  onChange={(e, data) => onCustomPromptChange(data.value)}
                  placeholder={
                    t('enterCustomPrompt') || 'Enter your custom prompt...'
                  }
                  disabled={isSaving}
                />
              </Field>
            </>
          ) : (
            <Field
              label={t('agendaContent') || 'Agenda Content'}
              className={styles.field}
            >
              <div className={styles.editorContainer} data-color-mode="light">
                <MDEditor
                  value={agendaContent}
                  onChange={(val: string | undefined) =>
                    onAgendaContentChange(val || '')
                  }
                  preview="edit"
                  height={'100%'}
                  visibleDragbar={false}
                  style={{ height: '100%' }}
                  textareaProps={{
                    disabled: isSaving,
                    placeholder:
                      t('enterAgendaContent') || 'Enter agenda content...',
                    style: { height: '100%' },
                  }}
                />
              </div>
            </Field>
          )}
        </DialogBody>
        <DialogActions className={styles.actions}>
          <Button
            appearance="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            {t('cancel') || 'Cancel'}
          </Button>
          <Button
            appearance="primary"
            onClick={onSaveAgenda}
            disabled={isSaveDisabled}
          >
            {isSaving
              ? mode === 'create'
                ? t('generating') || 'Generating...'
                : t('saving') || 'Saving...'
              : t('save') || 'Save'}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
