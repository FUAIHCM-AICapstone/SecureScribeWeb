'use client';

import React from 'react';
import {
  Body1,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Caption1,
  Title1,
  Title3,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';
import { useTranslations } from 'next-intl';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '8px',
  },
  introDescription: {
    color: tokens.colorNeutralForeground3,
    maxWidth: '720px',
  },
  grid: {
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
    gridAutoRows: '1fr',
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '360px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ':hover': {
      transform: 'translateY(-6px)',
      boxShadow: tokens.shadow16,
    },
    '@media (max-width: 768px)': {
      minHeight: '320px',
    },
    '@media (max-width: 480px)': {
      minHeight: '280px',
    },
  },
  cardHeader: {
    padding: '20px 20px 0',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      padding: '16px 16px 0',
    },
    '@media (max-width: 480px)': {
      padding: '14px 14px 0',
    },
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexGrow: 1,
    height: '100%',
    padding: '0 20px 20px',
    color: tokens.colorNeutralForeground2,
    '@media (max-width: 768px)': {
      padding: '0 16px 16px',
    },
    '@media (max-width: 480px)': {
      padding: '0 14px 14px',
    },
  },
  description: {
    display: '-webkit-box',
    WebkitLineClamp: '3',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
  },
  placeholder: {
    height: '80px',
    minHeight: '80px',
    flexShrink: 0,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px dashed ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground6,
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '0 20px 20px',
    flexShrink: 0,
    '@media (max-width: 768px)': {
      padding: '0 16px 16px',
    },
    '@media (max-width: 480px)': {
      padding: '0 14px 14px',
    },
  },
});

interface DashboardAction {
  label: string;
  appearance?: ButtonProps['appearance'];
}

interface DashboardCard {
  id: string;
  title: string;
  updatedAt: string;
  description: string;
  primaryAction: DashboardAction;
  secondaryAction: DashboardAction;
}

const Dashboard: React.FC = () => {
  const styles = useStyles();
  const t = useTranslations('Dashboard');

  const cards: DashboardCard[] = [
    {
      id: 'my-tasks',
      title: t('cards.myTasks.title'),
      updatedAt: t('cards.myTasks.updatedAt'),
      description: t('cards.myTasks.description'),
      primaryAction: {
        label: t('cards.myTasks.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.myTasks.secondaryAction'),
        appearance: 'secondary',
      },
    },
    {
      id: 'team-project',
      title: t('cards.teamProject.title'),
      updatedAt: t('cards.teamProject.updatedAt'),
      description: t('cards.teamProject.description'),
      primaryAction: {
        label: t('cards.teamProject.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.teamProject.secondaryAction'),
        appearance: 'secondary',
      },
    },
    {
      id: 'my-meetings',
      title: t('cards.myMeetings.title'),
      updatedAt: t('cards.myMeetings.updatedAt'),
      description: t('cards.myMeetings.description'),
      primaryAction: {
        label: t('cards.myMeetings.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.myMeetings.secondaryAction'),
        appearance: 'secondary',
      },
    },
    {
      id: 'recent-transcripts',
      title: t('cards.recentTranscripts.title'),
      updatedAt: t('cards.recentTranscripts.updatedAt'),
      description: t('cards.recentTranscripts.description'),
      primaryAction: {
        label: t('cards.recentTranscripts.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.recentTranscripts.secondaryAction'),
        appearance: 'secondary',
      },
    },
    {
      id: 'recent-notes',
      title: t('cards.recentNotes.title'),
      updatedAt: t('cards.recentNotes.updatedAt'),
      description: t('cards.recentNotes.description'),
      primaryAction: {
        label: t('cards.recentNotes.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.recentNotes.secondaryAction'),
        appearance: 'secondary',
      },
    },
    {
      id: 'quick-actions',
      title: t('cards.quickActions.title'),
      updatedAt: t('cards.quickActions.updatedAt'),
      description: t('cards.quickActions.description'),
      primaryAction: {
        label: t('cards.quickActions.primaryAction'),
        appearance: 'primary',
      },
      secondaryAction: {
        label: t('cards.quickActions.secondaryAction'),
        appearance: 'secondary',
      },
    },
  ];

  return (
    <section className={styles.root}>
      <div className={styles.intro}>
        <Title1 className="font-semibold">{t('title')}</Title1>
        <Body1 className={styles.introDescription}>{t('description')}</Body1>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <Card key={card.id} appearance="subtle" className={styles.card}>
            <CardHeader
              className={styles.cardHeader}
              header={<Title3 as="h3">{card.title}</Title3>}
              description={
                <Caption1>Last updated at {card.updatedAt}</Caption1>
              }
            />

            <div className={styles.cardBody}>
              <Body1 className={styles.description}>{card.description}</Body1>
              <div className={styles.placeholder} aria-hidden />
            </div>

            <CardFooter className={styles.footer}>
              <Button appearance={card.primaryAction.appearance} size="small">
                {card.primaryAction.label}
              </Button>
              <Button appearance={card.secondaryAction.appearance} size="small">
                {card.secondaryAction.label}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
