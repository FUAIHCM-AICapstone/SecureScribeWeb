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
    gap: '16px',
    marginBottom: '8px',
    flexWrap: 'nowrap',
    padding: '24px 32px',
    borderRadius: tokens.borderRadiusXLarge,
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground}08 0%, ${tokens.colorBrandBackground2}12 50%, transparent 100%)`,
    boxShadow: `inset 0 1px 0 0 ${tokens.colorNeutralStroke2}, 0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
    position: 'relative',
    overflow: 'hidden',
    '::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      width: '4px',
      height: '100%',
      background: `linear-gradient(180deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackground2} 100%)`,
      boxShadow: `0 0 12px ${tokens.colorBrandBackground}`,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      right: '32px',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${tokens.colorBrandBackground}15 0%, transparent 70%)`,
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
  },
  introTitle: {
    background: `linear-gradient(135deg, ${tokens.colorBrandForeground1} 0%, ${tokens.colorBrandForeground2} 50%, ${tokens.colorBrandForeground1} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontWeight: '800',
    fontSize: '32px',
    letterSpacing: '-1px',
    textShadow: `0 2px 8px ${tokens.colorBrandBackground}20`,
    position: 'relative',
    zIndex: '1',
  },
  introDescription: {
    color: tokens.colorNeutralForeground2,
    fontSize: '15px',
    lineHeight: '1.5',
    margin: '0',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    position: 'relative',
    zIndex: '1',
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
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}, 0 1px 2px ${tokens.colorNeutralShadowKey}`,
    backgroundImage: `
      radial-gradient(circle at 10% 20%, ${tokens.colorBrandBackground}03 0%, transparent 50%),
      radial-gradient(circle at 90% 80%, ${tokens.colorBrandBackground2}03 0%, transparent 50%)
    `,
    ':hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: `0 16px 40px ${tokens.colorNeutralShadowAmbient}, 0 6px 16px ${tokens.colorNeutralShadowKey}, 0 0 0 2px ${tokens.colorBrandBackground}60`,
    },
    ':hover::before': {
      opacity: '1',
      height: '4px',
    },
    ':hover::after': {
      opacity: '0.2',
      transform: 'scale(1.2)',
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      height: '2px',
      background: `linear-gradient(90deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandForeground2} 50%, ${tokens.colorBrandBackground2} 100%)`,
      opacity: '0.6',
      transition: 'all 0.4s ease',
      boxShadow: `0 0 12px ${tokens.colorBrandBackground}`,
      zIndex: 1,
    },
    '::after': {
      content: '""',
      position: 'absolute',
      bottom: '-50px',
      right: '-50px',
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${tokens.colorBrandBackground}15 0%, transparent 70%)`,
      opacity: '0',
      transition: 'all 0.5s ease',
      pointerEvents: 'none',
    },
  },
  cardDecoTop: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    opacity: '0.3',
  },
  cardDecoBottom: {
    position: 'absolute',
    bottom: '30px',
    right: '30px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground2,
    opacity: '0.2',
  },
  cardHeader: {
    padding: '16px 16px 10px',
    flexShrink: 0,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: '18px',
    letterSpacing: '-0.3px',
    background: `linear-gradient(135deg, ${tokens.colorNeutralForeground1} 0%, ${tokens.colorNeutralForeground2} 100%)`,
    WebkitBackgroundClip: 'text',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flexGrow: 1,
    padding: '0 16px 16px',
    color: tokens.colorNeutralForeground2,
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      bottom: '0',
      right: '0',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${tokens.colorBrandBackground}05 0%, transparent 70%)`,
      pointerEvents: 'none',
    },
  },
  description: {
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
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
    height: '140px',
    borderRadius: tokens.borderRadiusMedium,
    fontSize: '56px',
    flexShrink: 0,
    marginBottom: '12px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    '::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `
        radial-gradient(circle at 30% 30%, ${tokens.colorNeutralBackground1}50 0%, transparent 50%),
        radial-gradient(circle at 70% 70%, ${tokens.colorNeutralBackground1}30 0%, transparent 50%)
      `,
      animation: 'pulse 4s ease-in-out infinite',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '50%',
      height: '100%',
      background: `linear-gradient(90deg, transparent 0%, ${tokens.colorNeutralBackground1}40 50%, transparent 100%)`,
      transform: 'skewX(-20deg)',
      animation: 'shimmer 3s ease-in-out infinite',
    },
    '@keyframes pulse': {
      '0%, 100%': {
        opacity: '0.3',
        transform: 'scale(1)',
      },
      '50%': {
        opacity: '0.6',
        transform: 'scale(1.1)',
      },
    },
    '@keyframes shimmer': {
      '0%': {
        left: '-100%',
      },
      '50%, 100%': {
        left: '200%',
      },
    },
    ':hover': {
      transform: 'scale(1.05)',
    },
    ':hover::after': {
      animationDuration: '1.5s',
    },
  },
  statsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '8px',
  },
  statBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '5px 12px',
    borderRadius: tokens.borderRadiusMedium,
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: 'pointer',
    position: 'relative',
    boxShadow: `0 2px 4px ${tokens.colorNeutralShadowAmbient}`,
    ':hover': {
      transform: 'scale(1.15) translateY(-2px)',
      boxShadow: `0 4px 12px ${tokens.colorNeutralShadowKey}`,
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      borderRadius: tokens.borderRadiusMedium,
      background: `linear-gradient(135deg, ${tokens.colorNeutralBackground1}20 0%, transparent 100%)`,
      opacity: '0',
      transition: 'opacity 0.3s ease',
    },
    ':hover::before': {
      opacity: '1',
    },
  },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '14px 16px 16px',
    flexShrink: 0,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    background: `linear-gradient(180deg, transparent 0%, ${tokens.colorNeutralBackground2} 100%)`,
  },
  // Accent color variants with vibrant illustration-style gradients
  iconBrand: {
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground}25 0%, ${tokens.colorBrandBackground2}45 50%, ${tokens.colorBrandBackground}30 100%)`,
    color: tokens.colorBrandForeground1,
    border: `2px solid ${tokens.colorBrandBackground}30`,
    boxShadow: `inset 0 0 20px ${tokens.colorBrandBackground}15, 0 4px 12px ${tokens.colorBrandBackground}20`,
  },
  iconSuccess: {
    background: `linear-gradient(135deg, ${tokens.colorPaletteGreenBackground2}45 0%, ${tokens.colorPaletteGreenBackground3}65 50%, ${tokens.colorPaletteGreenBackground2}40 100%)`,
    color: tokens.colorPaletteGreenForeground2,
    border: `2px solid ${tokens.colorPaletteGreenBackground3}35`,
    boxShadow: `inset 0 0 20px ${tokens.colorPaletteGreenBackground2}20, 0 4px 12px ${tokens.colorPaletteGreenBackground2}25`,
  },
  iconWarning: {
    background: `linear-gradient(135deg, ${tokens.colorPaletteYellowBackground2}45 0%, ${tokens.colorPaletteYellowBackground3}65 50%, ${tokens.colorPaletteYellowBackground2}40 100%)`,
    color: tokens.colorPaletteYellowForeground2,
    border: `2px solid ${tokens.colorPaletteYellowBackground3}35`,
    boxShadow: `inset 0 0 20px ${tokens.colorPaletteYellowBackground2}20, 0 4px 12px ${tokens.colorPaletteYellowBackground2}25`,
  },
  iconDanger: {
    background: `linear-gradient(135deg, ${tokens.colorPaletteRedBackground2}45 0%, ${tokens.colorPaletteRedBackground3}65 50%, ${tokens.colorPaletteRedBackground2}40 100%)`,
    color: tokens.colorPaletteRedForeground2,
    border: `2px solid ${tokens.colorPaletteRedBackground3}35`,
    boxShadow: `inset 0 0 20px ${tokens.colorPaletteRedBackground2}20, 0 4px 12px ${tokens.colorPaletteRedBackground2}25`,
  },
  iconInformative: {
    background: `linear-gradient(135deg, ${tokens.colorPaletteBlueBackground2}45 0%, ${tokens.colorPaletteBlueForeground2}25 50%, ${tokens.colorPaletteBlueBackground2}40 100%)`,
    color: tokens.colorPaletteBlueForeground2,
    border: `2px solid ${tokens.colorPaletteBlueBackground2}35`,
    boxShadow: `inset 0 0 20px ${tokens.colorPaletteBlueBackground2}20, 0 4px 12px ${tokens.colorPaletteBlueBackground2}25`,
  },
  iconSubtle: {
    background: `linear-gradient(135deg, ${tokens.colorNeutralBackground5}50 0%, ${tokens.colorNeutralBackground6}70 50%, ${tokens.colorNeutralBackground5}50 100%)`,
    color: tokens.colorBrandForeground1,
    border: `2px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: `inset 0 0 20px ${tokens.colorNeutralBackground6}, 0 4px 12px ${tokens.colorNeutralShadowAmbient}, inset 0 0 40px ${tokens.colorBrandBackground}08`,
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
