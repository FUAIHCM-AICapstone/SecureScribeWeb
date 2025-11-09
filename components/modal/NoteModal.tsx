'use client';

import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogSurface,
    DialogTitle,
    Field,
    makeStyles,
    shorthands,
    Textarea,
    tokens,
} from '@fluentui/react-components';
import MDEditor from '@uiw/react-md-editor';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

// Normalize escaped newlines (\\n -> \n) from API responses
const normalizeContent = (content: string): string => {
    if (!content) return '';
    return content.replace(/\\n/g, '\n');
};

const useStyles = makeStyles({
    dialog: {
        // Use flex column so body can grow and actions stay pinned to bottom
        display: 'flex',
        flexDirection: 'column',
        // Prefer a viewport-height based size for consistent layout
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
        // allow the dialog body to grow and scroll if content is large
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
        // ensure editor fills available space in the dialog body
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: '400px',
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusMedium,
        overflow: 'hidden',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        ...shorthands.gap(tokens.spacingHorizontalS),
        padding: tokens.spacingVerticalM,
        borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    },
});

interface NoteModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    customNotePrompt: string;
    noteContent: string;
    isCreatingNote: boolean;
    isUpdatingNote: boolean;
    onOpenChange: (open: boolean) => void;
    onCustomPromptChange: (value: string) => void;
    onNoteContentChange: (value: string) => void;
    onSaveNote: () => void;
}

export function NoteModal({
    isOpen,
    mode,
    customNotePrompt,
    noteContent,
    isCreatingNote,
    isUpdatingNote,
    onOpenChange,
    onCustomPromptChange,
    onNoteContentChange,
    onSaveNote,
}: NoteModalProps) {
    const styles = useStyles();
    const t = useTranslations('MeetingDetail');

    // Determine loading state
    const isLoading = isCreatingNote || isUpdatingNote;

    // Normalize escaped newlines in edit mode on mount
    useEffect(() => {
        if (mode === 'edit' && noteContent && noteContent.includes('\\n')) {
            const normalized = normalizeContent(noteContent);
            if (normalized !== noteContent) {
                console.log('[NoteModal] Normalized escaped newlines in note content');
                onNoteContentChange(normalized);
            }
        }
    }, [mode, isOpen, noteContent, onNoteContentChange]); // Run when modal opens or content changes

    // Determine if save button should be disabled
    const isSaveDisabled =
        isLoading || (mode === 'edit' && noteContent.trim() === '');

    // Determine modal title
    const modalTitle =
        mode === 'create' ? t('createNote') : t('edit');

    const handleOpenChange = (event: any, data: { open: boolean }) => {
        onOpenChange(data.open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogSurface className={styles.dialog}>
                <DialogTitle>{modalTitle}</DialogTitle>
                <DialogBody className={styles.content}>
                    {mode === 'create' ? (
                        <Field
                            label={t('customPrompt') || 'Custom Prompt'}
                            className={styles.field}
                        >
                            <Textarea
                                value={customNotePrompt}
                                onChange={(e, data) => onCustomPromptChange(data.value)}
                                placeholder={
                                    t('enterCustomPrompt') || 'Enter your custom prompt...'
                                }
                                disabled={isCreatingNote}
                            />
                        </Field>
                    ) : (
                        <Field
                            label={t('noteContent') || 'Note Content'}
                            className={styles.field}
                        >
                            <div className={styles.editorContainer} data-color-mode="light">
                                <MDEditor
                                    value={noteContent}
                                    onChange={(val: string | undefined) => onNoteContentChange(val || '')}
                                    preview="edit"
                                    height={'100%'}
                                    visibleDragbar={false}
                                    style={{ height: '100%' }}
                                    textareaProps={{
                                        disabled: isUpdatingNote,
                                        placeholder: t('enterNoteContent') || 'Enter note content...',
                                        style: { height: '100%'},
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
                        disabled={isLoading}
                    >
                        {t('cancel') || 'Cancel'}
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={onSaveNote}
                        disabled={isSaveDisabled}
                    >
                        {isLoading
                            ? mode === 'create'
                                ? t('creating') || 'Creating...'
                                : t('saving') || 'Saving...'
                            : t('save') || 'Save'}
                    </Button>
                </DialogActions>
            </DialogSurface>
        </Dialog>
    );
}
