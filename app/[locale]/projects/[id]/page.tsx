import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { ProjectDetailClient } from './components/ProjectDetailClient';

type PageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  try {
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
