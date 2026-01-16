import {
  makeStyles,
  tokens,
} from '@/lib/components';
import React from 'react';
import CountUp from 'react-countup';

const useStyles = makeStyles({
  card: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow2,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    cursor: 'default',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: tokens.shadow8,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrapper: {
    padding: '10px',
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  label: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
  },
  meta: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
});

interface StatCardProps {
  icon: React.ReactNode;
  iconColor: { bg: string; color: string };
  value: string | number;
  label: string;
  metaIcon?: React.ReactNode;
  metaText: React.ReactNode;
  progress?: {
    value: number;
    max?: number;
    color?: 'brand' | 'success' | 'warning' | 'error';
  };
  extraContent?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  value,
  label,
  metaIcon,
  metaText,
  extraContent
}) => {
  const styles = useStyles();

  return (
    <div
      className={styles.card}
    >
      <div className={styles.header}>
        <div
          className={styles.iconWrapper}
          style={{ backgroundColor: iconColor.bg, color: iconColor.color }}
        >
          {icon}
        </div>
        {extraContent}
      </div>
      
      <div>
        <div className={styles.value}>
          {typeof value === 'number' ? (
            <CountUp end={value} duration={2} separator="," />
          ) : (
            value
          )}
        </div>
        <div className={styles.label}>{label}</div>
      </div>
      <div className={styles.meta}>
        {metaIcon}
        {metaText}
      </div>
    </div>
  );
};
