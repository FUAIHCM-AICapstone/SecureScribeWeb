'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getProject } from '@/services/api/project';
import { getMeeting } from '@/services/api/meeting';
import { getFile } from '@/services/api/file';
import { queryKeys } from '@/lib/queryClient';
import type { Mention } from 'types/chat.type';

export function usePrefetchMentions(mentions?: Mention[] | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!mentions || mentions.length === 0) return;

    // Group mentions by type for better organization
    const groupedMentions = mentions.reduce((acc, mention) => {
      const type = mention.entity_type as 'project' | 'meeting' | 'file';
      if (!acc[type]) acc[type] = [];
      acc[type].push(mention.entity_id);
      return acc;
    }, {} as Record<'project' | 'meeting' | 'file', string[]>);

    // Prefetch projects
    if (groupedMentions.project) {
      groupedMentions.project.forEach((id) => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.project(id),
          queryFn: () => getProject(id),
          staleTime: 5 * 60 * 1000,
        });
      });
    }

    // Prefetch meetings
    if (groupedMentions.meeting) {
      groupedMentions.meeting.forEach((id) => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.meeting(id),
          queryFn: () => getMeeting(id),
          staleTime: 5 * 60 * 1000,
        });
      });
    }

    // Prefetch files
    if (groupedMentions.file) {
      groupedMentions.file.forEach((id) => {
        queryClient.prefetchQuery({
          queryKey: queryKeys.file(id),
          queryFn: () => getFile(id),
          staleTime: 5 * 60 * 1000,
        });
      });
    }
  }, [mentions, queryClient]);
}
