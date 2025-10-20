import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { FilesPageClient } from './components/FilesPageClient';
import { queryKeys } from '@/lib/queryClient';
import { getProjects } from '@/services/api/project';
import { getFiles } from '@/services/api/file';

export default async function FilesPage() {
  const queryClient = new QueryClient();

  // Prefetch initial data for faster page load
  await Promise.all([
    // Prefetch projects for filter dropdown
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.projects],
      queryFn: () => getProjects({}, { limit: 100 }),
      staleTime: 10 * 60 * 1000,
    }),
    // Prefetch first page of files
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.files, {}, { page: 1, limit: 12 }],
      queryFn: () => getFiles({}, { page: 1, limit: 12 }),
      staleTime: 5 * 60 * 1000,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilesPageClient />
    </HydrationBoundary>
  );
}
