'use client';

import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import type { FileResponse } from 'types/file.type';
import { FileCard } from './FileCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    ...shorthands.gap(tokens.spacingHorizontalL),
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
      ...shorthands.gap(tokens.spacingHorizontalXL),
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '@media (max-width: 767px)': {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
  },
});

interface FilesGridProps {
  files: FileResponse[];
  onPreview?: (file: FileResponse) => void;
  onFileDeleted?: () => void;
  onFileRenamed?: () => void;
  onFileMoved?: () => void;
}

export function FilesGrid({ files, onPreview, onFileDeleted, onFileRenamed, onFileMoved }: FilesGridProps) {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {files.map((file) => (
        <FileCard 
          key={file.id} 
          file={file} 
          onPreview={onPreview}
          onFileDeleted={onFileDeleted}
          onFileRenamed={onFileRenamed}
          onFileMoved={onFileMoved}
        />
      ))}
    </div>
  );
}
