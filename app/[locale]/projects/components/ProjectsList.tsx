'use client';

import React from 'react';
import { makeStyles, shorthands } from '@/lib/components';
import type { ProjectResponse } from 'types/project.type';
import { ProjectRow } from './ProjectRow';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
});

interface ProjectsListProps {
  projects: ProjectResponse[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const styles = useStyles();

  return (
    <div className={styles.list}>
      {projects.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </div>
  );
}
