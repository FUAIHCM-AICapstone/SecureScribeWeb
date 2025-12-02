// API Utilities for error handling and response transformation
// Provides common patterns for API calls, error handling, and data transformation

import type { ApiResponse, ApiError } from 'types/common.type';

// Type definitions for axios (avoiding direct import to prevent module resolution issues)
type AxiosError = any;
type AxiosResponse<T = any> = {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
};

/**
 * Message translation interface
 */
export interface MessageTranslator {
    translate: (messageKey: string, defaultMessage?: string) => string;
}

/**
 * Message key mapper for backend message constants
 * Maps backend message keys to i18n translation keys
 */
export class MessageKeyMapper {
    private static readonly keyMap: Record<string, string> = {
        // Audio File Messages
        'AUDIO_UPLOADED_SUCCESS': 'MeetingDetail.uploadAudioSuccess',
        'AUDIO_NOT_FOUND': 'api.audio.notFound',
        'AUDIO_UPLOAD_FAILED': 'api.audio.uploadFailed',
        'AUDIO_DELETED_SUCCESS': 'api.audio.deleteSuccess',

        // Transcript Messages
        'TRANSCRIPT_CREATED_SUCCESS': 'api.transcript.createSuccess',
        'TRANSCRIPT_NOT_FOUND': 'api.transcript.notFound',
        'TRANSCRIPT_RETRIEVED_SUCCESS': 'api.transcript.retrieveSuccess',
        'TRANSCRIPT_UPDATED_SUCCESS': 'api.transcript.updateSuccess',
        'TRANSCRIPT_DELETED_SUCCESS': 'api.transcript.deleteSuccess',

        // Task Messages
        'TASK_CREATED_SUCCESS': 'Tasks.createTaskSuccess',
        'TASK_NOT_FOUND': 'api.task.notFound',
        'TASK_RETRIEVED_SUCCESS': 'api.task.retrieveSuccess',
        'TASK_UPDATED_SUCCESS': 'Tasks.updateTaskSuccess',
        'TASK_DELETED_SUCCESS': 'api.task.deleteSuccess',

        // Project Messages
        'PROJECT_CREATED_SUCCESS': 'Projects.createSuccess',
        'PROJECT_NOT_FOUND': 'api.project.notFound',
        'PROJECT_RETRIEVED_SUCCESS': 'api.project.retrieveSuccess',
        'PROJECT_LIST_RETRIEVED_SUCCESS': 'api.project.listRetrieveSuccess',
        'PROJECT_UPDATED_SUCCESS': 'ProjectEdit.updateSuccess',
        'PROJECT_DELETED_SUCCESS': 'Projects.deleteSuccess',
        'PROJECT_MEMBER_ADDED_SUCCESS': 'api.project.memberAddSuccess',
        'PROJECT_MEMBER_ADD_FAILED': 'api.project.memberAddFailed',
        'PROJECT_MEMBER_REMOVED_SUCCESS': 'api.project.memberRemoveSuccess',
        'PROJECT_LEFT_SUCCESS': 'api.project.leftSuccess',
        'PROJECT_MEMBER_NOT_FOUND': 'api.project.memberNotFound',
        'PROJECT_CANNOT_REMOVE_ALL_ADMINS': 'api.project.cannotRemoveAllAdmins',
        'PROJECT_CANNOT_LEAVE_LAST_ADMIN': 'api.project.cannotLeaveLastAdmin',
        'PROJECT_MEMBER_ROLE_UPDATED_SUCCESS': 'api.project.roleUpdateSuccess',
        'PROJECT_STATS_RETRIEVED_SUCCESS': 'api.project.statsRetrieveSuccess',
        'PROJECT_NOT_MEMBER': 'api.project.notMember',
        'PROJECT_ROLE_NOT_FOUND': 'api.project.roleNotFound',
        'PROJECT_ROLE_ALREADY_SET': 'api.project.roleAlreadySet',
        'PROJECT_ROLE_CHANGE_REQUESTED': 'api.project.roleChangeRequested',
        'PROJECT_CANNOT_CHANGE_LAST_ADMIN_ROLE': 'api.project.cannotChangeLastAdminRole',
        'PROJECT_INVALID_UUID_FORMAT': 'api.project.invalidUuidFormat',

        // Meeting Messages
        'MEETING_CREATED_SUCCESS': 'MeetingScheduler.createSuccess',
        'MEETING_NOT_FOUND': 'MeetingDetail.notFound',
        'MEETING_RETRIEVED_SUCCESS': 'api.meeting.retrieveSuccess',
        'MEETING_LIST_RETRIEVED_SUCCESS': 'api.meeting.listRetrieveSuccess',
        'MEETING_UPDATED_SUCCESS': 'MeetingEdit.updateSuccess',
        'MEETING_DELETED_SUCCESS': 'api.meeting.deleteSuccess',
        'MEETING_ADDED_TO_PROJECT_SUCCESS': 'api.meeting.addToProjectSuccess',
        'MEETING_REMOVED_FROM_PROJECT_SUCCESS': 'api.meeting.removeFromProjectSuccess',
        'MEETING_AUDIO_UPLOADED_SUCCESS': 'MeetingDetail.uploadAudioSuccess',
        'MEETING_AUDIO_FILES_RETRIEVED_SUCCESS': 'api.meeting.audioFilesRetrieveSuccess',
        'MEETING_ADD_TO_PROJECT_FAILED': 'api.meeting.addToProjectFailed',
        'MEETING_REMOVE_FROM_PROJECT_FAILED': 'api.meeting.removeFromProjectFailed',
        'MEETING_UPDATE_FAILED': 'api.meeting.updateFailed',
        'MEETING_AUDIO_UPLOAD_FAILED': 'api.meeting.audioUploadFailed',
        'MEETING_FILE_TOO_LARGE': 'api.meeting.fileTooLarge',
        'MEETING_UNSUPPORTED_AUDIO_TYPE': 'api.meeting.unsupportedAudioType',

        // Meeting Note Messages
        'MEETING_NOTE_CREATED_SUCCESS': 'MeetingDetail.createNoteSuccess',
        'MEETING_NOTE_NOT_FOUND': 'api.meetingNote.notFound',
        'MEETING_NOTE_RETRIEVED_SUCCESS': 'api.meetingNote.retrieveSuccess',
        'MEETING_NOTE_UPDATED_SUCCESS': 'MeetingDetail.updateNoteSuccess',
        'MEETING_NOTE_DELETED_SUCCESS': 'api.meetingNote.deleteSuccess',

        // Meeting Bot Messages
        'MEETING_BOT_CREATED_SUCCESS': 'api.bot.createSuccess',
        'MEETING_BOT_NOT_FOUND': 'api.bot.notFound',
        'MEETING_BOT_RETRIEVED_SUCCESS': 'api.bot.retrieveSuccess',
        'MEETING_BOT_LIST_RETRIEVED_SUCCESS': 'api.bot.listRetrieveSuccess',
        'MEETING_BOT_UPDATED_SUCCESS': 'api.bot.updateSuccess',
        'MEETING_BOT_DELETED_SUCCESS': 'api.bot.deleteSuccess',
        'MEETING_BOT_LOG_CREATED_SUCCESS': 'api.bot.logCreateSuccess',
        'MEETING_BOT_LOG_LIST_RETRIEVED_SUCCESS': 'api.bot.logListRetrieveSuccess',
        'MEETING_BOT_JOIN_TRIGGERED_SUCCESS': 'api.bot.joinTriggeredSuccess',
        'MEETING_BOT_WEBHOOK_PROCESSED_SUCCESS': 'api.bot.webhookProcessedSuccess',
        'MEETING_BOT_WEBHOOK_QUEUED_FOR_RETRY': 'api.bot.webhookQueuedForRetry',
        'MEETING_BOT_WEBHOOK_RECEIVED': 'api.bot.webhookReceived',
        'MEETING_BOT_JOIN_FAILED': 'api.bot.joinFailed',

        // User Messages
        'USER_CREATED_SUCCESS': 'api.user.createSuccess',
        'USER_NOT_FOUND': 'api.user.notFound',
        'USER_RETRIEVED_SUCCESS': 'api.user.retrieveSuccess',
        'USER_UPDATED_SUCCESS': 'Profile.updateSuccess',
        'USER_DELETED_SUCCESS': 'api.user.deleteSuccess',

        // Auth Messages
        'AUTH_FAILED': 'auth.login_failed',
        'ACCESS_DENIED': 'api.auth.accessDenied',
        'ADMIN_ACCESS_REQUIRED': 'api.auth.adminAccessRequired',
        'INVALID_CREDENTIALS': 'api.auth.invalidCredentials',
        'AUTHORIZATION_HEADER_REQUIRED': 'api.auth.authorizationHeaderRequired',
        'INVALID_BEARER_TOKEN_FORMAT': 'api.auth.invalidBearerTokenFormat',

        // File Messages
        'FILE_UPLOADED_SUCCESS': 'Files.uploadSuccess',
        'FILE_NOT_FOUND': 'api.file.notFound',
        'FILE_RETRIEVED_SUCCESS': 'api.file.retrieveSuccess',
        'FILE_DELETED_SUCCESS': 'api.file.deleteSuccess',

        // Common Messages
        'OPERATION_SUCCESSFUL': 'api.common.operationSuccessful',
        'OPERATION_FAILED': 'api.common.operationFailed',
        'INVALID_REQUEST': 'api.common.invalidRequest',
        'INTERNAL_SERVER_ERROR': 'api.common.internalServerError',
        'RESOURCE_ALREADY_EXISTS': 'api.common.resourceAlreadyExists',
        'VALIDATION_ERROR': 'api.common.validationError',
    };

