'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Button,
  Text,
  makeStyles,
  tokens,
  shorthands,
} from '@/lib/components';
import { ArrowLeft20Regular, ArrowRight20Regular } from '@/lib/icons';
import { getFiles } from '@/services/api/file';
import { getProjects } from '@/services/api/project';
import { getMeetings } from '@/services/api/meeting';
import { queryKeys } from '@/lib/queryClient';
import { showLoadingToast } from '@/components/loading/LoadingToast';
import { FileUploadModal } from '@/components/modal/FileUploadModal';
import { FilesHeader } from './FilesHeader';
import { FilesGrid } from './FilesGrid';
import { FilesList } from './FilesList';
import { EmptyFilesState } from './EmptyFilesState';
import { FileCardSkeleton } from './FileCardSkeleton';

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
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
      ...shorthands.gap(tokens.spacingHorizontalXL),
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
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
});

// LocalStorage key for view mode
const VIEW_MODE_KEY = 'files-view-mode';

export function FilesPageClient() {
  const styles = useStyles();
  const searchParams = useSearchParams();
  const t = useTranslations('Files');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Get view mode from localStorage or default to grid
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(VIEW_MODE_KEY);
      return (stored as 'grid' | 'list') || 'grid';
    }
    return 'grid';
  });

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || '',
  );
  const [fileType, setFileType] = useState(
    searchParams.get('type') || undefined,
  );
  const [projectId, setProjectId] = useState(
    searchParams.get('project') || undefined,
  );
  const [meetingId, setMeetingId] = useState(
    searchParams.get('meeting') || undefined,
  );
  const [uploadDateFrom, setUploadDateFrom] = useState<Date | null>(null);
  const [uploadDateTo, setUploadDateTo] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10),
  );

  const limit = viewMode === 'grid' ? 12 : 20;

  // Save view mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  // Fetch projects for filter - with aggressive caching
  const { data: projectsData } = useQuery({
    queryKey: [...queryKeys.projects],
    queryFn: () => getProjects({}, { limit: 100 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
  });

  // Fetch meetings for filter (filtered by project if selected)
  const { data: meetingsData } = useQuery({
    queryKey: projectId
      ? ['projects', projectId, 'meetings']
      : [...queryKeys.meetings],
    queryFn: () =>
      getMeetings(projectId ? { project_id: projectId } : {}, { limit: 100 }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes cache
    enabled: !!projectId,
  });

  const projects = projectsData?.data || [];
  const meetings = meetingsData?.data || [];

  // Check if a file's MIME type matches the selected category
  // Only supporting 'pdf' and 'document' types
  const matchesMimeTypeCategory = (
    mimeType: string,
    category?: string,
  ): boolean => {
    if (!category) return true; // No filter = show all

    const mime = mimeType.toLowerCase();
    switch (category) {
      case 'pdf':
        return mime === 'application/pdf';
      case 'document':
        return (
          mime.includes('word') ||
          mime === 'application/msword' ||
          mime ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          mime === 'text/plain' || // .txt files
          mime.startsWith('image/') || // images as documents
          mime.includes('sheet') || // spreadsheets as documents
          mime.includes('excel') ||
          mime === 'application/vnd.ms-excel' ||
          mime ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          mime.includes('presentation') || // presentations as documents
          mime.includes('powerpoint') ||
          mime === 'application/vnd.ms-powerpoint' ||
          mime ===
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
          mime === 'text/csv'
        );
      default:
        return true;
    }
  };

  // Build API filters (WITHOUT mime_type - we'll filter client-side)
  const apiFilters = useMemo(
    () => ({
      filename: searchQuery || undefined,
      // Don't send mime_type to backend - filter client-side instead
      project_id: projectId,
      meeting_id: meetingId,
      // created_at_gte: uploadDateFrom?.toISOString(),
      // created_at_lte: uploadDateTo?.toISOString(),
    }),
    [searchQuery, projectId, meetingId],
  );

  const apiParams = useMemo(
    () => ({
      page: currentPage,
      limit,
    }),
    [currentPage, limit],
  );

  // Fetch files with React Query - aggressive caching for smooth navigation
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...queryKeys.files, apiFilters, apiParams],
    queryFn: async () => {
      return getFiles(apiFilters, apiParams);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - consider data fresh
    gcTime: 15 * 60 * 1000, // 15 minutes - keep in cache
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false, // Don't refetch on tab focus
    refetchOnMount: false, // Don't refetch if data is fresh
  });

  // Apply client-side MIME type filtering (must be before conditional returns)
  const files = useMemo(() => {
    const rawFiles = data?.data || [];
    if (!fileType) return rawFiles;
    return rawFiles.filter((file) =>
      matchesMimeTypeCategory(file.mime_type || '', fileType),
    );
  }, [data?.data, fileType]);

  // Recalculate counts based on filtered files
  const totalCount = files.length;
  const totalPages = Math.ceil(totalCount / limit);
  const hasNext = currentPage < totalPages;
  const hasPrev = currentPage > 1;

  // Handlers
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFileTypeChange = useCallback((type?: string) => {
    setFileType(type);
    setCurrentPage(1);
  }, []);

  const handleProjectIdChange = useCallback((id?: string) => {
    setProjectId(id);
    setCurrentPage(1);
  }, []);

  const handleMeetingIdChange = useCallback((id?: string) => {
    setMeetingId(id);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback(
    (from?: Date | null, to?: Date | null) => {
      setUploadDateFrom(from || null);
      setUploadDateTo(to || null);
      setCurrentPage(1);
    },
    [],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // File operation callbacks - refetch data after successful operations
  const handleFileDeleted = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleFileRenamed = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleFileMoved = useCallback(() => {
    refetch();
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: limit }).map((_, i) => (
            <FileCardSkeleton key={i} />
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

  const isFiltered = !!(searchQuery || fileType || projectId || meetingId);

  return (
    <div className={styles.container}>
      {showLoadingToast(t('searching'))}

      <FilesHeader
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        fileType={fileType}
        onFileTypeChange={handleFileTypeChange}
        projectId={projectId}
        onProjectIdChange={handleProjectIdChange}
        meetingId={meetingId}
        onMeetingIdChange={handleMeetingIdChange}
        uploadDateFrom={uploadDateFrom}
        uploadDateTo={uploadDateTo}
        onDateRangeChange={handleDateRangeChange}
        totalCount={totalCount}
        projects={projects}
        meetings={meetings}
        onUploadClick={() => setUploadModalOpen(true)}
      />

      <div className={styles.content}>
        {files.length === 0 ? (
          <EmptyFilesState
            isFiltered={isFiltered}
            onUploadClick={() => setUploadModalOpen(true)}
          />
        ) : viewMode === 'grid' ? (
          <FilesGrid 
            files={files}
            onFileDeleted={handleFileDeleted}
            onFileRenamed={handleFileRenamed}
            onFileMoved={handleFileMoved}
          />
        ) : (
          <FilesList 
            files={files} 
            projects={projects} 
            meetings={meetings}
            onFileDeleted={handleFileDeleted}
            onFileRenamed={handleFileRenamed}
            onFileMoved={handleFileMoved}
          />
        )}
      </div>

      {/* Pagination */}
      {files.length > 0 && totalPages > 1 && (
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

      {/* Upload Modal */}
      <FileUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        defaultProjectId={projectId}
        defaultMeetingId={meetingId}
      />
    </div>
  );
}
