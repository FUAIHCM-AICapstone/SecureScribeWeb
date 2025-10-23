'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Text,
  Title3,
  Caption1,
  Body1,
  Badge,
  Button,
  Card,
  Spinner,
  makeStyles,
  tokens,
  shorthands,
} from '@fluentui/react-components';
import {
  ArrowLeft20Regular,
  CalendarClock20Regular,
  People20Regular,
  Document20Regular,
  Link20Regular,
} from '@fluentui/react-icons';
import { format } from 'date-fns';
import { queryKeys } from '@/lib/queryClient';
import { getMeeting } from '@/services/api/meeting';
import type { MeetingWithProjects } from 'types/meeting.type';

const useStyles = makeStyles({
  container: {
    maxWidth: '1600px',
    margin: '0 auto',
    ...shorthands.padding('40px', '32px', '24px'),
    '@media (max-width: 768px)': {
      ...shorthands.padding('24px', '16px', '16px'),
    },
  },
  backButton: {
    marginBottom: '24px',
  },
  header: {
    marginBottom: '32px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap('16px'),
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    flex: 1,
    minWidth: '0',
  },
  badgesRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('24px'),
    ...shorthands.padding('16px', '0'),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  metaLabel: {
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase200,
  },
  metaValue: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase200,
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    ...shorthands.gap('24px'),
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  sideColumn: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  section: {
    ...shorthands.padding('24px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },
  sectionTitle: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  description: {
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground1,
  },
  noContent: {
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  projectItem: {
    ...shorthands.padding('12px', '16px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectName: {
    fontWeight: 600,
  },
  urlButton: {
    width: '100%',
  },
  placeholder: {
    ...shorthands.padding('32px'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    ...shorthands.gap('16px'),
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    textAlign: 'center',
    ...shorthands.gap('16px'),
  },
  errorTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: tokens.colorPaletteRedForeground1,
  },
});

interface MeetingDetailClientProps {
  meetingId: string;
}

export function MeetingDetailClient({ meetingId }: MeetingDetailClientProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingDetail');
  const tMeetings = useTranslations('Meetings');
  const router = useRouter();

  const { data: meeting, isLoading, isError } = useQuery<MeetingWithProjects>({
    queryKey: queryKeys.meeting(meetingId),
    queryFn: () => getMeeting(meetingId),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge appearance="filled" color="success" size="large">
            {tMeetings('status.active')}
          </Badge>
        );
      case 'completed':
        return (
          <Badge appearance="filled" color="informative" size="large">
            {tMeetings('status.completed')}
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge appearance="filled" color="danger" size="large">
            {tMeetings('status.cancelled')}
          </Badge>
        );
      default:
        return (
          <Badge appearance="outline" size="large">
            {status}
          </Badge>
        );
    }
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return t('noDescription');
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return tMeetings('invalidDate');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <Spinner size="extra-large" />
          <Text>{t('loading')}</Text>
        </div>
      </div>
    );
  }

  if (isError || !meeting) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <Text className={styles.errorTitle}>{t('notFound')}</Text>
          <Body1>{t('notFoundDescription')}</Body1>
          <Button
            appearance="primary"
            icon={<ArrowLeft20Regular />}
            onClick={() => router.push('/meetings')}
          >
            {t('backToMeetings')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button
        appearance="subtle"
        icon={<ArrowLeft20Regular />}
        onClick={() => router.push('/meetings')}
        className={styles.backButton}
      >
        {t('backToMeetings')}
      </Button>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.titleSection}>
            <Title3>{meeting.title || tMeetings('untitledMeeting')}</Title3>
            <div className={styles.badgesRow}>
              {getStatusBadge(meeting.status)}
              {meeting.is_personal && (
                <Badge appearance="outline" size="large" color="brand">
                  {tMeetings('badges.personal')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className={styles.metaRow}>
          {meeting.start_time && (
            <div className={styles.metaItem}>
              <CalendarClock20Regular />
              <div>
                <Caption1 className={styles.metaLabel}>
                  {t('startTime')}
                </Caption1>
                <Body1 className={styles.metaValue}>
                  {formatDateTime(meeting.start_time)}
                </Body1>
              </div>
            </div>
          )}
          <div className={styles.metaItem}>
            <People20Regular />
            <div>
              <Caption1 className={styles.metaLabel}>
                {t('projects')}
              </Caption1>
              <Body1 className={styles.metaValue}>
                {t('projectsCount', {
                  count: meeting.projects?.length || 0,
                })}
              </Body1>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainColumn}>
          {/* Description Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <Document20Regular />
              <Title3>{t('description')}</Title3>
            </div>
            {meeting.description ? (
              <Body1 className={styles.description}>{meeting.description}</Body1>
            ) : (
              <Body1 className={styles.noContent}>{t('noDescription')}</Body1>
            )}
          </Card>

          {/* Notes Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <Document20Regular />
              <Title3>{t('notes')}</Title3>
            </div>
            <div className={styles.placeholder}>
              <Body1>{t('notes')} - Coming soon</Body1>
            </div>
          </Card>

          {/* Transcripts Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <Document20Regular />
              <Title3>{t('transcripts')}</Title3>
            </div>
            <div className={styles.placeholder}>
              <Body1>{t('transcripts')} - Coming soon</Body1>
            </div>
          </Card>

          {/* Files Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <Document20Regular />
              <Title3>{t('files')}</Title3>
            </div>
            <div className={styles.placeholder}>
              <Body1>{t('filesCount', { count: 0 })}</Body1>
            </div>
          </Card>
        </div>

        <div className={styles.sideColumn}>
          {/* Related Projects */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <People20Regular />
              <Title3>{t('projects')}</Title3>
            </div>
            {meeting.projects && meeting.projects.length > 0 ? (
              <div className={styles.projectsList}>
                {meeting.projects.map((project) => (
                  <div key={project.id} className={styles.projectItem}>
                    <Text className={styles.projectName}>
                      {project.name || 'Untitled Project'}
                    </Text>
                  </div>
                ))}
              </div>
            ) : (
              <Body1 className={styles.noContent}>{t('noProjects')}</Body1>
            )}
          </Card>

          {/* Meeting URL */}
          {meeting.url && (
            <Card className={styles.section}>
              <div className={styles.sectionTitle}>
                <Link20Regular />
                <Title3>{t('meetingUrl')}</Title3>
              </div>
              <Button
                appearance="primary"
                icon={<Link20Regular />}
                onClick={() => window.open(meeting.url, '_blank')}
                className={styles.urlButton}
              >
                {t('openUrl')}
              </Button>
            </Card>
          )}

          {/* Metadata */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <Document20Regular />
              <Title3>{t('overview')}</Title3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>
                  {t('createdAt')}
                </Caption1>
                <Body1>{formatDateTime(meeting.created_at)}</Body1>
              </div>
              <div>
                <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>
                  {t('updatedAt')}
                </Caption1>
                <Body1>{formatDateTime(meeting.updated_at || null)}</Body1>
              </div>
              <div>
                <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>
                  {t('status')}
                </Caption1>
                <div style={{ marginTop: '4px' }}>{getStatusBadge(meeting.status)}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
