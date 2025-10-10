'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import type { ProjectResponse } from 'types/project.type';
import { ProjectRow } from './ProjectRow';

const useStyles = makeStyles({
  tableWrapper: {
    width: '100%',
    ...shorthands.overflow('auto'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  table: {
    width: '100%',
    minWidth: '900px',
  },
});

interface ProjectsListProps {
  projects: ProjectResponse[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const styles = useStyles();
  const t = useTranslations('Projects');

  return (
    <div className={styles.tableWrapper}>
      <Table className={styles.table} size="small">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{t('table.name')}</TableHeaderCell>
            <TableHeaderCell>{t('table.description')}</TableHeaderCell>
            <TableHeaderCell>{t('table.members')}</TableHeaderCell>
            <TableHeaderCell>{t('table.status')}</TableHeaderCell>
            <TableHeaderCell>{t('table.createdDate')}</TableHeaderCell>
            <TableHeaderCell>{t('table.actions')}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
