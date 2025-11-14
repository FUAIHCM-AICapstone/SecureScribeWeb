'use client';

import { useEffect, useState, useCallback } from 'react';
import { messaging, getToken, onMessage, getVapidKey, isFirebaseReady } from '@/lib/firebase';
import { updateFCMToken } from '@/services/api/notification';
import { showToast, showNotificationToast } from '@/hooks/useShowToast';
import { getBrandConfig } from '@/lib/utils/runtimeConfig';

interface FCMState {
    token: string | null;
    permission: NotificationPermission;
    isLoading: boolean;
    error: string | null;
}

export const useFCM = () => {
    const [state, setState] = useState<FCMState>({
        token: null,
        permission: 'default',
        isLoading: false,
        error: null,
    });

    // Check if notifications are supported
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const isSupported = () => {
        return (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            'Notification' in window &&
            'PushManager' in window
        );
    };

    // Request notification permission
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!isSupported()) {
            setState(prev => ({
                ...prev,
                error: 'Notifications not supported in this browser',
            }));
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            setState(prev => ({ ...prev, permission }));

            if (permission === 'granted') {
                showToast('success', 'Notification permission granted');
                return true;
            } else {
                showToast('info', 'Notification permission denied');
                return false;
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            const errorMessage = 'Failed to request notification permission';
            setState(prev => ({ ...prev, error: errorMessage }));
            showToast('error', errorMessage);
            return false;
        }
    }, []);

    // Get FCM token
    const getFCMToken = useCallback(async (): Promise<string | null> => {
        if (!isFirebaseReady()) {
            setState(prev => ({
                ...prev,
                error: 'Firebase not initialized',
            }));
            return null;
        }

        if (!messaging) {
            setState(prev => ({
                ...prev,
                error: 'Firebase messaging not available',
            }));
            return null;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Register service worker if not already registered
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                console.log('Service Worker registered:', registration);
            }

            const vapidKey = getVapidKey();
            if (!vapidKey) {
                throw new Error('FCM VAPID key not configured');
            }

            const token = await getToken(messaging, {
                vapidKey: vapidKey,
            });

            if (token) {
                setState(prev => ({ ...prev, token, isLoading: false }));
                return token;
            } else {
                setState(prev => ({
                    ...prev,
                    error: 'Failed to get FCM token',
                    isLoading: false,
                }));
                return null;
            }
        } catch (error) {
            console.error('Error getting FCM token:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get FCM token';
            setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
            return null;
        }
    }, []);

    // Send FCM token to backend
    const sendTokenToBackend = useCallback(async (token: string) => {
        // Check if user is authenticated before sending token
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            console.log('User not authenticated, skipping FCM token registration');
            return;
        }

        try {
            const deviceName = navigator.userAgent;
            const deviceType = 'web';

            await updateFCMToken({
                device_name: deviceName,
                fcm_token: token,
                device_type: deviceType,
            });

            console.log('FCM token sent to backend successfully');
        } catch (error) {
            console.error('Error sending FCM token to backend:', error);
            showToast('error', 'Failed to register device for notifications');
        }
    }, []);

    // Initialize FCM - check permission status but don't auto-request
    const initializeFCM = useCallback(async () => {
        if (!isSupported()) {
            console.log('FCM not supported');
            return;
        }

        // Check current permission status
        const currentPermission = Notification.permission;
        setState(prev => ({ ...prev, permission: currentPermission }));

        // If permission is already granted, get token
        if (currentPermission === 'granted') {
            const token = await getFCMToken();
            if (token) {
                await sendTokenToBackend(token);
            }
        }
        // Don't auto-request permission - let user trigger it explicitly
    }, [getFCMToken, sendTokenToBackend]);

    // Manual permission request function
    const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
        if (!isSupported()) {
            setState(prev => ({
                ...prev,
                error: 'Notifications not supported in this browser',
            }));
            return false;
        }

        const currentPermission = Notification.permission;
        setState(prev => ({ ...prev, permission: currentPermission }));

        if (currentPermission === 'granted') {
            // Already granted, just get token
            const token = await getFCMToken();
            if (token) {
                await sendTokenToBackend(token);
            }
            return true;
        } else if (currentPermission === 'denied') {
            showToast('error', 'Notification permission was denied. Please enable notifications in your browser settings.');
            return false;
        } else {
            // Request permission
            const granted = await requestPermission();
            if (granted) {
                const token = await getFCMToken();
                if (token) {
                    await sendTokenToBackend(token);
                }
            }
            return granted;
        }
    }, [requestPermission, getFCMToken, sendTokenToBackend, isSupported]);

    // Set up foreground message handler
    useEffect(() => {
        if (!messaging || !isFirebaseReady()) return;

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Received foreground message:', payload);

            // Show notification with loud sound
            const notificationTitle = payload.notification?.title || 'New Message';
            const { logo: brandLogo } = getBrandConfig();
            const notificationOptions = {
                body: payload.notification?.body || 'You have a new message',
                icon: brandLogo,
                badge: brandLogo,
                data: payload.data,
                // Loud notification settings
                silent: false, // Ensure sound is played
                requireInteraction: true, // Keep notification visible until user interacts
                // Add vibration pattern for mobile devices
                vibrate: [200, 100, 200, 100, 200, 100, 400], // Strong vibration pattern
                // Note: actions are only supported for service worker notifications, not foreground
                tag: 'secure-scribe-notification', // Group similar notifications
            };

            // Check if we have permission to show notifications
            if (Notification.permission === 'granted') {
                const notification = new Notification(notificationTitle, notificationOptions);

                // Handle notification click (equivalent to 'view' action)
                notification.onclick = () => {
                    console.log('Foreground notification clicked');
                    notification.close();
                    // Focus on the app window
                    try {
                        window.focus();
                    } catch (error) {
                        console.warn('Could not focus window:', error);
                    }
                };

                // Handle notification close
                notification.onclose = () => {
                    console.log('Foreground notification closed');
                };

                // Handle notification error
                notification.onerror = (error) => {
                    console.error('Foreground notification error:', error);
                };

                // Auto close after 10 seconds if not interacted with
                setTimeout(() => {
                    notification.close();
                }, 10000);
            }

            // Also show in-app toast with sound
            showNotificationToast(`${notificationTitle}: ${notificationOptions.body}`);
        });

        return () => unsubscribe();
    }, []);

    // Initialize on mount
    useEffect(() => {
        initializeFCM();
    }, [initializeFCM]);

    // Watch for authentication changes and send FCM token when user logs in
    useEffect(() => {
        const checkAuthAndSendToken = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (accessToken && state.token && Notification.permission === 'granted') {
                console.log('User authenticated, sending FCM token to backend');
                await sendTokenToBackend(state.token);
            }
        };

        // Check immediately
        checkAuthAndSendToken();

        // Set up storage event listener for authentication changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'access_token' && e.newValue) {
                console.log('Access token added, checking FCM token registration');
                checkAuthAndSendToken();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [state.token, sendTokenToBackend]);

    return {
        ...state,
        requestPermission,
        requestNotificationPermission,
        getFCMToken,
        sendTokenToBackend,
        initializeFCM,
        isSupported: isSupported(),
    };
};
