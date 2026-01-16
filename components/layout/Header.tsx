'use client';

import { lazy, Suspense } from 'react';
const MeetingSchedulerModal = lazy(() => import('@/components/modal/MeetingSchedulerModal'));
const FileUploadModal = lazy(() => import('@/components/modal/FileUploadModal').then(m => ({ default: m.FileUploadModal })));
import SearchBoxWithResults from '@/components/search/SearchBoxWithResults';
import { showToast } from '@/hooks/useShowToast';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  Button,
  CounterBadge,
  Divider,
  Tooltip,
  mergeClasses,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import {
  AlertUrgent24Regular,
  ArrowUpload24Regular,
  CalendarAdd24Regular,
  Navigation24Regular,
} from '@fluentui/react-icons';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { NotificationDrawer } from './NotificationDrawer';
import { UserMenu } from './UserMenu';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import { getNotifications } from '@/services/api/notification';
import { dynamicSearch } from '@/services/api/search';
import { getProjects } from '@/services/api/project';
import { getMeetings } from '@/services/api/meeting';
import { getFiles } from '@/services/api/file';
import { getUsers } from '@/services/api/user';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
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
    borderRadius: 'var(--borderRadiusMedium)',
    border: `1px solid var(--colorNeutralStroke1)`,
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

export default function Header() {
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
    showToast('info', t('opening', { type: result.type, title: result.title }));
  };

  const onPreviewResult = (result: any) => {
    // For now, just show a toast. Could open a preview modal in the future
    showToast('info', t('preview', { type: result.type, title: result.title }));
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
              className={mergeClasses(
                styles.scheduleButton,
                styles.actionButton,
              )}
            >
              <span className={styles.buttonText}>{t('schedule')}</span>
            </Button>
          </Tooltip>

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

          <UserMenu user={user} onLogout={logout} t={t} />

          <Divider vertical style={{ height: 28 }} />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <NotificationDrawer
        open={isNotiOpen}
        onOpenChange={setIsNotiOpen}
        notifications={notifications}
        isLoading={notificationsLoading}
        error={notificationsError}
        unreadCount={unreadCount}
        t={t}
      />

      <Suspense fallback={null}>
        <MeetingSchedulerModal
          open={isSchedulerOpen}
          onOpenChange={setIsSchedulerOpen}
        />
      </Suspense>
      <Suspense fallback={null}>
        <FileUploadModal
          open={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
        />
      </Suspense>
    </>
  );
}
