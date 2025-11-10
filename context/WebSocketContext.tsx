'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from './AuthContext';
import { getWebSocketUrl as buildWebSocketUrl } from '../services/api/notification';
import { showToast } from '@/hooks/useShowToast';
import { useTranslations } from 'next-intl';

interface WebSocketContextType {
    isConnected: boolean;
    lastMessage: any;
    connect: () => void;
    disconnect: () => void;
    sendMessage: (message: any) => void;
}

interface TaskProgressMessage {
    type: 'task_progress';
    data: {
        task_id: string;
        progress: number;
        status: string;
        estimated_time: string;
        last_update: string;
        task_type: string;
    };
}

interface NotificationMessage {
    type: 'notification';
    data: {
        notification_type: string;
        payload: any;
        channel: string;
        timestamp: number;
    };
}

type WebSocketMessage = TaskProgressMessage | NotificationMessage | { type: string; data: any };

const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    lastMessage: null,
    connect: () => { },
    disconnect: () => { },
    sendMessage: () => { },
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 1; // Only retry once
    const reconnectInterval = 10000; // 10 seconds delay
    const isConnectingRef = useRef(false); // Prevent multiple simultaneous connections
    const hasConnectedRef = useRef(false); // Track if we've ever successfully connected
    const { logout } = useAuth();
    const t = useTranslations('MeetingDetail');

    // Browser compatibility check
    useEffect(() => {
        const timestamp = new Date().toISOString();
        console.log(`🔍 [${timestamp}] WebSocket compatibility check:`);
        console.log(`🔍 [${timestamp}] Browser environment:`, {
            userAgent: navigator.userAgent,
            webSocketSupported: typeof WebSocket !== 'undefined',
            secureContext: window.isSecureContext,
            protocol: window.location.protocol,
            cookiesEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        });

        if (typeof WebSocket === 'undefined') {
            console.error(`🚫 [${timestamp}] CRITICAL: WebSocket is not supported in this browser!`);
            console.error(`🚫 [${timestamp}] Please use a modern browser that supports WebSocket API.`);
            showToast('error', 'WebSocket not supported in this browser');
            return;
        }

        if (!navigator.onLine) {
            console.warn(`⚠️ [${timestamp}] Browser reports offline status - WebSocket connection may fail`);
        }

        if (!window.isSecureContext && window.location.protocol === 'https:') {
            console.warn(`⚠️ [${timestamp}] Secure context mismatch detected`);
        }

        console.log(`✅ [${timestamp}] WebSocket compatibility check passed`);
    }, []);

    // Helper function to get readable WebSocket ready state
    const getReadyStateText = (readyState: number): string => {
        switch (readyState) {
            case WebSocket.CONNECTING: return 'CONNECTING';
            case WebSocket.OPEN: return 'OPEN';
            case WebSocket.CLOSING: return 'CLOSING';
            case WebSocket.CLOSED: return 'CLOSED';
            default: return `UNKNOWN(${readyState})`;
        }
    };

    // Helper function to get meaning of WebSocket close codes
    const getCloseCodeMeaning = (code: number): string => {
        switch (code) {
            case 1000: return 'Normal closure';
            case 1001: return 'Going away';
            case 1002: return 'Protocol error';
            case 1003: return 'Unsupported data';
            case 1004: return 'Reserved';
            case 1005: return 'No status received';
            case 1006: return 'Abnormal closure';
            case 1007: return 'Invalid frame payload data';
            case 1008: return 'Policy violation';
            case 1009: return 'Message too big';
            case 1010: return 'Missing extension';
            case 1011: return 'Internal error';
            case 1012: return 'Service restart';
            case 1013: return 'Try again later';
            case 1014: return 'Bad gateway';
            case 1015: return 'TLS handshake';
            case 4001: return 'Unauthorized (custom)';
            case 4002: return 'User not found (custom)';
            case 4003: return 'Forbidden (custom)';
            default: return `Unknown code: ${code}`;
        }
    };

    const getWebSocketUrl = useCallback(() => {
        const timestamp = new Date().toISOString();
        console.log(`🔗 [${timestamp}] Starting WebSocket URL generation using notification service...`);

        const token = Cookies.get('access_token');

        console.log(`🔗 [${timestamp}] WebSocket URL generation details:`, {
            currentLocation: window.location.href,
            currentProtocol: window.location.protocol,
            hasToken: !!token,
            tokenLength: token?.length,
            tokenPrefix: token ? token.substring(0, 10) + '...' : 'none',
            cookiesAvailable: typeof Cookies !== 'undefined',
            allCookies: Cookies.get() // Log all cookies for debugging
        });

        if (!token) {
            console.error(`🚫 [${timestamp}] CRITICAL: No access token found for WebSocket connection`);
            console.error(`🚫 [${timestamp}] Available cookies:`, Cookies.get());
            console.error(`🚫 [${timestamp}] Current location:`, window.location.href);
            return null;
        }

        // Use the WebSocket URL builder from notification service
        const wsUrl = buildWebSocketUrl(token);

        console.log(`🔗 [${timestamp}] Generated WebSocket URL via notification service:`, {
            fullUrl: wsUrl,
            urlParts: {
                protocol: wsUrl.startsWith('wss:') ? 'wss:' : 'ws:',
                hasAuth: wsUrl.includes('authorization='),
                urlLength: wsUrl.length
            }
        });

        // Validate URL format
        try {
            new URL(wsUrl);
            console.log(`✅ [${timestamp}] WebSocket URL validation passed`);
        } catch (urlError) {
            console.error(`🚫 [${timestamp}] INVALID WebSocket URL format:`, urlError);
            return null;
        }

        return wsUrl;
    }, []);

    const connect = useCallback(() => {
        const timestamp = new Date().toISOString();

        // Prevent multiple simultaneous connection attempts and only connect once
        if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN || hasConnectedRef.current) {
            console.log(`🔄 [${timestamp}] WebSocket connection skipped:`, {
                isConnecting: isConnectingRef.current,
                currentReadyState: wsRef.current?.readyState,
                hasConnectedBefore: hasConnectedRef.current,
                readyStateText: wsRef.current ? getReadyStateText(wsRef.current.readyState) : 'no connection'
            });
            return;
        }

        const wsUrl = getWebSocketUrl();
        if (!wsUrl) {
            console.error(`🚫 [${timestamp}] CRITICAL: Cannot create WebSocket URL - missing access token or API endpoint`);
            console.error(`🚫 [${timestamp}] Connection state:`, {
                isConnecting: isConnectingRef.current,
                hasConnected: hasConnectedRef.current,
                reconnectAttempts: reconnectAttempts.current
            });
            return;
        }

        try {
            console.log(`🔌 [${timestamp}] Attempting WebSocket connection...`);
            console.log(`🔌 [${timestamp}] Connection details:`, {
                url: wsUrl.replace(/authorization=Bearer\s[^&]*/, 'authorization=Bearer [REDACTED]'),
                browser: navigator.userAgent,
                supportsWebSocket: typeof WebSocket !== 'undefined',
                webSocketReadyStates: {
                    CONNECTING: WebSocket.CONNECTING,
                    OPEN: WebSocket.OPEN,
                    CLOSING: WebSocket.CLOSING,
                    CLOSED: WebSocket.CLOSED
                }
            });

            isConnectingRef.current = true;
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            // Add connection timeout
            const connectionTimeout = setTimeout(() => {
                if (ws.readyState === WebSocket.CONNECTING) {
                    console.error(`⏰ [${timestamp}] WebSocket connection timeout after 10 seconds`);
                    ws.close(1006, 'Connection timeout');
                }
            }, 10000);

            ws.onopen = () => {
                const timestamp = new Date().toISOString();
                console.log(`✅ [${timestamp}] WebSocket connected successfully!`);
                console.log(`✅ [${timestamp}] WebSocket connection details:`, {
                    url: ws.url,
                    protocol: ws.protocol,
                    extensions: ws.extensions,
                    readyState: ws.readyState,
                    readyStateText: getReadyStateText(ws.readyState),
                    binaryType: ws.binaryType,
                    bufferedAmount: ws.bufferedAmount,
                    connectionTime: timestamp
                });

                // Clear connection timeout
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }

                isConnectingRef.current = false;
                setIsConnected(true);
                hasConnectedRef.current = true;
                reconnectAttempts.current = 0;

                // Show success toast for connection
                showToast('success', 'Connected to server');

                // Send initial ping to keep connection alive
                setTimeout(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        console.log(`🏓 [${new Date().toISOString()}] Sending initial ping to keep connection alive`);
                        ws.send(JSON.stringify({ type: 'ping' }));
                    }
                }, 1000);
            };

            ws.onmessage = (event) => {
                try {
                    const message: WebSocketMessage = JSON.parse(event.data);
                    console.log('📨 WebSocket message received:', message);
                    console.log('📨 Raw message data:', event.data);

                    setLastMessage(message);

                    // Handle different message types
                    if (message.type === 'task_progress') {
                        console.log('📊 Task progress update:', message.data);
                        console.log('📊 Task ID in message:', message.data?.task_id);

                        // Show toast for task progress updates
                        const progressData = message.data;
                        const taskTypeKey = progressData?.task_type || 'unknown';
                        const taskTypeDisplay = t(`taskTypes.${taskTypeKey}`, { defaultValue: progressData?.task_type || 'Task' });
                        
                        if (progressData?.status === 'completed') {
                            showToast('success', t('taskMessages.taskCompleted', { taskType: taskTypeDisplay }));
                        } else if (progressData?.status === 'failed' || progressData?.status === 'error') {
                            showToast('error', t('taskMessages.taskFailed', { taskType: taskTypeDisplay }));
                        } else if (progressData?.status === 'running' && progressData?.progress === 0) {
                            showToast('info', t('taskMessages.taskStarted', { taskType: taskTypeDisplay }));
                        }
                    } else if (message.type === 'notification') {
                        console.log('🔔 Notification received:', message.data);
                        // Show notification as toast
                        const notificationData = message.data;
                        const messageText = notificationData?.payload?.message || notificationData?.message || 'New notification';
                        showToast('info', messageText);
                    } else if (message.type === 'pong') {
                        console.log('🏓 Pong received from server');
                        // No toast for pong - it's just a keep-alive
                    } else if (message.type === 'capabilities') {
                        console.log('⚙️ Server capabilities:', message.data);
                        // No toast for capabilities - internal server info
                    } else if (message.type === 'connected') {
                        console.log('🔗 WebSocket connection confirmed');
                        showToast('success', 'Connected to server');
                    } else if (message.type === 'unauthorized' || message.type === 'error') {
                        console.log('🚫 WebSocket unauthorized or error, logging out...');
                        showToast('error', 'Connection error - please log in again');
                        logout();
                        return;
                    }
                } catch (error) {
                    console.error('❌ Failed to parse WebSocket message:', error);
                }
            };

            ws.onclose = (event) => {
                const timestamp = new Date().toISOString();
                const closeReason = event.reason || 'No reason provided';

                console.log(`🔌 [${timestamp}] WebSocket connection closed`);
                console.log(`🔌 [${timestamp}] Close event details:`, {
                    code: event.code,
                    reason: closeReason,
                    wasClean: event.wasClean,
                    target: event.target,
                    codeMeaning: getCloseCodeMeaning(event.code),
                    connectionDuration: hasConnectedRef.current ?
                        `${Math.round((Date.now() - new Date().getTime()) / 1000)}s` : 'never connected',
                    webSocketState: {
                        readyState: ws.readyState,
                        url: ws.url,
                        bufferedAmount: ws.bufferedAmount
                    }
                });

                isConnectingRef.current = false;
                setIsConnected(false);
                wsRef.current = null;

                // Clear connection timeout
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }

                // Handle specific error codes
                if (event.code === 4001) {
                    console.log('🚫 WebSocket closed: Unauthorized (4001) - Invalid token, logging out...');
                    showToast('error', 'Session expired - please log in again');
                    logout();
                    return;
                } else if (event.code === 4002) {
                    console.log('🚫 WebSocket closed: User not found (4002), logging out...');
                    showToast('error', 'User account not found - please contact support');
                    logout();
                    return;
                } else if (event.code === 4003) {
                    console.log('🚫 WebSocket closed: Forbidden (4003), logging out...');
                    showToast('error', 'Access denied - please log in again');
                    logout();
                    return;
                } else if (event.code === 1006) {
                    console.log('🚫 WebSocket closed: Abnormal closure (1006) - Connection lost');
                    showToast('warning', 'Connection lost - attempting to reconnect');
                } else if (event.code === 1008) {
                    console.log('🚫 WebSocket closed: Policy violation (1008)');
                    showToast('error', 'Connection policy violation');
                } else if (event.code === 1011) {
                    console.log('🚫 WebSocket closed: Server error (1011)');
                    showToast('error', 'Server error - connection closed');
                } else if (event.reason?.includes('unauthorized') || event.reason?.includes('invalid')) {
                    console.log('🚫 WebSocket closed due to authentication issue, logging out...');
                    showToast('error', 'Authentication error - please log in again');
                    logout();
                    return;
                } else if (event.code !== 1000) {
                    // Other non-normal closures
                    showToast('warning', 'Connection closed unexpectedly');
                }

                // Only attempt to reconnect if not a normal closure and we haven't exceeded max attempts
                if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts && !hasConnectedRef.current) {
                    console.log(`🔄 Attempting to reconnect... (${reconnectAttempts.current + 1}/${maxReconnectAttempts})`);
                    reconnectAttempts.current++;

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                }
            };

            ws.onerror = (error) => {
                const timestamp = new Date().toISOString();
                console.error(`❌ [${timestamp}] WebSocket error occurred!`);
                console.error(`❌ [${timestamp}] Error details:`, {
                    error,
                    errorType: error?.type || 'unknown',
                    errorTarget: error?.target || 'unknown',
                    webSocketState: {
                        readyState: ws.readyState,
                        readyStateText: getReadyStateText(ws.readyState),
                        url: ws.url,
                        protocol: ws.protocol,
                        extensions: ws.extensions,
                        binaryType: ws.binaryType,
                        bufferedAmount: ws.bufferedAmount
                    },
                    connectionState: {
                        isConnecting: isConnectingRef.current,
                        hasConnected: hasConnectedRef.current,
                        reconnectAttempts: reconnectAttempts.current
                    },
                    browserInfo: {
                        userAgent: navigator.userAgent,
                        onLine: navigator.onLine,
                        cookieEnabled: navigator.cookieEnabled
                    },
                    networkInfo: {
                        protocol: window.location.protocol,
                        hostname: window.location.hostname,
                        port: window.location.port
                    }
                });

                // Try to get more specific error information
                if (error?.target && error.target instanceof WebSocket) {
                    console.error(`❌ [${timestamp}] WebSocket error on target:`, {
                        targetReadyState: error.target.readyState,
                        targetUrl: error.target.url,
                        targetProtocol: error.target.protocol
                    });
                }

                isConnectingRef.current = false;

                // Clear connection timeout on error
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }
            };

        } catch (error) {
            const timestamp = new Date().toISOString();
            console.error(`🚫 [${timestamp}] CRITICAL: Failed to create WebSocket connection!`);
            console.error(`🚫 [${timestamp}] Creation error details:`, {
                error,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                errorStack: error instanceof Error ? error.stack : 'No stack trace',
                browserSupport: {
                    webSocketSupported: typeof WebSocket !== 'undefined',
                    webSocketVersion: WebSocket ? 'Supported' : 'Not supported'
                },
                networkStatus: {
                    online: navigator.onLine,
                    connectionType: (navigator as any).connection?.effectiveType || 'unknown'
                }
            });
            isConnectingRef.current = false;
        }
    }, [getWebSocketUrl, logout]);

    const disconnect = useCallback(() => {
        const timestamp = new Date().toISOString();
        console.log(`🔌 [${timestamp}] Initiating WebSocket disconnection...`);
        console.log(`🔌 [${timestamp}] Current connection state:`, {
            isConnected: isConnected,
            isConnecting: isConnectingRef.current,
            hasConnected: hasConnectedRef.current,
            reconnectAttempts: reconnectAttempts.current,
            readyState: wsRef.current?.readyState,
            readyStateText: wsRef.current ? getReadyStateText(wsRef.current.readyState) : 'no connection'
        });

        if (reconnectTimeoutRef.current) {
            console.log(`🔌 [${timestamp}] Clearing reconnect timeout`);
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            console.log(`🔌 [${timestamp}] Closing WebSocket connection with code 1000 (Normal closure)`);
            wsRef.current.close(1000, 'Client disconnecting');
            wsRef.current = null;
        }

        isConnectingRef.current = false;
        setIsConnected(false);
        reconnectAttempts.current = 0;
        hasConnectedRef.current = false; // Reset connection flag

        console.log(`✅ [${timestamp}] WebSocket disconnection completed`);
    }, [isConnected]);

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            try {
                wsRef.current.send(JSON.stringify(message));
                console.log('📤 Message sent:', message);
            } catch (error) {
                console.error('❌ Failed to send message:', error);
            }
        } else {
            console.warn('⚠️ WebSocket not connected, cannot send message');
        }
    }, []);

    // Single unified connection management
    useEffect(() => {
        const timestamp = new Date().toISOString();
        const token = Cookies.get('access_token');

        console.log(`🔄 [${timestamp}] WebSocket useEffect triggered - checking connection state`);
        console.log(`🔄 [${timestamp}] Authentication state:`, {
            hasToken: !!token,
            tokenLength: token?.length,
            tokenPrefix: token ? token.substring(0, 10) + '...' : 'none'
        });
        console.log(`🔄 [${timestamp}] Connection state:`, {
            isConnected,
            isConnecting: isConnectingRef.current,
            hasConnected: hasConnectedRef.current,
            readyState: wsRef.current?.readyState,
            readyStateText: wsRef.current ? getReadyStateText(wsRef.current.readyState) : 'no connection',
            reconnectAttempts: reconnectAttempts.current
        });

        // Only connect if we have a token and haven't connected before
        if (token && !hasConnectedRef.current && !isConnected && wsRef.current?.readyState !== WebSocket.OPEN) {
            console.log(`🔌 [${timestamp}] Conditions met for connection - initializing WebSocket...`);
            connect();
        } else if (!token && isConnected) {
            console.log(`🚪 [${timestamp}] No token available but connected - disconnecting...`);
            disconnect();
        } else {
            console.log(`⏸️ [${timestamp}] Connection conditions not met - no action taken`);
        }

        // Cleanup on unmount
        return () => {
            if (wsRef.current) {
                console.log(`🧹 [${timestamp}] Component unmounting - cleaning up WebSocket connection...`);
                disconnect();
            }
        };
    }, [connect, disconnect, isConnected]); // Only depend on these

    const contextValue: WebSocketContextType = {
        isConnected,
        lastMessage,
        connect,
        disconnect,
        sendMessage,
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

// Custom hook for task progress monitoring
export const useTaskProgress = (taskId?: string) => {
    const { lastMessage, isConnected } = useWebSocket();
    const [taskProgress, setTaskProgress] = useState<Map<string, any>>(new Map());

    useEffect(() => {
        if (lastMessage?.type === 'task_progress') {
            const progressData = lastMessage.data;
            setTaskProgress(prev => new Map(prev.set(progressData.task_id, progressData)));
        }
    }, [lastMessage]);

    const getTaskProgress = useCallback((id: string) => {
        return taskProgress.get(id) || null;
    }, [taskProgress]);

    const getCurrentTaskProgress = useCallback(() => {
        if (!taskId) return null;

        // First try exact match
        const exactMatch = taskProgress.get(taskId);
        if (exactMatch) return exactMatch;

        // If no exact match, try to find a task that starts with the expected pattern
        // This handles cases where backend adds timestamp suffix (e.g., index_file_123_1234567890)
        for (const [storedTaskId, progressData] of taskProgress.entries()) {
            if (storedTaskId && typeof storedTaskId === 'string' && storedTaskId.startsWith(taskId)) {
                return progressData;
            }
        }

        return null;
    }, [taskId, taskProgress]);

    return {
        taskProgress,
        getTaskProgress,
        getCurrentTaskProgress,
        isConnected,
    };
};