    /**
     * Get i18n translation key for backend message constant
     */
    static getTranslationKey(messageKey: string): string | null {
        return this.keyMap[messageKey] || null;
    }

    /**
     * Check if message key has translation
     */
    static hasTranslation(messageKey: string): boolean {
        return messageKey in this.keyMap;
    }
}

/**
 * Generic API error handler with message translation support
 */
export class ApiErrorHandler {
    private static translator: MessageTranslator | null = null;

    /**
     * Set translator function for i18n support
     */
    static setTranslator(translator: MessageTranslator): void {
        this.translator = translator;
    }

    /**
     * Translate message if translator is available
     */
    private static translateMessage(messageKey: string, fallback: string): string {
        if (!this.translator) {
            return fallback;
        }

        // Check if message key exists in mapping
        const translationKey = MessageKeyMapper.getTranslationKey(messageKey);
        if (translationKey) {
            return this.translator.translate(translationKey, fallback);
        }

        // Return original message if no translation key found
        return fallback;
    }

    static handle(error: AxiosError): ApiError {
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            const messageKey = data?.message || '';
            const fallbackMessage = data?.message || this.getDefaultErrorMessage(status);

            // Translate message if it's a backend message constant
            const translatedMessage = this.translateMessage(messageKey, fallbackMessage);

            return {
                success: false,
                message: translatedMessage,
                data: data?.data,
            };
        }

