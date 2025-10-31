import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { getProject } from '@/services/api/project';
import { ProjectDetailClient } from './components/ProjectDetailClient';
import { notFound } from 'next/navigation';

type PageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  try {
    // Prefetch project data with members
    await queryClient.prefetchQuery({
      queryKey: queryKeys.project(id),
      queryFn: () => getProject(id, true),
    });

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectDetailClient projectId={id} />
      </HydrationBoundary>
    );
  } catch (error) {
    console.error('Failed to fetch project:', error);
    notFound();
  }
}
