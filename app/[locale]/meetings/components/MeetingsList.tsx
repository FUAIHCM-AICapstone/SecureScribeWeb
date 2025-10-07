'use client';

import React from 'react';
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
import type { MeetingResponse } from 'types/meeting.type';
import { MeetingRow } from './MeetingRow';

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
    minWidth: '800px',
  },
});

interface MeetingsListProps {
  meetings: MeetingResponse[];
}

export function MeetingsList({ meetings }: MeetingsListProps) {
  const styles = useStyles();

  return (
    <div className={styles.tableWrapper}>
      <Table className={styles.table} size="small">
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Meeting Title</TableHeaderCell>
            <TableHeaderCell>Start Time</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Projects</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <MeetingRow key={meeting.id} meeting={meeting} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
