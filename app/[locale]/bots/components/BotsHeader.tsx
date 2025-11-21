'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Text,
  Caption1,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import {
  GridRegular,
  ListRegular,
  Search20Regular,
  Record24Regular,
} from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
    marginBottom: '32px',
    ...shorthands.padding('24px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius('16px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    boxShadow: tokens.shadow4,
    '@media (max-width: 768px)': {
      ...shorthands.padding('16px'),
    },
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
  },
  titleContainer: {
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
    fontSize: tokens.fontSizeHero900,
    fontWeight: 700,
    color: tokens.colorBrandForeground1,
  },
  viewToggle: {
    display: 'flex',
    ...shorthands.gap('8px'),
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
  },
  searchInput: {
    minWidth: '280px',
    flexGrow: 1,
    '@media (max-width: 768px)': {
      minWidth: '100%',
      width: '100%',
    },
  },
  countText: {
    color: tokens.colorNeutralForeground2,
    marginLeft: 'auto',
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
        <div className={styles.titleContainer}>
          <div className={styles.iconBadge}>
            <Record24Regular />
          </div>
          <Text className={styles.title}>{t('meetingRecordings')}</Text>
        </div>
        <div className={styles.viewToggle}>
          <Button
            appearance={viewMode === 'grid' ? 'primary' : 'secondary'}
            icon={<GridRegular />}
            onClick={() => onViewModeChange('grid')}
            title={t('gridView')}
          />
          <Button
            appearance={viewMode === 'list' ? 'primary' : 'secondary'}
            icon={<ListRegular />}
            onClick={() => onViewModeChange('list')}
            title={t('listView')}
          />
        </div>
      </div>

      <div className={styles.filtersRow}>
        <div className={styles.searchGroup}>
          <Input
            className={styles.searchInput}
            placeholder={t('searchMeetings')}
            value={localSearch}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            contentBefore={<Search20Regular />}
            appearance="outline"
          />
          <Button
            appearance="secondary"
            icon={<Search20Regular />}
            onClick={handleSearchSubmit}
          >
            {t('search')}
          </Button>
        </div>

        <Caption1 className={styles.countText}>
          {t('totalBots', { count: totalCount })}
        </Caption1>
      </div>
    </div>
  );
}
