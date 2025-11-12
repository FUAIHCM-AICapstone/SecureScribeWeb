'use client';

import { useCallback, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';
import { getWebSocketUrl as buildWebSocketUrl } from '@/services/api/notification';
import { WS_CONFIG } from 'types/websocket.type';

/**
 * Hook for managing WebSocket connection lifecycle
 * Handles connection establishment, disconnection, and message sending
 * Implements reconnection strategy with timeout handling
 */
export function useWebSocketConnection() {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttempts = useRef(0);
    const isConnectingRef = useRef(false);
    const hasConnectedRef = useRef(false);
    const connectionOpenTimeRef = useRef<number | null>(null);
    const immediateCloseAttemptsRef = useRef(0);
    const isLoggingOutRef = useRef(false);

    const { logout } = useAuth();

    const getWebSocketUrl = useCallback(() => {
        const token = Cookies.get('access_token');

        if (!token) {
            console.error('CRITICAL: No access token found for WebSocket connection');
            return null;
        }

        const wsUrl = buildWebSocketUrl(token);

        // Validate URL format
        try {
            new URL(wsUrl);
        } catch (urlError) {
            console.error('CRITICAL: INVALID WebSocket URL format:', urlError);
            return null;
        }

        return wsUrl;
    }, []);

    const connect = useCallback(() => {
        if (isConnectingRef.current || (wsRef.current?.readyState === WebSocket.OPEN)) {
            return;
        }

        const wsUrl = getWebSocketUrl();
        if (!wsUrl) {
            console.error('CRITICAL: Cannot create WebSocket URL - missing access token or API endpoint');
            return;
        }

        try {
            isConnectingRef.current = true;
            const ws = new WebSocket(wsUrl);
            wsRef.current = ws;

            // Add connection timeout
            const connectionTimeout = setTimeout(() => {
                if (ws.readyState === WebSocket.CONNECTING) {
                    console.error('CRITICAL: WebSocket connection timeout after 10 seconds');
                    ws.close(1006, 'Connection timeout');
                }
            }, WS_CONFIG.CONNECTION_TIMEOUT);

            ws.onopen = () => {
                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }

                isConnectingRef.current = false;
                setIsConnected(true);
                hasConnectedRef.current = true;
                reconnectAttempts.current = 0;
                connectionOpenTimeRef.current = Date.now();
                immediateCloseAttemptsRef.current = 0; 
                // Send initial ping to keep connection alive
                setTimeout(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'ping' }));
                    }
                }, WS_CONFIG.PING_INTERVAL);
            };

            ws.onclose = (event) => {
                isConnectingRef.current = false;
                setIsConnected(false);
                wsRef.current = null;

                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }

                // Log if WebSocket is closed before connection is established
                if (ws.readyState === WebSocket.CONNECTING) {
                    console.log('%c🔴 WebSocket Closed Before Connection Established:', 'color: #ef4444; font-weight: bold; font-size: 12px;', {
                        code: event.code,
                        reason: event.reason,
                        wasClean: event.wasClean,
                        timestamp: new Date().toISOString()
                    });
                }

                connectionOpenTimeRef.current = null;

                // Handle specific error codes
                if (event.code === 4001) {
                    console.error('CRITICAL: WebSocket closed - Unauthorized (4001) - Invalid token');
                    logout();
                    return;
                } else if (event.code === 4002) {
                    console.error('CRITICAL: WebSocket closed - User not found (4002)');
                    logout();
                    return;
                } else if (event.code === 4003) {
                    console.error('CRITICAL: WebSocket closed - Forbidden (4003)');
                    logout();
                    return;
                } else if (event.code === 1006) {
                    console.error('CRITICAL: WebSocket closed - Abnormal closure (1006) - Connection lost');
                } else if (event.code === 1008) {
                    console.error('CRITICAL: WebSocket closed - Policy violation (1008)');
                } else if (event.code === 1011) {
                    console.error('CRITICAL: WebSocket closed - Server error (1011)');
                } else if (event.reason?.includes('unauthorized') || event.reason?.includes('invalid')) {
                    console.error('CRITICAL: WebSocket closed due to authentication issue');
                    logout();
                    return;
                }

                // Only attempt to reconnect if not a normal closure and we haven't exceeded max attempts
                const shouldAttemptReconnect = event.code !== 1000 && reconnectAttempts.current < WS_CONFIG.MAX_RECONNECT_ATTEMPTS;

                if (shouldAttemptReconnect) {
                    // Special handling for immediate closes (connection opens then closes within 2 seconds)
                    if (connectionOpenTimeRef.current) {
                        // For immediate closes, ensure at least 3 attempts regardless of hasConnectedRef state
                        const minAttempts = 3;
                        if (immediateCloseAttemptsRef.current < minAttempts) {
                            immediateCloseAttemptsRef.current++;
                            reconnectAttempts.current++;

                            console.log(`%c🔄 Retrying immediate close... (${immediateCloseAttemptsRef.current}/${minAttempts})`, 'color: #f59e0b; font-weight: bold;');

                            reconnectTimeoutRef.current = setTimeout(() => {
                                connect();
                            }, WS_CONFIG.RECONNECT_INTERVAL);
                            return; // Don't continue to normal reconnection logic
                        } else {
                            console.error('%c❌ Max immediate close retry attempts reached (3)', 'color: #ef4444; font-weight: bold;');
                            return; // Don't attempt normal reconnection
                        }
                    }

                    // Normal reconnection logic - keep persistent connection alive
                    // Don't check hasConnectedRef - allow infinite reconnection attempts for persistence
                    reconnectAttempts.current++;
                    console.log(`%c🔄 Attempting to reconnect... (${reconnectAttempts.current}/${WS_CONFIG.MAX_RECONNECT_ATTEMPTS})`, 'color: #3b82f6; font-weight: bold;');

                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, WS_CONFIG.RECONNECT_INTERVAL);
                } else if (event.code === 1000) {
                    console.log('%c✅ WebSocket closed normally (1000)', 'color: #10b981; font-weight: bold;');
                }
            };

            ws.onerror = () => {
                isConnectingRef.current = false;

                if (connectionTimeout) {
                    clearTimeout(connectionTimeout);
                }
            };
        } catch (error) {
            console.error('CRITICAL: Failed to create WebSocket connection!', error);
            isConnectingRef.current = false;
        }
    }, [getWebSocketUrl, logout]);

    const disconnect = useCallback(() => {
        // Only close connection if explicitly logging out
        // During component unmount or navigation, keep connection alive
        if (!isLoggingOutRef.current) {
            console.log('%c⚪ WebSocket disconnect called but not logging out - keeping connection alive', 'color: #8b5cf6; font-weight: bold;');
            return;
        }

        console.log('%c🔴 WebSocket force disconnect - user logging out', 'color: #ef4444; font-weight: bold;');

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close(1000, 'Client disconnecting - logging out');
            wsRef.current = null;
        }

        isConnectingRef.current = false;
        setIsConnected(false);
        reconnectAttempts.current = 0;
        hasConnectedRef.current = false;
        connectionOpenTimeRef.current = null;
        immediateCloseAttemptsRef.current = 0;
        isLoggingOutRef.current = false; // Reset flag
    }, []);

    const sendMessage = useCallback((message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            try {
                wsRef.current.send(JSON.stringify(message));
            } catch (error) {
                console.error('CRITICAL: Failed to send message:', error);
            }
        } else {
            console.error('CRITICAL: WebSocket not connected, cannot send message');
        }
    }, []);

    const forceDisconnect = useCallback(() => {
        console.log('%c🔴 Force disconnecting WebSocket - user logout triggered', 'color: #ef4444; font-weight: bold;');
        isLoggingOutRef.current = true;
        disconnect();
    }, [disconnect]);

    return {
        isConnected,
        connect,
        disconnect,
        forceDisconnect,
        sendMessage,
        wsRef,
        setIsConnected,
    };
}
