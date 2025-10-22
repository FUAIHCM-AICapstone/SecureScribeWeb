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
    gap: '32px',
    width: '100%',
  },
  intro: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: '16px',
    marginBottom: '0',
    flexWrap: 'nowrap',
    padding: '24px',
    borderRadius: tokens.borderRadiusXLarge,
    background: `linear-gradient(135deg, rgba(17, 94, 163, 0.03) 0%, rgba(91, 155, 213, 0.05) 100%)`,
    border: '1px solid rgba(17, 94, 163, 0.15)',
    boxShadow: '0 2px 8px rgba(17, 94, 163, 0.08)',
    '@media (max-width: 768px)': {
      padding: '16px',
    },
  },
  introTitle: {
    color: '#115ea3',
    fontWeight: 700,
    fontSize: tokens.fontSizeHero900,
  },
  introDescription: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: '1.5',
    margin: '0',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  grid: {
    display: 'grid',
    gap: tokens.spacingHorizontalL,
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    '@media (min-width: 1200px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: tokens.spacingHorizontalXL,
    },
    '@media (min-width: 768px) and (max-width: 1199px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '280px',
    maxWidth: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px ${tokens.colorNeutralShadowAmbient}, 0 0 0 1px ${tokens.colorBrandBackground}`,
    },
  },
  cardHeader: {
    padding: '16px 16px 8px',
    flexShrink: 0,
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexGrow: 1,
    padding: '0 16px 16px',
    color: tokens.colorNeutralForeground2,
  },
  description: {
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
    fontWeight: '400',
    listStyle: 'none',
    margin: '0',
    padding: '0',
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
    marginBottom: '12px',
    transition: 'transform 0.3s ease',
  },
  statsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '8px',
  },
  statBadge: {
    fontSize: tokens.fontSizeBase100,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: tokens.borderRadiusMedium,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '12px 16px',
    flexShrink: 0,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  // Simplified accent color variants
  iconBrand: {
    background: `${tokens.colorBrandBackground}15`,
    color: tokens.colorBrandForeground1,
  },
  iconSuccess: {
    background: `${tokens.colorPaletteGreenBackground2}40`,
    color: tokens.colorPaletteGreenForeground2,
  },
  iconWarning: {
    background: `${tokens.colorPaletteYellowBackground2}40`,
    color: tokens.colorPaletteYellowForeground2,
  },
  iconDanger: {
    background: `${tokens.colorPaletteRedBackground2}40`,
    color: tokens.colorPaletteRedForeground2,
  },
  iconInformative: {
    background: `${tokens.colorPaletteBlueBackground2}40`,
    color: tokens.colorPaletteBlueForeground2,
  },
  iconSubtle: {
    background: tokens.colorNeutralBackground5,
    color: tokens.colorBrandForeground1,
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
      accentColor: 'danger',
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
      accentColor: 'warning',
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
                <div className={iconClassName}>
                  <div
                    style={{
                      transition:
                        'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      display: 'flex',
                      position: 'relative',
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'rotate(5deg) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                    }}
                  >
                    {card.icon}
                  </div>
                </div>

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
