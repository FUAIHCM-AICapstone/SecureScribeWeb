'use client';

import MeetingSchedulerModal from '@/components/modal/MeetingSchedulerModal';
import { FileUploadModal } from '@/components/modal/FileUploadModal';
import SearchBoxWithResults from '@/components/search/SearchBoxWithResults';
import { showToast } from '@/hooks/useShowToast';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  Avatar,
  Badge,
  Button,
  CounterBadge,
  Divider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tooltip,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import {
  AlertUrgent24Regular,
  ArrowUpload24Regular,
  CalendarAdd24Regular,
  Navigation24Regular,
  SignOut24Regular,
} from '@fluentui/react-icons';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { TestNotificationButton } from './TestNotificationButton';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
  markNotificationAsUnread,
} from '@/services/api/notification';
import type { NotificationResponse } from 'types/notification.type';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { dynamicSearch } from '@/services/api/search';
import { getProjects } from '@/services/api/project';
import { getMeetings } from '@/services/api/meeting';
import { getFiles } from '@/services/api/file';
import { getUsers } from '@/services/api/user';
import { getBrandConfig } from '@/lib/utils/runtimeConfig';

const useStyles = makeStyles({
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--colorNeutralBackground1)',
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    minWidth: 'fit-content',
    flexShrink: 0,
  },
  brandText: {
    '@media (max-width: 640px)': {
      display: 'none',
    },
  },
  breadcrumbs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--colorNeutralForeground2)',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    '@media (max-width: 1280px)': {
      display: 'none',
    },
  },
  grow: { flex: 1, minWidth: 0 },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: '400px',
    maxWidth: '800px',
    width: '60%',
    '@media (max-width: 1280px)': {
      minWidth: '300px',
      maxWidth: '500px',
      width: '50%',
    },
    '@media (max-width: 768px)': {
      minWidth: '250px',
      maxWidth: '400px',
      width: '100%',
    },
    '@media (max-width: 480px)': {
      minWidth: '200px',
      maxWidth: '300px',
      width: '100%',
    },
  },
  filter: { width: '180px' },
  right: { display: 'flex', alignItems: 'center', gap: '8px' },
  buttonText: {
    whiteSpace: 'nowrap',
    '@media (max-width: 1280px)': {
      display: 'none',
    },
  },
  scheduleButton: {
    justifyContent: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 'max-content',
  },
  actionButton: {
    justifyContent: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    minWidth: 'max-content',
  },
  menuButton: {
    // Always visible on all breakpoints
  },
  searchContainer: {
    // Ensure consistent width for SearchBox regardless of dismiss icon state
    position: 'relative',
    width: '100%',
    minHeight: '32px', // Match SearchBox height
    '& .fui-SearchBox': {
      width: '100%',
      '& .fui-Input': {
        width: '100%',
      },
    },
  },
  suggestionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  drawerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  drawerItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    padding: '10px 12px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: 'var(--colorNeutralBackground1)',
    cursor: 'pointer',
    transition: 'background .15s ease',
    ':hover': {
      backgroundColor: 'var(--colorNeutralBackground1Hover)',
    },
  },
  drawerItemHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    fontWeight: 600,
  },
  drawerItemSub: {
    color: 'var(--colorNeutralForeground3)',
  },
});

// Removed legacy inline search types in favor of reusable SearchBoxWithResults

