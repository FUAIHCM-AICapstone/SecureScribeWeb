import axiosInstance from './axiosInstance';
import { ApiWrapper } from './utilities';
import {
    MeetingBotJoinRequest,
    MeetingBotJoinResponse,
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
};

export default meetingBotApi;
