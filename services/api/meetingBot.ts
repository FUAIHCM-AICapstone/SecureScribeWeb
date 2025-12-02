import axiosInstance from './axiosInstance';
import { ApiWrapper } from './utilities';
import {
    MeetingBotJoinRequest,
    MeetingBotJoinResponse,
    BotResponse,
    BotLogsResponse,
    UpdateBotStatusRequest,
    GetBotsFilters,
} from 'types/meetingBot.type';

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
     * Get all bots with optional filters and pagination
     * @param filters - Optional filters (status, meeting_id)
     * @param pagination - Page and limit for pagination
     * @returns List of bots
     */
    getBots: async (
        filters?: GetBotsFilters,
        pagination?: { page: number; limit: number }
    ): Promise<{ data: BotResponse[]; pagination: any }> => {
        return ApiWrapper.executePaginated<BotResponse>(async () =>
            axiosInstance.get('/meeting-bots', {
                params: {
                    ...filters,
                    page: pagination?.page || 1,
                    limit: pagination?.limit || 20,
                },
            })
        );
    },

    /**
     * Get a specific bot by ID
     * @param botId - UUID of the bot
     * @returns Bot details
     */
    getBot: async (botId: string): Promise<BotResponse> => {
        return ApiWrapper.execute<BotResponse>(async () =>
            axiosInstance.get(`/meeting-bots/${botId}`)
        );
    },

    /**
     * Get bot associated with a specific meeting
     * @param meetingId - UUID of the meeting
     * @returns Bot details
     */
    getBotsForMeeting: async (meetingId: string): Promise<BotResponse> => {
        return ApiWrapper.execute<BotResponse>(async () =>
            axiosInstance.get(`/meetings/${meetingId}/bot`)
        );
    },

    /**
     * Update bot status
     * @param botId - UUID of the bot
     * @param statusUpdate - Status and optional error message
     * @returns Updated bot
     */
    updateBotStatus: async (
        botId: string,
        statusUpdate: UpdateBotStatusRequest
    ): Promise<BotResponse> => {
        return ApiWrapper.execute<BotResponse>(async () =>
            axiosInstance.patch(`/meeting-bots/${botId}/status`, null, {
                params: {
                    status: statusUpdate.status,
                    error: statusUpdate.error,
                },
            })
        );
    },

    /**
     * Delete a bot
     * @param botId - UUID of the bot
     * @returns Success response
     */
    deleteMeetingBot: async (botId: string): Promise<{ success: boolean; message: string }> => {
        return ApiWrapper.execute<{ success: boolean; message: string }>(async () =>
            axiosInstance.delete(`/meeting-bots/${botId}`)
        );
    },

    /**
     * Get logs for a specific bot with pagination
     * @param botId - UUID of the bot
     * @param pagination - Page and limit for pagination
     * @returns List of logs
     */
    getBotLogs: async (
        botId: string,
        pagination?: { page: number; limit: number }
    ): Promise<BotLogsResponse> => {
        return ApiWrapper.execute<BotLogsResponse>(async () =>
            axiosInstance.get(`/meeting-bots/${botId}/logs`, {
                params: {
                    page: pagination?.page || 1,
                    limit: pagination?.limit || 50,
                },
            })
        );
    },
};

export default meetingBotApi;
