'use client';

import React from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import type { FileResponse } from 'types/file.type';
import type { ProjectResponse } from 'types/project.type';
import type { MeetingResponse } from 'types/meeting.type';
import { FileRow } from './FileRow';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
});

interface FilesListProps {
  files: FileResponse[];
  projects?: ProjectResponse[];
  meetings?: MeetingResponse[];
  onFileDeleted?: () => void;
  onFileRenamed?: () => void;
  onFileMoved?: () => void;
}

export function FilesList({ files, projects, meetings, onFileDeleted, onFileRenamed, onFileMoved }: FilesListProps) {
  const styles = useStyles();

  return (
    <div className={styles.list}>
      {files.map((file) => (
        <FileRow
          key={file.id}
          file={file}
          projects={projects}
          meetings={meetings}
          onFileDeleted={onFileDeleted}
          onFileRenamed={onFileRenamed}
          onFileMoved={onFileMoved}
        />
      ))}
    </div>
  );
}
