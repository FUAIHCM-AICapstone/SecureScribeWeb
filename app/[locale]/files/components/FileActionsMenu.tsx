'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Menu,
  MenuTrigger,
  MenuButton,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Input,
  Field,
  makeStyles,
} from '@fluentui/react-components';
import {
  MoreHorizontal20Regular,
  Eye20Regular,
  ArrowDownload20Regular,
  Rename20Regular,
  Delete20Regular,
  ArrowMove20Regular,
} from '@fluentui/react-icons';
import type { FileResponse } from 'types/file.type';
import { deleteFile, updateFile } from '@/services/api/file';
import { queryKeys } from '@/lib/queryClient';
import { showToast } from '@/hooks/useShowToast';
import { FileMoveModal } from '@/components/modal/FileMoveModal';

const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

interface FileActionsMenuProps {
  file: FileResponse;
}

export function FileActionsMenu({ file }: FileActionsMenuProps) {
  const styles = useStyles();
  const t = useTranslations('Files');
  const queryClient = useQueryClient();
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [newFileName, setNewFileName] = useState(file.filename || '');

  // Rename mutation
  const renameMutation = useMutation({
    mutationFn: (newName: string) => updateFile(file.id, { filename: newName }),
    onSuccess: () => {
      showToast('success', t('rename.renameSuccess'));
      queryClient.invalidateQueries({ queryKey: queryKeys.files });
      if (file.project_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projectFiles(file.project_id),
        });
      }
      if (file.meeting_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.meetingFiles(file.meeting_id),
        });
      }
      setRenameOpen(false);
    },
    onError: () => {
      showToast('error', t('rename.renameError'));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteFile(file.id),
    onSuccess: () => {
      showToast('success', t('delete.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: queryKeys.files });
      if (file.project_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.projectFiles(file.project_id),
        });
      }
      if (file.meeting_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.meetingFiles(file.meeting_id),
        });
      }
      setDeleteOpen(false);
    },
    onError: () => {
      showToast('error', t('delete.deleteError'));
    },
  });

  const handleDownload = () => {
    if (file.storage_url) {
      window.open(file.storage_url, '_blank');
    }
  };

  const handleRename = () => {
    if (newFileName && newFileName !== file.filename) {
      renameMutation.mutate(newFileName);
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          <MenuButton
            appearance="subtle"
            icon={<MoreHorizontal20Regular />}
            size="small"
            aria-label={t('actions.label')}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<Eye20Regular />}
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement view details
                console.log('View details:', file.id);
              }}
            >
              {t('actions.view')}
            </MenuItem>
            <MenuItem
              icon={<ArrowDownload20Regular />}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
            >
              {t('actions.download')}
            </MenuItem>
            <MenuItem
              icon={<Rename20Regular />}
              onClick={(e) => {
                e.stopPropagation();
                setRenameOpen(true);
              }}
            >
              {t('actions.rename')}
            </MenuItem>
            <MenuItem
              icon={<ArrowMove20Regular />}
              onClick={(e) => {
                e.stopPropagation();
                setMoveOpen(true);
              }}
            >
              {t('actions.move')}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              icon={<Delete20Regular />}
              onClick={(e) => {
                e.stopPropagation();
                setDeleteOpen(true);
              }}
              style={{ color: 'var(--colorPaletteRedForeground1)' }}
            >
              {t('actions.delete')}
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* Rename Dialog */}
      <Dialog
        open={renameOpen}
        onOpenChange={(_, data) => setRenameOpen(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('rename.title')}</DialogTitle>
            <DialogContent className={styles.dialogContent}>
              <Field label={t('rename.newName')}>
                <Input
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder={t('rename.namePlaceholder')}
                />
              </Field>
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => setRenameOpen(false)}
                disabled={renameMutation.isPending}
              >
                {t('rename.cancel')}
              </Button>
              <Button
                appearance="primary"
                onClick={handleRename}
                disabled={!newFileName || renameMutation.isPending}
              >
                {renameMutation.isPending
                  ? t('rename.renaming')
                  : t('rename.save')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onOpenChange={(_, data) => setDeleteOpen(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('delete.confirmTitle')}</DialogTitle>
            <DialogContent className={styles.dialogContent}>
              {t('delete.confirmMessage')}
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => setDeleteOpen(false)}
                disabled={deleteMutation.isPending}
              >
                {t('delete.cancel')}
              </Button>
              <Button
                appearance="primary"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending
                  ? t('delete.deleting')
                  : t('delete.confirm')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Move Modal */}
      <FileMoveModal
        open={moveOpen}
        onClose={() => setMoveOpen(false)}
        file={file}
        onMoveSuccess={() => {
          setMoveOpen(false);
        }}
      />
    </>
  );
}
