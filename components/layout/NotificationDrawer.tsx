'use client';

import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerHeaderTitle,
} from '@/lib/components';
import type { NotificationResponse } from 'types/notification.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import {
  markNotificationAsRead,
  markNotificationAsUnread,
  deleteNotification,
} from '@/services/api/notification';
import { showToast } from '@/hooks/useShowToast';
import { NotificationItem } from './NotificationItem';
import { useNotificationStyles } from './Header.styles';

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: NotificationResponse[];
  isLoading: boolean;
  error: any;
  unreadCount: number;
  t: any;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  open,
  onOpenChange,
  notifications,
  isLoading,
  error,
  unreadCount,
  t,
}) => {
  const styles = useNotificationStyles();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      if (isRead) {
        return await markNotificationAsUnread(id);
      } else {
        return await markNotificationAsRead(id);
      }
    },
    onMutate: async ({ id, isRead }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      const previousNotifications = queryClient.getQueryData(queryKeys.notifications);

      queryClient.setQueryData(
        queryKeys.notifications,
        (old: NotificationResponse[] | undefined) => {
          if (!old) return old;
          return old.map((n) => (n.id === id ? { ...n, is_read: !isRead } : n));
        },
      );

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
      showToast('error', t('failedToUpdateNotification'));
    },
    onSuccess: (data, { isRead }) => {
      showToast(
        isRead ? 'info' : 'success',
        isRead ? t('markedAsUnread') : t('markedAsRead'),
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications.filter((n) => !n.is_read);
      await Promise.all(unreadNotifications.map((n) => markNotificationAsRead(n.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      showToast('success', t('markAllAsRead'));
      onOpenChange(false);
    },
    onError: (error: any) => {
      showToast('error', error.message || t('failedToMarkAsRead'));
    },
  });

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      await Promise.all(notifications.map((n) => deleteNotification(n.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      showToast('success', t('deleteSuccess'));
      onOpenChange(false);
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      showToast('error', error.message || t('failedToDeleteNotifications'));
    },
  });

  return (
    <Drawer
      open={open}
      position="end"
      onOpenChange={(_, data) => onOpenChange(!!data.open)}
    >
      <DrawerHeader>
        <DrawerHeaderTitle>{t('notifications')}</DrawerHeaderTitle>
      </DrawerHeader>
      <DrawerBody>
        <div className={styles.drawerList}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {t('loadingNotifications')}
            </div>
          ) : error ? (
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                color: 'var(--colorStatusDangerForeground1)',
              }}
            >
              {error.message || t('failedToLoadNotifications')}
            </div>
          ) : notifications.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                color: 'var(--colorNeutralForeground3)',
              }}
            >
              {t('noNotifications')}
            </div>
          ) : (
            notifications.map((n: NotificationResponse) => (
              <NotificationItem
                key={n.id}
                notification={n}
                t={t}
                onToggleRead={(id) => {
                  const target = notifications.find((x) => x.id === id);
                  if (target) toggleReadMutation.mutate({ id, isRead: target.is_read });
                }}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>
      </DrawerBody>
      <DrawerFooter>
        {unreadCount > 0 ? (
          <Button
            appearance="secondary"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
          >
            {t('markAllAsRead')}
          </Button>
        ) : notifications.length > 0 ? (
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={(_, data) => setIsDeleteDialogOpen(data.open)}
          >
            <DialogTrigger disableButtonEnhancement>
              <Button
                appearance="secondary"
                disabled={deleteAllNotificationsMutation.isPending}
              >
                {t('deleteHistory')}
              </Button>
            </DialogTrigger>
            <DialogSurface>
              <DialogBody>
                <DialogTitle>{t('deleteHistory')}</DialogTitle>
                <DialogContent>{t('confirmDeleteHistory')}</DialogContent>
                <DialogActions>
                  <DialogTrigger disableButtonEnhancement>
                    <Button appearance="secondary">{t('cancel')}</Button>
                  </DialogTrigger>
                  <Button
                    appearance="primary"
                    onClick={() => deleteAllNotificationsMutation.mutate()}
                    disabled={deleteAllNotificationsMutation.isPending}
                  >
                    {t('delete')}
                  </Button>
                </DialogActions>
              </DialogBody>
            </DialogSurface>
          </Dialog>
        ) : null}
        <Button appearance="secondary" onClick={() => onOpenChange(false)}>
          {t('close')}
        </Button>
      </DrawerFooter>
    </Drawer>
  );
};
