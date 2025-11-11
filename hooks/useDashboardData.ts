import { useQueries } from '@tanstack/react-query';
import { getTasks } from '@/services/api/task';
import { getProjects } from '@/services/api/project';
import { getMeetings } from '@/services/api/meeting';
import { getFiles } from '@/services/api/file';
import { queryKeys } from '@/lib/queryClient';
import type { TaskResponse } from '../types/task.type';
import type { ProjectResponse } from '../types/project.type';
import type { MeetingResponse } from '../types/meeting.type';
import type { FileResponse } from '../types/file.type';

interface DataState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

interface DashboardData {
  tasks: DataState<TaskResponse>;
  projects: DataState<ProjectResponse>;
  meetings: DataState<MeetingResponse>;
  files: DataState<FileResponse>;
  transcripts: DataState<MeetingResponse>;
  notes: DataState<MeetingResponse>;
}

export const useDashboardData = () => {
  // Use useQueries to fetch multiple queries in parallel with caching
  const queries = useQueries({
    queries: [
      {
        queryKey: queryKeys.dashboardTasks,
        queryFn: () => getTasks({ status: undefined }, { limit: 10, page: 1 }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
      },
      {
        queryKey: queryKeys.dashboardProjects,
        queryFn: () =>
          getProjects({ is_archived: false }, { limit: 10, page: 1 }),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
      },
      {
        queryKey: queryKeys.dashboardMeetings,
        queryFn: () => getMeetings({}, { limit: 10, page: 1 }),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
      },
      {
        queryKey: queryKeys.dashboardFiles,
        queryFn: () => getFiles({}, { limit: 10, page: 1 }),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
      },
      {
        queryKey: queryKeys.dashboardTranscripts,
        queryFn: () => getMeetings({}, { limit: 20, page: 1 }),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
      },
      {
        queryKey: queryKeys.dashboardNotes,
        queryFn: () => getMeetings({}, { limit: 20, page: 1 }),
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
      },
    ],
  });

  const [
    tasksQuery,
    projectsQuery,
    meetingsQuery,
    filesQuery,
    transcriptsQuery,
    notesQuery,
  ] = queries;

  // Transform queries to DataState format
  const dashboardData: DashboardData = {
    tasks: {
      data: tasksQuery.data?.data || [],
      loading: tasksQuery.isLoading,
      error: tasksQuery.error ? (tasksQuery.error as Error).message : null,
    },
    projects: {
      data: projectsQuery.data?.data || [],
      loading: projectsQuery.isLoading,
      error: projectsQuery.error
        ? (projectsQuery.error as Error).message
        : null,
    },
    meetings: {
      data: meetingsQuery.data?.data || [],
      loading: meetingsQuery.isLoading,
      error: meetingsQuery.error
        ? (meetingsQuery.error as Error).message
        : null,
    },
    files: {
      data: filesQuery.data?.data || [],
      loading: filesQuery.isLoading,
      error: filesQuery.error ? (filesQuery.error as Error).message : null,
    },
    transcripts: {
      data: transcriptsQuery.data?.data?.slice(0, 10) || [],
      loading: transcriptsQuery.isLoading,
      error: transcriptsQuery.error
        ? (transcriptsQuery.error as Error).message
        : null,
    },
    notes: {
      data: notesQuery.data?.data?.slice(0, 10) || [],
      loading: notesQuery.isLoading,
      error: notesQuery.error ? (notesQuery.error as Error).message : null,
    },
  };

  return dashboardData;
};
