/**
 * Notification Parser
 * Parses notification data and generates display-ready title/message
 */

import type { NotificationResponse } from 'types/notification.type';
import {
  getNotificationTranslationKey,
  getNotificationIcon,
  getNotificationPayloadFields,
} from './notificationTypeMap';

export interface ParsedNotification {
  title: string;
  message: string;
  icon: string;
  type: string;
  translationKey: string;
}

/**
 * Interpolate placeholders in text with values from payload
 * Example: "User {user_name} joined {project_name}" → "User John joined Project A"
 */
const interpolateText = (text: string, payload?: Record<string, any>): string => {
  if (!payload) return text;

  let result = text;
  // Match {placeholder} and replace with payload values
  const placeholderRegex = /\{([^}]+)\}/g;

  result = result.replace(placeholderRegex, (match, key) => {
    return String(payload[key] ?? match);
  });

  return result;
};

/**
 * Extract relevant payload fields for the notification type
 */
const extractPayloadContext = (
  type: string | undefined,
  payload?: Record<string, any>
): Record<string, any> => {
  if (!payload) return {};

  const fields = getNotificationPayloadFields(type);
  const context: Record<string, any> = {};

  fields.forEach((field) => {
    if (field in payload) {
      context[field] = payload[field];
    }
  });

  return context;
};

/**
 * Parse notification for display
 * Priority: translationKey → payload.message → fallback
 */
export const parseNotification = (
  notification: NotificationResponse,
  t: (key: string, variables?: Record<string, any>) => string
): ParsedNotification => {
  const { type, payload } = notification;

  // Get configuration for this notification type
  const translationKey = getNotificationTranslationKey(type);
  const icon = getNotificationIcon(type);

  // Extract relevant payload fields
  const payloadContext = extractPayloadContext(type, payload);

  // Determine title
  let title = '';
  
  // Try to get title from payload first (task_title, project_name, etc.)
  if (payload?.task_title) {
    title = payload.task_title;
  } else if (payload?.project_name) {
    title = payload.project_name;
  } else if (payload?.title) {
    title = payload.title;
  } else if (payload?.filename) {
    title = payload.filename;
  } else if (type) {
    title = type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.slice(1);
  } else {
    title = 'Notification';
  }

  // Determine message
  let message = '';

  // Priority 1: Try translation key with payload interpolation
  try {
    const translatedText = t(translationKey);
    // Check if translation was found (not same as key)
    if (translatedText !== translationKey) {
      message = interpolateText(translatedText, payloadContext);
    }
  } catch {
    // Translation failed, continue to fallbacks
  }

  // Priority 2: Use payload.message if translation not found
  if (!message && payload?.message) {
    message = String(payload.message);
  }

  // Priority 3: Use payload.description
  if (!message && payload?.description) {
    message = String(payload.description);
  }

  // Priority 4: Use payload.content
  if (!message && payload?.content) {
    message = String(payload.content);
  }

  // Priority 5: Fallback to notification type
  if (!message && type) {
    message = type.replace(/_/g, ' ');
  }

  // Priority 6: Generic fallback
  if (!message) {
    message = 'You have a new notification';
  }

  return {
    title,
    message,
    icon,
    type: type || 'notification',
    translationKey,
  };
};

/**
 * Get display info for notification (backward compatible with existing Header.tsx)
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
