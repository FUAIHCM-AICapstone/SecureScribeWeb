'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  TableRow,
  TableCell,
  Text,
  Badge,
  Caption1,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { format } from 'date-fns';
import type { ProjectResponse } from 'types/project.type';
import { ProjectActionsMenu } from './ProjectActionsMenu';

const useStyles = makeStyles({
  row: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  nameCell: {
    fontWeight: 600,
  },
  descriptionText: {
    color: tokens.colorNeutralForeground2,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
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
      return format(new Date(project.created_at), 'PPp');
    } catch {
      return t('invalidDate');
    }
  };

  return (
    <TableRow className={styles.row}>
      <TableCell>
        <Text className={styles.nameCell}>
          {project.name || t('untitledProject')}
        </Text>
      </TableCell>
      <TableCell>
        {project.description && (
          <Caption1 className={styles.descriptionText}>
            {project.description}
          </Caption1>
        )}
      </TableCell>
      <TableCell>
        <Caption1>
          {t('memberCount', { count: project.member_count || 0 })}
        </Caption1>
      </TableCell>
      <TableCell>{getStatusBadge()}</TableCell>
      <TableCell>
        <Caption1>{formatCreatedDate()}</Caption1>
      </TableCell>
      <TableCell>
        <ProjectActionsMenu project={project} />
      </TableCell>
    </TableRow>
  );
}
