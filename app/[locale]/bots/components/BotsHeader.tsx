'use client';

import {
  Grid20Regular,
  List20Regular,
  Record20Regular,
  Search20Regular,
} from '@/lib/icons';
import {
  Badge,
  Button,
  Caption1,
  Input,
  makeStyles,
  shorthands,
  Text,
  ToggleButton,
  tokens,
} from '@fluentui/react-components';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    marginBottom: '32px',
    ...shorthands.padding('20px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    boxShadow: tokens.shadow4,
    '@media (max-width: 768px)': {
      ...shorthands.padding('16px', '12px'),
    },
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    flex: 1,
    minWidth: 0,
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    flexShrink: 0,
  },
  titleContent: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('2px'),
    minWidth: 0,
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
    whiteSpace: 'nowrap',
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    lineHeight: tokens.lineHeightBase200,
  },
  actionsRow: {
    display: 'flex',
    ...shorthands.gap('8px'),
    alignItems: 'center',
  },
  viewToggle: {
    display: 'flex',
    ...shorthands.gap('4px'),
    alignItems: 'center',
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexGrow: 1,
    minWidth: '200px',
  },
  searchInput: {
    flexGrow: 1,
    maxWidth: '400px',
    '@media (max-width: 768px)': {
      maxWidth: '100%',
      width: '100%',
    },
  },
  countBadge: {
    flexShrink: 0,
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
    <div className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.titleSection}>
          <div className={styles.iconWrapper}>
            <Record20Regular />
          </div>
          <div className={styles.titleContent}>
            <Text className={styles.title}>{t('title')}</Text>
            <Caption1 className={styles.subtitle}>{t('description')}</Caption1>
          </div>
        </div>
        <div className={styles.actionsRow}>
          <div className={styles.viewToggle}>
            <ToggleButton
              appearance={viewMode === 'grid' ? 'primary' : 'subtle'}
              icon={<Grid20Regular />}
              checked={viewMode === 'grid'}
              onClick={() => onViewModeChange('grid')}
              aria-label={t('gridView')}
              size="small"
            />
            <ToggleButton
              appearance={viewMode === 'list' ? 'primary' : 'subtle'}
              icon={<List20Regular />}
              checked={viewMode === 'list'}
              onClick={() => onViewModeChange('list')}
              aria-label={t('listView')}
              size="small"
            />
          </div>
          <Badge appearance="outline" size="large" className={styles.countBadge}>
            {t('totalBots', { count: totalCount })}
          </Badge>
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
            size="medium"
          />
          <Button
            appearance="primary"
            icon={<Search20Regular />}
            onClick={handleSearchSubmit}
            size="medium"
          >
            {t('search')}
          </Button>
        </div>
      </div>
    </div>
  );
}
