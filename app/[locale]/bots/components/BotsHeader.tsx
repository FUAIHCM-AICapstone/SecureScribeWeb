'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Text,
  Caption1,
  Title1,
  Body1,
  makeStyles,
  tokens,
  shorthands,
  ToggleButton,
} from '@fluentui/react-components';
import {
  Grid20Regular,
  List20Regular,
  Search20Regular,
  Record24Regular,
} from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
    marginBottom: '32px',
    ...shorthands.padding('28px', '32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    boxShadow: tokens.shadow8,
    position: 'relative',
    overflow: 'hidden',
    '@media (max-width: 768px)': {
      ...shorthands.padding('20px', '16px'),
    },
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: tokens.colorBrandBackground,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
    zIndex: 1,
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  iconBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorBrandBackground,
    boxShadow: tokens.shadow8,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  title: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    lineHeight: tokens.lineHeightHero900,
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
    maxWidth: '500px',
  },
  viewToggle: {
    display: 'flex',
    ...shorthands.gap('8px'),
    alignItems: 'center',
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    zIndex: 1,
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexGrow: 1,
  },
  searchInput: {
    minWidth: '280px',
    flexGrow: 1,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    '@media (max-width: 768px)': {
      minWidth: '100%',
      width: '100%',
    },
  },
  countBadge: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    ...shorthands.padding('8px', '16px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  countText: {
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface BotsHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
}

export function BotsHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  totalCount,
}: BotsHeaderProps) {
  const styles = useStyles();
  const t = useTranslations('Bots');
  const [localSearch, setLocalSearch] = useState(searchQuery);

  React.useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = () => {
    if (localSearch !== searchQuery) {
      onSearchChange(localSearch);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  return (
    <motion.div
      className={styles.header}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.headerAccent} />
      
      <div className={styles.topRow}>
        <div className={styles.titleSection}>
          <div className={styles.titleRow}>
            <div className={styles.iconBadge}>
              <Record24Regular />
            </div>
            <Title1 className={styles.title}>{t('title')}</Title1>
          </div>
          <Body1 className={styles.subtitle}>{t('description')}</Body1>
        </div>
        <div className={styles.viewToggle}>
          <ToggleButton
            appearance={viewMode === 'grid' ? 'primary' : 'outline'}
            icon={<Grid20Regular />}
            checked={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
            aria-label={t('gridView')}
          />
          <ToggleButton
            appearance={viewMode === 'list' ? 'primary' : 'outline'}
            icon={<List20Regular />}
            checked={viewMode === 'list'}
            onClick={() => onViewModeChange('list')}
            aria-label={t('listView')}
          />
        </div>
      </div>

      <div className={styles.filtersRow}>
        <div className={styles.searchGroup}>
          <Input
            className={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            value={localSearch}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            contentBefore={<Search20Regular />}
            appearance="outline"
          />
          <Button
            appearance="primary"
            icon={<Search20Regular />}
            onClick={handleSearchSubmit}
          >
            {t('search')}
          </Button>
        </div>

        <div className={styles.countBadge}>
          <Caption1 className={styles.countText}>
            {t('totalBots', { count: totalCount })}
          </Caption1>
        </div>
      </div>
    </motion.div>
  );
}
