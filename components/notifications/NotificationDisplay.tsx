/**
 * Notification Display Component
 * Displays a single notification
 */

import React from 'react';
import type { NotificationResponse } from 'types/notification.type';
import { parseNotification } from '@/lib/notifications/parseNotification';

export interface NotificationDisplayProps {
  notification: NotificationResponse;
  t: (key: string, variables?: Record<string, any>) => string;
}

/**
 * Displays a single notification
 */
export const NotificationDisplay: React.FC<NotificationDisplayProps> = ({
  notification,
  t,
}) => {
  const parsed = parseNotification(notification, t);

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
 * Parse notification for display
 * Returns title and message directly
 */
export const getNotificationDisplay = (
  notification: NotificationResponse,
  t: (key: string) => string
): { title: string; message: string } => {
  const parsed = parseNotification(notification, t);
  return {
    title: parsed.title,
    message: parsed.message,
  };
};
