'use client';

import {
  Badge,
  Caption1,
  Card,
  CardFooter,
  CardHeader,
  makeStyles,
  shorthands,
  Text,
  tokens,
} from '@fluentui/react-components';
import { CalendarClock20Regular, People20Regular } from '@/lib/icons';
import { formatDateTime } from '@/lib/dateFormatter';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { ProjectResponse } from 'types/project.type';
import { ProjectActionsMenu } from './ProjectActionsMenu';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '280px',
    maxWidth: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.transition('all', '0.3s', 'ease'),
    ...shorthands.overflow('hidden'),
    position: 'relative',
    cursor: 'pointer',
    boxShadow: `0 2px 8px ${tokens.colorNeutralShadowAmbient}`,
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 8px 24px ${tokens.colorNeutralShadowAmbient}, 0 0 0 1px ${tokens.colorBrandBackground}`,
    },
  },
  header: {
    ...shorthands.padding('16px', '16px', '8px'),
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.gap('8px'),
  },
  title: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    ...shorthands.overflow('hidden'),
    flexGrow: 1,
  },
  body: {
    ...shorthands.padding('0', '16px', '16px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    flexGrow: 1,
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    color: tokens.colorNeutralForeground2,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    ...shorthands.overflow('hidden'),
  },
  footer: {
    ...shorthands.padding('12px', '16px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap('8px'),
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('6px'),
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
  },
  dateInfo: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  actionsMenu: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    zIndex: 10,
  },
});

interface ProjectCardProps {
  project: ProjectResponse;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const styles = useStyles();
  const router = useRouter();
  const t = useTranslations('Projects');

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the actions menu
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(`/projects/${project.id}`);
  };

  const getStatusBadge = () => {
    if (project.is_archived) {
      return (
        <Badge appearance="filled" color="warning" size="small">
          {t('status.archived')}
        </Badge>
      );
    }
    return (
      <Badge appearance="filled" color="success" size="small">
        {t('status.active')}
      </Badge>
    );
  };

  const formatCreatedDate = () => {
    if (!project.created_at) return t('noDateSet');
    try {
      return formatDateTime(project.created_at);
    } catch {
      return t('invalidDate');
    }
  };

  return (
    <Card className={styles.card} onClick={handleCardClick}>
      <CardHeader
        className={styles.header}
        header={
          <div className={styles.headerContent}>
            <Text className={styles.title}>
              {project.name || t('untitledProject')}
            </Text>
            <div className={styles.actionsMenu}>
              <ProjectActionsMenu project={project} />
            </div>
          </div>
        }
      />

      <div className={styles.body}>
        <div className={styles.badgeRow}>{getStatusBadge()}</div>

        {project.description && (
          <Caption1 className={styles.description}>
            {project.description}
          </Caption1>
        )}

        <div className={styles.infoRow}>
          <People20Regular />
          <Caption1>
            {t('memberCount', { count: project.member_count || 0 })}
          </Caption1>
        </div>
      </div>

      <CardFooter className={styles.footer}>
        <div className={styles.memberInfo}>
          <CalendarClock20Regular />
          <span className={styles.dateInfo}>{formatCreatedDate()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
