import axiosInstance from './axiosInstance';
import { ApiWrapper } from './utilities';
import {
    MeetingBotJoinRequest,
    MeetingBotJoinResponse,
    BotTaskStatus,
    AudioFileResponse,
    PresignedUrlResponse,
    BotJoinTaskResponse,
} from 'types/meetingBot.type';
import { ApiResponse } from 'types/common.type';


/**
 * Meeting Bot API Service
 * Handles all bot-related operations for recording meetings
 */
export const meetingBotApi = {
    /**
     * Trigger a bot to join a meeting and start recording
     * @param meetingId - UUID of the meeting
     * @param options - Optional meeting_url override and immediate flag
     * @returns MeetingBotJoinResponse with task_id and bot_id
     */
    triggerBotJoin: async (
        meetingId: string,
        options?: MeetingBotJoinRequest
    ): Promise<MeetingBotJoinResponse> => {
        return ApiWrapper.execute<MeetingBotJoinResponse>(async () =>
            axiosInstance.post(
                `/meetings/${meetingId}/bot/join`,
                options || {}
            )
        );
    },

    /**
     * Get the status of a bot join task
     * @param taskId - UUID of the bot join task
     * @returns BotJoinTaskResponse with current status
     */
    getBotJoinStatus: async (taskId: string): Promise<BotJoinTaskResponse> => {
        return ApiWrapper.execute<BotJoinTaskResponse>(async () =>
            axiosInstance.get(`/bot/tasks/${taskId}`)
        );
    },

    /**
     * Get all audio files associated with a meeting
     * @param meetingId - UUID of the meeting
     * @returns Array of AudioFileResponse objects
     */
    getAudioFilesForMeeting: async (
        meetingId: string
    ): Promise<AudioFileResponse[]> => {
        return ApiWrapper.executeList<AudioFileResponse>(async () =>
            axiosInstance.get(`/meetings/${meetingId}/audio-files`)
        );
    },

    /**
     * Get a presigned URL for downloading an audio file
     * @param audioFileId - UUID of the audio file
     * @returns PresignedUrlResponse with temporary download URL
     */
    getAudioFileDownloadUrl: async (
        audioFileId: string
    ): Promise<string> => {
        const response = await ApiWrapper.execute<PresignedUrlResponse>(
            async () =>
                axiosInstance.get(`/audio-files/${audioFileId}/download-url`)
        );
        return response.url;
    },

    /**
     * Delete an audio file
     * @param audioFileId - UUID of the audio file
     */
    deleteAudioFile: async (audioFileId: string): Promise<void> => {
        return ApiWrapper.executeVoid(async () =>
            axiosInstance.delete(`/audio-files/${audioFileId}`)
        );
    },

    /**
     * Get recording status for a meeting
     * @param meetingId - UUID of the meeting
     * @returns BotTaskStatus with current recording status
     */
    getRecordingStatus: async (
        meetingId: string
    ): Promise<BotTaskStatus | null> => {
        try {
            return await ApiWrapper.execute<BotTaskStatus>(async () =>
                axiosInstance.get(`/meetings/${meetingId}/recording-status`)
            );
        } catch (error) {
            // Return null if no recording task exists
            return null;
        }
    },
};

export default meetingBotApi;
