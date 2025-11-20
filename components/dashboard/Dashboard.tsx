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
import React, { useEffect, useState } from 'react';

import { DashboardSkeleton } from './DashboardSkeleton';
import { DashboardHeader } from './DashboardHeader';
import { StatsGrid } from './StatsGrid';
import { StatCard } from './StatCard';
import { ContentGrid } from './ContentGrid';
import { ContentSection } from './ContentSection';

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
});

const Dashboard: React.FC = () => {
  const styles = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [period, setPeriod] = useState<DashboardPeriod>(DashboardPeriod.SEVEN_DAYS);
  const [scope, setScope] = useState<DashboardScope>(DashboardScope.HYBRID);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await statisticApi.getDashboardStats(period, scope);
      setData(response);
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats:', err);
      setError(err.message || 'Không thể tải dữ liệu thống kê');
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'completed':
        return { bg: tokens.colorPaletteGreenBackground2, color: tokens.colorPaletteGreenForeground1 };
      case 'in_progress':
      case 'active':
        return { bg: tokens.colorPaletteBlueBackground2, color: tokens.colorPaletteDarkOrangeForeground1 };
      case 'todo':
      case 'pending':
        return { bg: tokens.colorPaletteYellowBackground2, color: tokens.colorPaletteYellowForeground1 };
      case 'overdue':
      case 'cancelled':
        return { bg: tokens.colorPaletteRedBackground2, color: tokens.colorPaletteRedForeground1 };
      default:
        return { bg: tokens.colorNeutralBackground3, color: tokens.colorNeutralForeground3 };
    }
  };

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className={styles.root}>
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>Lỗi</MessageBarTitle>
            {error}
            <Button onClick={fetchData} style={{ marginTop: '8px' }}>Thử lại</Button>
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
            label="Nhiệm vụ được giao"
            metaIcon={<CheckmarkCircle24Regular fontSize={16} />}
            metaText={`${data.tasks.completion_rate}% hoàn thành`}
            progress={{ value: data.tasks.completion_rate, color: 'brand' }}
            extraContent={
              data.tasks.overdue_count > 0 && (
                <span style={{ color: tokens.colorPaletteRedForeground1, fontSize: '12px', fontWeight: 600 }}>
                  {data.tasks.overdue_count} quá hạn
                </span>
              )
            }
          />
          <StatCard
            icon={<VideoClip24Regular />}
            iconColor={{ bg: tokens.colorPaletteGreenBackground2, color: tokens.colorPaletteGreenForeground1 }}
            value={data.meetings.total_count}
            label="Cuộc họp tham gia"
            metaIcon={<Timer24Regular fontSize={16} />}
            metaText={`${data.meetings.total_duration_minutes} phút tổng cộng`}
            progress={{ value: 75, color: 'success' }} // Dummy progress for visual balance
          />
          <StatCard
            icon={<PeopleTeam24Regular />}
            iconColor={{ bg: tokens.colorPaletteYellowBackground2, color: tokens.colorPaletteYellowForeground1 }}
            value={data.projects.total_active}
            label="Dự án đang hoạt động"
            metaText={`${data.projects.role_admin_count} quản trị viên • ${data.projects.role_member_count} thành viên`}
            progress={{ value: 60, color: 'warning' }} // Dummy progress
          />
          <StatCard
            icon={<DocumentText24Regular />}
            iconColor={{ bg: tokens.colorPaletteRedBackground2, color: tokens.colorPaletteRedForeground1 }}
            value={data.storage.total_files}
            label="Tài liệu đã tải lên"
            metaText={`${data.storage.total_size_mb} MB sử dụng`}
            progress={{ value: (data.storage.total_size_mb / 1024) * 100, color: 'error' }} // Assuming 1GB limit
          />
        </StatsGrid>
      )}

      {data && (
        <ContentGrid>
          <ContentSection
            title="Cuộc họp sắp tới"
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
                <div className={styles.itemIcon} style={{ backgroundColor: tokens.colorPaletteBlueBackground2, color: tokens.colorPaletteDarkOrangeForeground1 }}>
                  <CalendarLtr24Regular />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{meeting.title || 'Cuộc họp không tên'}</div>
                  <div className={styles.itemSubtitle}>
                    <Clock24Regular fontSize={16} />
                    {formatDate(meeting.start_time)}
                  </div>
                </div>
              </div>
            ))}
          </ContentSection>

          <ContentSection
            title="Nhiệm vụ ưu tiên"
            onViewAll={() => router.push('/tasks')}
            isEmpty={data.quick_access.priority_tasks.length === 0}
            emptyMessage="Không có nhiệm vụ cần xử lý gấp"
          >
            {data.quick_access.priority_tasks.map((task: any) => {
              const statusStyle = getStatusColor(task.status);
              return (
                <div
                  key={task.id}
                  className={styles.listItem}
                  onClick={() => router.push(`/tasks/${task.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push(`/tasks/${task.id}`);
                    }
                  }}
                >
                  <div className={styles.itemIcon} style={{ backgroundColor: tokens.colorPaletteRedBackground2, color: tokens.colorPaletteRedForeground1 }}>
                    <Important24Regular />
                  </div>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{task.title}</div>
                    <div className={styles.itemSubtitle}>
                      {task.project_name && <span>{task.project_name} • </span>}
                      Hạn: {formatDate(task.due_date)}
                    </div>
                  </div>
                  <div className={styles.statusBadge} style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                    {task.status}
                  </div>
                </div>
              );
            })}
          </ContentSection>

          <ContentSection
            title="Dự án gần đây"
            onViewAll={() => router.push('/projects')}
            isEmpty={data.quick_access.active_projects.length === 0}
            emptyMessage="Chưa tham gia dự án nào"
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
                <div className={styles.itemIcon} style={{ backgroundColor: tokens.colorBrandBackground2, color: tokens.colorBrandForeground1 }}>
                  <PeopleTeam24Regular />
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemTitle}>{project.name}</div>
                  <div className={styles.itemSubtitle}>
                    {project.member_count} thành viên • {project.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                  </div>
                </div>
              </div>
            ))}
          </ContentSection>
        </ContentGrid>
      )}
    </div>
  );
};

export default Dashboard;
