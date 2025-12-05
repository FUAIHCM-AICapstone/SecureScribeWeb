/**
 * Notification Type Mapper
 * Maps backend notification types to frontend translation keys and metadata
 */

export interface NotificationTypeConfig {
  translationKey: string;
  icon: string;
  payloadFields: string[]; // Fields to extract from payload for interpolation
}

export const notificationTypeMap: Record<string, NotificationTypeConfig> = {
  // Project-related notifications
  user_joined_project: {
    translationKey: 'notifications.user_joined_project',
    icon: 'UserAdd',
    payloadFields: ['user_name', 'project_name'],
  },
  added_to_project: {
    translationKey: 'notifications.added_to_project',
    icon: 'PersonAdd',
    payloadFields: ['added_by_name', 'project_name'],
  },
  user_removed_project: {
    translationKey: 'notifications.user_removed_project',
    icon: 'PersonRemove',
    payloadFields: ['user_name', 'project_name'],
  },
  removed_from_project: {
    translationKey: 'notifications.removed_from_project',
    icon: 'Warning',
    payloadFields: ['removed_by_name', 'project_name'],
  },

  // Task-related notifications
  task_assigned: {
    translationKey: 'notifications.task_assigned',
    icon: 'CheckmarkCircle',
    payloadFields: ['task_title', 'assigned_by'],
  },
  task_updated: {
    translationKey: 'notifications.task_updated',
    icon: 'Edit',
    payloadFields: ['task_title', 'new_status'],
  },

  // File-related notifications
  'task.file_indexing.completed': {
    translationKey: 'notifications.file_indexing_completed',
    icon: 'DocumentSearch',
    payloadFields: ['filename'],
  },

  // Meeting notifications
  meeting_reminder: {
    translationKey: 'notifications.meeting_reminder',
    icon: 'Calendar',
    payloadFields: ['title'],
  },

  // Bot notifications
  bot_status_update: {
    translationKey: 'notifications.bot_status_update',
    icon: 'Bot',
    payloadFields: ['status', 'message'],
  },

  // System notifications
  system_announcement: {
    translationKey: 'notifications.system_announcement',
    icon: 'Info',
    payloadFields: ['message'],
  },
  maintenance: {
    translationKey: 'notifications.maintenance',
    icon: 'Wrench',
    payloadFields: ['duration'],
  },

  // General notifications
  project_update: {
    translationKey: 'notifications.project_update',
    icon: 'FolderOpen',
    payloadFields: ['project_name'],
  },
  comment_reply: {
    translationKey: 'notifications.comment_reply',
    icon: 'Chat',
    payloadFields: ['user_name', 'content'],
  },
};

/**
 * Get notification config by type
 */
export const getNotificationConfig = (type?: string): NotificationTypeConfig => {
  if (!type) {
    return {
      translationKey: 'notifications.generic',
      icon: 'Bell',
      payloadFields: [],
    };
  }

  return (
    notificationTypeMap[type] || {
      translationKey: 'notifications.generic',
      icon: 'Bell',
      payloadFields: [],
    }
  );
};

/**
 * Get default icon for notification type
 */
export const getNotificationIcon = (type?: string): string => {
  return getNotificationConfig(type).icon;
};

/**
 * Get translation key for notification type
 */
export const getNotificationTranslationKey = (type?: string): string => {
  return getNotificationConfig(type).translationKey;
};

/**
 * Get payload fields to extract for this notification type
 */
export const getNotificationPayloadFields = (type?: string): string[] => {
  return getNotificationConfig(type).payloadFields;
};
