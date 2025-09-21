/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// MESSAGE TYPES
// ============================================

export interface MessageResponse {
    id: string
    conversation_id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}

export interface MessageListRequest {
    before_message_id?: string
    limit?: number
}

export interface SendMessageRequest {
    conversation_id: string
    content: string
}

export interface SendMessageResponse {
    user_message: MessageResponse
    ai_message: MessageResponse
}

// ============================================
// CONVERSATION TYPES
// ============================================

export interface ConversationResponse {
    id: string
    name: string
    message_count: number
    last_activity: string
    create_date: string
    update_date?: string
}

export interface ConversationListRequest {
    search?: string
    order_by?: string
    order_direction?: 'asc' | 'desc'
}

export interface CreateConversationRequest {
    name: string
    initial_message?: string
}

export interface UpdateConversationRequest {
    name?: string
}

// ============================================
// UI STATE TYPES FOR CHATCLIENTWRAPPER
// ============================================

export interface Conversation {
    id: string
    name: string
    messages: Message[]
    lastActivity: Date
    messageCount: number
    systemPrompt?: string
}

export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    isStreaming?: boolean
    response_time_ms?: string
}

export interface ChatState {
    conversations: Conversation[]
    activeConversationId: string | null
    messages: Message[]
    isLoading: boolean
    isTyping: boolean
    error: string | null
    wsToken: string | null
}

export function convertToUIConversation(apiConversation: ConversationResponse): Conversation {
    return {
        id: apiConversation.id,
        name: apiConversation.name,
        messages: [], // Will be loaded separately
        lastActivity: new Date(apiConversation.last_activity),
        messageCount: apiConversation.message_count,
    }
}

export function convertToUIMessage(apiMessage: MessageResponse): Message {
    return {
        id: apiMessage.id,
        role: apiMessage.role,
        content: apiMessage.content,
        timestamp: new Date(apiMessage.timestamp),
    }
}

// ============================================
// ERROR TYPES
// ============================================

export interface ChatError {
    code: string
    message: string
    details?: string
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string | Date;
    conversation_id?: string;
    response_time_ms?: number;
    isStreaming?: boolean;
}

export interface ChatHistory {
    messages: ChatMessage[];
    total_count: number;
    page: number;
    page_size: number;
    total_pages: number;
}