        if (error.request) {
            // Request was made but no response received
            const message = this.translator 
                ? this.translator.translate('api.common.networkError', 'Network Error - No response received')
                : 'Network Error - No response received';

            return {
                success: false,
                message,
            };
        }

        // Something else happened
        const message = this.translator
            ? this.translator.translate('api.common.unknownError', error.message || 'Unknown Error')
            : error.message || 'Unknown Error';

        return {
            success: false,
            message,
        };
    }

    /**
     * Get default error message based on HTTP status
     */
    private static getDefaultErrorMessage(status: number): string {
        const statusMessages: Record<number, string> = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            422: 'Validation Error',
            500: 'Internal Server Error',
        };

        return statusMessages[status] || `HTTP ${status} Error`;
    }
}

/**
 * Generic response transformer with message translation support
 */
export class ResponseTransformer {
    private static translator: MessageTranslator | null = null;

    /**
     * Set translator function for i18n support
     */
    static setTranslator(translator: MessageTranslator): void {
        this.translator = translator;
    }

    /**
     * Translate message if translator is available
     */
    private static translateMessage(messageKey: string, fallback: string): string {
        if (!this.translator) {
            return fallback;
        }

        const translationKey = MessageKeyMapper.getTranslationKey(messageKey);
        if (translationKey) {
            return this.translator.translate(translationKey, fallback);
        }

        return fallback;
    }

    static transformSuccess<T>(response: AxiosResponse<ApiResponse<T>>): T {
        const { data } = response;

        if (!data.success) {
            const messageKey = data.message || 'API returned success: false';
            const translatedMessage = this.translateMessage(messageKey, messageKey);
            throw new Error(translatedMessage);
        }

        if (!data.data) {
            const message = this.translator
                ? this.translator.translate('api.common.noData', 'API returned no data')
                : 'API returned no data';
            throw new Error(message);
        }

        return data.data;
    }

    static transformList<T>(response: AxiosResponse<any>): T[] {
        const { data } = response;

        if (!data.success) {
            throw new Error(data.message || 'API returned success: false');
        }

        if (!data.data) {
            return [];
        }

        // Handle both direct array and paginated response
        if (Array.isArray(data.data)) {
            return data.data;
        }

        return [];
    }

    static transformPaginated(response: AxiosResponse<any>) {
        const { data } = response;

        if (!data.success) {
            throw new Error(data.message || 'API returned success: false');
        }

        return {
            data: data.data || [],
            pagination: data.pagination || {
                page: 1,
                limit: 20,
                total: 0,
                total_pages: 0,
                has_next: false,
                has_prev: false,
            },
        };
    }

