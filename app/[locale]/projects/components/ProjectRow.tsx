'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Text,
  Badge,
  Caption1,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import { formatDateTime } from '@/lib/dateFormatter';
import type { ProjectResponse } from 'types/project.type';
import { ProjectActionsMenu } from './ProjectActionsMenu';

const useStyles = makeStyles({
  row: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr 1fr 1.5fr auto',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.transition('all', '0.2s', 'ease'),
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
    },
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '2fr 1fr 1fr auto',
      ...shorthands.gap('12px'),
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr auto',
      ...shorthands.gap('8px'),
    },
  },
  titleCell: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    minWidth: 0,
  },
  nameCell: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  descriptionText: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  hiddenOnMobile: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  hiddenOnTablet: {
    '@media (max-width: 1024px)': {
      display: 'none',
    },
  },
});

interface ProjectRowProps {
  project: ProjectResponse;
}

export function ProjectRow({ project }: ProjectRowProps) {
  const styles = useStyles();
  const t = useTranslations('Projects');

  const getStatusBadge = () => {
    if (project.is_archived) {
      return (
        <Badge appearance="filled" color="warning" size="small">
          {t('status.archived')}
        </Badge>
      );
    }
    return (
      <Badge appearance="filled" color="success" size="small">
        {t('status.active')}
      </Badge>
    );
  };

  const formatCreatedDate = () => {
    if (!project.created_at) return t('noDateSet');
    try {
      return formatDateTime(project.created_at);
    } catch {
      return t('invalidDate');
    }
  };

  return (
    <div className={styles.row}>
      <div className={styles.titleCell}>
        <Text className={styles.nameCell}>
          {project.name || t('untitledProject')}
        </Text>
      </div>
      <div className={styles.hiddenOnTablet}>
        {project.description && (
          <Caption1 className={styles.descriptionText}>
            {project.description}
          </Caption1>
        )}
      </div>
      <div className={styles.hiddenOnMobile}>
        <Caption1>
          {t('memberCount', { count: project.member_count || 0 })}
        </Caption1>
      </div>
      <div className={styles.hiddenOnMobile}>{getStatusBadge()}</div>
      <div className={styles.hiddenOnTablet}>
        <Caption1>{formatCreatedDate()}</Caption1>
      </div>
      <div>
        <ProjectActionsMenu project={project} />
      </div>
    </div>
  );
}
