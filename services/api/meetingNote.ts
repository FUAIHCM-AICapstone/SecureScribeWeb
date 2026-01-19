// Meeting Note Management API
// Based on backend endpoints from app/api/endpoints/meeting_note.py

import type {
    MeetingNoteCreateParams,
    MeetingNoteRequest,
    MeetingNoteResponse,
    MeetingNoteSummaryResponse,
} from 'types/meeting_note.type';
import axiosInstance from './axiosInstance';
import { ApiWrapper, QueryBuilder, UuidValidator } from './utilities';

/**
 * Create a meeting note with AI processing
 * Supports custom prompts and meeting type hints for AI agent
 */
export const createMeetingNote = async (
    params: MeetingNoteCreateParams
): Promise<MeetingNoteSummaryResponse> => {
    UuidValidator.validate(params.meeting_id, 'Meeting ID');

    const queryParams = {
        custom_prompt: params.custom_prompt,
        meeting_type_hint: params.meeting_type_hint,
    };

    const queryString = QueryBuilder.build(queryParams);

    return ApiWrapper.execute(() =>
        axiosInstance.post(
            `/meetings/${params.meeting_id}/notes${queryString}`
        )
    );
};

/**
 * Get a meeting note
 */
export const getMeetingNote = async (
    meetingId: string
): Promise<MeetingNoteResponse> => {
    UuidValidator.validate(meetingId, 'Meeting ID');
    return ApiWrapper.execute(() =>
        axiosInstance.get(`/meetings/${meetingId}/notes`)
    );
};

/**
 * Update a meeting note
 */
export const updateMeetingNote = async (
    meetingId: string,
    payload: MeetingNoteRequest
): Promise<MeetingNoteResponse> => {
    UuidValidator.validate(meetingId, 'Meeting ID');
    return ApiWrapper.execute(() =>
        axiosInstance.put(`/meetings/${meetingId}/notes`, payload)
    );
};

/**
 * Delete a meeting note
 */
export const deleteMeetingNote = async (
    meetingId: string
): Promise<void> => {
    UuidValidator.validate(meetingId, 'Meeting ID');
    return ApiWrapper.executeVoid(() =>
        axiosInstance.delete(`/meetings/${meetingId}/notes`)
    );
};

/**
 * Download a meeting note as a file
 */
export const downloadMeetingNote = async (
    meetingId: string
): Promise<Blob> => {
    UuidValidator.validate(meetingId, 'Meeting ID');
    const response = await axiosInstance.get(`/meetings/${meetingId}/notes/download`, {
        responseType: 'blob',
    });
    return response.data;
};
