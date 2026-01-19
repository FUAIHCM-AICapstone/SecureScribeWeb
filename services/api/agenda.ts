// Meeting Agenda Management API
// Based on backend endpoints for meeting agenda

import type {
    MeetingAgendaRequest,
    MeetingAgendaResponse,
    MeetingAgendaGenerateParams,
    MeetingAgendaGenerateResponse,
} from 'types/agenda.type';
import axiosInstance from './axiosInstance';
import { ApiWrapper, QueryBuilder, UuidValidator } from './utilities';

/**
 * Get a meeting agenda
 */
export const getMeetingAgenda = async (
    meetingId: string
): Promise<MeetingAgendaResponse> => {
    UuidValidator.validate(meetingId, 'Meeting ID');
    return ApiWrapper.execute(() =>
        axiosInstance.get(`/meetings/${meetingId}/agenda`)
    );
};

/**
 * Update a meeting agenda
 */
export const updateMeetingAgenda = async (
    meetingId: string,
    request: MeetingAgendaRequest
): Promise<MeetingAgendaResponse> => {
    UuidValidator.validate(meetingId, 'Meeting ID');
    return ApiWrapper.execute(() =>
        axiosInstance.put(`/meetings/${meetingId}/agenda`, request)
    );
};

/**
 * Generate a meeting agenda with AI processing
 * Supports custom prompts and meeting type hints for AI agent
 */
export const generateMeetingAgenda = async (
    params: MeetingAgendaGenerateParams
): Promise<MeetingAgendaGenerateResponse> => {
    UuidValidator.validate(params.meeting_id, 'Meeting ID');

    const queryParams = {
        custom_prompt: params.custom_prompt,
        meeting_type_hint: params.meeting_type_hint,
    };

    const queryString = QueryBuilder.build(queryParams);

    return ApiWrapper.execute(() =>
        axiosInstance.post(
            `/meetings/${params.meeting_id}/agenda/generate${queryString}`
        )
    );
};

/**
 * Delete a meeting agenda
 */
export const deleteMeetingAgenda = async (
    meetingId: string
): Promise<void> => {
    UuidValidator.validate(meetingId, 'Meeting ID');
    return ApiWrapper.execute(() =>
        axiosInstance.delete(`/meetings/${meetingId}/agenda`)
    );
};

/**
 * Download a meeting agenda as a file
 */
export const downloadMeetingAgenda = async (
    meetingId: string
): Promise<Blob> => {
    UuidValidator.validate(meetingId, 'Meeting ID');
    const response = await axiosInstance.get(`/meetings/${meetingId}/agenda/download`, {
        responseType: 'blob',
    });
    return response.data;
};