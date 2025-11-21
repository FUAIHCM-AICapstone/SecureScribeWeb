'use client';

import React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';
import type { BotResponse } from 'types/meetingBot.type';
import { BotCard } from './BotCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: tokens.spacingHorizontalXL,
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: tokens.spacingHorizontalL,
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
