'use client';

import React from 'react';
import { makeStyles, tokens, shorthands } from '@/lib/components';
import type { ProjectResponse } from 'types/project.type';
import { ProjectCard } from './ProjectCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    ...shorthands.gap(tokens.spacingHorizontalL),
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    width: '100%',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      ...shorthands.gap(tokens.spacingHorizontalXL),
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 767px)': {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
});

interface ProjectsGridProps {
  projects: ProjectResponse[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
