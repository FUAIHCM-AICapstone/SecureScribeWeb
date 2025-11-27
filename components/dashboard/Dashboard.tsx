/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import statisticApi from '@/services/api/statistic';
import {
  DashboardPeriod,
  DashboardResponse,
  DashboardScope
} from 'types/statistic.type';
import {
  Button,
  makeStyles,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  OptionOnSelectData,
  SelectionEvents,
  tokens,
  Badge,
} from '@fluentui/react-components';
import {
  CalendarLtr24Regular,
  CheckboxChecked24Regular,
  CheckmarkCircle24Regular,
  Clock24Regular,
  DocumentText24Regular,
  Important24Regular,
  PeopleTeam24Regular,
  Timer24Regular,
  VideoClip24Regular
} from '@fluentui/react-icons';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { DashboardSkeleton } from './DashboardSkeleton';
import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { StatCard } from './StatCard';
import { ContentGrid } from './ContentGrid';
import { ContentSection } from './ContentSection';
import { ChartSection } from './ChartSection';
import { TaskDetailsModal } from '@/app/[locale]/tasks/components/TaskDetailsModal';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    padding: '24px',
    boxSizing: 'border-box',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
  itemIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemSubtitle: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  statusBadge: {
    padding: '2px 8px',
    borderRadius: tokens.borderRadiusCircular,
    fontSize: tokens.fontSizeBase100,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  // Icon colors
  iconBrand: { backgroundColor: tokens.colorBrandBackground2, color: tokens.colorBrandForeground1 },
  iconSuccess: { backgroundColor: tokens.colorPaletteGreenBackground2, color: tokens.colorPaletteGreenForeground1 },
  iconWarning: { backgroundColor: tokens.colorPaletteYellowBackground2, color: tokens.colorPaletteYellowForeground1 },
  iconDanger: { backgroundColor: tokens.colorPaletteRedBackground2, color: tokens.colorPaletteRedForeground1 },
  iconInfo: { backgroundColor: tokens.colorPaletteBlueBackground2, color: tokens.colorPaletteBlueForeground2 },
});

