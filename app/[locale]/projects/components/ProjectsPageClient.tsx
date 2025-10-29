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
import { getProjects } from '@/services/api/project';
import { queryKeys } from '@/lib/queryClient';
import { showLoadingToast } from '@/components/loading/LoadingToast';
import { ProjectsHeader } from './ProjectsHeader';
import { ProjectsGrid } from './ProjectsGrid';
import { ProjectsList } from './ProjectsList';
import { EmptyProjectsState } from './EmptyProjectsState';
import { ProjectCardSkeleton } from './ProjectCardSkeleton';
import ProjectCreateModal from '@/components/modal/ProjectCreateModal';

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

export function ProjectsPageClient() {
  const styles = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Projects');

  // Initialize state from URL params
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (searchParams.get('view') as 'grid' | 'list') || 'grid',
  );
  const [isArchived, setIsArchived] = useState<boolean | undefined>(() => {
    const archived = searchParams.get('archived');
    if (archived === 'true') return true;
    if (archived === 'false') return false;
    return undefined;
  });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [createdDateFrom, setCreatedDateFrom] = useState<Date | null>(null);
  const [createdDateTo, setCreatedDateTo] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10),
  );
  const [showProjectModal, setShowProjectModal] = useState(false);

  const limit = viewMode === 'grid' ? 12 : 20;

  // Build API filters
  const apiFilters = useMemo(
    () => ({
      is_archived: isArchived,
      name: searchQuery || undefined,
      created_at_gte: createdDateFrom?.toISOString(),
      created_at_lte: createdDateTo?.toISOString(),
    }),
    [isArchived, searchQuery, createdDateFrom, createdDateTo],
  );

  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit,
    }),
    [currentPage, limit],
  );

  // Fetch projects with React Query
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...queryKeys.projects, apiFilters, apiParams],
    queryFn: async () => {
      return getProjects(apiFilters, apiParams);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
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

  const handleArchivedChange = useCallback(
    (value: boolean | undefined) => {
      setIsArchived(value);
      setCurrentPage(1);
      updateURL({
        archived: value === undefined ? undefined : String(value),
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
      setCreatedDateFrom(from);
      setCreatedDateTo(to);
      setCurrentPage(1);
      updateURL({
        from: from?.toISOString(),
        to: to?.toISOString(),
        page: '1',
      });
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

  const handleCreateProject = useCallback(() => {
    setShowProjectModal(true);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchQuery || isArchived !== undefined || createdDateFrom || createdDateTo,
  );

  const projects = data?.data || [];
  const pagination = data?.pagination;
  const totalCount = pagination?.total || 0;

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <ProjectsHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isArchived={isArchived}
          onArchivedChange={handleArchivedChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          createdDateFrom={createdDateFrom}
          createdDateTo={createdDateTo}
          onDateRangeChange={handleDateRangeChange}
          totalCount={0}
        />
        <div className={styles.skeletonGrid}>
          {Array.from({ length: limit }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={styles.container}>
        <ProjectsHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isArchived={isArchived}
          onArchivedChange={handleArchivedChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          createdDateFrom={createdDateFrom}
          createdDateTo={createdDateTo}
          onDateRangeChange={handleDateRangeChange}
          totalCount={0}
        />
        <div className={styles.errorContainer}>
          <Text className={styles.errorTitle}>{t('errorTitle')}</Text>
          <Text className={styles.errorMessage}>
            {error instanceof Error ? error.message : t('errorTitle')}
          </Text>
          <Button appearance="primary" onClick={() => refetch()}>
            {t('retry')}
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <div className={styles.container}>
        <ProjectsHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isArchived={isArchived}
          onArchivedChange={handleArchivedChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          createdDateFrom={createdDateFrom}
          createdDateTo={createdDateTo}
          onDateRangeChange={handleDateRangeChange}
          totalCount={0}
        />
        <EmptyProjectsState
          isFiltered={hasActiveFilters}
          onCreateClick={handleCreateProject}
        />
      </div>
    );
  }

  // Main content
  return (
    <div className={styles.container}>
      {showLoadingToast(t('searching'))}

      <ProjectsHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        isArchived={isArchived}
        onArchivedChange={handleArchivedChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        createdDateFrom={createdDateFrom}
        createdDateTo={createdDateTo}
        onDateRangeChange={handleDateRangeChange}
        totalCount={totalCount}
      />

      <div className={styles.content}>
        {viewMode === 'grid' ? (
          <ProjectsGrid projects={projects} />
        ) : (
          <ProjectsList projects={projects} />
        )}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <div className={styles.pagination}>
          <Button
            appearance="secondary"
            icon={<ArrowLeft20Regular />}
            disabled={!pagination.has_prev}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            {t('previous')}
          </Button>
          <Text className={styles.pageInfo}>
            {t('pageInfo', {
              current: currentPage,
              total: pagination.total_pages,
            })}
          </Text>
          <Button
            appearance="secondary"
            icon={<ArrowRight20Regular />}
            iconPosition="after"
            disabled={!pagination.has_next}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            {t('next')}
          </Button>
        </div>
      )}

      {/* Project Create Modal */}
      <ProjectCreateModal
        open={showProjectModal}
        onOpenChange={setShowProjectModal}
      />
    </div>
  );
}
