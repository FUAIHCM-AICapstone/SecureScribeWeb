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
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    marginBottom: '24px',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  viewToggle: {
    display: 'flex',
    ...shorthands.gap('4px'),
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
        <Text className={styles.title}>{t('title')}</Text>
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
