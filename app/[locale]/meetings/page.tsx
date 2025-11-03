import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { MeetingsPageClient } from './components/MeetingsPageClient';
import { queryKeys } from '@/lib/queryClient';
import { getMeetings } from '@/services/api/meeting';
import { getProjects } from '@/services/api/project';

export default async function MeetingsPage() {
  const queryClient = new QueryClient();

  // Prefetch initial data for faster page load
  await Promise.all([
    // Prefetch projects for filter dropdown
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.projects],
      queryFn: () => getProjects({}, { limit: 100 }),
      staleTime: 10 * 60 * 1000,
    }),
    // Prefetch first page of meetings
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.meetings, {}, { page: 1, limit: 10 }],
      queryFn: () => getMeetings({}, { page: 1, limit: 10 }),
      staleTime: 5 * 60 * 1000,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MeetingsPageClient />
    </HydrationBoundary>
  );
}
