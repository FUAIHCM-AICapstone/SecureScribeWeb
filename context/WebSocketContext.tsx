/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
import { WebSocketContextType, WebSocketMessage } from 'types/websocket.type';
import { useWebSocketConnection } from '@/hooks/useWebSocketConnection';
import { useWebSocketMessageHandlers } from '@/hooks/useWebSocketMessageHandlers';

const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    lastMessage: null,
    connect: () => { },
    disconnect: () => { },
    forceDisconnect: () => { },
    sendMessage: () => { },
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const hasConnectedRef = useRef(false);

    // Use the connection management hook
    const {
        isConnected,
        connect,
        disconnect,
        forceDisconnect,
        sendMessage,
        wsRef,
    } = useWebSocketConnection();

    // Use the message handling hook
    useWebSocketMessageHandlers(wsRef, setLastMessage);

    // Register forceDisconnect globally for AuthContext to call during logout
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).__wsForceDisconnect = forceDisconnect;
        }
        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).__wsForceDisconnect;
            }
        };
    }, [forceDisconnect]);
    useEffect(() => {
        if (typeof WebSocket === 'undefined') {
            console.error('CRITICAL: WebSocket is not supported in this browser!');
            return;
        }
    }, []);

    // Connection lifecycle management
    useEffect(() => {
        const token = Cookies.get('access_token');

        // Only connect if we have a token and haven't connected before
        if (token && !hasConnectedRef.current && !isConnected && wsRef.current?.readyState !== WebSocket.OPEN) {
            hasConnectedRef.current = true;
            console.log('%c🟢 WebSocketProvider: Initiating connection', 'color: #10b981; font-weight: bold;');
            connect();
        } else if (!token && isConnected) {
            // Token lost, disconnect
            console.log('%c🔴 WebSocketProvider: Token lost, disconnecting', 'color: #ef4444; font-weight: bold;');
            disconnect();
        }

        // NO cleanup on unmount - keep connection alive during session
        // Connection will only be closed on explicit logout via forceDisconnect()
    }, [connect, disconnect, isConnected, wsRef]);

    const contextValue: WebSocketContextType = {
        isConnected,
        lastMessage,
        connect,
        disconnect,
        forceDisconnect,
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
