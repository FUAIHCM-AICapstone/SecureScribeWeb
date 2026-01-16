'use client';

import { useQuery } from '@tanstack/react-query';
import { getProject } from '@/services/api/project';
import { getMeeting } from '@/services/api/meeting';
import { getFile } from '@/services/api/file';
import { queryKeys } from '@/lib/queryClient';
import type { MentionType } from 'types/chat.type';

interface UseMentionTitleResult {
  title: string;
  isLoading: boolean;
  isError: boolean;
}

export function useMentionTitle(
  entityType: MentionType,
  entityId: string
): UseMentionTitleResult {
  const placeholders: Record<MentionType, string> = {
    meeting: 'Meeting',
    project: 'Project',
    file: 'File',
  };

  const queryKey =
    entityType === 'project'
      ? queryKeys.project(entityId)
      : entityType === 'meeting'
      ? queryKeys.meeting(entityId)
      : queryKeys.file(entityId);

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        if (entityType === 'project') {
          const result = await getProject(entityId);
          const title = result.name || placeholders[entityType];
          return String(title); // Ensure it's always a string
        } else if (entityType === 'meeting') {
          const result = await getMeeting(entityId);
          const title = result.title || placeholders[entityType];
          return String(title); // Ensure it's always a string
        } else if (entityType === 'file') {
          const result = await getFile(entityId);
          const title = result.filename || placeholders[entityType];
          return String(title); // Ensure it's always a string
        }
        return placeholders[entityType];
      } catch (error) {
        console.error(`Failed to fetch ${entityType} title:`, error);
        return placeholders[entityType];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  return {
    title: String(data || placeholders[entityType]),
    isLoading,
    isError,
  };
}
