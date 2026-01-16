'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
  MenuDivider,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  MoreHorizontal20Regular,
  Delete20Regular,
  PersonCircle20Regular,
} from '@/lib/icons';
import { removeUserFromProject, updateUserRole } from 'services/api/project';
import { showToast } from 'hooks/useShowToast';
import { useMutation } from '@tanstack/react-query';
import type { UserProjectResponse } from 'types/project.type';

const useStyles = makeStyles({
  deleteMenuItem: {
    color: tokens.colorPaletteRedForeground1,
  },
  deleteMenuItemHover: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
  },
});

interface MemberActionsMenuProps {
  member: UserProjectResponse;
  projectId: string;
  currentUserRole?: string | null;
  onMemberRemoved?: () => void;
  onMemberRoleChanged?: () => void;
}

export function MemberActionsMenu({
  member,
  projectId,
  currentUserRole,
  onMemberRemoved,
  onMemberRoleChanged,
}: MemberActionsMenuProps) {
  const t = useTranslations('ProjectDetail.members.actions');
  const tProjects = useTranslations('Projects');
  const styles = useStyles();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState<'admin' | 'member'>(
    member.role === 'admin' ? 'member' : 'admin',
  );
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  // Helper function to get translated role label
  const getRoleLabel = (role: string): string => {
    switch (role.toLowerCase()) {
      case 'owner':
        return tProjects('roleOwner');
      case 'admin':
        return tProjects('roleAdmin');
      case 'member':
        return tProjects('roleMember');
      default:
        return role;
    }
  };

  // Check if current user can manage this member
  // Owner can manage all, admin can only manage members (not other admins or owner)
  const canManageMember = (): boolean => {
    if (currentUserRole === 'owner') return true;
    if (
      currentUserRole === 'admin' &&
      member.role !== 'owner' &&
      member.role !== 'admin'
    ) {
      return true;
    }
    return false;
  };

  // Remove member mutation
  const removeMutation = useMutation({
    mutationFn: () => removeUserFromProject(projectId, member.user_id),
    onSuccess: () => {
      showToast(
        'success',
        t('removeSuccess', {
          name: member.user?.name || member.user?.email || 'Member',
        }),
      );
      if (onMemberRemoved) {
        onMemberRemoved();
      }
      setShowRemoveDialog(false);
      setIsDeleting(false);
    },
    onError: () => {
      showToast('error', t('removeError'));
      setIsDeleting(false);
    },
  });

  // Update role mutation
  const roleUpdateMutation = useMutation({
    mutationFn: () =>
      updateUserRole(projectId, member.user_id, { role: newRole }),
    onSuccess: () => {
      showToast(
        'success',
        t('changeRoleSuccess', {
          name: member.user?.name || member.user?.email || 'Member',
          role: getRoleLabel(newRole),
        }),
      );
      if (onMemberRoleChanged) {
        onMemberRoleChanged();
      }
      setShowRoleDialog(false);
    },
    onError: () => {
      showToast('error', t('changeRoleError'));
    },
  });

  const handleRemove = () => {
    setIsDeleting(true);
    removeMutation.mutate();
  };

  const handleRoleChange = () => {
    roleUpdateMutation.mutate();
  };

  if (!canManageMember()) {
    return null;
  }

  return (
    <>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          <MenuButton
            appearance="subtle"
            icon={<MoreHorizontal20Regular />}
            size="small"
            aria-label={t('label')}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem
              icon={<PersonCircle20Regular />}
              onClick={(e) => {
                e.stopPropagation();
                setNewRole(member.role === 'admin' ? 'member' : 'admin');
                setShowRoleDialog(true);
              }}
              disabled={member.role === 'owner' || roleUpdateMutation.isPending}
            >
              {member.role === 'admin' ? t('makeMember') : t('makeAdmin')}
            </MenuItem>

            <MenuDivider />

            <MenuItem
              icon={<Delete20Regular />}
              onClick={(e) => {
                e.stopPropagation();
                setShowRemoveDialog(true);
              }}
              disabled={member.role === 'owner' || isDeleting}
              className={
                isDeleteHovered
                  ? styles.deleteMenuItemHover
                  : styles.deleteMenuItem
              }
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
            >
              {t('remove')}
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* Remove Confirmation Dialog */}
      <Dialog
        open={showRemoveDialog}
        onOpenChange={(_, data) => setShowRemoveDialog(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('removeConfirmTitle')}</DialogTitle>
            <DialogContent>
              {t('removeConfirmMessage', {
                name: member.user?.name || member.user?.email || 'Member',
              })}
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => setShowRemoveDialog(false)}
                disabled={isDeleting}
              >
                {t('cancel')}
              </Button>
              <Button
                appearance="primary"
                onClick={handleRemove}
                disabled={isDeleting}
              >
                {isDeleting ? t('removing') : t('confirmRemove')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={showRoleDialog}
        onOpenChange={(_, data) => setShowRoleDialog(data.open)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('changeRoleTitle')}</DialogTitle>
            <DialogContent>
              {t('changeRoleMessage', {
                name: member.user?.name || member.user?.email || 'Member',
                role: getRoleLabel(newRole),
              })}
            </DialogContent>
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => setShowRoleDialog(false)}
                disabled={roleUpdateMutation.isPending}
              >
                {t('cancel')}
              </Button>
              <Button
                appearance="primary"
                onClick={handleRoleChange}
                disabled={roleUpdateMutation.isPending}
              >
                {roleUpdateMutation.isPending ? t('changing') : t('changeRole')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
