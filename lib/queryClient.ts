import { QueryClient } from '@tanstack/react-query';

// Caching strategies for different data types
export const cacheConfig = {
  // Data that changes frequently (user-generated content, real-time)
  short: { staleTime: 30 * 1000, gcTime: 5 * 60 * 1000 },        // 30s stale, 5m GC
  // Data that changes occasionally (meetings, notes, agenda)
  medium: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },   // 5m stale, 30m GC
  // Data that rarely changes (transcripts, file lists, archived items)
  long: { staleTime: 1 * 60 * 60 * 1000, gcTime: 2 * 60 * 60 * 1000 }, // 1h stale, 2h GC
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false, // Don't refetch on window focus (prevent double calls)
      staleTime: cacheConfig.medium.staleTime, // 5 minutes default for general data caching
      gcTime: cacheConfig.medium.gcTime, // 30 minutes garbage collection
      refetchOnMount: false, // Don't auto-refetch on mount (rely on staleTime)
      refetchOnReconnect: false, // Don't auto-refetch on reconnect
      keepPreviousData: true, // ← CRITICAL: Shows previous data while fetching new data (eliminates UI flicker)
    },
    mutations: {
      retry: 0, // No retry for mutations (prevent accidental duplicates)
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});

// Query Keys for consistent caching
export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  projectMeetings: (id: string, page: number) => ['projects', id, 'meetings', page] as const,
  projectFiles: (id: string, page: number) => ['projects', id, 'files', page] as const,
  searchProjectMeetings: (id: string, search: string, page: number) => ['projects', id, 'meetings', 'search', search, page] as const,
  searchProjectFiles: (id: string, search: string, page: number) => ['projects', id, 'files', 'search', search, page] as const,

  meetings: ['meetings'] as const,
  personalMeetings: ['meetings', 'personal'] as const,
  meeting: (id: string) => ['meetings', id] as const,
  meetingFiles: (id: string) => ['meetings', id, 'files'] as const,
  meetingNote: (id: string) => ['meetings', id, 'note'] as const,
  meetingTasks: (id: string, page: number = 1) => ['tasks', { meeting_id: id, page }] as const,

  tasks: ['tasks'] as const,
  myTasks: ['tasks', 'my'] as const,
  task: (id: string) => ['tasks', id] as const,
  projectTasks: (id: string, page: number) => ['projects', id, 'tasks', page] as const,

  files: ['files'] as const,
  file: (id: string) => ['files', id] as const,

  // Bot queries
  bots: ['bots'] as const,
  botList: (page: number, limit: number, search?: string) => 
    search 
      ? ['bots', { page, limit, search }] as const
      : ['bots', { page, limit }] as const,
  bot: (id: string) => ['bots', id] as const,
  botLogs: (id: string) => ['bots', id, 'logs'] as const,

  user: ['user'] as const,
  users: ['users'] as const,
  userStats: ['user', 'stats'] as const,

  notifications: ['notifications'] as const,
  notification: (id: string) => ['notifications', id] as const,

  search: (query: string) => ['search', query] as const,
  searchProjects: (query: string) => ['search', 'projects', query] as const,
  searchMeetings: (query: string) => ['search', 'meetings', query] as const,
  searchFiles: (query: string) => ['search', 'files', query] as const,
  searchUsers: (query: string) => ['search', 'users', query] as const,

  // Chat queries
  conversations: ['chat', 'conversations'] as const,
  conversation: (id: string) => ['chat', 'conversations', id] as const,
  conversationMessages: (id: string) =>
    ['chat', 'conversations', id, 'messages'] as const,
};

export default queryClient;
