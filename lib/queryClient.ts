import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false, // Don't refetch on window focus (prevent double calls)
      staleTime: 5 * 60 * 1000, // 5 minutes for general data caching
      gcTime: 15 * 60 * 1000, // 15 minutes garbage collection
      refetchOnMount: false, // Don't auto-refetch on mount (rely on staleTime)
      refetchOnReconnect: false, // Don't auto-refetch on reconnect
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

  tasks: ['tasks'] as const,
  myTasks: ['tasks', 'my'] as const,
  task: (id: string) => ['tasks', id] as const,
  projectTasks: (id: string, page: number) => ['projects', id, 'tasks', page] as const,

  files: ['files'] as const,
  file: (id: string) => ['files', id] as const,

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
