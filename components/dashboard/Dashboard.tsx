'use client';

import React from 'react';
import {
  Badge,
  Body1,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Caption1,
  mergeClasses,
  Title1,
  Title3,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import type { ButtonProps } from '@fluentui/react-components';
import {
  CheckboxChecked24Regular,
  PeopleTeam24Regular,
  VideoClip24Regular,
  DocumentText24Regular,
  NotebookSection24Regular,
  Flash24Regular,
} from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    padding: '0',
  },
  intro: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: '12px',
    marginBottom: '0',
    flexWrap: 'nowrap',
    paddingBottom: '16px',
    borderBottom: `2px solid ${tokens.colorBrandBackground}`,
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground2}10 0%, transparent 100%)`,
    padding: '16px 0',
    borderRadius: tokens.borderRadiusMedium,
  },
  introTitle: {
    background: `linear-gradient(135deg, ${tokens.colorBrandForeground1} 0%, ${tokens.colorBrandForeground2} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: '700',
    fontSize: '28px',
    letterSpacing: '-0.5px',
  },
  introDescription: {
    color: tokens.colorNeutralForeground3,
    fontSize: '14px',
    lineHeight: '1.4',
    margin: '0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  grid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    '@media (max-width: 768px)': {
      gridTemplateColumns: 'repeat(1, 1fr)',
    },
    '@media (min-width: 769px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxWidth: '100%',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
    ':hover': {
      transform: 'translateY(-6px)',
      boxShadow: tokens.shadow28,
    },
    ':hover::before': {
      opacity: '1',
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '3px',
      background: `linear-gradient(90deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackground2} 100%)`,
      opacity: '0.5',
      transition: 'opacity 0.3s ease',
    },
  },
  cardHeader: {
    padding: '14px 14px 8px',
    flexShrink: 0,
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexGrow: 1,
    padding: '0 14px 14px',
    color: tokens.colorNeutralForeground2,
  },
  description: {
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.4',
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '120px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: '48px',
    flexShrink: 0,
    marginBottom: '8px',
    position: 'relative',
    overflow: 'hidden',
  },
  statsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: 'auto',
  },
  statBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    padding: '0 14px 14px',
    flexShrink: 0,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    paddingTop: '12px',
  },
  // Accent color variants with illustration-style gradients
  iconBrand: {
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground}20 0%, ${tokens.colorBrandBackground2}40 100%)`,
    color: tokens.colorBrandForeground1,
    border: `1px solid ${tokens.colorBrandBackground2}30`,
  },
  iconSuccess: {
    background: `linear-gradient(135deg, ${tokens.colorPaletteGreenBackground2}40 0%, ${tokens.colorPaletteGreenBackground3}60 100%)`,
    color: tokens.colorPaletteGreenForeground2,
    border: `1px solid ${tokens.colorPaletteGreenBackground3}30`,
  },
  iconWarning: {
    background: `linear-gradient(135deg, ${tokens.colorPaletteYellowBackground2}40 0%, ${tokens.colorPaletteYellowBackground3}60 100%)`,
    color: tokens.colorPaletteYellowForeground2,
    border: `1px solid ${tokens.colorPaletteYellowBackground3}30`,
  },
  iconDanger: {
    background: `linear-gradient(135deg, ${tokens.colorPaletteRedBackground2}40 0%, ${tokens.colorPaletteRedBackground3}60 100%)`,
    color: tokens.colorPaletteRedForeground2,
    border: `1px solid ${tokens.colorPaletteRedBackground3}30`,
  },
  iconInformative: {
    background: `linear-gradient(135deg, ${tokens.colorPaletteBlueBackground2}40 0%, ${tokens.colorPaletteBlueBackground2}60 100%)`,
    color: tokens.colorPaletteBlueForeground2,
    border: `1px solid ${tokens.colorPaletteBlueBackground2}30`,
  },
  iconSubtle: {
    background: `linear-gradient(135deg, ${tokens.colorNeutralBackground4} 0%, ${tokens.colorNeutralBackground5} 100%)`,
    color: tokens.colorNeutralForeground2,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

interface DashboardAction {
  label: string;
  appearance?: ButtonProps['appearance'];
}

interface DashboardStat {
  label: string;
  value: string | number;
}

interface DashboardCard {
  id: string;
  title: string;
  updatedAt: string;
  description: string;
  icon: React.ReactElement;
  accentColor:
    | 'brand'
    | 'success'
    | 'warning'
    | 'danger'
    | 'informative'
    | 'subtle';
  stats: DashboardStat[];
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
      icon: <CheckboxChecked24Regular />,
      accentColor: 'brand',
      stats: [
        { label: 'Pending', value: 5 },
        { label: 'Completed', value: 12 },
      ],
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
      icon: <PeopleTeam24Regular />,
      accentColor: 'success',
      stats: [
        { label: 'Active', value: 3 },
        { label: 'Members', value: 24 },
      ],
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
      icon: <VideoClip24Regular />,
      accentColor: 'informative',
      stats: [
        { label: 'Today', value: 2 },
        { label: 'This Week', value: 7 },
      ],
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
      icon: <DocumentText24Regular />,
      accentColor: 'warning',
      stats: [
        { label: 'Total', value: 18 },
        { label: 'New', value: 3 },
      ],
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
      icon: <NotebookSection24Regular />,
      accentColor: 'subtle',
      stats: [
        { label: 'Shared', value: 8 },
        { label: 'Private', value: 5 },
      ],
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
      icon: <Flash24Regular />,
      accentColor: 'danger',
      stats: [
        { label: 'Recent', value: 15 },
        { label: 'Favorites', value: 6 },
      ],
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
        <Title1 className={styles.introTitle}>{t('title')}</Title1>
        <span
          style={{ margin: '0 8px', color: tokens.colorNeutralForeground4 }}
        >
          •
        </span>
        <Body1 className={styles.introDescription}>{t('description')}</Body1>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => {
          const iconClassName = mergeClasses(
            styles.iconContainer,
            styles[
              `icon${card.accentColor.charAt(0).toUpperCase() + card.accentColor.slice(1)}` as keyof ReturnType<
                typeof useStyles
              >
            ],
          );

          return (
            <Card key={card.id} appearance="subtle" className={styles.card}>
              <CardHeader
                className={styles.cardHeader}
                header={<Title3 as="h3">{card.title}</Title3>}
                description={
                  <Caption1>Last updated at {card.updatedAt}</Caption1>
                }
              />

              <div className={styles.cardBody}>
                <div className={iconClassName}>{card.icon}</div>

                <Body1 className={styles.description}>{card.description}</Body1>

                <div className={styles.statsContainer}>
                  {card.stats.map((stat, index) => (
                    <Badge
                      key={index}
                      appearance="outline"
                      className={styles.statBadge}
                    >
                      {stat.label}: {stat.value}
                    </Badge>
                  ))}
                </div>
              </div>

              <CardFooter className={styles.footer}>
                <Button appearance={card.primaryAction.appearance} size="small">
                  {card.primaryAction.label}
                </Button>
                <Button
                  appearance={card.secondaryAction.appearance}
                  size="small"
                >
                  {card.secondaryAction.label}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Dashboard;
