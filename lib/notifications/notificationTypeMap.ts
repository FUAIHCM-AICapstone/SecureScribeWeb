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
    translationKey: 'notification.user_joined_project',
    icon: 'UserAdd',
    payloadFields: ['user_name', 'project_name'],
  },
  added_to_project: {
    translationKey: 'notification.added_to_project',
    icon: 'PersonAdd',
    payloadFields: ['added_by_name', 'project_name'],
  },
  user_removed_project: {
    translationKey: 'notification.user_removed_project',
    icon: 'PersonRemove',
    payloadFields: ['user_name', 'project_name'],
  },
  removed_from_project: {
    translationKey: 'notification.removed_from_project',
    icon: 'Warning',
    payloadFields: ['removed_by_name', 'project_name'],
  },

  // Task-related notifications
  task_assigned: {
    translationKey: 'notification.task_assigned',
    icon: 'CheckmarkCircle',
    payloadFields: ['task_title', 'assigned_by_name'],
  },
  task_updated: {
    translationKey: 'notification.task_updated',
    icon: 'Edit',
    payloadFields: ['task_title', 'new_status'],
  },

  // File-related notifications
  'task.file_indexing.completed': {
    translationKey: 'notification.file_indexing_completed',
    icon: 'DocumentSearch',
    payloadFields: ['filename', 'meeting_name'],
  },
  'task.file_indexing.failed': {
    translationKey: 'notification.task_file_indexing_failed',
    icon: 'ErrorCircle',
    payloadFields: ['filename', 'meeting_name'],
  },

  // Audio processing notifications
  audio_processing_completed: {
    translationKey: 'notification.audio_processing_completed',
    icon: 'Speaker1',
    payloadFields: ['meeting_name'],
  },

  // Chat processing notifications
  'task.chat_processing.completed': {
    translationKey: 'notification.chat_processing_completed',
    icon: 'Chat',
    payloadFields: ['meeting_name'],
  },
  'task.chat_processing.failed': {
    translationKey: 'notification.task_chat_processing_failed',
    icon: 'ErrorCircle',
    payloadFields: ['meeting_name'],
  },

  // Meeting analysis notifications
  'task.meeting_analysis.completed': {
    translationKey: 'notification.meeting_analysis_completed',
    icon: 'DocumentAnalytics',
    payloadFields: ['meeting_name', 'tasks_count', 'note_length'],
  },
  'task.meeting_analysis.failed': {
    translationKey: 'notification.task_meeting_analysis_failed',
    icon: 'ErrorCircle',
    payloadFields: ['meeting_name'],
  },

  // Meeting notifications
  meeting_reminder: {
    translationKey: 'notification.meeting_reminder',
    icon: 'Calendar',
    payloadFields: ['title'],
  },

  // Bot notifications
  bot_status_update: {
    translationKey: 'notification.bot_status_update',
    icon: 'Bot',
    payloadFields: ['status', 'message'],
  },

  // System notifications
  system_announcement: {
    translationKey: 'notification.system_announcement',
    icon: 'Info',
    payloadFields: ['message'],
  },
  maintenance: {
    translationKey: 'notification.maintenance',
    icon: 'Wrench',
    payloadFields: ['duration'],
  },

  // General notifications
  project_update: {
    translationKey: 'notification.project_update',
    icon: 'FolderOpen',
    payloadFields: ['project_name'],
  },
  comment_reply: {
    translationKey: 'notification.comment_reply',
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
      translationKey: 'notification.generic',
      icon: 'Bell',
      payloadFields: [],
    };
  }

  return (
    notificationTypeMap[type] || {
      translationKey: 'notification.generic',
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
