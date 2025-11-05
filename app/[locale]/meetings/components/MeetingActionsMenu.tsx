'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
  MenuDivider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  MoreHorizontal20Regular,
  Eye20Regular,
  Edit20Regular,
  Delete20Regular,
  Share20Regular,
  Archive20Regular,
} from '@fluentui/react-icons';
import { deleteMeeting } from 'services/api/meeting';
import { showToast } from 'hooks/useShowToast';
import { DeleteConfirmationModal } from 'components/modal/DeleteConfirmationModal';
import type { MeetingResponse } from 'types/meeting.type';

const useStyles = makeStyles({
  deleteMenuItem: {
    color: tokens.colorPaletteRedForeground1,
  },
  deleteMenuItemHover: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
});

interface MeetingActionsMenuProps {
  meeting: MeetingResponse;
  onDeleteSuccess?: () => void;
}

export function MeetingActionsMenu({ meeting, onDeleteSuccess }: MeetingActionsMenuProps) {
  const t = useTranslations('Meetings');
  const router = useRouter();
  const styles = useStyles();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMeeting(meeting.id);

      // Show success toast
      showToast('success', t('actions.deleteSuccess', { title: meeting.title || 'Meeting' }));

      // Call the callback to notify parent of successful deletion
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      // Close dialog
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete meeting:', error);
      showToast('error', t('actions.deleteError', { title: meeting.title || 'Meeting' }));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'view':
        router.push(`/meetings/${meeting.id}`);
        break;
      case 'edit':
        console.log('Edit meeting:', meeting.title);
        // TODO: Implement edit functionality
        break;
      case 'share':
        console.log('Share meeting:', meeting.title);
        // TODO: Implement share functionality
        break;
      case 'archive':
        console.log('Archive meeting:', meeting.title);
        // TODO: Implement archive functionality
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
      default:
        break;
    }
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
          />
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<Eye20Regular />}
              onClick={() => handleAction('view')}
            >
              {t('actions.view')}
            </MenuItem>
            <MenuItem
              icon={<Edit20Regular />}
              onClick={() => handleAction('edit')}
            >
              {t('actions.edit')}
            </MenuItem>
            <MenuItem
              icon={<Share20Regular />}
              onClick={() => handleAction('share')}
            >
              {t('actions.share')}
            </MenuItem>
            <MenuItem
              icon={<Archive20Regular />}
              onClick={() => handleAction('archive')}
            >
              {t('actions.archive')}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              icon={<Delete20Regular />}
              onClick={() => handleAction('delete')}
              disabled={isDeleting}
              className={isDeleteHovered ? styles.deleteMenuItemHover : styles.deleteMenuItem}
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
            >
              {t('actions.delete')}
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      <DeleteConfirmationModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title={t('actions.deleteConfirmTitle')}
        itemName={meeting.title || 'Meeting'}
      />
    </>
  );
}