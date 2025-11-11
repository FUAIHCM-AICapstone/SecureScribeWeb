'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Badge,
  Body1,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Caption1,
  Title1,
  Title3,
  makeStyles,
  tokens,
  shorthands,
  Skeleton,
  SkeletonItem,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';
import { Home24Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import { useDashboardData } from '@/hooks/useDashboardData';
import {
  DonutChart,
  BarChart,
  LineChart,
  PieChart,
  type DonutChartData,
  type BarChartData,
  type LineChartData,
  type PieChartData,
} from './charts';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
    gap: '32px',
    width: '100%',
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
    marginBottom: '0',
    padding: '24px',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow4,
    '@media (max-width: 768px)': {
      padding: '16px',
    },
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  iconBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorBrandBackground,
    boxShadow: tokens.shadow8,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  introTitle: {
    color: tokens.colorBrandForeground1,
    fontWeight: 700,
    fontSize: tokens.fontSizeHero900,
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
  },
  introDescription: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: '1.5',
    margin: '0',
    fontWeight: '400',
  },
  grid: {
    display: 'grid',
    gap: tokens.spacingHorizontalL,
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: tokens.spacingHorizontalXL,
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '280px',
    maxWidth: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px ${tokens.colorNeutralShadowAmbient}, 0 0 0 1px ${tokens.colorBrandBackground}`,
    },
  },
  cardHeader: {
    padding: '16px 16px 8px',
    flexShrink: 0,
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexGrow: 1,
    padding: '0 16px 16px',
    color: tokens.colorNeutralForeground2,
  },
  description: {
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    fontWeight: '400',
    listStyle: 'none',
    margin: '0',
    padding: '0',
  },
  statsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '8px',
  },
  chartContainer: {
    width: '100%',
    height: '200px',
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadge: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: tokens.borderRadiusMedium,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '12px 16px',
    flexShrink: 0,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface DashboardAction {
  label: string;
  appearance?: ButtonProps['appearance'];
}

interface DashboardStat {
  label: string;
  value: string | number;
}

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  accentColor:
    | 'brand'
    | 'success'
    | 'warning'
    | 'danger'
    | 'informative'
    | 'subtle';
  stats: DashboardStat[];
  primaryAction: DashboardAction;
  secondaryAction: DashboardAction;
  loading?: boolean;
  error?: string | null;
  chartData?:
    | DonutChartData[]
    | BarChartData[]
    | LineChartData[]
    | PieChartData[];
}

const Dashboard: React.FC = () => {
  const styles = useStyles();
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const dashboardData = useDashboardData();

  // Enhanced Task Stats Calculation
  const calculateTaskStats = () => {
    const tasks = dashboardData.tasks.data;
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const completed = tasks.filter((t) => t.status === 'done').length;
    const pending = todo + inProgress;

    // Calculate completion rate
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate overdue tasks
    const now = new Date();
    const overdue = tasks.filter((t) => {
      if (!t.due_date || t.status === 'done') return false;
      return new Date(t.due_date) < now;
    }).length;

    // Calculate due this week
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    const dueThisWeek = tasks.filter((t) => {
      if (!t.due_date || t.status === 'done') return false;
      const dueDate = new Date(t.due_date);
      return dueDate >= now && dueDate <= weekEnd;
    }).length;

    // Chart data for donut
    const chartData: DonutChartData[] = [
      {
        name: t('stats.todo'),
        value: todo,
        color: tokens.colorPaletteBlueForeground2,
      },
      {
        name: t('stats.inProgress'),
        value: inProgress,
        color: tokens.colorPaletteYellowForeground2,
      },
      {
        name: t('stats.completed'),
        value: completed,
        color: tokens.colorPaletteGreenForeground2,
      },
    ].filter((item) => item.value > 0);

    return {
      total,
      todo,
      inProgress,
      completed,
      pending,
      completionRate,
      overdue,
      dueThisWeek,
      chartData,
    };
  };

  // Enhanced Project Stats Calculation
  const calculateProjectStats = () => {
    const projects = dashboardData.projects.data;
    const total = projects.length;
    const active = projects.filter((p) => !p.is_archived).length;
    const archived = projects.filter((p) => p.is_archived).length;
    const totalMembers = projects.reduce(
      (sum, p) => sum + (p.member_count || 0),
      0,
    );
    const avgMembers = active > 0 ? Math.round(totalMembers / active) : 0;

    // Chart data for bar (projects over time - last 7 days)
    const chartData: BarChartData[] = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
      });
      const count = projects.filter((p) => {
        if (!p.created_at) return false;
        const createdDate = new Date(p.created_at);
        return createdDate.toDateString() === date.toDateString();
      }).length;
      chartData.push({ name: dayName, value: count });
    }

    return { total, active, archived, totalMembers, avgMembers, chartData };
  };

  // Enhanced Meeting Stats Calculation
  const calculateMeetingStats = () => {
    const meetings = dashboardData.meetings.data;
    const total = meetings.length;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const nextWeekEnd = new Date(weekEnd);
    nextWeekEnd.setDate(weekEnd.getDate() + 7);

    const todayCount = meetings.filter((m) => {
      if (!m.start_time) return false;
      const meetingDate = new Date(m.start_time);
      return (
        meetingDate >= today &&
        meetingDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
      );
    }).length;

    const thisWeekCount = meetings.filter((m) => {
      if (!m.start_time) return false;
      const meetingDate = new Date(m.start_time);
      return meetingDate >= weekStart && meetingDate < weekEnd;
    }).length;

    const nextWeekCount = meetings.filter((m) => {
      if (!m.start_time) return false;
      const meetingDate = new Date(m.start_time);
      return meetingDate >= weekEnd && meetingDate < nextWeekEnd;
    }).length;

    // Chart data for line (meetings over last 7 days)
    const chartData: LineChartData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
      });
      const count = meetings.filter((m) => {
        if (!m.start_time) return false;
        const meetingDate = new Date(m.start_time);
        return meetingDate.toDateString() === date.toDateString();
      }).length;
      chartData.push({ name: dayName, value: count });
    }

    return {
      total,
      today: todayCount,
      thisWeek: thisWeekCount,
      nextWeek: nextWeekCount,
      chartData,
    };
  };

  // Enhanced Transcript Stats Calculation
  const calculateTranscriptStats = () => {
    const transcripts = dashboardData.transcripts.data;
    const total = transcripts.length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const lastWeek = transcripts.filter((m) => {
      if (!m.created_at) return false;
      return new Date(m.created_at) >= sevenDaysAgo;
    }).length;

    const lastMonth = transcripts.filter((m) => {
      if (!m.created_at) return false;
      return new Date(m.created_at) >= thirtyDaysAgo;
    }).length;

    // Chart data for bar (transcripts created over last 7 days)
    const chartData: BarChartData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
      });
      const count = transcripts.filter((m) => {
        if (!m.created_at) return false;
        const createdDate = new Date(m.created_at);
        return createdDate.toDateString() === date.toDateString();
      }).length;
      chartData.push({ name: dayName, value: count });
    }

    return { total, lastWeek, lastMonth, chartData };
  };

  // Enhanced Note Stats Calculation
  const calculateNoteStats = () => {
    const notes = dashboardData.notes.data;
    const total = notes.length;
    const shared = notes.filter((m) => !m.is_personal).length;
    const private_ = notes.filter((m) => m.is_personal).length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const editedThisWeek = notes.filter((m) => {
      if (!m.updated_at) return false;
      return new Date(m.updated_at) >= sevenDaysAgo;
    }).length;

    // Chart data for pie
    const chartData: PieChartData[] = [
      {
        name: t('stats.shared'),
        value: shared,
        color: tokens.colorPaletteBlueForeground2,
      },
      {
        name: t('stats.private'),
        value: private_,
        color: tokens.colorPaletteGreenForeground2,
      },
    ].filter((item) => item.value > 0);

    return { total, shared, private: private_, editedThisWeek, chartData };
  };

  // Enhanced Quick Action Stats Calculation
  const calculateQuickActionStats = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const tasksCreated = dashboardData.tasks.data.filter(
      (t) => t.created_at && new Date(t.created_at) >= sevenDaysAgo,
    ).length;

    const meetingsCreated = dashboardData.meetings.data.filter(
      (m) => m.created_at && new Date(m.created_at) >= sevenDaysAgo,
    ).length;

    const filesThisWeek = dashboardData.files.data.filter(
      (f) => f.created_at && new Date(f.created_at) >= sevenDaysAgo,
    ).length;

    const recentCount = tasksCreated + meetingsCreated + filesThisWeek;

    // Chart data for bar (activity over last 7 days)
    const chartData: BarChartData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en', {
        day: 'numeric',
        month: 'short',
      });

      const dayTasks = dashboardData.tasks.data.filter((t) => {
        if (!t.created_at) return false;
        return new Date(t.created_at).toDateString() === date.toDateString();
      }).length;

      const dayMeetings = dashboardData.meetings.data.filter((m) => {
        if (!m.created_at) return false;
        return new Date(m.created_at).toDateString() === date.toDateString();
      }).length;

      const dayFiles = dashboardData.files.data.filter((f) => {
        if (!f.created_at) return false;
        return new Date(f.created_at).toDateString() === date.toDateString();
      }).length;

      chartData.push({
        name: dayName,
        value: dayTasks + dayMeetings + dayFiles,
      });
    }

    return {
      recentCount,
      tasksCreated,
      meetingsCreated,
      filesThisWeek,
      chartData,
    };
  };

  const taskStats = calculateTaskStats();
  const projectStats = calculateProjectStats();
  const meetingStats = calculateMeetingStats();
  const transcriptStats = calculateTranscriptStats();
  const noteStats = calculateNoteStats();
  const quickActionStats = calculateQuickActionStats();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const cards: DashboardCard[] = [
    {
      id: 'my-tasks',
      title: t('cards.myTasks.title'),
      description: t('cards.myTasks.description'),
      accentColor: 'brand',
      stats: [
        { label: t('stats.total'), value: taskStats.total },
        { label: t('stats.pending'), value: taskStats.pending },
        { label: t('stats.completed'), value: taskStats.completed },
        {
          label: t('stats.completionRate'),
          value: `${taskStats.completionRate}%`,
        },
        { label: t('stats.overdue'), value: taskStats.overdue },
        { label: t('stats.dueThisWeek'), value: taskStats.dueThisWeek },
      ],
      chartData: taskStats.chartData,
      primaryAction: {
        label: t('cards.myTasks.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.myTasks.secondaryAction'),
        appearance: 'secondary',
      },
      loading: dashboardData.tasks.loading,
      error: dashboardData.tasks.error,
    },
    {
      id: 'team-project',
      title: t('cards.teamProject.title'),
      description: t('cards.teamProject.description'),
      accentColor: 'success',
      stats: [
        { label: t('stats.total'), value: projectStats.total },
        { label: t('stats.active'), value: projectStats.active },
        { label: t('stats.archived'), value: projectStats.archived },
        { label: t('stats.avgMembers'), value: projectStats.avgMembers },
      ],
      chartData: projectStats.chartData,
      primaryAction: {
        label: t('cards.teamProject.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.teamProject.secondaryAction'),
        appearance: 'secondary',
      },
      loading: dashboardData.projects.loading,
      error: dashboardData.projects.error,
    },
    {
      id: 'my-meetings',
      title: t('cards.myMeetings.title'),
      description: t('cards.myMeetings.description'),
      accentColor: 'informative',
      stats: [
        { label: t('stats.total'), value: meetingStats.total },
        { label: t('stats.today'), value: meetingStats.today },
        { label: t('stats.thisWeek'), value: meetingStats.thisWeek },
        { label: t('stats.nextWeek'), value: meetingStats.nextWeek },
      ],
      chartData: meetingStats.chartData,
      primaryAction: {
        label: t('cards.myMeetings.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.myMeetings.secondaryAction'),
        appearance: 'secondary',
      },
      loading: dashboardData.meetings.loading,
      error: dashboardData.meetings.error,
    },
    {
      id: 'recent-transcripts',
      title: t('cards.recentTranscripts.title'),
      description: t('cards.recentTranscripts.description'),
      accentColor: 'danger',
      stats: [
        { label: t('stats.total'), value: transcriptStats.total },
        { label: t('stats.lastWeek'), value: transcriptStats.lastWeek },
        { label: t('stats.lastMonth'), value: transcriptStats.lastMonth },
      ],
      chartData: transcriptStats.chartData,
      primaryAction: {
        label: t('cards.recentTranscripts.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.recentTranscripts.secondaryAction'),
        appearance: 'secondary',
      },
      loading: dashboardData.transcripts.loading,
      error: dashboardData.transcripts.error,
    },
    {
      id: 'recent-notes',
      title: t('cards.recentNotes.title'),
      description: t('cards.recentNotes.description'),
      accentColor: 'subtle',
      stats: [
        { label: t('stats.total'), value: noteStats.total },
        { label: t('stats.shared'), value: noteStats.shared },
        { label: t('stats.private'), value: noteStats.private },
        { label: t('stats.editedThisWeek'), value: noteStats.editedThisWeek },
      ],
      chartData: noteStats.chartData,
      primaryAction: {
        label: t('cards.recentNotes.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.recentNotes.secondaryAction'),
        appearance: 'secondary',
      },
      loading: dashboardData.notes.loading,
      error: dashboardData.notes.error,
    },
    {
      id: 'quick-actions',
      title: t('cards.quickActions.title'),
      description: t('cards.quickActions.description'),
      accentColor: 'warning',
      stats: [
        {
          label: t('stats.recentActivity'),
          value: quickActionStats.recentCount,
        },
        {
          label: t('stats.tasksCreated'),
          value: quickActionStats.tasksCreated,
        },
        {
          label: t('stats.meetingsCreated'),
          value: quickActionStats.meetingsCreated,
        },
        {
          label: t('stats.filesThisWeek'),
          value: quickActionStats.filesThisWeek,
        },
      ],
      chartData: quickActionStats.chartData,
      primaryAction: {
        label: t('cards.quickActions.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.quickActions.secondaryAction'),
        appearance: 'secondary',
      },
      loading: false,
      error: null,
    },
  ];

  return (
    <section className={styles.root}>
      <div className={styles.intro}>
        {/* Top Row: Title with Icon */}
        <div className={styles.topRow}>
          <div className={styles.titleContainer}>
            <div className={styles.iconBadge}>
              <Home24Regular />
            </div>
            <Title1 className={styles.introTitle}>{t('title')}</Title1>
          </div>
        </div>

        {/* Bottom Row: Description */}
        <div className={styles.bottomRow}>
          <Body1 className={styles.introDescription}>{t('description')}</Body1>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => {
          // Determine navigation path based on card ID
          const getNavigationPath = (cardId: string) => {
            switch (cardId) {
              case 'my-tasks':
                return '/tasks';
              case 'team-project':
                return '/projects';
              case 'my-meetings':
                return '/meetings';
              case 'recent-transcripts':
                return '/meetings';
              case 'recent-notes':
                return '/meetings';
              case 'quick-actions':
                return '/dashboard';
              default:
                return '/dashboard';
            }
          };

          return (
            <Card key={card.id} appearance="subtle" className={styles.card}>
              <CardHeader
                className={styles.cardHeader}
                header={<Title3 as="h3">{card.title}</Title3>}
                description={<Caption1>{card.description}</Caption1>}
              />

              <div className={styles.cardBody}>
                {card.loading ? (
                  // Loading skeleton
                  <>
                    <Skeleton>
                      <SkeletonItem size={120} />
                    </Skeleton>
                    <Skeleton>
                      <SkeletonItem />
                    </Skeleton>
                    <Skeleton>
                      <SkeletonItem />
                    </Skeleton>
                  </>
                ) : card.error ? (
                  // Error message
                  <MessageBar intent="error">
                    <MessageBarBody>{card.error}</MessageBarBody>
                  </MessageBar>
                ) : (
                  // Normal content
                  <>
                    <div className={styles.statsContainer}>
                      {card.stats.map((stat, index) => (
                        <Badge
                          key={index}
                          appearance="outline"
                          className={styles.statBadge}
                        >
                          {stat.label}: {stat.value}
                        </Badge>
                      ))}
                    </div>

                    {/* Chart Visualization */}
                    {card.chartData && card.chartData.length > 0 && (
                      <div className={styles.chartContainer}>
                        {card.id === 'my-tasks' && (
                          <DonutChart
                            data={card.chartData as DonutChartData[]}
                          />
                        )}
                        {card.id === 'team-project' && (
                          <BarChart data={card.chartData as BarChartData[]} />
                        )}
                        {card.id === 'my-meetings' && (
                          <LineChart data={card.chartData as LineChartData[]} />
                        )}
                        {card.id === 'recent-transcripts' && (
                          <BarChart data={card.chartData as BarChartData[]} />
                        )}
                        {card.id === 'recent-notes' && (
                          <PieChart data={card.chartData as PieChartData[]} />
                        )}
                        {card.id === 'quick-actions' && (
                          <BarChart data={card.chartData as BarChartData[]} />
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {!card.loading && !card.error && (
                <CardFooter className={styles.footer}>
                  <Button
                    appearance={card.primaryAction.appearance}
                    size="small"
                    onClick={() => handleNavigation(getNavigationPath(card.id))}
                  >
                    {card.primaryAction.label}
                  </Button>
                  <Button
                    appearance={card.secondaryAction.appearance}
                    size="small"
                    onClick={() => handleNavigation(getNavigationPath(card.id))}
                  >
                    {card.secondaryAction.label}
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Dashboard;
