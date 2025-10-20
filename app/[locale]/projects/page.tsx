import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { ProjectsPageClient } from './components/ProjectsPageClient';
import { queryKeys } from '@/lib/queryClient';
import { getProjects } from '@/services/api/project';

export default async function ProjectsPage() {
  const queryClient = new QueryClient();

  // Prefetch initial data for faster page load
  await queryClient.prefetchQuery({
    queryKey: [...queryKeys.projects, {}, { page: 1, limit: 12 }],
    queryFn: () => getProjects({}, { page: 1, limit: 12 }),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectsPageClient />
    </HydrationBoundary>
  );
}
