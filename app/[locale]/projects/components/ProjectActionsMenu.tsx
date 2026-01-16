'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
} from '@/lib/components';
import {
  MoreVertical20Regular,
  Eye20Regular,
  Edit20Regular,
  Archive20Regular,
  ArchiveArrowBack20Regular,
  Delete20Regular,
} from '@/lib/icons';
import type { ProjectResponse } from 'types/project.type';
import {
  archiveProject,
  unarchiveProject,
  deleteProject,
} from '@/services/api/project';
import { queryKeys } from '@/lib/queryClient';
import { showToast } from '@/hooks/useShowToast';
import ProjectEditModal from '@/components/modal/ProjectEditModal';
import { DeleteConfirmationModal } from '@/components/modal/DeleteConfirmationModal';

const useStyles = makeStyles({
  menuButton: {
    minWidth: 'auto',
  },
});

interface ProjectActionsMenuProps {
  project: ProjectResponse;
  onEditSuccess?: () => void;
  onArchiveSuccess?: () => void;
  onUnarchiveSuccess?: () => void;
  onDeleteSuccess?: () => void;
}

export function ProjectActionsMenu({
  project,
  onEditSuccess,
  onArchiveSuccess,
  onUnarchiveSuccess,
  onDeleteSuccess,
}: ProjectActionsMenuProps) {
  const styles = useStyles();
  const router = useRouter();
  const t = useTranslations('Projects');
  const tEdit = useTranslations('ProjectEdit');
  const queryClient = useQueryClient();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleViewDetails = () => {
    router.push(`/projects/${project.id}`);
  };

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: () => archiveProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({
        queryKey: queryKeys.project(project.id),
      });
      showToast('success', tEdit('archiveSuccess'), { duration: 3000 });

      // Call the callback to notify parent of successful archive
      if (onArchiveSuccess) {
        onArchiveSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Error archiving project:', error);
      showToast('error', error?.message || tEdit('archiveError'), {
        duration: 5000,
      });
    },
  });

  // Unarchive mutation
  const unarchiveMutation = useMutation({
    mutationFn: () => unarchiveProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({
        queryKey: queryKeys.project(project.id),
      });
      showToast('success', tEdit('unarchiveSuccess'), { duration: 3000 });

      // Call the callback to notify parent of successful unarchive
      if (onUnarchiveSuccess) {
        onUnarchiveSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Error unarchiving project:', error);
      showToast('error', error?.message || tEdit('unarchiveError'), {
        duration: 5000,
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(project.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      showToast('success', tEdit('deleteSuccess'), { duration: 3000 });
      setDeleteModalOpen(false);

      // Call the callback to notify parent of successful deletion
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Error deleting project:', error);
      showToast('error', error?.message || tEdit('deleteError'), {
        duration: 5000,
      });
    },
  });

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditModalOpen(true);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    archiveMutation.mutate();
  };

  const handleUnarchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    unarchiveMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            icon={<MoreVertical20Regular />}
            aria-label={t('actions.label')}
            className={styles.menuButton}
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
            {project.is_archived ? (
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
            <MenuItem icon={<Delete20Regular />} onClick={handleDelete}>
              {t('actions.delete')}
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* Edit Modal */}
      <ProjectEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        project={project}
        onEditSuccess={onEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
        title={tEdit('deleteConfirmTitle')}
        itemName={project.name}
      />
    </>
  );
}
