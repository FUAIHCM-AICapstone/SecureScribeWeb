'use client';

import { useRouter } from '@/i18n/navigation';
import {
  Badge,
  Body1,
  Button,
  Caption1,
  Card,
  Title1,
  Title2,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import {
  ArrowTrending24Regular,
  Calendar24Regular,
  CheckboxChecked24Regular,
  Clock24Regular,
  DocumentText24Regular,
  PeopleTeam24Regular,
  Star24Filled,
  VideoClip24Regular,
} from '@fluentui/react-icons';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '32px',
    borderRadius: tokens.borderRadiusXLarge,
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackground2} 100%)`,
    color: tokens.colorNeutralForegroundOnBrand,
    boxShadow: tokens.shadow16,
    '@media (max-width: 768px)': {
      padding: '24px',
    },
  },
  welcomeTitle: {
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: tokens.fontSizeHero900,
    fontWeight: 700,
  },
  welcomeSubtitle: {
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: tokens.fontSizeBase400,
    opacity: 0.9,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  statCard: {
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    transition: 'all 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    },
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  statIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: '20px',
  },
  statValue: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  statTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: tokens.fontSizeBase100,
    marginTop: '8px',
  },
  trendUp: {
    color: tokens.colorPaletteGreenForeground2,
  },
  trendDown: {
    color: tokens.colorPaletteRedForeground2,
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  listCard: {
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow4,
  },
  listItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    borderRadius: tokens.borderRadiusMedium,
    transition: 'background 0.2s ease',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  itemIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: tokens.borderRadiusMedium,
    flexShrink: 0,
    fontSize: '16px',
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
  },
  itemTitle: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  divider: {
    height: '1px',
    backgroundColor: tokens.colorNeutralStroke2,
    margin: '8px 0',
  },
  emptyState: {
    padding: '32px',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  iconBrand: {
    backgroundColor: `${tokens.colorBrandBackground}20`,
    color: tokens.colorBrandForeground1,
  },
  iconSuccess: {
    backgroundColor: `${tokens.colorPaletteGreenBackground2}40`,
    color: tokens.colorPaletteGreenForeground2,
  },
  iconWarning: {
    backgroundColor: `${tokens.colorPaletteYellowBackground2}40`,
    color: tokens.colorPaletteYellowForeground2,
  },
  iconInfo: {
    backgroundColor: `${tokens.colorPaletteBlueBackground2}40`,
    color: tokens.colorPaletteBlueForeground2,
  },
});

const Dashboard: React.FC = () => {
  const styles = useStyles();
  const router = useRouter();

  const stats = [
    {
      label: 'Nhiệm vụ đang thực hiện',
      value: 12,
      icon: <CheckboxChecked24Regular />,
      trend: '+3 từ tuần trước',
      trendUp: true,
      iconClass: styles.iconBrand,
    },
    {
      label: 'Dự án tham gia',
      value: 5,
      icon: <PeopleTeam24Regular />,
      trend: '+1 dự án mới',
      trendUp: true,
      iconClass: styles.iconSuccess,
    },
    {
      label: 'Cuộc họp tuần này',
      value: 8,
      icon: <VideoClip24Regular />,
      trend: '2 cuộc họp hôm nay',
      trendUp: false,
      iconClass: styles.iconInfo,
    },
    {
      label: 'Tài liệu gần đây',
      value: 24,
      icon: <DocumentText24Regular />,
      trend: '5 tài liệu mới',
      trendUp: true,
      iconClass: styles.iconWarning,
    },
  ];

  const recentTasks = [
    {
      id: 1,
      title: 'Hoàn thành báo cáo Q4',
      project: 'Dự án Alpha',
      dueDate: 'Hôm nay, 17:00',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Review code module thanh toán',
      project: 'Dự án Beta',
      dueDate: 'Ngày mai, 10:00',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Cập nhật tài liệu API',
      project: 'Dự án Gamma',
      dueDate: '15/11, 14:00',
      priority: 'low',
    },
    {
      id: 4,
      title: 'Meeting với team design',
      project: 'Dự án Alpha',
      dueDate: '16/11, 09:00',
      priority: 'medium',
    },
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Daily Standup',
      time: 'Hôm nay, 09:30',
      participants: 8,
      type: 'team',
    },
    {
      id: 2,
      title: 'Sprint Planning',
      time: 'Hôm nay, 14:00',
      participants: 12,
      type: 'project',
    },
    {
      id: 3,
      title: '1-on-1 với Manager',
      time: 'Ngày mai, 11:00',
      participants: 2,
      type: 'personal',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Nguyễn Văn A đã hoàn thành "Thiết kế UI Dashboard"',
      time: '10 phút trước',
      type: 'task',
    },
    {
      id: 2,
      title: 'Đã tạo cuộc họp "Sprint Review"',
      time: '30 phút trước',
      type: 'meeting',
    },
    {
      id: 3,
      title: 'Trần Thị B đã chia sẻ tài liệu "API Documentation"',
      time: '1 giờ trước',
      type: 'document',
    },
    {
      id: 4,
      title: 'Bạn đã được thêm vào dự án "Delta"',
      time: '2 giờ trước',
      type: 'project',
    },
  ];

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'danger' as const,
      medium: 'warning' as const,
      low: 'success' as const,
    };
    return colors[priority as keyof typeof colors] || ('subtle' as const);
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return 'Thấp';
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.welcomeSection}>
        <Title1 className={styles.welcomeTitle}>Chào mừng trở lại!</Title1>
        <Body1 className={styles.welcomeSubtitle}>
          Dưới đây là tổng quan về hoạt động và công việc của bạn
        </Body1>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={`${styles.statIcon} ${stat.iconClass}`}>
                {stat.icon}
              </div>
              <Star24Filled style={{ color: tokens.colorPaletteYellowForeground2, fontSize: '16px' }} />
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={`${styles.statTrend} ${stat.trendUp ? styles.trendUp : styles.trendDown}`}>
              <ArrowTrending24Regular style={{ fontSize: '14px' }} />
              <span>{stat.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Title2 className={styles.sectionTitle}>Nhiệm vụ gần đây</Title2>
            <Button appearance="subtle" size="small" onClick={() => router.push('/tasks')}>
              Xem tất cả
            </Button>
          </div>
          <Card className={styles.listCard}>
            {recentTasks.map((task, index) => (
              <React.Fragment key={task.id}>
                {index > 0 && <div className={styles.divider} />}
                <div className={styles.listItem}>
                  <div className={`${styles.itemIcon} ${styles.iconBrand}`}>
                    <CheckboxChecked24Regular />
                  </div>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{task.title}</div>
                    <div className={styles.itemMeta}>
                      <span>{task.project}</span>
                      <span>•</span>
                      <Clock24Regular style={{ fontSize: '14px' }} />
                      <span>{task.dueDate}</span>
                      <Badge appearance="filled" color={getPriorityBadge(task.priority)} size="small">
                        {getPriorityText(task.priority)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </Card>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Title2 className={styles.sectionTitle}>Cuộc họp sắp tới</Title2>
            <Button appearance="subtle" size="small" onClick={() => router.push('/meetings')}>
              Xem tất cả
            </Button>
          </div>
          <Card className={styles.listCard}>
            {upcomingMeetings.map((meeting, index) => (
              <React.Fragment key={meeting.id}>
                {index > 0 && <div className={styles.divider} />}
                <div className={styles.listItem}>
                  <div className={`${styles.itemIcon} ${styles.iconInfo}`}>
                    <VideoClip24Regular />
                  </div>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{meeting.title}</div>
                    <div className={styles.itemMeta}>
                      <Calendar24Regular style={{ fontSize: '14px' }} />
                      <span>{meeting.time}</span>
                      <span>•</span>
                      <span>{meeting.participants} người</span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </Card>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Title2 className={styles.sectionTitle}>Hoạt động gần đây</Title2>
          </div>
          <Card className={styles.listCard}>
            {recentActivity.map((activity, index) => (
              <React.Fragment key={activity.id}>
                {index > 0 && <div className={styles.divider} />}
                <div className={styles.listItem}>
                  <div className={`${styles.itemIcon} ${styles.iconSuccess}`}>
                    {activity.type === 'task' && <CheckboxChecked24Regular />}
                    {activity.type === 'meeting' && <VideoClip24Regular />}
                    {activity.type === 'document' && <DocumentText24Regular />}
                    {activity.type === 'project' && <PeopleTeam24Regular />}
                  </div>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{activity.title}</div>
                    <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                      {activity.time}
                    </Caption1>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
