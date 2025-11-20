import React from 'react';
import {
  Skeleton,
  SkeletonItem,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    padding: '24px',
    boxSizing: 'border-box',
  },
  headerContainer: {
    padding: '32px',
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  controls: {
    display: 'flex',
    gap: '12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  statCard: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    padding: '20px',
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    height: '100%',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  flexBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
});

export const DashboardSkeleton = () => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {/* Header Skeleton */}
      <div className={styles.headerContainer}>
        <div className={styles.welcomeSection}>
          <Skeleton>
            <SkeletonItem size={28} style={{ width: '250px', height: '40px' }} />
            <SkeletonItem size={16} style={{ width: '350px' }} />
          </Skeleton>
        </div>
        <div className={styles.controls}>
           <Skeleton>
            <SkeletonItem shape="rectangle" style={{ width: '120px', height: '32px', borderRadius: '4px' }} />
            <SkeletonItem shape="rectangle" style={{ width: '140px', height: '32px', borderRadius: '4px' }} />
          </Skeleton>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.statCard}>
             <Skeleton>
                <div className={styles.flexBetween}>
                    <SkeletonItem shape="square" size={40} style={{ borderRadius: '8px' }} />
                    <SkeletonItem size={12} style={{ width: '60px' }} />
                </div>
                <div style={{ marginTop: '8px' }}>
                    <SkeletonItem size={28} style={{ width: '100px', marginBottom: '4px' }} />
                    <SkeletonItem size={12} style={{ width: '140px' }} />
                </div>
                <SkeletonItem shape="rectangle" style={{ width: '100%', height: '4px', marginTop: '8px' }} />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <SkeletonItem shape="circle" size={16} />
                    <SkeletonItem size={12} style={{ width: '100px' }} />
                </div>
             </Skeleton>
          </div>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className={styles.contentGrid}>
        {[1, 2, 3].map((section) => (
          <div key={section} className={styles.section}>
            <div className={styles.flexBetween} style={{ marginBottom: '8px' }}>
                <Skeleton>
                    <SkeletonItem size={20} style={{ width: '180px' }} />
                </Skeleton>
                <Skeleton>
                    <SkeletonItem shape="circle" size={24} />
                </Skeleton>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3].map((item) => (
                    <div key={item} className={styles.listItem}>
                        <Skeleton>
                            <SkeletonItem shape="circle" size={36} />
                        </Skeleton>
                        <div className={styles.flexColumn}>
                            <Skeleton>
                                <SkeletonItem size={16} style={{ width: '60%' }} />
                                <SkeletonItem size={12} style={{ width: '40%' }} />
                            </Skeleton>
                        </div>
                        {section === 2 && ( // Simulate status badge for tasks
                             <Skeleton>
                                <SkeletonItem shape="rectangle" style={{ width: '60px', height: '20px', borderRadius: '10px' }} />
                             </Skeleton>
                        )}
                    </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
