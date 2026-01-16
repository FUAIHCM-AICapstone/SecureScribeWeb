'use client';

import React, { useEffect, useState } from 'react';
import { messaging, onMessage, isFirebaseReady } from '@/lib/firebase';
import { showToast } from '@/hooks/useShowToast';

interface FCMState {
  token: string | null;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
}

/**
 * Firebase Initializer Component
 * Defers Firebase initialization by 2000ms to avoid blocking LCP
 * Loads Firebase messaging in background after initial page render
 */
export const FirebaseInitializer: React.FC<{
  onReady?: (state: FCMState) => void;
}> = ({ onReady }) => {
  const [state, setState] = useState<FCMState>({
    token: null,
    permission: 'default',
    isLoading: false,
    error: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Deferred Firebase initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isFirebaseReady()) {
        setState(prev => ({
          ...prev,
          error: 'Firebase not initialized',
        }));
        return;
      }

      // Check notification permission
      if ('Notification' in window) {
        setState(prev => ({
          ...prev,
          permission: Notification.permission as NotificationPermission,
        }));
      }

      setIsInitialized(true);
      onReady?.(state);
    }, 2000); // Defer 2s after page load

    return () => clearTimeout(timer);
  }, [onReady, state]);

  // Listen for FCM messages (only after init)
  useEffect(() => {
    if (!isInitialized || !messaging) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('FCM message received:', payload);
      showToast('info', payload.notification?.title || 'New notification');
    });

    return () => unsubscribe();
  }, [isInitialized]);

  // Return null - this is initialization-only component
  return null;
};

export default FirebaseInitializer;
