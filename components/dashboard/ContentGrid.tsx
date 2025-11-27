import { makeStyles } from '@fluentui/react-components';
import { motion } from 'framer-motion';
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
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2 // Wait for stats to load a bit
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

interface ContentGridProps {
  children: React.ReactNode;
}

export const ContentGrid: React.FC<ContentGridProps> = ({ children }) => {
  const styles = useStyles();

  return (
    <motion.div
      className={styles.contentGrid}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={item} style={{ height: '100%' }}>{child}</motion.div>
      ))}
    </motion.div>
  );
};