const Dashboard: React.FC = () => {
  const styles = useStyles();
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const tTasks = useTranslations('Tasks');
  const tMeetings = useTranslations('Meetings');
  const tProjects = useTranslations('Projects');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [period, setPeriod] = useState<DashboardPeriod>(DashboardPeriod.SEVEN_DAYS);
  const [scope, setScope] = useState<DashboardScope>(DashboardScope.HYBRID);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statisticApi.getDashboardStats(period, scope);
      console.log('[Dashboard] API Response:', response);
      console.log('[Dashboard] Chart Data:', response?.chart_data);
      setData(response);
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err.message || t('errorLoadingStats'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, scope]);

  const handlePeriodChange = (e: SelectionEvents, data: OptionOnSelectData) => {
    if (data.optionValue) {
      setPeriod(data.optionValue as DashboardPeriod);
    }
  };

  const handleScopeChange = (e: SelectionEvents, data: OptionOnSelectData) => {
    if (data.optionValue) {
      setScope(data.optionValue as DashboardScope);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return (
          <Badge appearance="filled" color="warning" size="small">
            {tTasks('status.todo')}
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge appearance="filled" color="informative" size="small">
            {tTasks('status.in_progress')}
          </Badge>
        );
      case 'done':
        return (
          <Badge appearance="filled" color="success" size="small">
            {tTasks('status.done')}
          </Badge>
        );
      default:
        return (
          <Badge appearance="outline" size="small">
            {status}
          </Badge>
        );
    }
  };

  const getMeetingStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge appearance="filled" color="success" size="small">
            {tMeetings('status.active')}
          </Badge>
        );
      case 'completed':
        return (
          <Badge appearance="filled" color="informative" size="small">
            {tMeetings('status.completed')}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge appearance="filled" color="danger" size="small">
            {tMeetings('status.cancelled')}
          </Badge>
        );
      case 'archived':
        return (
          <Badge appearance="filled" color="warning" size="small">
            {tMeetings('status.archived')}
          </Badge>
        );
      default:
        return (
          <Badge appearance="outline" size="small">
            {status}
          </Badge>
        );
    }
  };

  const getProjectStatusBadge = (project: any) => {
    if (project.is_archived) {
      return (
        <Badge appearance="filled" color="warning" size="small">
          {tProjects('status.archived')}
        </Badge>
      );
    }
    return (
      <Badge appearance="filled" color="success" size="small">
        {tProjects('status.active')}
      </Badge>
    );
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
    setSelectedTaskId(null);
  };

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.root}>
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>{t('errorTitle')}</MessageBarTitle>
            {error}
            <Button onClick={fetchData} style={{ marginTop: '8px' }}>{t('retry')}</Button>
          </MessageBarBody>
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <DashboardHeader
        scope={scope}
        period={period}
        onScopeChange={handleScopeChange}
        onPeriodChange={handlePeriodChange}
      />

      {data && (
        <StatsGrid>
          <StatCard
            icon={<CheckboxChecked24Regular />}
            iconColor={{ bg: tokens.colorBrandBackground2, color: tokens.colorBrandForeground1 }}
            value={data.tasks.total_assigned}
            label={t('tasksAssigned')}
            metaIcon={<CheckmarkCircle24Regular fontSize={16} />}
            metaText={`${data.tasks.completion_rate}% ${t('completed')}`}
            extraContent={
              data.tasks.overdue_count > 0 && (
                <span style={{ color: tokens.colorPaletteRedForeground1, fontSize: '12px', fontWeight: 600 }}>
                  {data.tasks.overdue_count} {t('overdue')}
                </span>
              )
            }
          />
          <StatCard
            icon={<VideoClip24Regular />}
            iconColor={{ bg: tokens.colorPaletteGreenBackground2, color: tokens.colorPaletteGreenForeground1 }}
            value={data.meetings.total_count}
            label={t('meetingsJoined')}
            metaIcon={<Timer24Regular fontSize={16} />}
            metaText={`${data.meetings.total_duration_minutes} ${t('totalMinutes')}`}
          />
          <StatCard
            icon={<PeopleTeam24Regular />}
            iconColor={{ bg: tokens.colorPaletteYellowBackground2, color: tokens.colorPaletteYellowForeground1 }}
            value={data.projects.total_active}
            label={t('activeProjects')}
            metaText={`${data.projects.role_admin_count} ${t('adminsMembers')} ${data.projects.role_member_count}`}
          />
          <StatCard
            icon={<DocumentText24Regular />}
            iconColor={{ bg: tokens.colorPaletteRedBackground2, color: tokens.colorPaletteRedForeground1 }}
            value={data.storage.total_files}
            label={t('filesUploaded')}
            metaText={`${data.storage.total_size_mb} ${t('mbUsed')}`}
          />
        </StatsGrid>
      )}

      {data && data.chart_data && data.chart_data.length > 0 && (
        <ChartSection title={t('taskActivity')} data={data.chart_data} />
      )}

      {data && (!data.chart_data || data.chart_data.length === 0) && (
        <MessageBar intent="warning">
          <MessageBarBody>
            <MessageBarTitle>{t('noChartData')}</MessageBarTitle>
            No activity data available for the selected period
          </MessageBarBody>
        </MessageBar>
      )}

      {data && (
        <ContentGrid>
          <ContentSection
            title={t('upcomingMeetings')}
            onViewAll={() => router.push('/meetings')}
            isEmpty={data.quick_access.upcoming_meetings.length === 0}
          >
            {data.quick_access.upcoming_meetings.map((meeting: any) => (
              <div
                key={meeting.id}
                className={styles.listItem}
                onClick={() => router.push(`/meetings/${meeting.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/meetings/${meeting.id}`);
                  }
                }}
              >
                <div className={`${styles.itemIcon} ${styles.iconInfo}`}>
                  <CalendarLtr24Regular />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{meeting.title || t('untitledMeeting')}</div>
                  <div className={styles.itemSubtitle}>
                    <Clock24Regular fontSize={16} />
                    {formatDate(meeting.start_time)}
                  </div>
                </div>
                {getMeetingStatusBadge(meeting.status)}
              </div>
            ))}
          </ContentSection>

          <ContentSection
            title={t('priorityTasks')}
            onViewAll={() => router.push('/tasks')}
            isEmpty={data.quick_access.priority_tasks.length === 0}
            emptyMessage={t('noUrgentTasks')}
          >
            {data.quick_access.priority_tasks.map((task: any) => (
              <div
                key={task.id}
                className={styles.listItem}
                onClick={() => handleTaskClick(task.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTaskClick(task.id);
                  }
                }}
              >
                <div className={`${styles.itemIcon} ${styles.iconDanger}`}>
                  <Important24Regular />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{task.title}</div>
                  <div className={styles.itemSubtitle}>
                    {task.project_name && <span>{task.project_name} • </span>}
                    {t('due')}: {formatDate(task.due_date)}
                  </div>
                </div>
                {getStatusBadge(task.status)}
              </div>
            ))}
          </ContentSection>

          <ContentSection
            title={t('recentProjects')}
            onViewAll={() => router.push('/projects')}
            isEmpty={data.quick_access.active_projects.length === 0}
            emptyMessage={t('noProjectsJoined')}
          >
            {data.quick_access.active_projects.map((project: any) => (
              <div
                key={project.id}
                className={styles.listItem}
                onClick={() => router.push(`/projects/${project.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(`/projects/${project.id}`);
                  }
                }}
              >
                <div className={`${styles.itemIcon} ${styles.iconBrand}`}>
                  <PeopleTeam24Regular />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{project.name}</div>
                  <div className={styles.itemSubtitle}>
                    {tProjects('memberCount', { count: project.member_count || 0 })} • {project.role === 'admin' ? tProjects('roleAdmin') : tProjects('roleMember')}
                  </div>
                </div>
                {getProjectStatusBadge(project)}
              </div>
            ))}
          </ContentSection>
        </ContentGrid>
      )}

      <TaskDetailsModal
        taskId={selectedTaskId || ''}
        open={isTaskModalOpen}
        onClose={handleTaskModalClose}
      />
    </div>
  );
};

export default Dashboard;
