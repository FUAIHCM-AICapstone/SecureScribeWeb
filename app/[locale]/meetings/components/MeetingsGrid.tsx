'use client';

import React from 'react';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import type { MeetingResponse } from 'types/meeting.type';
import { MeetingCard } from './MeetingCard';

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

interface MeetingsGridProps {
  meetings: MeetingResponse[];
}

export function MeetingsGrid({ meetings }: MeetingsGridProps) {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} />
      ))}
    </div>
  );
}
