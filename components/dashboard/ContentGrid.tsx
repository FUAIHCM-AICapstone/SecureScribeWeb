import { makeStyles } from '@fluentui/react-components';
import React from 'react';

const useStyles = makeStyles({
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '24px',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
  },
  contentItem: {
    height: '100%',
    animation: 'fadeInUp 0.5s ease-out forwards',
    opacity: 0,
  },
});

interface ContentGridProps {
  children: React.ReactNode;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ children }) => {
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
      <div className={styles.contentGrid}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className={styles.contentItem} style={{ animationDelay: `${(index + 0.2) * 0.1}s` }}>
            {child}
          </div>
        ))}
      </div>
    </>
  );
};
