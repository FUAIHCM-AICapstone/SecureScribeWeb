/**
 * WebSocket Type Definitions
 * Centralized types for all WebSocket-related interfaces and messages
 */

// Context type definition
export interface WebSocketContextType {
    isConnected: boolean;
    lastMessage: WebSocketMessage | null;
    connect: () => void;
    disconnect: () => void;
    forceDisconnect: () => void;
    sendMessage: (message: any) => void;
}

// WebSocket message type definitions
export interface TaskProgressMessage {
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

export interface NotificationMessage {
    type: 'notification';
    data: {
        notification_type: string;
        payload: any;
        channel: string;
        timestamp: number;
    };
}

export interface UserJoinedMessage {
    type: 'user_joined';
    data: {
        user_id: string;
        project_id: string;
        user_name?: string;
        project_name?: string;
    };
}

export interface UserRemovedMessage {
    type: 'user_removed';
    data: {
        user_id: string;
        project_id: string;
        user_name?: string;
        project_name?: string;
        is_self_removal?: boolean;
    };
}

export interface YouAddedToProjectMessage {
    type: 'you_added_to_project';
    data: {
        project_id: string;
        added_by_user_id: string;
        message: string;
    };
    received_at: string;
    channel: string;
}

export interface YouRemovedFromProjectMessage {
    type: 'you_removed_from_project';
    data: {
        project_id: string;
        removed_by_user_id: string;
        is_self_removal: boolean;
        message: string;
    };
    received_at: string;
    channel: string;
}

// Union type for all possible WebSocket messages
export type WebSocketMessage =
    | TaskProgressMessage
    | NotificationMessage
    | UserJoinedMessage
    | UserRemovedMessage
    | YouAddedToProjectMessage
    | YouRemovedFromProjectMessage
    | { type: string; data: any };

// WebSocket configuration constants
export const WS_CONFIG = {
    MAX_RECONNECT_ATTEMPTS: 5,
    RECONNECT_INTERVAL: 2000, // 10 seconds
    CONNECTION_TIMEOUT: 10000, // 10 seconds
    PING_INTERVAL: 2000, // 1 second
} as const;
