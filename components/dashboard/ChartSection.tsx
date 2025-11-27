import { makeStyles, tokens } from '@fluentui/react-components';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../../types/statistic.type';

const useStyles = makeStyles({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '24px',
    borderRadius: tokens.borderRadiusXLarge,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: tokens.shadow8,
  },
  sectionHeader: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  chartWrapper: {
    width: '100%',
    height: '380px',
    position: 'relative',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '380px',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
  },
  legendWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: tokens.borderRadiusCircular,
  },
});

interface ChartSectionProps {
  title: string;
  taskData?: ChartDataPoint[];
  meetingData?: ChartDataPoint[];
  // Legacy support for single data prop
  data?: ChartDataPoint[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ title, taskData, meetingData, data }) => {
  const styles = useStyles();
  const t = useTranslations('Dashboard');

  // Format and merge data for recharts - combine both datasets by date
  const formattedData = useMemo(() => {
    const primaryData = taskData || data || [];
    const secondaryData = meetingData || [];

    // Create a map of all dates
    const dateMap = new Map<string, { date: string; tasks: number; meetings: number }>();

    // Process primary (task) data
    primaryData.forEach(point => {
      const dateKey = point.date;
      const formattedDate = new Date(point.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: formattedDate, tasks: 0, meetings: 0 });
      }
      dateMap.get(dateKey)!.tasks = point.count || 0;
    });

    // Process secondary (meeting) data
    secondaryData.forEach(point => {
      const dateKey = point.date;
      const formattedDate = new Date(point.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' });
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: formattedDate, tasks: 0, meetings: 0 });
      }
      dateMap.get(dateKey)!.meetings = point.count || 0;
    });

    // Sort by date and return as array
    return Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => value);
  }, [taskData, meetingData, data]);

  // Determine if we have dual data or single data mode
  const isDualMode = Boolean(taskData && meetingData);
  
  // Check if we have any valid data points
  const hasTaskData = formattedData.some(d => d.tasks > 0);
  const hasMeetingData = formattedData.some(d => d.meetings > 0);
  const hasData = formattedData.length > 0 && (hasTaskData || hasMeetingData);
  
  // Calculate max value for Y axis with some padding
  const maxTasks = Math.max(...formattedData.map(d => d.tasks || 0), 1);
  const maxMeetings = Math.max(...formattedData.map(d => d.meetings || 0), 1);
  const maxValue = Math.max(maxTasks, maxMeetings);
  const yAxisMax = Math.ceil(maxValue * 1.2 / 5) * 5 || 10; // Round up to nearest 5, minimum 10

  // Colors for the two lines
  const taskColor = tokens.colorPaletteBlueForeground2;
  const meetingColor = tokens.colorPaletteGreenForeground1;

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.sectionHeader}>{title}</div>
      {hasData ? (
        <>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke={tokens.colorNeutralForeground3}
                  tick={{ fontSize: 12, fill: tokens.colorNeutralForeground3 }}
                  axisLine={{ stroke: tokens.colorNeutralStroke2 }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  domain={[0, yAxisMax]}
                  stroke={tokens.colorNeutralForeground3}
                  tick={{ fontSize: 12, fill: tokens.colorNeutralForeground3 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tokens.colorNeutralBackground1,
                    border: `1px solid ${tokens.colorNeutralStroke1}`,
                    borderRadius: tokens.borderRadiusLarge,
                    padding: '12px 16px',
                    boxShadow: tokens.shadow16,
                  }}
                  labelStyle={{ color: tokens.colorNeutralForeground1, fontWeight: 600, marginBottom: '8px' }}
                  formatter={(value: number, name: string) => {
                    const label = name === 'tasks' ? t('tasksCreated') : t('meetingsHeld');
                    return [value, label];
                  }}
                  cursor={{ stroke: tokens.colorNeutralStroke1, strokeDasharray: '4 4' }}
                />
                {(isDualMode || !meetingData) && hasTaskData && (
                  <Line
                    type="monotone"
                    dataKey="tasks"
                    name="tasks"
                    stroke={taskColor}
                    strokeWidth={3}
                    dot={{ fill: taskColor, r: 4, strokeWidth: 2, stroke: tokens.colorNeutralBackground1 }}
                    activeDot={{ r: 6, fill: taskColor, strokeWidth: 3, stroke: tokens.colorNeutralBackground1 }}
                    isAnimationActive={true}
                    connectNulls={true}
                  />
                )}
                {isDualMode && hasMeetingData && (
                  <Line
                    type="monotone"
                    dataKey="meetings"
                    name="meetings"
                    stroke={meetingColor}
                    strokeWidth={3}
                    dot={{ fill: meetingColor, r: 4, strokeWidth: 2, stroke: tokens.colorNeutralBackground1 }}
                    activeDot={{ r: 6, fill: meetingColor, strokeWidth: 3, stroke: tokens.colorNeutralBackground1 }}
                    isAnimationActive={true}
                    connectNulls={true}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {isDualMode && (
            <div className={styles.legendWrapper}>
              {hasTaskData && (
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: taskColor }} />
                  <span>{t('tasksCreated')}</span>
                </div>
              )}
              {hasMeetingData && (
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ backgroundColor: meetingColor }} />
                  <span>{t('meetingsHeld')}</span>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>{t('noActivityData')}</div>
      )}
    </motion.div>
  );
};