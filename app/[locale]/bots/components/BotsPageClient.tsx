'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Button,
  Text,
  makeStyles,
  tokens,
  shorthands,
  Toast,
  ToastTitle,
  ToastBody,
  useToastController,
} from '@fluentui/react-components';
import { ArrowLeft20Regular, ArrowRight20Regular } from '@fluentui/react-icons';
import { meetingBotApi } from '@/services/api/meetingBot';
import { showLoadingToast } from '@/components/loading/LoadingToast';
import { BotsHeader } from './BotsHeader';
import { BotsGrid } from './BotsGrid';
import { BotsList } from './BotsList';
import { EmptyBotsState } from './EmptyBotsState';
import { BotCardSkeleton } from './BotCardSkeleton';
import { BotLogsModal } from './BotLogsModal';
import { BotDetailsModal } from './BotDetailsModal';

const useStyles = makeStyles({
  container: {
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
    ...shorthands.padding('40px', '32px', '24px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('24px', '16px', '16px'),
    },
  },
  content: {
    marginBottom: '32px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.padding('64px', '24px'),
    minHeight: '400px',
    textAlign: 'center',
    ...shorthands.gap('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },
  errorTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: tokens.colorPaletteRedForeground1,
  },
  errorMessage: {
    color: tokens.colorNeutralForeground2,
    maxWidth: '500px',
  },
  skeletonGrid: {
    display: 'grid',
    ...shorthands.gap(tokens.spacingHorizontalL),
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      ...shorthands.gap(tokens.spacingHorizontalXL),
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.padding('24px', '0'),
  },
  pageInfo: {
    minWidth: '120px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
  },
});

export function BotsPageClient() {
  const styles = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Bots');
  const { dispatchToast } = useToastController('bot-toaster');

  // Initialize state from URL params
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (searchParams.get('view') as 'grid' | 'list') || 'grid',
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10),
  );
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const limit = viewMode === 'grid' ? 12 : 20;

  // Fetch bots with React Query
  const { data: botsData, isLoading: isBotsLoading, isError, error, refetch } = useQuery({
    queryKey: ['bots', { page: currentPage, limit }],
    queryFn: async () => {
      return meetingBotApi.getBots(
        {},
        { page: currentPage, limit }
      );
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (consistent with queryClient config)
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData, // Keep previous data while fetching
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Update URL when filters change
  const updateURL = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Handlers
  const handleViewModeChange = useCallback(
    (mode: 'grid' | 'list') => {
      setViewMode(mode);
      setCurrentPage(1);
      updateURL({ view: mode, page: '1' });
    },
    [updateURL],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
      updateURL({ search: query || undefined, page: '1' });
    },
    [updateURL],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateURL({ page: String(page) });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [updateURL],
  );

  const handleStatusChange = useCallback(
    async (botId: string, status: string) => {
      try {
        await meetingBotApi.updateBotStatus(botId, {
          status: status as any,
        });
        dispatchToast(
          <Toast>
            <ToastTitle>{t('botStatusUpdated')}</ToastTitle>
          </Toast>,
          { intent: 'success' }
        );
        refetch();
      } catch (err) {
        dispatchToast(
          <Toast>
            <ToastTitle>{t('failedToUpdateStatus')}</ToastTitle>
            <ToastBody>{err instanceof Error ? err.message : 'Unknown error'}</ToastBody>
          </Toast>,
          { intent: 'error' }
        );
      }
    },
    [dispatchToast, t, refetch],
  );

  const handleDelete = useCallback(
    async (botId: string) => {
      if (!confirm(t('confirmDelete'))) return;
      try {
        await meetingBotApi.deleteMeetingBot(botId);
        dispatchToast(
          <Toast>
            <ToastTitle>{t('botDeleted')}</ToastTitle>
          </Toast>,
          { intent: 'success' }
        );
        refetch();
      } catch (err) {
        dispatchToast(
          <Toast>
            <ToastTitle>{t('failedToDelete')}</ToastTitle>
            <ToastBody>{err instanceof Error ? err.message : 'Unknown error'}</ToastBody>
          </Toast>,
          { intent: 'error' }
        );
      }
    },
    [dispatchToast, t, refetch],
  );

  const handleViewLogs = useCallback(
    (botId: string) => {
      setSelectedBotId(botId);
      setIsLogsModalOpen(true);
    },
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Determine if filters are active
  const hasActiveFilters = Boolean(searchQuery);

  // Loading states
  const isInitialLoading = isBotsLoading && !botsData;

  // Extract data and pagination info
  const bots = useMemo(() => botsData?.data || [], [botsData]);
  const pagination = useMemo(() => botsData?.pagination, [botsData]);
  const totalCount = useMemo(() => pagination?.total || 0, [pagination]);
  const totalPages = useMemo(() => pagination?.total_pages || 1, [pagination]);
  const hasNext = useMemo(() => pagination?.has_next || false, [pagination]);
  const hasPrev = useMemo(() => pagination?.has_prev || false, [pagination]);

  // Initial loading state - show header + skeleton
  if (isInitialLoading) {
    return (
      <div className={styles.container}>
        <BotsHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          totalCount={0}
        />
        <div className={styles.skeletonGrid}>
          {Array.from({ length: viewMode === 'grid' ? 12 : 8 }).map((_, i) => (
            <BotCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <Text className={styles.errorTitle}>{t('errorTitle')}</Text>
          <Text className={styles.errorMessage}>
            {error instanceof Error
              ? error.message
              : t('errorLoadingBots')}
          </Text>
          <Button appearance="primary" onClick={() => refetch()}>
            {t('retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showLoadingToast(t('searching'))}

      <BotsHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        totalCount={totalCount}
      />

      <div className={styles.content}>
        {bots.length === 0 ? (
          <EmptyBotsState isFiltered={hasActiveFilters} />
        ) : viewMode === 'grid' ? (
          <BotsGrid
            bots={bots}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onViewLogs={handleViewLogs}
          />
        ) : (
          <BotsList
            bots={bots}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            onViewLogs={handleViewLogs}
          />
        )}
      </div>

      {bots.length > 0 && totalPages > 1 && (
        <div className={styles.pagination}>
          <Button
            appearance="secondary"
            icon={<ArrowLeft20Regular />}
            disabled={!hasPrev}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {t('previous')}
          </Button>
          <Text className={styles.pageInfo}>
            {t('pageInfo', { current: currentPage, total: totalPages })}
          </Text>
          <Button
            appearance="secondary"
            icon={<ArrowRight20Regular />}
            iconPosition="after"
            disabled={!hasNext}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {t('next')}
          </Button>
        </div>
      )}

      {selectedBotId && (
        <>
          <BotLogsModal
            botId={selectedBotId}
            open={isLogsModalOpen}
            onOpenChange={setIsLogsModalOpen}
          />
          <BotDetailsModal
            botId={selectedBotId}
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
          />
        </>
      )}
    </div>
  );
}
