'use client';

import React from 'react';
import { Dialog, DialogSurface, DialogTitle, DialogBody, DialogActions, Button, Textarea, makeStyles, shorthands, tokens, Spinner, Body1 } from '@fluentui/react-components';
import { useTranslations } from 'next-intl';

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
  agendaContent: string;
  isSaving: boolean;
  isLoading?: boolean;
  error?: string | null;
  onOpenChange: (open: boolean) => void;
  onAgendaContentChange: (value: string) => void;
  onSaveAgenda: () => void;
}

export function AgendaModal({
  isOpen,
  agendaContent,
  isSaving,
  isLoading = false,
  error = null,
  onOpenChange,
  onAgendaContentChange,
  onSaveAgenda,
}: AgendaModalProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingDetail');

  const handleOpenChange = (event: any, data: { open: boolean }) => {
    onOpenChange(data.open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogSurface className={styles.dialog}>
        <DialogTitle>Edit Agenda</DialogTitle>
        <DialogBody className={styles.content}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
              <Spinner size="small" />
            </div>
          ) : error ? (
            <div style={{ color: tokens.colorPaletteRedForeground1, padding: '16px', textAlign: 'center' }}>
              <Body1>{error}</Body1>
            </div>
          ) : (
            <div className={styles.field}>
              <label style={{ fontWeight: 600, marginBottom: '8px', color: tokens.colorNeutralForeground1 }}>
                {t('agendaContent') || 'Agenda Content'}
              </label>
              <div className={styles.editorContainer} data-color-mode="light">
                <Textarea
                  value={agendaContent}
                  onChange={(e, data) => onAgendaContentChange(data.value)}
                  placeholder="Enter agenda in markdown format..."
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    fontFamily: 'monospace',
                    fontSize: tokens.fontSizeBase300,
                    border: 'none',
                    outline: 'none',
                    padding: tokens.spacingVerticalM,
                  }}
                />
              </div>
            </div>
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
            disabled={isSaving || !agendaContent.trim()}
          >
            {isSaving ? (t('saving') || 'Saving...') : (t('save') || 'Save')}
          </Button>
        </DialogActions>
      </DialogSurface>
    </Dialog>
  );
}
