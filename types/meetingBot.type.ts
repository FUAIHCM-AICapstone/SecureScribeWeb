// Meeting Bot API Request Types

export interface MeetingBotJoinRequest {
    meeting_url?: string;  // Optional override, max 2048 characters
    immediate?: boolean;   // Default: false
}

// Meeting Bot API Response Types

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
