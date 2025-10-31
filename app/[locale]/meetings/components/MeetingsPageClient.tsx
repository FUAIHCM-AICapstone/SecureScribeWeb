'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Button,
  Text,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import { ArrowLeft20Regular, ArrowRight20Regular } from '@fluentui/react-icons';
import { getMeetings } from '@/services/api/meeting';
import { queryKeys } from '@/lib/queryClient';
import { showLoadingToast } from '@/components/loading/LoadingToast';
import { MeetingsHeader } from './MeetingsHeader';
import { MeetingsGrid } from './MeetingsGrid';
import { MeetingsList } from './MeetingsList';
import { EmptyMeetingsState } from './EmptyMeetingsState';
import { MeetingCardSkeleton } from './MeetingCardSkeleton';
import MeetingSchedulerModal from '@/components/modal/MeetingSchedulerModal';

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
  },
  loadingIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    marginBottom: '16px',
  },
  loadingText: {
    color: tokens.colorNeutralForeground2,
    fontSize: '14px',
  },
});

export function MeetingsPageClient() {
  const styles = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Meetings');

  // Initialize state from URL params
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (searchParams.get('view') as 'grid' | 'list') || 'grid',
  );
  const [isPersonal, setIsPersonal] = useState<boolean | undefined>(() => {
    const personal = searchParams.get('personal');
    if (personal === 'true') return true;
    if (personal === 'false') return false;
    return undefined;
  });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [startDateFrom, setStartDateFrom] = useState<Date | null>(null);
  const [startDateTo, setStartDateTo] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10),
  );
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const limit = viewMode === 'grid' ? 12 : 20;

  // Build API filters
  const apiFilters = useMemo(
    () => ({
      is_personal: isPersonal,
      title: searchQuery || undefined,
      start_time_gte: startDateFrom?.toISOString(),
      start_time_lte: startDateTo?.toISOString(),
    }),
    [isPersonal, searchQuery, startDateFrom, startDateTo],
  );

  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit,
    }),
    [currentPage, limit],
  );

  // Fetch meetings with React Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey:
      isPersonal === true
        ? [...queryKeys.personalMeetings, apiParams]
        : [...queryKeys.meetings, apiFilters, apiParams],
    queryFn: async () => {
      return getMeetings(apiFilters, apiParams);
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
      setCurrentPage(1); // Reset to page 1 when changing view
      updateURL({ view: mode, page: '1' });
    },
    [updateURL],
  );

  const handlePersonalChange = useCallback(
    (value: boolean | undefined) => {
      setIsPersonal(value);
      setCurrentPage(1);
      updateURL({
        personal: value === undefined ? undefined : String(value),
        page: '1',
      });
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

  const handleDateRangeChange = useCallback(
    (from: Date | null, to: Date | null) => {
      setStartDateFrom(from);
      setStartDateTo(to);
      setCurrentPage(1);
      updateURL({ page: '1' });
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

  const handleCreateClick = useCallback(() => {
    setShowMeetingModal(true);
  }, []);

  // Determine if filters are active
  const hasActiveFilters = Boolean(
    isPersonal !== undefined || searchQuery || startDateFrom || startDateTo,
  );

  // Loading states
  const isInitialLoading = isLoading && !data;

  // Initial loading state - show header + skeleton
  if (isInitialLoading) {
    return (
      <div className={styles.container}>
        <MeetingsHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isPersonal={isPersonal}
          onPersonalChange={handlePersonalChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          startDateFrom={startDateFrom}
          startDateTo={startDateTo}
          onDateRangeChange={handleDateRangeChange}
          totalCount={0}
        />
        <div className={styles.skeletonGrid}>
          {Array.from({ length: viewMode === 'grid' ? 12 : 8 }).map((_, i) => (
            <MeetingCardSkeleton key={i} />
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
              : 'An unexpected error occurred'}
          </Text>
          <Button appearance="primary" onClick={() => refetch()}>
            {t('retry')}
          </Button>
        </div>
      </div>
    );
  }

  const meetings = data?.data || [];
  const pagination = data?.pagination;
  const totalCount = pagination?.total || 0;
  const totalPages = pagination?.total_pages || 1;
  const hasNext = pagination?.has_next || false;
  const hasPrev = pagination?.has_prev || false;

  return (
    <div className={styles.container}>
      {showLoadingToast(t('searching'))}

      <MeetingsHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        isPersonal={isPersonal}
        onPersonalChange={handlePersonalChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        startDateFrom={startDateFrom}
        startDateTo={startDateTo}
        onDateRangeChange={handleDateRangeChange}
        totalCount={totalCount}
      />

      <div className={styles.content}>
        {meetings.length === 0 ? (
          <EmptyMeetingsState
            isFiltered={hasActiveFilters}
            onCreateClick={handleCreateClick}
          />
        ) : viewMode === 'grid' ? (
          <MeetingsGrid meetings={meetings} />
        ) : (
          <MeetingsList meetings={meetings} />
        )}
      </div>

      {meetings.length > 0 && totalPages > 1 && (
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

      {/* Meeting Scheduler Modal */}
      <MeetingSchedulerModal
        open={showMeetingModal}
        onOpenChange={setShowMeetingModal}
      />
    </div>
  );
}
