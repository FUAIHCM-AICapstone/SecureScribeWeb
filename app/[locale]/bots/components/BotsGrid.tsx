'use client';

import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import type { BotResponse } from 'types/meetingBot.type';
import { BotCard } from './BotCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    ...shorthands.gap(tokens.spacingHorizontalL),
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      ...shorthands.gap(tokens.spacingHorizontalXL),
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 767px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

interface BotsGridProps {
  bots: BotResponse[];
  onStatusChange?: (botId: string, status: string) => void;
  onDelete?: (botId: string) => void;
  onViewLogs?: (botId: string) => void;
}

export function BotsGrid({
  bots,
  onStatusChange,
  onDelete,
  onViewLogs,
}: BotsGridProps) {
  const styles = useStyles();

  return (
    <div className={styles.grid}>
      {bots.map((bot) => (
        <BotCard
          key={bot.id}
          bot={bot}
          meetingTitle={bot.meeting?.title || 'Unknown Meeting'}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onViewLogs={onViewLogs}
        />
      ))}
    </div>
  );
}
