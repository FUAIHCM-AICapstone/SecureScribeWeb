'use client';

import { DeleteConfirmationModal } from '@/components/modal/DeleteConfirmationModal';
import MeetingEditModal from '@/components/modal/MeetingEditModal';
import { showToast } from '@/hooks/useShowToast';
import { queryKeys } from '@/lib/queryClient';
import { archiveMeeting, deleteMeeting, getMeeting, unarchiveMeeting } from '@/services/api/meeting';
import {
  Badge,
  Body1,
  Button,
  Caption1,
  Card,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  Archive20Regular,
  ArrowLeft20Regular,
  CalendarClock20Regular,
  Delete20Regular,
  Document20Regular,
  Edit20Regular,
  Link20Regular,
  MoreVertical20Regular,
  People20Regular,
} from '@fluentui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { MeetingWithProjects } from 'types/meeting.type';
import { LinkedProjectsSection } from './LinkedProjectsSection';

const useStyles = makeStyles({
  container: {
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
    ...shorthands.padding('32px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    boxShadow: tokens.shadow4,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    ...shorthands.gap('16px'),
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
    flex: 1,
    minWidth: '0',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  badgesRow: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
  },
  actionsRow: {
    display: 'flex',
    ...shorthands.gap('8px'),
    alignItems: 'center',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('32px'),
    ...shorthands.padding('20px', '0', '0'),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    marginTop: '20px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('12px'),
  },
  metaIcon: {
    color: tokens.colorBrandForeground2,
    marginTop: '2px',
    opacity: 0.8,
  },
  metaContent: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
  },
  metaLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
  },
  metaValue: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
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
    ...shorthands.padding('28px'),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    boxShadow: tokens.shadow4,
    ...shorthands.transition('box-shadow', '0.2s', 'ease'),
    ':hover': {
      boxShadow: tokens.shadow8,
    },
  },
  sectionTitle: {
    marginBottom: '20px',
    paddingBottom: '16px',
    ...shorthands.borderBottom('2px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  sectionIcon: {
    color: tokens.colorBrandForeground2,
    opacity: 0.8,
  },
  sectionHeading: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: 700,
    color: tokens.colorNeutralForeground1,
  },
  description: {
    lineHeight: '1.8',
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
  },
  noContent: {
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
    textAlign: 'center',
    ...shorthands.padding('24px'),
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  projectItem: {
    ...shorthands.padding('16px', '20px'),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.transition('all', '0.2s', 'ease'),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
      boxShadow: tokens.shadow4,
      transform: 'translateX(4px)',
    },
  },
  projectName: {
    fontWeight: 600,
    fontSize: tokens.fontSizeBase300,
  },
  urlButton: {
    width: '100%',
  },
  placeholder: {
    ...shorthands.padding('48px', '32px'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
  },
  placeholderText: {
    fontSize: tokens.fontSizeBase300,
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
  overviewItem: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
    ...shorthands.padding('16px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  overviewLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    fontWeight: 600,
  },
  overviewValue: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 500,
    color: tokens.colorNeutralForeground1,
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
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const {
    data: meeting,
    isLoading,
    isError,
  } = useQuery<MeetingWithProjects>({
    queryKey: queryKeys.meeting(meetingId),
    queryFn: () => getMeeting(meetingId),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteMeeting(meetingId),
    onSuccess: () => {
      showToast('success', tMeetings('actions.deleteSuccess'));
      router.push('/meetings');
    },
    onError: (error: any) => {
      showToast('error', error?.response?.data?.detail || tMeetings('actions.deleteError'));
      setIsDeleting(false);
    },
  });

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: () => archiveMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({
        queryKey: queryKeys.meeting(meetingId),
      });
      showToast('success', tMeetings('actions.archiveSuccess'), { duration: 3000 });
    },
    onError: (error: any) => {
      console.error('Error archiving meeting:', error);
      showToast('error', error?.message || tMeetings('actions.archiveError'), {
        duration: 5000,
      });
    },
  });

  // Unarchive mutation
  const unarchiveMutation = useMutation({
    mutationFn: () => unarchiveMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({
        queryKey: queryKeys.meeting(meetingId),
      });
      showToast('success', tMeetings('actions.unarchiveSuccess'), { duration: 3000 });
    },
    onError: (error: any) => {
      console.error('Error unarchiving meeting:', error);
      showToast('error', error?.message || tMeetings('actions.unarchiveError'), {
        duration: 5000,
      });
    },
  });

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    setShowDeleteModal(false);
    deleteMutation.mutate();
  };

  const handleArchiveToggle = () => {
    if (meeting?.status === 'archived') {
      unarchiveMutation.mutate();
    } else {
      archiveMutation.mutate();
    }
  };

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
      case 'archived':
        return (
          <Badge appearance="outline" color="warning" size="large">
            {tMeetings('status.archived')}
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
            <Text className={styles.title}>
              {meeting.title || tMeetings('untitledMeeting')}
            </Text>
            <div className={styles.badgesRow}>
              {getStatusBadge(meeting.status)}
              {meeting.is_personal && (
                <Badge appearance="outline" size="large" color="brand">
                  {tMeetings('badges.personal')}
                </Badge>
              )}
              {meeting.url && (
                <Badge
                  appearance="outline"
                  size="large"
                  color="brand"
                  icon={<Link20Regular />}
                >
                  {t('hasMeetingUrl')}
                </Badge>
              )}
            </div>
            {meeting.description && (
              <Body1 className={styles.description}>
                {meeting.description}
              </Body1>
            )}
          </div>
          <div className={styles.actionsRow}>
            <Button
              appearance="secondary"
              icon={<Edit20Regular />}
              onClick={handleEdit}
            >
              {t('edit')}
            </Button>
            <Button
              appearance="secondary"
              icon={<Archive20Regular />}
              onClick={handleArchiveToggle}
              disabled={archiveMutation.isPending || unarchiveMutation.isPending}
            >
              {meeting.status === 'archived' ? tMeetings('actions.unarchive') : tMeetings('actions.archive')}
            </Button>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button appearance="subtle" icon={<MoreVertical20Regular />} />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    icon={<Delete20Regular />}
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {t('delete')}
                  </MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>

        <div className={styles.metaRow}>
          {meeting.start_time && (
            <div className={styles.metaItem}>
              <CalendarClock20Regular className={styles.metaIcon} />
              <div className={styles.metaContent}>
                <Caption1 className={styles.metaLabel}>
                  {t('startTime')}:
                </Caption1>
                <Body1 className={styles.metaValue}>
                  {formatDateTime(meeting.start_time)}
                </Body1>
              </div>
            </div>
          )}
          <div className={styles.metaItem}>
            <People20Regular className={styles.metaIcon} />
            <div className={styles.metaContent}>
              <Caption1 className={styles.metaLabel}>{t('projects')}:</Caption1>
              <Body1 className={styles.metaValue}>
                {t('projectsCount', {
                  count: meeting.projects?.length || 0,
                })}
              </Body1>
            </div>
          </div>
          <div className={styles.metaItem}>
            <Document20Regular className={styles.metaIcon} />
            <div className={styles.metaContent}>
              <Caption1 className={styles.metaLabel}>
                {t('createdAt')}:
              </Caption1>
              <Body1 className={styles.metaValue}>
                {formatDateTime(meeting.created_at)}
              </Body1>
            </div>
          </div>
          <div className={styles.metaItem}>
            <Document20Regular className={styles.metaIcon} />
            <div className={styles.metaContent}>
              <Caption1 className={styles.metaLabel}>
                {t('updatedAt')}:
              </Caption1>
              <Body1 className={styles.metaValue}>
                {formatDateTime(meeting.updated_at || null)}
              </Body1>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainColumn}>
          {/* Notes Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <Document20Regular className={styles.sectionIcon} />
              <Text className={styles.sectionHeading}>{t('notes')}</Text>
            </div>
            <div className={styles.placeholder}>
              <Body1 className={styles.placeholderText}>
                {t('notes')} - Coming soon
              </Body1>
            </div>
          </Card>

          {/* Files Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <Document20Regular className={styles.sectionIcon} />
              <Text className={styles.sectionHeading}>{t('files')}</Text>
            </div>
            <div className={styles.placeholder}>
              <Body1 className={styles.placeholderText}>
                {t('filesCount', { count: 0 })}
              </Body1>
            </div>
          </Card>
        </div>

        <div className={styles.sideColumn}>
          {/* Transcripts Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <Document20Regular className={styles.sectionIcon} />
              <Text className={styles.sectionHeading}>{t('transcripts')}</Text>
            </div>
            <div className={styles.placeholder}>
              <Body1 className={styles.placeholderText}>
                {t('transcripts')} - Coming soon
              </Body1>
            </div>
          </Card>

          {/* Related Projects */}
          {meeting.projects && meeting.projects.length > 0 && (
            <LinkedProjectsSection projects={meeting.projects} />
          )}

          {/* Meeting URL */}
          {meeting.url && (
            <Card className={styles.section}>
              <div className={styles.sectionTitle}>
                <Link20Regular className={styles.sectionIcon} />
                <Text className={styles.sectionHeading}>{t('meetingUrl')}</Text>
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
        </div>
      </div>

      {/* Meeting Edit Modal */}
      {meeting && (
        <MeetingEditModal
          open={showEditModal}
          onOpenChange={setShowEditModal}
          meeting={meeting}
          onEditSuccess={() => {
            setShowEditModal(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title={tMeetings('actions.deleteConfirmTitle')}
        itemName={meeting?.title || tMeetings('untitledMeeting')}
      />
    </div>
  );
}
