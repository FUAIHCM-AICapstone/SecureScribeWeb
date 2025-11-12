'use client';

import { useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { showToast, showNotificationToast } from '@/hooks/useShowToast';
import { queryKeys } from '@/lib/queryClient';
import { WebSocketMessage } from 'types/websocket.type';

/**
 * Hook for handling incoming WebSocket messages
 * Routes messages to type-specific handlers
 * Handles query invalidation, notifications, and UI updates
 */
export function useWebSocketMessageHandlers(
    wsRef: React.MutableRefObject<WebSocket | null>,
    setLastMessage: React.Dispatch<React.SetStateAction<WebSocketMessage | null>>
) {
    const t = useTranslations('MeetingDetail');
    const tNotifications = useTranslations('notifications');
    const queryClient = useQueryClient();
    const { logout } = useAuth();

    const handleTaskProgress = useCallback((progressData: any) => {
        const taskTypeKey = progressData?.task_type || 'unknown';
        const taskTypeDisplay = t(`taskTypes.${taskTypeKey}`, { defaultValue: progressData?.task_type || 'Task' });

        if (progressData?.status === 'completed') {
            showToast('success', t('taskMessages.taskCompleted', { taskType: taskTypeDisplay }));
        } else if (progressData?.status === 'failed' || progressData?.status === 'error') {
            showToast('error', t('taskMessages.taskFailed', { taskType: taskTypeDisplay }));
        } else if (progressData?.status === 'running' && progressData?.progress === 0) {
            showToast('info', t('taskMessages.taskStarted', { taskType: taskTypeDisplay }));
        }
    }, [t]);

    const handleNotification = useCallback((notificationData: any) => {
        const eventType = notificationData?.payload?.event_type || notificationData?.notification_type;

        if (eventType) {
            try {
                const notificationText = tNotifications(eventType, notificationData.payload);
                showNotificationToast(notificationText);
            } catch {
                const fallbackText = notificationData?.payload?.message || notificationData?.message || 'New notification';
                showNotificationToast(fallbackText);
            }
        } else {
            const fallbackText = notificationData?.payload?.message || notificationData?.message || 'New notification';
            showNotificationToast(fallbackText);
        }

        queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    }, [tNotifications, queryClient]);

    const handleUserJoined = useCallback((messageData: any) => {
        let notificationMessage: string;
        try {
            notificationMessage = tNotifications('user_joined_project', {
                user_name: messageData.user_name || 'Someone',
                project_name: messageData.project_name || `Project ${messageData.project_id.slice(0, 8)}...`,
            });
        } catch {
            notificationMessage = `${messageData.user_name || 'A user'} joined ${messageData.project_name || 'a project'}`;
        }
        showNotificationToast(notificationMessage);

        // Invalidate project-related queries
        if (messageData?.project_id) {
            queryClient.invalidateQueries({ queryKey: queryKeys.project(messageData.project_id) });
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.projects });
        queryClient.invalidateQueries({ queryKey: queryKeys.users });
        queryClient.invalidateQueries({ queryKey: queryKeys.searchUsers('') });
    }, [tNotifications, queryClient]);

    const handleUserRemoved = useCallback((messageData: any) => {
        let notificationMessage: string;
        try {
            notificationMessage = tNotifications('user_removed_project', {
                user_name: messageData.user_name || 'Someone',
                project_name: messageData.project_name || `Project ${messageData.project_id.slice(0, 8)}...`,
                is_self_removal: messageData.is_self_removal || false,
            });
        } catch {
            const action = messageData.is_self_removal ? 'left' : 'was removed from';
            notificationMessage = `${messageData.user_name || 'A user'} ${action} ${messageData.project_name || 'a project'}`;
        }
        showNotificationToast(notificationMessage);

        // Invalidate project-related queries
        if (messageData?.project_id) {
            queryClient.invalidateQueries({ queryKey: queryKeys.project(messageData.project_id) });
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.projects });
        queryClient.invalidateQueries({ queryKey: queryKeys.users });
        queryClient.invalidateQueries({ queryKey: queryKeys.searchUsers('') });
    }, [tNotifications, queryClient]);

    const handleProjectMembershipChange = useCallback((messageData: any, isAdded: boolean) => {
        const message = messageData.message || (isAdded ? 'You were added to a project' : 'You were removed from a project');
        showNotificationToast(message);

        queryClient.invalidateQueries({ queryKey: queryKeys.projects });

        if (messageData?.project_id) {
            queryClient.invalidateQueries({ queryKey: queryKeys.project(messageData.project_id) });
        }
    }, [queryClient]);

    // Setup message listener
    useEffect(() => {
        const ws = wsRef.current;
        if (!ws) return;

        const handleMessage = (event: Event) => {
            const messageEvent = event as MessageEvent;
            try {
                const message = JSON.parse(messageEvent.data);
                
                // Colorful console log for debugging - log raw message
                console.log('%c🔵 WebSocket Message Received:', 'color: #3b82f6; font-weight: bold; font-size: 12px;', {
                    raw: messageEvent.data,
                    parsed: message,
                    timestamp: new Date().toISOString()
                });
                
                setLastMessage(message);

                // Route to type-specific handlers
                if (message.type === 'task_progress') {
                    handleTaskProgress(message.data);
                } else if (message.type === 'notification') {
                    handleNotification(message.data);
                } else if (message.type === 'user_joined') {
                    handleUserJoined(message.data);
                } else if (message.type === 'user_removed') {
                    handleUserRemoved(message.data);
                } else if (message.type === 'you_added_to_project') {
                    handleProjectMembershipChange(message.data, true);
                } else if (message.type === 'you_removed_from_project') {
                    handleProjectMembershipChange(message.data, false);
                } else if (message.type === 'unauthorized' || message.type === 'error') {
                    console.error('CRITICAL: WebSocket error or unauthorized - logging out');
                    logout();
                }
                // Silent handling for: pong, capabilities, connected (no action needed)
            } catch (error) {
                console.error('CRITICAL: Failed to parse WebSocket message:', error);
            }
        };

        ws.addEventListener('message', handleMessage);

        return () => {
            ws.removeEventListener('message', handleMessage);
        };
    }, [wsRef, setLastMessage, handleTaskProgress, handleNotification, handleUserJoined, handleUserRemoved, handleProjectMembershipChange, logout]);
}
