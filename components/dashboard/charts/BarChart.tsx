'use client';

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    width: '100%',
    height: '140px',
  },
  tooltip: {
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '8px 12px',
    boxShadow: tokens.shadow8,
  },
  tooltipLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  tooltipValue: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
});

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BarChartProps {
  data: BarChartData[];
  color?: string;
  dataKey?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  const styles = useStyles();

  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        <div className={styles.tooltipValue}>{payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export const BarChart: React.FC<BarChartProps> = ({
  data,
  color = tokens.colorBrandBackground,
  dataKey = 'value',
}) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={tokens.colorNeutralStroke2}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: tokens.colorNeutralForeground2 }}
            stroke={tokens.colorNeutralStroke2}
          />
          <YAxis
            tick={{ fontSize: 11, fill: tokens.colorNeutralForeground2 }}
            stroke={tokens.colorNeutralStroke2}
            tickFormatter={(value) => Math.round(value).toString()}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
