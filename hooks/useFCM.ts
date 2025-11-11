'use client';

import { useEffect, useState, useCallback } from 'react';
import { messaging, getToken, onMessage, getVapidKey, isFirebaseReady } from '@/lib/firebase';
import { updateFCMToken } from '@/services/api/notification';
import { showToast } from '@/hooks/useShowToast';
import { getBrandConfig } from '@/lib/utils/runtimeConfig';

// Function to play loud notification sound using Web Audio API
const playLoudNotificationSound = (power = 1.3) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

    const createOsc = (type: OscillatorType, freq: number) => {
        const o = ctx.createOscillator();
        o.type = type;
        o.frequency.value = freq;
        return o;
    };

    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const distort = ctx.createWaveShaper();
    const curve = new Float32Array(44100);
    for (let i = 0; i < curve.length; i++) {
        const x = (i / curve.length) * 2 - 1;
        curve[i] = x < 0 ? -(Math.pow(Math.abs(x), 0.4)) : Math.pow(x, 0.4);
    }
    distort.curve = curve;
    distort.connect(gain);

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -40;
    compressor.ratio.value = 15;
    compressor.attack.value = 0.001;
    compressor.release.value = 0.12;
    compressor.connect(distort);

    // High-tech pluck click
    (() => {
        const o = createOsc("triangle", 2200);
        const g = ctx.createGain();
        o.connect(g);
        g.connect(compressor);

        const now = ctx.currentTime;
        g.gain.setValueAtTime(0.8 * power, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        o.start(now);
        o.stop(now + 0.08);
    })();

    // Sweep chirp
    (() => {
        const o = createOsc("sawtooth", 900);
        const g = ctx.createGain();
        o.connect(g);
        g.connect(compressor);

        const now = ctx.currentTime + 0.03;
        o.frequency.setValueAtTime(900, now);
        o.frequency.exponentialRampToValueAtTime(2400, now + 0.22);

        g.gain.setValueAtTime(0.55 * power, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        o.start(now);
        o.stop(now + 0.22);
    })();

    // Sub punch
    (() => {
        const o = createOsc("sine", 120);
        const g = ctx.createGain();
        o.connect(g);
        g.connect(compressor);

        const now = ctx.currentTime + 0.05;
        o.frequency.setValueAtTime(160, now);
        o.frequency.exponentialRampToValueAtTime(70, now + 0.18);

        g.gain.setValueAtTime(0.9 * power, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        o.start(now);
        o.stop(now + 0.18);
    })();
};

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

                // Play additional loud sound using Web Audio API for maximum volume
                try {
                    playLoudNotificationSound();
                } catch (error) {
                    console.warn('Could not play additional notification sound:', error);
                }

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

            // Also show in-app toast
            showToast('info', `${notificationTitle}: ${notificationOptions.body}`);
        });

        return () => unsubscribe();
    }, []);

    // Initialize on mount
    useEffect(() => {
        initializeFCM();
    }, [initializeFCM]);

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
