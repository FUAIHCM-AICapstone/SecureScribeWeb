'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Input,
  Text,
  Caption1,
  Dropdown,
  Option,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import {
  Grid20Regular,
  List20Regular,
  Search20Regular,
  DocumentFolder24Regular,
  ArrowUpload20Regular,
} from '@fluentui/react-icons';
import type { ProjectResponse } from 'types/project.type';
import type { MeetingResponse } from 'types/meeting.type';

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
  topActions: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  viewToggle: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    ...shorthands.gap('12px'),
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    minWidth: '200px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
      width: '100%',
    },
  },
  searchGroup: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    flexGrow: 1,
    minWidth: '280px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
      width: '100%',
    },
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground2,
  },
  dateGroup: {
    display: 'flex',
    alignItems: 'flex-end',
    ...shorthands.gap('8px'),
  },
  datePicker: {
    minWidth: '160px',
  },
  dropdown: {
    minWidth: '200px',
    '@media (max-width: 768px)': {
      minWidth: '100%',
      width: '100%',
    },
  },
  uploadButton: {
    alignSelf: 'flex-end',
  },
});

interface FilesHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  fileType?: string;
  onFileTypeChange: (type?: string) => void;
  projectId?: string;
  onProjectIdChange: (id?: string) => void;
  meetingId?: string;
  onMeetingIdChange: (id?: string) => void;
  uploadDateFrom?: Date | null;
  uploadDateTo?: Date | null;
  onDateRangeChange: (from?: Date | null, to?: Date | null) => void;
  totalCount: number;
  projects: ProjectResponse[];
  meetings: MeetingResponse[];
  onUploadClick: () => void;
}

export function FilesHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  fileType,
  onFileTypeChange,
  projectId,
  onProjectIdChange,
  meetingId,
  onMeetingIdChange,
  uploadDateFrom,
  uploadDateTo,
  onDateRangeChange,
  totalCount,
  projects,
  meetings,
  onUploadClick,
}: FilesHeaderProps) {
  const styles = useStyles();
  const t = useTranslations('Files');

  // Only PDF and Docs types
  const fileTypes = [
    { value: '', label: t('allTypes') },
    { value: 'pdf', label: t('fileTypes.pdf') },
    { value: 'document', label: t('fileTypes.document') },
  ];

  return (
    <div className={styles.header}>
      {/* Top Row: Title + View Toggle */}
      <div className={styles.topRow}>
        <div className={styles.titleContainer}>
          <div className={styles.iconBadge}>
            <DocumentFolder24Regular />
          </div>
          <div>
            <Text className={styles.title}>{t('title')}</Text>
            <Caption1>{t('filesCount', { count: totalCount })}</Caption1>
          </div>
        </div>
        <div className={styles.topActions}>
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
          <Button
            appearance="primary"
            icon={<ArrowUpload20Regular />}
            onClick={onUploadClick}
            className={styles.uploadButton}
          >
            {t('uploadFile')}
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className={styles.filtersRow}>
        {/* Search */}
        <div className={styles.searchGroup}>
          <label className={styles.label}>{t('searchPlaceholder')}</label>
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            contentBefore={<Search20Regular />}
          />
        </div>

        {/* File Type Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>{t('filterByType')}</label>
          <Dropdown
            placeholder={t('allTypes')}
            value={
              fileTypes.find((t) => t.value === (fileType || ''))?.label ||
              t('allTypes')
            }
            onOptionSelect={(_, data) =>
              onFileTypeChange((data.optionValue as string) || undefined)
            }
            className={styles.dropdown}
          >
            {fileTypes.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Dropdown>
        </div>

        {/* Project Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>{t('filterByProject')}</label>
          <Dropdown
            placeholder={t('allProjects')}
            value={
              projectId
                ? projects.find((p) => p.id === projectId)?.name ||
                  t('allProjects')
                : t('allProjects')
            }
            onOptionSelect={(_, data) => {
              const newProjectId = data.optionValue as string;
              onProjectIdChange(newProjectId || undefined);
              // Reset meeting when project changes
              if (newProjectId !== projectId) {
                onMeetingIdChange(undefined);
              }
            }}
            className={styles.dropdown}
          >
            <Option value="">{t('allProjects')}</Option>
            {projects.map((project) => (
              <Option key={project.id} value={project.id}>
                {project.name}
              </Option>
            ))}
          </Dropdown>
        </div>

        {/* Meeting Filter */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>{t('filterByMeeting')}</label>
          <Dropdown
            placeholder={t('allMeetings')}
            value={
              meetingId
                ? meetings.find((m) => m.id === meetingId)?.title ||
                  t('allMeetings')
                : t('allMeetings')
            }
            onOptionSelect={(_, data) =>
              onMeetingIdChange((data.optionValue as string) || undefined)
            }
            className={styles.dropdown}
            disabled={!projectId}
          >
            <Option value="">{t('allMeetings')}</Option>
            {meetings.map((meeting) => (
              <Option key={meeting.id} value={meeting.id}>
                {meeting.title || t('noMeeting')}
              </Option>
            ))}
          </Dropdown>
        </div>

        {/* Date Range Filter */}
        <div className={styles.dateGroup}>
          <div className={styles.filterGroup}>
            <label className={styles.label}>{t('fromDate')}</label>
            <DatePicker
              placeholder={t('fromDate')}
              value={uploadDateFrom || undefined}
              onSelectDate={(date) => onDateRangeChange(date, uploadDateTo)}
              className={styles.datePicker}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.label}>{t('toDate')}</label>
            <DatePicker
              placeholder={t('toDate')}
              value={uploadDateTo || undefined}
              onSelectDate={(date) => onDateRangeChange(uploadDateFrom, date)}
              className={styles.datePicker}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
