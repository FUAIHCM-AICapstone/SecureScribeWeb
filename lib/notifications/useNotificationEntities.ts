/**
 * Hook for fetching notification-related entities (meetings, projects, tasks, users)
 * Instead of displaying raw IDs, we fetch the entity data to show names/titles
 */

import { getMeeting } from '@/services/api/meeting';
import { getProject } from '@/services/api/project';
import { getTask } from '@/services/api/task';
import { getUser } from '@/services/api/user';
import { useQueries } from '@tanstack/react-query';

export interface EntityData {
  [key: string]: any;
}

/**
 * Maps entity ID field names to their display names
 */
const ENTITY_ID_MAPPINGS: Record<string, { fetch?: (id: string) => Promise<any>; displayField: string }> = {
  meeting_id: {
    fetch: getMeeting,
    displayField: 'title',
  },
  project_id: {
    fetch: getProject,
    displayField: 'name',
  },
  task_id: {
    fetch: getTask,
    displayField: 'title',
  },
  user_id: {
    fetch: getUser,
    displayField: 'name',
  },
  assigned_by: {
    fetch: getUser,
    displayField: 'name',
  },
  added_by_name: {
    displayField: 'added_by_name',
  },
};

/**
 * Extract entity IDs from payload that need to be fetched
 */
export const extractEntityIdsToFetch = (
  payload?: Record<string, any>
): Array<{ fieldName: string; id: string }> => {
  if (!payload) return [];

  const idsToFetch: Array<{ fieldName: string; id: string }> = [];

  Object.entries(ENTITY_ID_MAPPINGS).forEach(([fieldName, config]) => {
    const id = payload[fieldName];

    // Only fetch if ID exists and we have a fetch function
    if (id && config.fetch) {
      idsToFetch.push({ fieldName, id });
    }
  });

  return idsToFetch;
};

/**
 * Fetch entity data for all IDs in payload
 * Returns enriched payload with entity names instead of just IDs
 */
export const useNotificationEntities = (
  payload?: Record<string, any>
) => {
  const idsToFetch = extractEntityIdsToFetch(payload);

  // Use useQueries to fetch all entities in parallel
  const queries = useQueries({
    queries: idsToFetch.map(({ fieldName, id }) => {
      const config = ENTITY_ID_MAPPINGS[fieldName];

      return {
        queryKey: [fieldName, id],
        queryFn: () => config.fetch!(id),
        enabled: !!id && !!config.fetch,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      };
    }),
  });

  // Build enriched payload with entity names
  const enrichedPayload: Record<string, any> = { ...payload };
  let isLoading = false;
  let error: Error | null = null;

  queries.forEach((query: any, index: number) => {
    const { fieldName } = idsToFetch[index];
    const config = ENTITY_ID_MAPPINGS[fieldName];

    if (query.isLoading) {
      isLoading = true;
    }

    if (query.error) {
      error = query.error as Error;
    }

    if (query.data && config.fetch) {
      // Create a name field for interpolation
      // e.g., meeting_id → meeting_name, project_id → project_name
      const nameFieldKey = fieldName.replace('_id', '_name');
      enrichedPayload[nameFieldKey] = query.data[config.displayField];
    }
  });

  return {
    enrichedPayload,
    isLoading,
    error,
    isSuccess: !isLoading && !error && idsToFetch.length > 0,
  };
};

/**
 * For use in components that need to await entity data
 * Returns enriched payload when all queries are complete
 */
export const useEnrichedNotificationPayload = (
  payload?: Record<string, any>
) => {
  const { enrichedPayload, isLoading, error } = useNotificationEntities(payload);

  return {
    enrichedPayload: isLoading ? payload : enrichedPayload,
    isLoading,
    error,
  };
};