    static transformBulk(response: AxiosResponse<any>) {
        const { data } = response;

        if (!data.success && data.total_failed > 0) {
            throw new Error(data.message || 'Bulk operation partially failed');
        }

        return {
            success: data.success,
            message: data.message,
            data: data.data || [],
            total_processed: data.total_processed || 0,
            total_success: data.total_success || 0,
            total_failed: data.total_failed || 0,
        };
    }
}

/**
 * Generic API wrapper with error handling
 */
export class ApiWrapper {
    static async execute<T>(
        apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>
    ): Promise<T> {
        try {
            const response = await apiCall();
            return ResponseTransformer.transformSuccess(response);
        } catch (error) {
            throw ApiErrorHandler.handle(error as AxiosError);
        }
    }

    static async executeList<T>(
        apiCall: () => Promise<AxiosResponse<any>>
    ): Promise<T[]> {
        try {
            const response = await apiCall();
            return ResponseTransformer.transformList<T>(response);
        } catch (error) {
            throw ApiErrorHandler.handle(error as AxiosError);
        }
    }

    static async executePaginated<T>(
        apiCall: () => Promise<AxiosResponse<any>>
    ): Promise<{ data: T[]; pagination: any }> {
        try {
            const response = await apiCall();
            return ResponseTransformer.transformPaginated(response);
        } catch (error) {
            throw ApiErrorHandler.handle(error as AxiosError);
        }
    }

    static async executeBulk(
        apiCall: () => Promise<AxiosResponse<any>>
    ): Promise<{
        success: boolean;
        message: string;
        data: any[];
        total_processed: number;
        total_success: number;
        total_failed: number;
    }> {
        try {
            const response = await apiCall();
            return ResponseTransformer.transformBulk(response);
        } catch (error) {
            throw ApiErrorHandler.handle(error as AxiosError);
        }
    }

    static async executeVoid(
        apiCall: () => Promise<AxiosResponse<any>>
    ): Promise<void> {
        try {
            const response = await apiCall();
            if (!response.data.success) {
                throw new Error(response.data.message || 'API call failed');
            }
        } catch (error) {
            throw ApiErrorHandler.handle(error as AxiosError);
        }
    }
}

/**
 * Query parameter builder
 */
export class QueryBuilder {
    static build(params: Record<string, any>): string {
        const filtered = Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    return `${key}=${value.join(',')}`;
                }
                return `${key}=${encodeURIComponent(String(value))}`;
            });

        return filtered.length > 0 ? `?${filtered.join('&')}` : '';
    }
}

/**
 * Form data builder for file uploads
 */
export class FormDataBuilder {
    static build(data: Record<string, any>): FormData {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    formData.append(key, value.join(','));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        return formData;
    }

    static buildWithFile(file: File, additionalData?: Record<string, any>): FormData {
        const formData = new FormData();
        formData.append('file', file);

        if (additionalData) {
            Object.entries(additionalData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        formData.append(key, value.join(','));
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
        }

        return formData;
    }
}

/**
 * UUID validation utility
 */
export class UuidValidator {
    static isValid(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    static validate(uuid: string, fieldName: string = 'ID'): void {
        if (!this.isValid(uuid)) {
            throw new Error(`Invalid ${fieldName} format: ${uuid}`);
        }
    }
}
export class SSEHelper {
    /**
     * Create an EventSource with proper authorization headers
     * Uses cookie-based authentication like axiosInstance
     */
    static createEventSource(
        url: string,
        onMessage: (data: any) => void,
        onError?: (error: any) => void,
        onOpen?: () => void
    ): EventSource {
        // Get access token from cookies (same as axiosInstance)
        const token = this.getAccessToken();

        // Add authorization as query parameter for SSE
        const separator = url.includes('?') ? '&' : '?';
        const authUrl = token ? `${url}${separator}authorization=${encodeURIComponent(token)}` : url;

        const eventSource = new EventSource(authUrl);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('Failed to parse SSE message:', error);
                onError?.(error);
            }
        };

        eventSource.onopen = () => {
            onOpen?.();
        };

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            onError?.(error);
        };

        return eventSource;
    }

    /**
     * Get access token from cookies (same logic as axiosInstance)
     */
    private static getAccessToken(): string | null {
        if (typeof window === 'undefined') {
            return null;
        }

        // Try to get token from cookies (same as axiosInstance interceptor)
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'access_token' && value) {
                return value;
            }
        }

        return null;
    }

    /**
     * Close an EventSource connection
     */
    static closeEventSource(eventSource: EventSource): void {
        eventSource.close();
    }
}