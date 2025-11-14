'use client';

import { FileMoveModal } from '@/components/modal/FileMoveModal';
import { showToast } from '@/hooks/useShowToast';
import { deleteFile, updateFile } from '@/services/api/file';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  makeStyles,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components';
import {
  ArrowDownload20Regular,
  ArrowMove20Regular,
  Delete20Regular,
  Eye20Regular,
  MoreHorizontal20Regular,
  Rename20Regular,
} from '@fluentui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { FileResponse } from 'types/file.type';

const useStyles = makeStyles({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

interface FileActionsMenuProps {
  file: FileResponse;
  onRenameSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onMoveSuccess?: () => void;
}

export function FileActionsMenu({ file, onRenameSuccess, onDeleteSuccess, onMoveSuccess }: FileActionsMenuProps) {
  const styles = useStyles();
  const t = useTranslations('Files');
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [newFileName, setNewFileName] = useState(file.filename || '');

  // Rename mutation
  const renameMutation = useMutation({
    mutationFn: (newName: string) => updateFile(file.id, { filename: newName }),
    onSuccess: () => {
      showToast('success', t('rename.renameSuccess'));
      // Call the callback to notify parent of successful rename
      if (onRenameSuccess) {
        onRenameSuccess();
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
      // Call the callback to notify parent of successful deletion
      if (onDeleteSuccess) {
        onDeleteSuccess();
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
          // Call the callback to notify parent of successful move
          if (onMoveSuccess) {
            onMoveSuccess();
          }
          setMoveOpen(false);
        }}
      />
    </>
  );
}
