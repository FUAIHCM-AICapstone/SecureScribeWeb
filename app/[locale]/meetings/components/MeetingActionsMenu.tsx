
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
  ArchiveArrowBack20Regular,
  Record20Regular,
} from '@/lib/icons';
import {
  deleteMeeting,
  archiveMeeting,
  unarchiveMeeting,
} from 'services/api/meeting';
import { meetingBotApi } from '@/services/api/meetingBot';
import { showToast } from 'hooks/useShowToast';
import { DeleteConfirmationModal } from 'components/modal/DeleteConfirmationModal';
import MeetingEditModal from 'components/modal/MeetingEditModal';
import MeetingShareModal from 'components/modal/MeetingShareModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
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
  onEditSuccess?: () => void;
  onArchiveSuccess?: () => void;
  onUnarchiveSuccess?: () => void;
  onShareSuccess?: () => void;
  onDeleteSuccess?: () => void;
  onBotJoinSuccess?: () => void;
}

export function MeetingActionsMenu({
  meeting,
  onEditSuccess,
  onArchiveSuccess,
  onUnarchiveSuccess,
  onShareSuccess,
  onDeleteSuccess,
  onBotJoinSuccess,
}: MeetingActionsMenuProps) {
  const t = useTranslations('Meetings');
  const router = useRouter();
  const styles = useStyles();
  const queryClient = useQueryClient();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: () => archiveMeeting(meeting.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({
        queryKey: queryKeys.meeting(meeting.id),
      });
      showToast('success', t('actions.archiveSuccess'), { duration: 3000 });

      if (onArchiveSuccess) {
        onArchiveSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Error archiving meeting:', error);
      showToast('error', error?.message || t('actions.archiveError'), {
        duration: 5000,
      });
    },
  });

  // Unarchive mutation
  const unarchiveMutation = useMutation({
    mutationFn: () => unarchiveMeeting(meeting.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({
        queryKey: queryKeys.meeting(meeting.id),
      });
      showToast('success', t('actions.unarchiveSuccess'), { duration: 3000 });

      if (onUnarchiveSuccess) {
        onUnarchiveSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Error unarchiving meeting:', error);
      showToast('error', error?.message || t('actions.unarchiveError'), {
        duration: 5000,
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteMeeting(meeting.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      showToast(
        'success',
        t('actions.deleteSuccess', { title: meeting.title || 'Meeting' }),
        { duration: 3000 },
      );
      setShowDeleteDialog(false);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Error deleting meeting:', error);
      showToast(
        'error',
        error?.message ||
          t('actions.deleteError', { title: meeting.title || 'Meeting' }),
        {
          duration: 5000,
        },
      );
    },
  });

  // Trigger bot join mutation
  const triggerBotJoinMutation = useMutation({
    mutationFn: () => meetingBotApi.triggerBotJoin(meeting.id),
    onSuccess: () => {
      showToast('success', t('actions.botJoinTriggered'), { duration: 3000 });
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });

      if (onBotJoinSuccess) {
        onBotJoinSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Error triggering bot join:', error);
      showToast(
        'error',
        error?.message || t('actions.botJoinError'),
        {
          duration: 5000,
        },
      );
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleViewDetails = () => {
    router.push(`/meetings/${meeting.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditModalOpen(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareModalOpen(true);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    archiveMutation.mutate();
  };

  const handleUnarchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    unarchiveMutation.mutate();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleTriggerBotJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerBotJoinMutation.mutate();
  };

  // Check if meeting is archived (based on status)
  const isArchived = meeting.status === 'archived';

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
            <MenuItem icon={<Eye20Regular />} onClick={handleViewDetails}>
              {t('actions.view')}
            </MenuItem>
            <MenuItem icon={<Edit20Regular />} onClick={handleEdit}>
              {t('actions.edit')}
            </MenuItem>
            <MenuItem icon={<Share20Regular />} onClick={handleShare}>
              {t('actions.share')}
            </MenuItem>
            <MenuItem
              icon={<Record20Regular />}
              onClick={handleTriggerBotJoin}
              disabled={triggerBotJoinMutation.isPending}
            >
              {t('actions.recordBot')}
            </MenuItem>
            {isArchived ? (
              <MenuItem
                icon={<ArchiveArrowBack20Regular />}
                onClick={handleUnarchive}
                disabled={unarchiveMutation.isPending}
              >
                {t('actions.unarchive')}
              </MenuItem>
            ) : (
              <MenuItem
                icon={<Archive20Regular />}
                onClick={handleArchive}
                disabled={archiveMutation.isPending}
              >
                {t('actions.archive')}
              </MenuItem>
            )}
            <MenuDivider />
            <MenuItem
              icon={<Delete20Regular />}
              onClick={handleDeleteClick}
              disabled={deleteMutation.isPending}
              className={
                isDeleteHovered
                  ? styles.deleteMenuItemHover
                  : styles.deleteMenuItem
              }
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
            >
              {t('actions.delete')}
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* Edit Modal */}
      <MeetingEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        meeting={meeting}
        onEditSuccess={onEditSuccess}
      />

      {/* Share Modal */}
      <MeetingShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        meeting={meeting}
        onShareSuccess={onShareSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
        title={t('actions.deleteConfirmTitle')}
        itemName={meeting.title || 'Meeting'}
      />
    </>
  );
}