export default function Header({
  // notificationPermission,
  // fcmToken,
  // fcmLoading,
  // requestNotificationPermission,
}: {
  notificationPermission: NotificationPermission;
  fcmToken: string | null;
  fcmLoading: boolean;
  requestNotificationPermission: () => Promise<boolean>;
}) {
  const styles = useStyles();
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Header');
  const { toggle } = useSidebar();
  const { user, logout } = useAuth();

  // Modals state
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const queryClient = useQueryClient();

  // Brand configuration from runtime config
  const [brandName, setBrandName] = useState('SecureScribe');
  const [brandLogo, setBrandLogo] = useState('/images/logos/logo.png');

  // Load brand configuration from runtime config
  useEffect(() => {
    try {
      const brandCfg = getBrandConfig();
      setBrandName(brandCfg.name);
      setBrandLogo(brandCfg.logo);
    } catch (error) {
      console.warn('Failed to load brand config, using defaults:', error);
      // Keep default values on error
    }
  }, []);

  // Fetch notifications with React Query
  const {
    data: notifications = [],
    isLoading: notificationsLoading,
    error: notificationsError,
  } = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () =>
      getNotifications({ limit: 20, order_by: 'created_at', dir: 'desc' }).then(
        (res) => res.data,
      ),
    enabled: !!user, // Only fetch if user is authenticated
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 30 * 1000, // Consider data stale after 30 seconds
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Mutation for toggling notification read status
  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      if (isRead) {
        return await markNotificationAsUnread(id);
      } else {
        return await markNotificationAsRead(id);
      }
    },
    onMutate: async ({ id, isRead }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueryData(
        queryKeys.notifications,
      );

      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.notifications,
        (old: NotificationResponse[] | undefined) => {
          if (!old) return old;
          return old.map((n) => (n.id === id ? { ...n, is_read: !isRead } : n));
        },
      );

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          queryKeys.notifications,
          context.previousNotifications,
        );
      }
      console.error('Failed to update notification:', err);
      showToast('error', 'Failed to update notification');
    },
    onSuccess: (data, { isRead }) => {
      showToast(
        isRead ? 'info' : 'success',
        isRead ? t('markedAsUnread') : t('markedAsRead'),
      );
    },
  });

  const toggleNotificationRead = (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (!target) return;

    toggleReadMutation.mutate({ id, isRead: target.is_read });
  };

  // Helper function to extract display information from notification
  const getNotificationDisplay = (notification: NotificationResponse) => {
    const { type, payload } = notification;

    // Extract title and message from type and payload
    let title = type || 'Notification';
    let message = '';

    if (payload && typeof payload === 'object') {
      // Handle task-related notifications
      if (payload.task_title) {
        title = payload.task_title;
        message = t('taskAssigned');

        // Add assigned by information if available (could be user name or ID)
        if (payload.assigned_by) {
          message += ` by ${payload.assigned_by}`;
        }
      }
      // Handle other types of notifications
      else if (payload.title) {
        title = payload.title;
      }

      if (payload.message) {
        message = payload.message;
      } else if (payload.description) {
        message = payload.description;
      } else if (payload.content) {
        message = payload.content;
      } else if (!payload.task_title) {
        // Only fallback to stringify if it's not a task notification
        message = JSON.stringify(payload);
      }
    }

    return { title, message };
  };

  // Breadcrumbs: from URL segments, then title map via i18n keys
  const segments = pathname
    .replace(/^\/(en|vi)/, '')
    .split('/')
    .filter(Boolean);

  // Filter out UUID segments (detail page IDs)
  const isUUID = (str: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

  const crumbLabels = segments
    .filter((seg) => !isUUID(seg)) // Remove UUID segments
    .map((seg) => {
      try {
        return t(`crumb.${seg}` as any);
      } catch {
        return seg;
      }
    });

  const onSelectResult = (result: any) => {
    // Navigate based on result type
    let url = '';
    switch (result.type) {
      case 'project':
        url = `/projects/${result.id}`;
        break;
      case 'meeting':
        url = `/meetings/${result.id}`;
        break;
      case 'file':
      case 'document':
        url = `/files/${result.id}`;
        break;
      case 'user':
        url = `/profile/${result.id}`;
        break;
      default:
        url = '/';
    }

    router.push(url);
    showToast('info', `Opening ${result.type}: ${result.title}`);
  };

  const onPreviewResult = (result: any) => {
    // For now, just show a toast. Could open a preview modal in the future
    showToast('info', `Preview ${result.type}: ${result.title}`);
  };

  // Custom search function that returns SearchResultsGrouped format
  const customSearchEntities = async (query: string) => {
    if (!query.trim()) {
      return {
        meetings: [],
        transcripts: [],
        meeting_notes: [],
        files: [],
        projects: [],
        users: [],
        documents: [],
      };
    }

    try {
      // Perform parallel search across all entities
      const [documents, projects, meetings, files, users] =
        await Promise.allSettled([
          dynamicSearch({ search: query, limit: 3 }),
          getProjects({ name: query }, { limit: 3 }),
          getMeetings({ title: query }, { limit: 3 }),
          getFiles({ filename: query }, { limit: 3 }),
          getUsers({ name: query, limit: 3 }),
        ]);

      // Transform results to SearchResultsGrouped format
      const meetingsResults: any[] = [];
      const transcripts: any[] = [];
      const meeting_notes: any[] = [];
      const filesResults: any[] = [];
      const projectsResults: any[] = [];
      const usersResults: any[] = [];
      const documentsResults: any[] = [];

      // Add projects
      if (projects.status === 'fulfilled' && projects.value?.data?.length) {
        projectsResults.push(
          ...projects.value.data.map((project: any) => ({
            id: project.id,
            type: 'project',
            title: project.name,
            subtitle: project.description || 'Project',
          })),
        );
      }

      // Add meetings
      if (meetings.status === 'fulfilled' && meetings.value?.data?.length) {
        meetingsResults.push(
          ...meetings.value.data.map((meeting: any) => ({
            id: meeting.id,
            type: 'meeting',
            title: meeting.title || 'Untitled Meeting',
            subtitle: meeting.description || 'Meeting',
          })),
        );
      }

      // Add files
      if (files.status === 'fulfilled' && files.value?.data?.length) {
        filesResults.push(
          ...files.value.data.map((file: any) => ({
            id: file.id,
            type: 'file',
            title: file.filename || 'Unnamed File',
            subtitle: `File • ${file.file_type || 'Unknown type'}`,
          })),
        );
      }

      // Add users
      if (users.status === 'fulfilled' && users.value?.data?.length) {
        usersResults.push(
          ...users.value.data.map((user: any) => ({
            id: user.id,
            type: 'user',
            title: user.name || user.email,
            subtitle: user.position || 'User',
          })),
        );
      }

      // Add document search results (now using same API as other searches)
      if (documents.status === 'fulfilled' && documents.value?.data?.length) {
        documentsResults.push(
          ...documents.value.data.map((result: any) => ({
            id: result.id,
            type: 'document',
            title: result.name || 'Document',
            subtitle: `Created ${new Date(result.created_at).toLocaleDateString()}`,
          })),
        );
      }

      return {
        meetings: meetingsResults,
        transcripts,
        meeting_notes,
        files: filesResults,
        projects: projectsResults,
        users: usersResults,
        documents: documentsResults,
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        meetings: [],
        transcripts: [],
        meeting_notes: [],
        files: [],
        projects: [],
        users: [],
        documents: [],
      };
    }
  };

  const onClickBrand = () => {
    router.push('/', { locale });
  };

  const onUpload = () => {
    setIsUploadOpen(true);
  };

  const onSchedule = () => {
    setIsSchedulerOpen(true);
  };

  return (
    <>
      <header className={styles.header}>
        <Tooltip content={t('menu')} relationship="label">
          <Button
            appearance="subtle"
            icon={<Navigation24Regular />}
            onClick={toggle}
            className={styles.menuButton}
            aria-label="Toggle menu"
          />
        </Tooltip>
        <div
          className={styles.brand}
          role="button"
          tabIndex={0}
          onClick={onClickBrand}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onClickBrand();
          }}
        >
          <Image
            src={brandLogo}
            alt={brandName}
            width={28}
            height={28}
          />
          <strong className={styles.brandText}>{brandName}</strong>
        </div>

        <div className={styles.breadcrumbs}>
          {crumbLabels.length === 0 ? (
            <span>{t('home')}</span>
          ) : (
            crumbLabels.map((c, i) => (
              <React.Fragment key={`${c}-${i}`}>
                <span>{c}</span>
                {i < crumbLabels.length - 1 && <span>/</span>}
              </React.Fragment>
            ))
          )}
        </div>

        <div className={styles.grow} />

        <div className={styles.right}>
          <div className={styles.searchWrap}>
            <div className={styles.searchContainer}>
              <SearchBoxWithResults
                placeholder={t('searchPlaceholder')}
                onSelect={onSelectResult}
                onPreview={onPreviewResult}
                searchEntities={customSearchEntities}
                align="end"
                appearance="outline"
                size="large"
              />
            </div>
          </div>
          <Tooltip content={t('upload')} relationship="label">
            <Button
              appearance="primary"
              size="medium"
              className={styles.actionButton}
              icon={<ArrowUpload24Regular />}
              onClick={onUpload}
            >
              <span className={styles.buttonText}>{t('upload')}</span>
            </Button>
          </Tooltip>
          <Tooltip content={t('schedule')} relationship="label">
            <Button
              appearance="secondary"
              size="medium"
              icon={<CalendarAdd24Regular />}
              onClick={onSchedule}
              className={mergeClasses(styles.scheduleButton, styles.actionButton)}
            >
              <span className={styles.buttonText}>{t('schedule')}</span>
            </Button>
          </Tooltip>

          {/* Notifications */}
          <Tooltip content={t('notifications')} relationship="label">
            <Button
              appearance="subtle"
              icon={<AlertUrgent24Regular />}
              onClick={() => setIsNotiOpen(true)}
            >
              {unreadCount > 0 && (
                <CounterBadge
                  count={unreadCount}
                  appearance="filled"
                  color="danger"
                  size="small"
                />
              )}
            </Button>
          </Tooltip>

          {/* User Profile Dropdown */}
          <Menu>
            <MenuTrigger>
              <Tooltip content="Profile" relationship="label">
                <Button appearance="subtle" size="small">
                  <Avatar
                    name={user?.name || user?.email || 'User'}
                    image={
                      user?.avatar_url ? { src: user.avatar_url } : undefined
                    }
                    size={28}
                  />
                </Button>
              </Tooltip>
            </MenuTrigger>
            <MenuPopover>
              <MenuList>
                <div
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--colorNeutralForeground3)',
                    }}
                  >
                    {user?.email}
                  </div>
                  {user?.position && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--colorNeutralForeground3)',
                      }}
                    >
                      {user.position}
                    </div>
                  )}
                </div>
                <Divider />
                <MenuItem icon={<SignOut24Regular />} onClick={logout}>
                  {t('logout') || 'Logout'}
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>

          <Divider vertical style={{ height: 28 }} />
          <TestNotificationButton />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>
      <Drawer
        open={isNotiOpen}
        position="end"
        onOpenChange={(_, data) => setIsNotiOpen(!!data.open)}
      >
        <DrawerHeader>
          <DrawerHeaderTitle>{t('notifications')}</DrawerHeaderTitle>
        </DrawerHeader>
        <DrawerBody>
          {/* Notification Settings - Compact Design */}
          {/* <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--colorNeutralStroke2)' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              {t('notificationSettings')}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--colorNeutralForeground3)' }}>
                  {t('browserPermission')}:
                </span>
                <Badge
                  appearance="filled"
                  color={
                    notificationPermission === 'granted' ? 'success' :
                      notificationPermission === 'denied' ? 'danger' : 'warning'
                  }
                  size="small"
                >
                  {notificationPermission === 'granted' ? t('permissionGranted') :
                    notificationPermission === 'denied' ? t('permissionDenied') : t('permissionDefault')}
                </Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--colorNeutralForeground3)' }}>
                  {t('fcmToken')}:
                </span>
                <Badge
                  appearance="filled"
                  color={fcmToken ? 'success' : 'warning'}
                  size="small"
                >
                  {fcmToken ? t('tokenRegistered') : t('tokenNotRegistered')}
                </Badge>
              </div>
              {notificationPermission !== 'granted' && (
                <Button
                  appearance="primary"
                  size="small"
                  onClick={requestNotificationPermission}
                  disabled={fcmLoading}
                  style={{ alignSelf: 'flex-start', marginTop: '4px', fontSize: '11px', padding: '4px 8px' }}
                >
                  {fcmLoading ? t('enablingNotifications') : t('enableNotifications')}
                </Button>
              )}
            </div>
          </div> */}

          <div className={styles.drawerList}>
            {notificationsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                {t('loadingNotifications')}
              </div>
            ) : notificationsError ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: 'var(--colorStatusDangerForeground1)',
                }}
              >
                {notificationsError.message || t('failedToLoadNotifications')}
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: 'var(--colorNeutralForeground3)',
                }}
              >
                {t('noNotifications')}
              </div>
            ) : (
              notifications.map((n) => {
                const displayInfo = getNotificationDisplay(n);
                return (
                  <div
                    key={n.id}
                    className={styles.drawerItem}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleNotificationRead(n.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ')
                        toggleNotificationRead(n.id);
                    }}
                  >
                    <div className={styles.drawerItemHeader}>
                      <span>{displayInfo.title}</span>
                      {!n.is_read && (
                        <Badge appearance="filled" color="brand" size="small">
                          New
                        </Badge>
                      )}
                    </div>
                    <div className={styles.drawerItemSub}>
                      {displayInfo.message}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'var(--colorNeutralForeground3)',
                        marginTop: '4px',
                      }}
                    >
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <Button appearance="secondary" onClick={() => setIsNotiOpen(false)}>
            {t('close')}
          </Button>
        </DrawerFooter>
      </Drawer>
      <MeetingSchedulerModal
        open={isSchedulerOpen}
        onOpenChange={setIsSchedulerOpen}
      />
      <FileUploadModal
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </>
  );
}
