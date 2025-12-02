// Meeting Bot API Request Types

import { MeetingResponse } from "./meeting.type";

export interface MeetingBotJoinRequest {
    meeting_url?: string;  // Optional override, max 2048 characters
    immediate?: boolean;   // Default: false
}

export interface UpdateBotStatusRequest {
    status: 'pending' | 'scheduled' | 'active' | 'recording' | 'complete' | 'completed' | 'failed' | 'waiting_for_host' | 'joined' | 'error';
    error?: string;
}

export interface GetBotsFilters {
    status?: string;
    meeting_id?: string;
}

// Meeting Bot API Response Types

export interface MeetingBotLogResponse {
    id: string;
    action: string | null;
    message: string | null;
    created_at: string;
}

export interface BotResponse {
    id: string;
    meeting_id: string;
    meeting: MeetingResponse | null;
    scheduled_start_time: string | null;
    actual_start_time: string | null;
    actual_end_time: string | null;
    status: 'pending' | 'scheduled' | 'active' | 'recording' | 'complete' | 'completed' | 'failed' | 'waiting_for_host' | 'joined' | 'error';
    meeting_url: string | null;
    retry_count: number;
    last_error: string | null;
    created_by: string;
    created_at: string;
    updated_at: string | null;
    logs?: MeetingBotLogResponse[];
}

export interface MeetingBotJoinResponse {
    success: boolean;
    message: string;
    data: {
        task_id: string;      // UUID - Celery task ID
        bot_id: string;       // UUID - Bot identifier
        meeting_id: string;   // UUID - Meeting identifier
        status: 'pending' | 'scheduled' | 'completed' | 'failed';
        scheduled_start_time: string | null; // ISO 8601 datetime, nullable
        created_at: string;   // ISO 8601 datetime
    };
}


export interface BotLogsResponse {
    success: boolean;
    message: string;
    data: MeetingBotLogResponse[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
}
