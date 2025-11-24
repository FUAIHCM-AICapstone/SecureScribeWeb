import { makeStyles, tokens } from '@fluentui/react-components';
import { motion } from 'framer-motion';
import React from 'react';
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
    boxShadow: tokens.shadow2,
    height: '400px',
  },
  sectionHeader: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  chartContainer: {
    flex: 1,
    minHeight: 0,
  },
});

interface ChartSectionProps {
  title: string;
  data: ChartDataPoint[];
}

export const ChartSection: React.FC<ChartSectionProps> = ({ title, data }) => {
  const styles = useStyles();

  // Format data for recharts
  const formattedData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
    count: point.count,
    value: point.value || 0,
  }));

  return (
    <motion.div
      className={styles.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.sectionHeader}>{title}</div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} />
            <XAxis
              dataKey="date"
              stroke={tokens.colorNeutralForeground3}
              fontSize={12}
            />
            <YAxis
              stroke={tokens.colorNeutralForeground3}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tokens.colorNeutralBackground1,
                border: `1px solid ${tokens.colorNeutralStroke1}`,
                borderRadius: tokens.borderRadiusMedium,
              }}
              labelStyle={{ color: tokens.colorNeutralForeground1 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={tokens.colorBrandBackground2}
              strokeWidth={2}
              dot={{ fill: tokens.colorBrandBackground2, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: tokens.colorBrandBackground2, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};