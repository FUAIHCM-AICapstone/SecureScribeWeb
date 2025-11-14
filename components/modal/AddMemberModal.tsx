'use client';

import { useDebounce } from '@/hooks/useDebounce';
import { showToast } from '@/hooks/useShowToast';
import { queryKeys } from '@/lib/queryClient';
import { addUserToProject } from '@/services/api/project';
import { getUsers } from '@/services/api/user';
import {
  Button,
  Caption1,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Option,
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Dismiss24Regular, PersonAdd24Regular } from '@fluentui/react-icons';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import type { UserProjectResponse } from 'types/project.type';
import type { User } from 'types/user.type';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
    minWidth: '500px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
    },
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  comboboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  roleContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  userOption: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  userEmail: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  selectedUserInfo: {
    ...shorthands.padding('12px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  selectedUserName: {
    fontSize: '14px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  loadingSpinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.gap('8px'),
    ...shorthands.padding('12px'),
  },
  noResults: {
    ...shorthands.padding('12px'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.gap(tokens.spacingHorizontalS),
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  existingMembers: UserProjectResponse[];
}

export function AddMemberModal({
  open,
  onOpenChange,
  projectId,
  existingMembers,
}: AddMemberModalProps) {
  const styles = useStyles();
  const t = useTranslations('Projects');
  const queryClient = useQueryClient();

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('member');

  // Debounce user search query
  const debouncedUserQuery = useDebounce(userSearchQuery, 500);

  // Get existing member IDs to filter them out
  const existingMemberIds = existingMembers.map((m) => m.user_id);

  // Fetch users with search and pagination
  const {
    data: usersData,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
    isFetchingNextPage: isFetchingNextUsersPage,
    isLoading: isLoadingUsers,
  } = useInfiniteQuery({
    queryKey: ['users', debouncedUserQuery],
    queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
      getUsers({
        ...(debouncedUserQuery ? { name: debouncedUserQuery } : {}),
        limit: 50,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages) => {
      if (lastPage.data && lastPage.data.length === 50) {
        return pages.length + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  // Flatten paginated users and filter out existing members
  const allUsers = usersData?.pages.flatMap((page: any) => page.data) || [];
  const filteredUsers = allUsers.filter(
    (user: User) => !existingMemberIds.includes(user.id),
  );

  // Handle scroll pagination
  const handleUsersListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      hasNextUsersPage &&
      !isFetchingNextUsersPage &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    ) {
      fetchNextUsersPage();
    }
  };

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUser) {
        throw new Error('No user selected');
      }
      return addUserToProject(projectId, {
        user_id: selectedUser.id,
        role: selectedRole,
      });
    },
    onSuccess: () => {
      // Invalidate project query to refresh members list
      queryClient.invalidateQueries({
        queryKey: queryKeys.project(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects,
      });

      showToast('success', t('memberAdded'));

      // Reset form and close modal
      setUserSearchQuery('');
      setSelectedUser(null);
      setSelectedRole('member');
      onOpenChange(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.detail || error?.message || t('memberAddError');
      showToast('error', errorMessage);
    },
  });

  const handleAddMember = () => {
    addMemberMutation.mutate();
  };

  const handleClose = () => {
    setUserSearchQuery('');
    setSelectedUser(null);
    setSelectedRole('member');
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        if (!data.open && !addMemberMutation.isPending) {
          handleClose();
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle
            action={
              <Button
                appearance="subtle"
                icon={<Dismiss24Regular />}
                onClick={handleClose}
                disabled={addMemberMutation.isPending}
              />
            }
          >
            {t('addMember')}
          </DialogTitle>

          <DialogContent className={styles.content}>
            {/* User Search Section */}
            <div className={styles.section}>
              <label className={styles.label}>{t('selectUser')}</label>
              <Combobox
                placeholder={
                  isLoadingUsers ? t('loading') : t('searchUserPlaceholder')
                }
                value={
                  selectedUser
                    ? `${selectedUser.name || selectedUser.email}`
                    : userSearchQuery
                }
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setUserSearchQuery(e.target.value);
                  setSelectedUser(null);
                }}
                onOptionSelect={(_: any, data: any) => {
                  const userId = data.optionValue as string;
                  const user = allUsers.find((u: User) => u.id === userId);
                  if (user) {
                    setSelectedUser(user);
                  }
                  setUserSearchQuery('');
                }}
                disabled={addMemberMutation.isPending}
                listbox={{
                  onScroll: handleUsersListScroll,
                }}
              >
                {filteredUsers.map((user: User) => (
                  <Option
                    key={user.id}
                    value={user.id}
                    text={user.name || user.email}
                  >
                    <div className={styles.userOption}>
                      <Text>{user.name || user.email}</Text>
                      <span className={styles.userEmail}>{user.email}</span>
                    </div>
                  </Option>
                ))}
                {isFetchingNextUsersPage && (
                  <div className={styles.loadingSpinner}>
                    <Spinner size="small" />
                    <Caption1>{t('loading')}</Caption1>
                  </div>
                )}
                {!isLoadingUsers &&
                  filteredUsers.length === 0 &&
                  debouncedUserQuery && (
                    <div className={styles.noResults}>
                      <Caption1>{t('noResults')}</Caption1>
                    </div>
                  )}
              </Combobox>
            </div>

            {/* Selected User Info */}
            {selectedUser && (
              <div className={styles.selectedUserInfo}>
                <Text className={styles.selectedUserName}>
                  {selectedUser.name || selectedUser.email}
                </Text>
                <Caption1>{selectedUser.email}</Caption1>
                {selectedUser.position && (
                  <Caption1>{selectedUser.position}</Caption1>
                )}
              </div>
            )}

            {/* Role Selection */}
            <div className={styles.section}>
              <label className={styles.label}>{t('selectRole')}</label>
              <Dropdown
                value={
                  selectedRole === 'admin' ? t('roleAdmin') : t('roleMember')
                }
                selectedOptions={[selectedRole]}
                onOptionSelect={(_, data) => {
                  setSelectedRole(data.optionValue as string);
                }}
                disabled={addMemberMutation.isPending || !selectedUser}
              >
                <Option value="member">{t('roleMember')}</Option>
                <Option value="admin">{t('roleAdmin')}</Option>
              </Dropdown>
            </div>
          </DialogContent>

          <DialogActions className={styles.actions}>
            <Button
              appearance="secondary"
              onClick={handleClose}
              disabled={addMemberMutation.isPending}
            >
              {t('cancel')}
            </Button>
            <Button
              appearance="primary"
              onClick={handleAddMember}
              disabled={!selectedUser || addMemberMutation.isPending}
              icon={
                addMemberMutation.isPending ? undefined : <PersonAdd24Regular />
              }
            >
              {addMemberMutation.isPending ? t('adding') : t('addMember')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
