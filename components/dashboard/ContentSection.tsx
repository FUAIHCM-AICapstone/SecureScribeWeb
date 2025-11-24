import {
  Button,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ArrowRight24Regular } from '@fluentui/react-icons';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';

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
    height: '100%',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  emptyState: {
    textAlign: 'center',
    padding: '24px',
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

interface ContentSectionProps {
  title: string;
  onViewAll: () => void;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  onViewAll,
  children,
  isEmpty,
  emptyMessage,
}) => {
  const styles = useStyles();
  const t = useTranslations('Dashboard');

  return (
    <motion.div
      className={styles.section}
      whileHover={{ y: -2, boxShadow: tokens.shadow4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>{title}</div>
        <Button appearance="subtle" icon={<ArrowRight24Regular />} onClick={onViewAll} />
      </div>
      <div className={styles.list}>
        {isEmpty ? (
          <div className={styles.emptyState}>{emptyMessage || t('noData')}</div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
};
