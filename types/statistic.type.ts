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
    value?: number;
}

export interface TaskStats {
    total_assigned: number;
    todo_count: number;
    in_progress_count: number;
    done_count: number;
    overdue_count: number;
    completion_rate: number;
    chart_data: ChartDataPoint[];
}

export interface MeetingStats {
    total_count: number;
    total_duration_minutes: number;
    average_duration_minutes: number;
    bot_usage_count: number;
    chart_data: ChartDataPoint[];
}

export interface ProjectStats {
    total_active: number;
    total_archived: number;
    role_admin_count: number;
    role_member_count: number;
}

export interface StorageStats {
    total_files: number;
    total_size_bytes: number;
    total_size_mb: number;
}

export interface QuickAccessMeeting {
    id: string;
    title: string | null;
    start_time: string | null; // ISO string
    end_time: string | null; // ISO string
    url: string | null;
    project_name: string | null;
    status: string;
    has_transcript: boolean;
}

export interface QuickAccessTask {
    id: string;
    title: string;
    due_date: string | null; // ISO string
    priority: string;
    status: string;
    project_name: string | null;
}

export interface QuickAccessProject {
    id: string;
    name: string;
    role: string;
    member_count: number;
    joined_at: string; // ISO string
}

export interface QuickAccessData {
    upcoming_meetings: QuickAccessMeeting[];
    recent_meetings: QuickAccessMeeting[];
    priority_tasks: QuickAccessTask[];
    active_projects: QuickAccessProject[];
}

export interface DashboardResponse {
    period: DashboardPeriod;
    scope: DashboardScope;
    tasks: TaskStats;
    meetings: MeetingStats;
    projects: ProjectStats;
    storage: StorageStats;
    quick_access: QuickAccessData;
}
