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
} from '@/lib/components';
import { ArrowLeft20Regular, ArrowRight20Regular } from '@/lib/icons';
import { getTasks } from '@/services/api/task';
import { queryKeys } from '@/lib/queryClient';
import { showLoadingToast, hideLoadingToast } from '@/components/loading/LoadingToast';
import { useAuth } from '@/context/AuthContext';
import { TasksHeader } from './TasksHeader';
import { TasksGrid } from './TasksGrid';
import { TasksList } from './TasksList';
import { EmptyTasksState } from './EmptyTasksState';
import { TaskCardSkeleton } from './TaskCardSkeleton';
import { CreateTaskModal } from './CreateTaskModal';
import type { TaskStatus } from 'types/task.type';

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

export function TasksPageClient() {
  const styles = useStyles();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Tasks');
  const { user } = useAuth();

  // Initialize state from URL params
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    (searchParams.get('view') as 'grid' | 'list') || 'grid',
  );
  const [isMyTasks, setIsMyTasks] = useState<boolean | undefined>(() => {
    const myTasks = searchParams.get('myTasks');
    if (myTasks === 'true') return true;
    if (myTasks === 'false') return false;
    return undefined;
  });
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(
    () => {
      const status = searchParams.get('status');
      if (status === 'todo' || status === 'in_progress' || status === 'done') {
        return status;
      }
      return undefined;
    },
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10),
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const limit = viewMode === 'grid' ? 12 : 20;

  const assigneeFilter = useMemo(
    () => (isMyTasks ? user?.id : undefined),
    [isMyTasks, user?.id],
  );

  // Build API filters
  const apiFilters = useMemo(
    () => ({
      title: searchQuery || undefined,
      status: statusFilter,
      assignee_id: assigneeFilter,
    }),
    [searchQuery, statusFilter, assigneeFilter],
  );

  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit,
    }),
    [currentPage, limit],
  );

  const isQueryEnabled = !isMyTasks || Boolean(assigneeFilter);

  // Fetch tasks with React Query
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey:
      isMyTasks === true
        ? [...queryKeys.myTasks, assigneeFilter ?? 'pending', apiParams]
        : [...queryKeys.tasks, apiFilters, apiParams],
    queryFn: async () => {
      return getTasks(apiFilters, apiParams);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: isQueryEnabled,
  });

  useEffect(() => {
    if (isFetching) {
      showLoadingToast(t('searching'));
    } else {
      hideLoadingToast();
    }

    return () => {
      hideLoadingToast();
    };
  }, [isFetching, t]);

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

  const handleMyTasksChange = useCallback(
    (value: boolean | undefined) => {
      setIsMyTasks(value);
      setCurrentPage(1);
      updateURL({
        myTasks: value === undefined ? undefined : String(value),
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

  const handleStatusFilterChange = useCallback(
    (status: TaskStatus | undefined) => {
      setStatusFilter(status);
      setCurrentPage(1);
      updateURL({ status: status || undefined, page: '1' });
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
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const createTaskModal = (
    <CreateTaskModal open={isCreateModalOpen} onClose={handleCloseCreateModal} />
  );

  // Determine if filters are active
  const hasActiveFilters = Boolean(
    isMyTasks !== undefined || searchQuery || statusFilter,
  );

  // Loading states
  const isInitialLoading = (isLoading && !data) || (isMyTasks === true && !assigneeFilter);

  // Initial loading state - show header + skeleton
  if (isInitialLoading) {
    return (
      <div className={styles.container}>
        {createTaskModal}
        <TasksHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          isMyTasks={isMyTasks}
          onMyTasksChange={handleMyTasksChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          totalCount={0}
          onCreateClick={handleCreateClick}
        />
        <div className={styles.skeletonGrid}>
          {Array.from({ length: viewMode === 'grid' ? 12 : 8 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={styles.container}>
        {createTaskModal}
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

  const tasks = data?.data || [];
  const pagination = data?.pagination;
  const totalCount = pagination?.total || 0;
  const totalPages = pagination?.total_pages || 1;
  const hasNext = pagination?.has_next || false;
  const hasPrev = pagination?.has_prev || false;

  return (
    <div className={styles.container}>
      {createTaskModal}
      <TasksHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        isMyTasks={isMyTasks}
        onMyTasksChange={handleMyTasksChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        totalCount={totalCount}
        onCreateClick={handleCreateClick}
      />

      <div className={styles.content}>
        {tasks.length === 0 ? (
          <EmptyTasksState
            isFiltered={hasActiveFilters}
            onCreateClick={handleCreateClick}
          />
        ) : viewMode === 'grid' ? (
          <TasksGrid tasks={tasks} />
        ) : (
          <TasksList tasks={tasks} />
        )}
      </div>

      {tasks.length > 0 && totalPages > 1 && (
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
    </div>
  );
}
