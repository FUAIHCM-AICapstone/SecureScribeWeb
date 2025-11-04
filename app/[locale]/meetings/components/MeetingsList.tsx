'use client';

import React from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import type { MeetingResponse } from 'types/meeting.type';
import { MeetingRow } from './MeetingRow';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
});

interface MeetingsListProps {
  meetings: MeetingResponse[];
}

export function MeetingsList({ meetings }: MeetingsListProps) {
  const styles = useStyles();

  return (
    <div className={styles.list}>
      {meetings.map((meeting) => (
        <MeetingRow key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}
