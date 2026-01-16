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
  Dropdown,
  Option,
  type OptionOnSelectData,
} from '@fluentui/react-components';
import {
  Grid20Regular,
  List20Regular,
  Search20Regular,
  TaskListSquareLtr24Regular,
  Add20Regular,
} from '@/lib/icons';
import type { TaskStatus } from 'types/task.type';

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
  statusDropdown: {
    minWidth: '160px',
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
  },
  countText: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
  },
});

interface TasksHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  isMyTasks: boolean | undefined;
  onMyTasksChange: (value: boolean | undefined) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: TaskStatus | undefined;
  onStatusFilterChange: (status: TaskStatus | undefined) => void;
  totalCount: number;
  onCreateClick: () => void;
}

export function TasksHeader({
  viewMode,
  onViewModeChange,
  isMyTasks,
  onMyTasksChange,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  onCreateClick,
}: TasksHeaderProps) {
  const styles = useStyles();
  const t = useTranslations('Tasks');
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleStatusChange = (
    _event: React.SyntheticEvent,
    data: OptionOnSelectData,
  ) => {
    const value = data.optionValue;
    if (value === 'all') {
      onStatusFilterChange(undefined);
    } else {
      onStatusFilterChange(value as TaskStatus);
    }
  };

  return (
    <div className={styles.header}>
      {/* Top Row: Title and View Toggle */}
      <div className={styles.topRow}>
        <div className={styles.titleContainer}>
          <div className={styles.iconBadge}>
            <TaskListSquareLtr24Regular />
          </div>
          <Text className={styles.title}>{t('title')}</Text>
        </div>
        <div className={styles.viewToggle}>
          <Button
            appearance="primary"
            icon={<Add20Regular />}
            onClick={onCreateClick}
          >
            {t('createTask')}
          </Button>
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

      {/* Filters Row */}
      <div className={styles.filtersRow}>
        <form onSubmit={handleSearchSubmit} className={styles.searchGroup}>
          <Input
            className={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            value={localSearchQuery}
            onChange={handleSearchInputChange}
            contentBefore={<Search20Regular />}
          />
          <Button type="submit" appearance="primary">
            {t('searchButton')}
          </Button>
        </form>

        <div className={styles.filterGroup}>
          <Dropdown
            className={styles.statusDropdown}
            placeholder={t('statusFilter.all')}
            value={
              statusFilter
                ? t(`statusFilter.${statusFilter}`)
                : t('statusFilter.all')
            }
            onOptionSelect={handleStatusChange}
          >
            <Option value="all">{t('statusFilter.all')}</Option>
            <Option value="todo">{t('statusFilter.todo')}</Option>
            <Option value="in_progress">{t('statusFilter.in_progress')}</Option>
            <Option value="done">{t('statusFilter.done')}</Option>
          </Dropdown>
        </div>

        <div className={styles.filterGroup}>
          <ToggleButton
            appearance={isMyTasks === true ? 'primary' : 'outline'}
            checked={isMyTasks === true}
            onClick={() =>
              onMyTasksChange(isMyTasks === true ? undefined : true)
            }
          >
            {t('myTasks')}
          </ToggleButton>
        </div>
      </div>

      {/* Bottom Row: Count */}
      <div className={styles.bottomRow}>
        <Caption1 className={styles.countText}>
          {t('tasksCount', { count: totalCount })}
        </Caption1>
      </div>
    </div>
  );
}
