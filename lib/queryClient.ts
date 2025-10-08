import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            refetchOnWindowFocus: true, // Refetch data when window regains focus
            staleTime: 2 * 60 * 1000, // 2 minutes for dashboard data
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnMount: 'always', // Always refetch dashboard data on mount
            refetchOnReconnect: 'always',
        },
        mutations: {
            retry: 1,
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
    projectMeetings: (id: string) => ['projects', id, 'meetings'] as const,
    projectFiles: (id: string) => ['projects', id, 'files'] as const,

    meetings: ['meetings'] as const,
    personalMeetings: ['meetings', 'personal'] as const,
    meeting: (id: string) => ['meetings', id] as const,
    meetingFiles: (id: string) => ['meetings', id, 'files'] as const,

    files: ['files'] as const,
    file: (id: string) => ['files', id] as const,

    user: ['user'] as const,
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
    conversationMessages: (id: string) => ['chat', 'conversations', id, 'messages'] as const,
};

export default queryClient;
