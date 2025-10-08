export interface Mention {
    entity_type: string; // "project", "meeting", "file"
    entity_id: string;   // UUID string
    offset_start: number;
    offset_end: number;
}

export type MentionType = 'project' | 'meeting' | 'file';

export interface MentionSearchItem {
    id: string;
    name: string;
    type: MentionType;
}

export interface MentionOccurrence {
    type: MentionType;
    id: string;
    name: string;
    offset: number;
    length: number;
}

export interface ChatMessageCreate {
    content: string;
    mentions?: Mention[];
}

export interface ChatMessageResponse {
    id: string; // UUID as string
    conversation_id: string; // UUID as string
    message_type: string; // "user", "agent", "system"
    content: string;
    created_at: string; // ISO datetime string
    mentions?: Mention[] | null;
}

export interface ChatConversationResponse {
    id: string; // UUID as string
    user_id: string; // UUID as string
    title?: string;
    created_at: string; // ISO datetime string
    updated_at?: string; // ISO datetime string
    is_active: boolean;
    messages: ChatMessageResponse[];
}

export interface ConversationCreate {
    title?: string;
}

export interface ConversationUpdate {
    title?: string;
    is_active?: boolean;
}

export interface ConversationResponse {
    id: string; // UUID as string
    user_id: string; // UUID as string
    title?: string;
    created_at: string; // ISO datetime string
    updated_at?: string; // ISO datetime string
    is_active: boolean;
}

export interface ConversationsPaginatedResponse {
    success: boolean;
    message: string;
    data: ConversationResponse[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
}

export interface ChatMessageApiResponse {
    success: boolean;
    message: string;
    data: ChatMessageResponse | {
        user_message: ChatMessageResponse;
        ai_message: ChatMessageResponse;
    };
}

export interface ChatConversationApiResponse {
    success: boolean;
    message: string;
    data: ChatConversationResponse;
}

export interface ConversationApiResponse {
    success: boolean;
    message: string;
    data: ConversationResponse;
}
