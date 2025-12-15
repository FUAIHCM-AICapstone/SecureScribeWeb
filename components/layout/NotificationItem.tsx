/**
 * Notification Item Component
 * Displays a single notification with entity data fetching
 */

import React from 'react';
import { Badge, Skeleton } from '@fluent-ui/react-components';
import type { NotificationResponse } from 'types/notification.type';
import { useEnrichedNotificationPayload } from '@/lib/notifications/useNotificationEntities';
import { parseNotification } from '@/lib/notifications/parseNotification';

interface NotificationItemProps {
  notification: NotificationResponse;
  t: (key: string) => string;
  onToggleRead: (id: string) => void;
  onDelete?: (id: string) => void;
}

const notificationItemStyles = {
  wrapper: {
    padding: '12px 16px',
    borderBottom: '1px solid var(--colorNeutralStroke2)',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'var(--colorNeutralBackground2)',
    },
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    marginBottom: '4px',
  } as React.CSSProperties,
  title: {
    fontWeight: 600,
    fontSize: '14px',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,
  message: {
    fontSize: '13px',
    color: 'var(--colorNeutralForeground2)',
    marginBottom: '4px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  } as React.CSSProperties,
  timestamp: {
    fontSize: '11px',
    color: 'var(--colorNeutralForeground3)',
  } as React.CSSProperties,
  skeletonLine: {
    marginBottom: '8px',
  } as React.CSSProperties,
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  t,
  onToggleRead,
  onDelete,
}) => {
  // Fetch entity data if needed (meeting_id, project_id, etc.)
  const { enrichedPayload, isLoading } = useEnrichedNotificationPayload(
    notification.payload
  );

  // Parse notification with enriched data
  const enrichedNotification: NotificationResponse = {
    ...notification,
    payload: enrichedPayload,
  };

  const parsed = parseNotification(enrichedNotification, t);

  if (isLoading) {
    return (
      <div style={{ ...notificationItemStyles.wrapper, cursor: 'default' }}>
        <Skeleton
          appearance="line"
          style={{ ...notificationItemStyles.skeletonLine, width: '200px', height: '16px' }}
        />
        <Skeleton
          appearance="line"
          style={{ ...notificationItemStyles.skeletonLine, width: '300px', height: '14px' }}
        />
        <Skeleton
          appearance="line"
          style={{ width: '100px', height: '12px' }}
        />
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleRead(notification.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(notification.id);
  };

  return (
    <div
      style={notificationItemStyles.wrapper}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as any);
        }
      }}
    >
      <div style={notificationItemStyles.header}>
        <span style={notificationItemStyles.title}>{parsed.title}</span>
        {!notification.is_read && (
          <Badge appearance="filled" color="brand" size="small">
            New
          </Badge>
        )}
      </div>
      <div style={notificationItemStyles.message}>{parsed.message}</div>
      <div style={notificationItemStyles.timestamp}>
        {new Date(notification.created_at).toLocaleString()}
      </div>
    </div>
  );
};

export default NotificationItem;
