import { makeStyles } from '@fluentui/react-components';
import { motion } from 'framer-motion';
import React from 'react';

const useStyles = makeStyles({
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface StatsGridProps {
  children: React.ReactNode;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ children }) => {
  const styles = useStyles();

  return (
    <motion.div
      className={styles.statsGrid}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  );
};
