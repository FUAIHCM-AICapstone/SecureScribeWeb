/**
 * Notification Display Component with Entity Fetching
 * Fetches meeting, project, task, user data to display names instead of IDs
 */

import React from 'react';
import { Skeleton } from '@fluentui/react-components';
import type { NotificationResponse } from 'types/notification.type';
import { parseNotification } from '@/lib/notifications/parseNotification';
import { useEnrichedNotificationPayload } from '@/lib/notifications/useNotificationEntities';

export interface NotificationDisplayProps {
  notification: NotificationResponse;
  t: (key: string, variables?: Record<string, any>) => string;
}

/**
 * Displays a single notification with fetched entity data
 * Handles loading and error states gracefully
 */
export const NotificationDisplay: React.FC<NotificationDisplayProps> = ({
  notification,
  t,
}) => {
  const { enrichedPayload, isLoading } = useEnrichedNotificationPayload(
    notification.payload
  );

  // Create a notification with enriched payload for parsing
  const enrichedNotification: NotificationResponse = {
    ...notification,
    payload: enrichedPayload,
  };

  const parsed = parseNotification(enrichedNotification, t);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Skeleton appearance="opaque" style={{ width: '200px', height: '16px' }} />
        <Skeleton appearance="opaque" style={{ width: '300px', height: '14px' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ fontWeight: 600, fontSize: '14px' }}>
        {parsed.title}
      </div>
      <div style={{ fontSize: '13px', color: '#424242' }}>
        {parsed.message}
      </div>
    </div>
  );
};

/**
 * Parse notification with entity enrichment
 * Returns title and message with proper entity names instead of IDs
 */
export const getNotificationDisplayWithEntities = async (
  notification: NotificationResponse,
  t: (key: string) => string,
  enrichedPayload?: Record<string, any>
): Promise<{ title: string; message: string }> => {
  const finalPayload = enrichedPayload || notification.payload;
  
  const enrichedNotification: NotificationResponse = {
    ...notification,
    payload: finalPayload,
  };

  const parsed = parseNotification(enrichedNotification, t);
  return {
    title: parsed.title,
    message: parsed.message,
  };
};
