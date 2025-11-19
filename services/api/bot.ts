/**
 * Meeting Bot API Service
 * Backend endpoints for bot webhook and status management
 * 
 * Note: These endpoints are typically called from the backend server
 * The webhook endpoint receives recordings from the bot service
 */

import axiosInstance from './axiosInstance';
import { ApiWrapper } from './utilities';
import {
    BotWebhookRecordingResponse,
    BotJoinTaskResponse,
} from 'types/meetingBot.type';


/**
 * Bot Webhook API Service
 * Handles webhook callbacks from the bot service
 */
export const botWebhookApi = {
    /**
     * Receive a recording from the bot service
     * This is called by the bot service after recording completes
     * 
     * @param formData - FormData containing recording file and metadata
     * @returns BotWebhookRecordingResponse with task_id and audio_file_id
     */
    receiveRecording: async (
        formData: FormData
    ): Promise<BotWebhookRecordingResponse> => {
        return ApiWrapper.execute<BotWebhookRecordingResponse>(async () =>
            axiosInstance.post('/bot/webhook/recording', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
        );
    },

    /**
     * Get the status of a bot join task
     * @param taskId - UUID of the bot join task
     * @returns BotJoinTaskResponse with current status
     */
    getTaskStatus: async (taskId: string): Promise<BotJoinTaskResponse> => {
        return ApiWrapper.execute<BotJoinTaskResponse>(async () =>
            axiosInstance.get(`/bot/tasks/${taskId}`)
        );
    },

    /**
     * Get recording status for a meeting
     * @param meetingId - UUID of the meeting
     * @returns BotJoinTaskResponse with latest recording task status
     */
    getMeetingRecordingStatus: async (
        meetingId: string
    ): Promise<BotJoinTaskResponse | null> => {
        try {
            return await ApiWrapper.execute<BotJoinTaskResponse>(async () =>
                axiosInstance.get(`/meetings/${meetingId}/recording-status`)
            );
        } catch (error) {
            // Return null if no recording task exists
            return null;
        }
    },
};

export default botWebhookApi;
