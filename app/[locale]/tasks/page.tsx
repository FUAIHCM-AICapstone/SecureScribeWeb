import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { TasksPageClient } from './components/TasksPageClient';
import { queryKeys } from '@/lib/queryClient';
import { getTasks } from '@/services/api/task';

export default async function TasksPage() {
  const queryClient = new QueryClient();

  // Prefetch initial data for faster page load
  await queryClient.prefetchQuery({
    queryKey: [...queryKeys.tasks, {}, { page: 1, limit: 10 }],
    queryFn: () => getTasks({}, { page: 1, limit: 10 }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TasksPageClient />
    </HydrationBoundary>
  );
}
