// Search Types
export interface SearchRequest {
    search: string;
    page?: number;
    limit?: number;
    project_id?: string;
    meeting_id?: string;
}

export interface SearchResult {
    id: string;
    name: string;
    created_at: string;
    type: string;
}

export interface SearchResponse {
    success: boolean;
    message: string;
    data: SearchResult[];
    errors: any;
}

export interface IndexingStatus {
    file_id: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    message?: string;
    filename?: string;
    mime_type?: string;
}

// Task Progress Types
export interface TaskProgressData {
    task_id: string;
    progress: number;
    status: string;
    estimated_time: string;
    last_update: string;
    task_type: string;
}

export interface TaskProgressMessage {
    type: 'task_progress';
    data: TaskProgressData;
}

// WebSocket Message Types
export type WebSocketMessage = TaskProgressMessage | {
    type: string;
    data: any;
};

// Common API Response (matches backend ApiResponse)
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}

// Indexing Types
export interface IndexingProgress {
    file_id: string;
    status: 'started' | 'extracting' | 'chunking' | 'embedding' | 'storing' | 'completed' | 'failed';
    progress: number;
    message: string;
    current_step?: string;
    total_chunks?: number;
    processed_chunks?: number;
}

export interface IndexingStatusExtended {
    file_id: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    message?: string;
    started_at?: string;
    completed_at?: string;
}




// Specific Response Types
export type SearchApiResponse = SearchResponse;

// RAG Types
export interface RagRequest {
    query: string;
}

export interface RagResponseData {
    answer: string;
    contexts: string[];
}

export type RagApiResponse = ApiResponse<RagResponseData>;
