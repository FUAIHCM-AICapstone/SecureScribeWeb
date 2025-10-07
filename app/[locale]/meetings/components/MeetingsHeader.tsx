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
  ToggleButton,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import {
  Grid20Regular,
  List20Regular,
  Search20Regular,
  CalendarLtr20Regular,
} from '@fluentui/react-icons';
import { useDebounce } from '@/hooks/useDebounce';

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
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 400);

  // Update parent when debounced value changes
  React.useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, onSearchChange, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        <Text className={styles.title}>Meetings</Text>
        <div className={styles.viewToggle}>
          <Button
            appearance={viewMode === 'grid' ? 'primary' : 'secondary'}
            icon={<Grid20Regular />}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
          />
          <Button
            appearance={viewMode === 'list' ? 'primary' : 'secondary'}
            icon={<List20Regular />}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
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
            All Meetings
          </ToggleButton>
          <ToggleButton
            appearance={isPersonal === true ? 'primary' : 'secondary'}
            checked={isPersonal === true}
            onClick={() => onPersonalChange(true)}
            size="small"
          >
            Personal
          </ToggleButton>
        </div>

        <Input
          className={styles.searchInput}
          placeholder="Search meetings..."
          value={localSearch}
          onChange={handleSearchChange}
          contentBefore={<Search20Regular />}
        />

        <div className={styles.datePickerGroup}>
          <CalendarLtr20Regular />
          <DatePicker
            className={styles.datePicker}
            placeholder="From date"
            value={startDateFrom}
            onSelectDate={(date) =>
              onDateRangeChange(date || null, startDateTo)
            }
          />
          <Text>-</Text>
          <DatePicker
            className={styles.datePicker}
            placeholder="To date"
            value={startDateTo}
            onSelectDate={(date) =>
              onDateRangeChange(startDateFrom, date || null)
            }
          />
        </div>

        <Caption1 className={styles.countText}>
          {totalCount} {totalCount === 1 ? 'meeting' : 'meetings'}
        </Caption1>
      </div>
    </div>
  );
}
