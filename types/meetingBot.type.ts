// Meeting Bot API Request Types

export interface MeetingBotJoinRequest {
    meeting_url?: string;  // Optional override, max 2048 characters
    immediate?: boolean;   // Default: false
}

export interface BotWebhookRecordingRequest {
    recording: File;       // Binary video/webm file from the bot
    botId: string;         // ID of the bot that recorded
    meetingUrl: string;    // URL of the meeting that was recorded
    status: string;        // Status of the recording (e.g., "completed")
    teamId: string;        // Team ID from the bot service
    timestamp: string;     // ISO 8601 timestamp of when recording completed
    userId: string;        // User ID (ignored, uses bearer token user instead)
}

// Meeting Bot API Response Types

export interface MeetingBotJoinResponse {
    task_id: string;                    // UUID
    bot_id: string;                     // UUID
    meeting_id: string;                 // UUID
    status: 'pending' | 'scheduled' | 'completed' | 'failed';
    scheduled_start_time: string | null; // ISO 8601 datetime, nullable
    created_at: string;                 // ISO 8601 datetime
}

export interface BotWebhookRecordingResponse {
    success: boolean;
    message: string;
    data: {
        task_id: string;      // Celery task ID
        audio_file_id: string; // AudioFile record ID
    };
}

export interface BotTaskStatus {
    task_id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    progress?: number;
    error_message?: string;
    created_at: string;
    completed_at?: string;
}

// Bot Join Task Response (for status polling)
export interface BotJoinTaskResponse {
    id: string;
    meeting_id: string;
    task_id: string;
    bot_id: string;
    status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed';
    scheduled_start_time?: string;
    error_message?: string;
    created_at: string;
    updated_at?: string;
}

// Audio File Response (already exists but included for reference)
export interface AudioFileResponse {
    id: string;
    meeting_id: string;
    uploaded_by: string;
    file_url?: string;
    seq_order?: number;
    duration_seconds?: number;
    is_concatenated: boolean;
    created_at: string;
    updated_at?: string;
}

// Presigned URL Response
export interface PresignedUrlResponse {
    url: string;
    expires_at: string;
}
