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
  shorthands,
  tokens,
} from '@fluentui/react-components';
import type { FileResponse } from 'types/file.type';
import { FileListItem } from './FileListItem';

const useStyles = makeStyles({
  tableWrapper: {
    ...shorthands.overflow('auto'),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
  },
  table: {
    width: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
  },
});

interface FilesListProps {
  files: FileResponse[];
}

export function FilesList({ files }: FilesListProps) {
  const styles = useStyles();
  const t = useTranslations('Files');

  return (
    <div className={styles.tableWrapper}>
      <Table className={styles.table} size="small">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>{t('table.name')}</TableHeaderCell>
            <TableHeaderCell>{t('table.type')}</TableHeaderCell>
            <TableHeaderCell>{t('table.size')}</TableHeaderCell>
            <TableHeaderCell>{t('table.uploadDate')}</TableHeaderCell>
            <TableHeaderCell>{t('table.actions')}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <FileListItem key={file.id} file={file} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
