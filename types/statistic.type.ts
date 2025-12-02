export enum DashboardPeriod {
    SEVEN_DAYS = "7d",
    THIRTY_DAYS = "30d",
    NINETY_DAYS = "90d",
    ALL_TIME = "all"
}

export enum DashboardScope {
    PERSONAL = "personal",
    PROJECT = "project",
    HYBRID = "hybrid"
}

export interface ChartDataPoint {
    date: string; // YYYY-MM-DD
    count: number;
    value?: number | null; // Secondary metric (e.g., completed count, duration)
}

export interface TaskStatusBreakdown {
    todo: number;
    in_progress: number;
    done: number;
}

export interface TaskStats {
    total: number;
    status_breakdown: TaskStatusBreakdown;
    overdue_count: number;
    completion_rate: number;
    due_today: number;
    due_this_week: number;
    created_this_period: number;
    completed_this_period: number;
    chart_data: ChartDataPoint[];
}

export interface MeetingStats {
    total_count: number;
    total_duration_minutes: number;
    average_duration_minutes: number;
    bot_usage_count: number;
    bot_usage_rate: number;
    meetings_with_transcript: number;
    upcoming_count: number;
    chart_data: ChartDataPoint[];
}

export interface ProjectStats {
    total_count: number;
    active_count: number;
    archived_count: number;
    owned_count: number;
    member_count: number;
}

export interface StorageStats {
    total_files: number;
    total_size_bytes: number;
    total_size_mb: number;
    files_by_type: Record<string, number>;
}

export interface QuickAccessMeeting {
    id: string;
    title: string | null;
    start_time: string | null; // ISO string
    url: string | null;
    project_names: string[];
    status: string;
    has_transcript: boolean;
    has_recording: boolean;
}

export interface QuickAccessTask {
    id: string;
    title: string;
    due_date: string | null; // ISO string
    priority: string;
    status: string;
    project_names: string[];
    is_overdue: boolean;
}

export interface QuickAccessProject {
    id: string;
    name: string;
    description: string | null;
    role: string;
    member_count: number;
    task_count: number;
    meeting_count: number;
    joined_at: string; // ISO string
}

export interface QuickAccessData {
    upcoming_meetings: QuickAccessMeeting[];
    recent_meetings: QuickAccessMeeting[];
    priority_tasks: QuickAccessTask[];
    active_projects: QuickAccessProject[];
}

export interface SummaryStats {
    total_tasks: number;
    total_meetings: number;
    total_projects: number;
    pending_tasks: number;
    upcoming_meetings_24h: number;
}

export interface DashboardResponse {
    period: DashboardPeriod;
    scope: DashboardScope;
    summary: SummaryStats;
    tasks: TaskStats;
    meetings: MeetingStats;
    projects: ProjectStats;
    storage: StorageStats;
    quick_access: QuickAccessData;
}
