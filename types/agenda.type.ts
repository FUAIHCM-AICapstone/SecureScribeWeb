// Meeting Agenda Management Types
// Based on backend schemas for meeting agenda

import type { ApiResponse } from './common.type';

export interface MeetingAgendaRequest {
    content: string;
}

export interface MeetingAgendaResponse {
    id: string;
    content?: string;
    last_edited_at?: string;
    created_at: string;
    updated_at?: string;
}

export interface MeetingAgendaGenerateParams {
    meeting_id: string;
    custom_prompt?: string;
    meeting_type_hint?: string;
}

export interface MeetingAgendaGenerateResponse {
    agenda: MeetingAgendaResponse;
    content: string;
    token_usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export type MeetingAgendaApiResponse = ApiResponse<MeetingAgendaResponse>;
export type MeetingAgendaGenerateApiResponse = ApiResponse<MeetingAgendaGenerateResponse>;