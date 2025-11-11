'use client';

import React, { useState } from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { SendRegular } from '@fluentui/react-icons';
import { sendNotifications } from '@/services/api/notification';
import { useAuth } from '@/context/AuthContext';

const useStyles = makeStyles({
    button: {
        minWidth: 'auto',
        backgroundColor: tokens.colorBrandBackground,
        color: tokens.colorNeutralForegroundOnBrand,
        ':hover': {
            backgroundColor: tokens.colorBrandBackgroundHover,
        },
    },
});

export const TestNotificationButton: React.FC = () => {
    const styles = useStyles();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleTestNotification = async () => {
        if (!user?.id) {
            console.error('User not logged in');
            return;
        }

        setIsLoading(true);

        try {
            // Hardcode test notification data with loud sound
            const notificationData = {
                user_ids: [user.id], // Send to current user
                type: 'test',
                payload: {
                    title: '🚨 LOUD TEST NOTIFICATION 🚨',
                    body: '🔊🔊🔊 THIS IS A LOUD TEST FCM NOTIFICATION WITH SOUND! 🔊🔊🔊',
                    icon: 'https://mom.meobeo.ai/images/logos/logo.png',
                    badge: 'https://mom.meobeo.ai/images/logos/logo.png',
                    data: {
                        url: window.location.origin,
                        action: 'test_notification'
                    },
                    // Additional loud notification settings
                    sound: 'default', // Use default system sound
                    priority: 'high', // High priority for louder notifications
                    ttl: 86400 // Time to live: 24 hours
                },
                channel: 'push'
            };

            console.log('Sending test notification:', notificationData);

            const result = await sendNotifications(notificationData);
            console.log('Test notification sent successfully:', result);

            // Note: FCM notification will be handled automatically by the service worker
            // No need to show toast as the push notification will appear

        } catch (error) {
            console.error('Failed to send test notification:', error);
            // Could show error toast here if needed
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            appearance="primary"
            size="small"
            icon={<SendRegular />}
            onClick={handleTestNotification}
            disabled={isLoading || !user?.id}
            className={styles.button}
            title="Send Test FCM Notification"
        >
            {isLoading ? 'Sending...' : 'Test Notify'}
        </Button>
    );
};
