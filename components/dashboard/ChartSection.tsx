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
    padding: '20px',
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: tokens.shadow4,
  },
  sectionHeader: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  chartWrapper: {
    width: '100%',
    height: '350px',
    position: 'relative',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '350px',
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
});

interface ChartSectionProps {
  title: string;
  data: ChartDataPoint[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ title, data }) => {
  const styles = useStyles();
  const t = useTranslations('Dashboard');

  // Format data for recharts
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(point => ({
      date: new Date(point.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
      count: point.count || 0,
      value: point.value || 0,
    }));
  }, [data]);

  // Check if we have any valid data points
  const hasData = formattedData.length > 0 && formattedData.some(d => d.count > 0);
  
  // Calculate max value for Y axis with some padding
  const maxCount = Math.max(...formattedData.map(d => d.count || 0), 1);
  const yAxisMax = Math.ceil(maxCount * 1.1 / 50) * 50; // Round up to nearest 50

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.sectionHeader}>{title}</div>
      {hasData ? (
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke1} />
              <XAxis
                dataKey="date"
                stroke={tokens.colorNeutralForeground2}
                tick={{ fontSize: 12, fill: tokens.colorNeutralForeground2 }}
              />
              <YAxis
                domain={[0, yAxisMax]}
                stroke={tokens.colorNeutralForeground2}
                tick={{ fontSize: 12, fill: tokens.colorNeutralForeground2 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tokens.colorNeutralBackground1,
                  border: `2px solid ${tokens.colorBrandStroke1}`,
                  borderRadius: tokens.borderRadiusLarge,
                  padding: '12px',
                  boxShadow: tokens.shadow8,
                }}
                labelStyle={{ color: tokens.colorBrandForeground1, fontWeight: 700, fontSize: 13 }}
                formatter={(value: any) => [value, t('tasksCreated')]}
                wrapperStyle={{ color: tokens.colorBrandForeground1 }}
                cursor={{ strokeDasharray: '3 3', stroke: tokens.colorBrandStroke1 }}
              />
              <Line
                type="natural"
                dataKey="count"
                stroke={tokens.colorBrandForeground1}
                strokeWidth={4}
                dot={{ fill: tokens.colorBrandForeground1, r: 6, strokeWidth: 2, stroke: tokens.colorBrandBackground2 }}
                activeDot={{ r: 8, fill: tokens.colorBrandForeground1, strokeWidth: 3, stroke: tokens.colorBrandBackground2 }}
                isAnimationActive={true}
                connectNulls={true}
                label={{ fill: tokens.colorBrandForeground1, fontWeight: 700, offset: 20, position: 'top' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={styles.emptyState}>{t('noActivityData')}</div>
      )}
    </motion.div>
  );
};