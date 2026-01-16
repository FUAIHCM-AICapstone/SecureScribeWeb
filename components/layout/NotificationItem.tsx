/**
 * Notification Item Component
 * Displays a single notification
 */

import { parseNotification } from '@/lib/notifications/parseNotification';
import { Badge } from '@/lib/components';
import React from 'react';
import type { NotificationResponse } from 'types/notification.type';

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDelete,
}) => {
  // Parse notification directly without entity fetching
  const parsed = parseNotification(notification, t);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleRead(notification.id);
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
