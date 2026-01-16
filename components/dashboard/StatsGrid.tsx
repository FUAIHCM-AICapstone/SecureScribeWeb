import { makeStyles } from '@/lib/components';
import React from 'react';

const useStyles = makeStyles({
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  statsItem: {
    animation: 'fadeInUp 0.5s ease-out forwards',
    opacity: 0,
  },
});

interface StatsGridProps {
  children: React.ReactNode;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ children }) => {
  const styles = useStyles();

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div className={styles.statsGrid}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className={styles.statsItem} style={{ animationDelay: `${index * 0.1}s` }}>
            {child}
          </div>
        ))}
      </div>
    </>
  );
};
