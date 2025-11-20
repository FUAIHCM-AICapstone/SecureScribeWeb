import {
  Body1,
  Dropdown,
  makeStyles,
  Option,
  OptionOnSelectData,
  SelectionEvents,
  Title1,
  tokens,
} from '@fluentui/react-components';
import { DashboardPeriod, DashboardScope } from 'types/statistic.type';
import React from 'react';
import { motion } from 'framer-motion';

const useStyles = makeStyles({
  headerContainer: {
    position: 'relative',
    padding: '32px',
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
    boxShadow: tokens.shadow4,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  welcomeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  welcomeTitle: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeHero900,
    fontWeight: 700,
  },
  welcomeSubtitle: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase400,
  },
  controls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackgroundAlpha,
    backdropFilter: 'blur(10px)',
    padding: '12px', // Increased padding
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow4, // Added shadow
  },
  decorativeBlob1: {
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${tokens.colorBrandBackground2} 0%, transparent 70%)`,
    opacity: 0.5,
    filter: 'blur(40px)',
    zIndex: 0,
  },
  decorativeBlob2: {
    position: 'absolute',
    bottom: '-50%',
    left: '-10%',
    width: '250px',
    height: '250px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${tokens.colorPaletteBlueBackground2} 0%, transparent 70%)`,
    opacity: 0.5,
    filter: 'blur(40px)',
    zIndex: 0,
  },
});

interface DashboardHeaderProps {
  scope: DashboardScope;
  period: DashboardPeriod;
  onScopeChange: (e: SelectionEvents, data: OptionOnSelectData) => void;
  onPeriodChange: (e: SelectionEvents, data: OptionOnSelectData) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  scope,
  period,
  onScopeChange,
  onPeriodChange,
}) => {
  const styles = useStyles();

  return (
    <motion.div 
      className={styles.headerContainer}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Blobs */}
      <motion.div 
        className={styles.decorativeBlob1}
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      <motion.div 
        className={styles.decorativeBlob2}
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />

      <div className={styles.headerContent}>
        <div className={styles.welcomeSection}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Title1 className={styles.welcomeTitle}>Tổng quan</Title1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Body1 className={styles.welcomeSubtitle}>
              Theo dõi hoạt động và hiệu suất làm việc của bạn
            </Body1>
          </motion.div>
        </div>
        
        <motion.div 
          className={styles.controls}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        >
          <Dropdown
            placeholder="Phạm vi"
            value={
              scope === DashboardScope.PERSONAL
                ? 'Cá nhân'
                : scope === DashboardScope.PROJECT
                ? 'Dự án'
                : 'Hỗn hợp'
            }
            selectedOptions={[scope]}
            onOptionSelect={onScopeChange}
            style={{ minWidth: '120px' }}
          >
            <Option value={DashboardScope.PERSONAL}>Cá nhân</Option>
            <Option value={DashboardScope.PROJECT}>Dự án</Option>
            <Option value={DashboardScope.HYBRID}>Hỗn hợp</Option>
          </Dropdown>
          <Dropdown
            placeholder="Thời gian"
            value={
              period === DashboardPeriod.SEVEN_DAYS
                ? '7 ngày qua'
                : period === DashboardPeriod.THIRTY_DAYS
                ? '30 ngày qua'
                : period === DashboardPeriod.NINETY_DAYS
                ? '90 ngày qua'
                : 'Tất cả'
            }
            selectedOptions={[period]}
            onOptionSelect={onPeriodChange}
            style={{ minWidth: '140px' }}
          >
            <Option value={DashboardPeriod.SEVEN_DAYS}>7 ngày qua</Option>
            <Option value={DashboardPeriod.THIRTY_DAYS}>30 ngày qua</Option>
            <Option value={DashboardPeriod.NINETY_DAYS}>90 ngày qua</Option>
            <Option value={DashboardPeriod.ALL_TIME}>Tất cả</Option>
          </Dropdown>
        </motion.div>
      </div>
    </motion.div>
  );
};
