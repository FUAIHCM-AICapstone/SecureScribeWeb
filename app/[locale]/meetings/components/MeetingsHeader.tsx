'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Input,
  Text,
  Caption1,
  makeStyles,
  tokens,
  shorthands,
  ToggleButton,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import {
  Grid20Regular,
  List20Regular,
  Search20Regular,
  CalendarLtr20Regular,
  CalendarMonth24Regular,
  Add20Regular,
} from '@fluentui/react-icons';

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
  createButton: {
    marginLeft: 'auto',
    '@media (max-width: 768px)': {
      width: '100%',
      marginLeft: '0',
    },
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  searchInput: {
    minWidth: '280px',
    flexGrow: 1,
    '@media (max-width: 768px)': {
      minWidth: '100%',
      width: '100%',
    },
  },
  searchGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexGrow: 1,
  },
  datePickerGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
  },
  datePicker: {
    minWidth: '160px',
  },
  countText: {
    color: tokens.colorNeutralForeground2,
    marginLeft: 'auto',
  },
});

interface MeetingsHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isPersonal: boolean | undefined;
  onPersonalChange: (value: boolean | undefined) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDateFrom: Date | null;
  startDateTo: Date | null;
  onDateRangeChange: (from: Date | null, to: Date | null) => void;
  totalCount: number;
  onCreateClick: () => void;
}

export function MeetingsHeader({
  viewMode,
  onViewModeChange,
  isPersonal,
  onPersonalChange,
  searchQuery,
  onSearchChange,
  startDateFrom,
  startDateTo,
  onDateRangeChange,
  totalCount,
  onCreateClick,
}: MeetingsHeaderProps) {
  const styles = useStyles();
  const t = useTranslations('Meetings');
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Update local search when searchQuery prop changes
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
            <CalendarMonth24Regular />
          </div>
          <Text className={styles.title}>{t('title')}</Text>
        </div>
        <Button
          className={styles.createButton}
          appearance="primary"
          icon={<Add20Regular />}
          onClick={onCreateClick}
        >
          {t('createMeeting')}
        </Button>
        <div className={styles.viewToggle}>
          <Button
            appearance={viewMode === 'grid' ? 'primary' : 'secondary'}
            icon={<Grid20Regular />}
            onClick={() => onViewModeChange('grid')}
            aria-label={t('gridView')}
          />
          <Button
            appearance={viewMode === 'list' ? 'primary' : 'secondary'}
            icon={<List20Regular />}
            onClick={() => onViewModeChange('list')}
            aria-label={t('listView')}
          />
        </div>
      </div>

      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          <ToggleButton
            appearance={isPersonal === undefined ? 'primary' : 'secondary'}
            checked={isPersonal === undefined}
            onClick={() => onPersonalChange(undefined)}
            size="small"
          >
            {t('allMeetings')}
          </ToggleButton>
          <ToggleButton
            appearance={isPersonal === true ? 'primary' : 'secondary'}
            checked={isPersonal === true}
            onClick={() => onPersonalChange(true)}
            size="small"
          >
            {t('personalMeetings')}
          </ToggleButton>
        </div>

        <div className={styles.searchGroup}>
          <Input
            className={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            value={localSearch}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            contentBefore={<Search20Regular />}
          />
          <Button
            appearance="secondary"
            icon={<Search20Regular />}
            onClick={handleSearchSubmit}
          >
            {t('searchButton')}
          </Button>
        </div>

        <div className={styles.datePickerGroup}>
          <CalendarLtr20Regular />
          <DatePicker
            className={styles.datePicker}
            placeholder={t('fromDate')}
            value={startDateFrom}
            onSelectDate={(date) =>
              onDateRangeChange(date || null, startDateTo)
            }
          />
          <Text>-</Text>
          <DatePicker
            className={styles.datePicker}
            placeholder={t('toDate')}
            value={startDateTo}
            onSelectDate={(date) =>
              onDateRangeChange(startDateFrom, date || null)
            }
          />
        </div>

        <Caption1 className={styles.countText}>
          {t('meetingsCount', { count: totalCount })}
        </Caption1>
      </div>
    </div>
  );
}
