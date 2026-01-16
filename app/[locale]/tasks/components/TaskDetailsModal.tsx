'use client';

import { queryKeys } from '@/lib/queryClient';
import { getTask } from '@/services/api/task';
import { getMeeting } from '@/services/api/meeting';
import { useRouter } from '@/i18n/navigation';
import { MeetingRow } from '@/app/[locale]/meetings/components/MeetingRow';
import { ProjectRow } from '@/app/[locale]/projects/components/ProjectRow';
import {
  Avatar,
  Badge,
  Button,
  Caption1,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  CalendarClock20Regular,
  Edit20Regular,
} from '@fluentui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { formatDateTime as formatDateTimeUtil } from '@/lib/dateFormatter';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import type { TaskResponse } from 'types/task.type';

const useStyles = makeStyles({
  dialog: {
    minWidth: '70%',
    '@media (max-width: 768px)': {
      minWidth: '100%',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalXXS),
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  title: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  statusBadge: {
    margin: 0,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalXL),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
  },
  sectionLabel: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  description: {
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
  },
  metaCard: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: tokens.colorNeutralForeground2,
  },
  metaRowLabel: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  metaRowValue: {
    color: tokens.colorNeutralForeground2,
  },
  peopleList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalS),
  },
  personCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
  },
  personInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  personMeta: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalXXS),
  },
  personLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding(tokens.spacingVerticalXXL, 0),
  },
  emptyValue: {
    color: tokens.colorNeutralForeground3,
  },
});

interface TaskDetailsModalProps {
  taskId: string;
  open: boolean;
  onClose: () => void;
  initialTask?: TaskResponse;
  onEdit?: (task: TaskResponse) => void;
}

export function TaskDetailsModal({
  taskId,
  open,
  onClose,
  initialTask,
  onEdit,
}: TaskDetailsModalProps) {
  const styles = useStyles();
  const t = useTranslations('Tasks');
  const router = useRouter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: queryKeys.task(taskId),
    queryFn: () => getTask(taskId),
    enabled: open && Boolean(taskId),
    initialData: initialTask,
  });

  // Query meeting details if task has a meeting_id
  const { data: meetingData, isLoading: isMeetingLoading } = useQuery({
    queryKey: queryKeys.meeting(data?.meeting_id || ''),
    queryFn: () => getMeeting(data!.meeting_id!),
    enabled: open && Boolean(data?.meeting_id),
  });

  const statusBadge = useMemo(() => {
    if (!data) {
      return null;
    }

    switch (data.status) {
      case 'todo':
        return (
          <Badge appearance="filled" color="warning">
            {t('status.todo')}
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge appearance="filled" color="informative">
            {t('status.in_progress')}
          </Badge>
        );
      case 'done':
        return (
          <Badge appearance="filled" color="success">
            {t('status.done')}
          </Badge>
        );
      default:
        return <Badge appearance="outline">{data.status}</Badge>;
    }
  }, [data, t]);

  const formatDateTime = (value?: string) => {
    if (!value) {
      return null;
    }
    try {
      return formatDateTimeUtil(value);
    } catch {
      return value;
    }
  };

  const handleEditClick = () => {
    if (data && onEdit) {
      onEdit(data);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(_, detail) => {
        if (!detail.open) {
          onClose();
        }
      }}
    >
      <DialogSurface className={styles.dialog}>
        <DialogBody>
          <DialogTitle> </DialogTitle>
          <DialogContent className={styles.content}>
            {isLoading && !data ? (
              <div className={styles.spinnerContainer}>
                <Spinner label={t('loading')} />
              </div>
            ) : isError || !data ? (
              <div className={styles.section}>
                <Text className={styles.sectionLabel}>{t('errorTitle')}</Text>
                <Text className={styles.emptyValue}>{t('retry')}</Text>
                <Button
                  appearance="primary"
                  onClick={() => refetch()}
                  disabled={isFetching}
                >
                  {isFetching ? t('loading') : t('retry')}
                </Button>
              </div>
            ) : (
              <div className={styles.body}>
                <div className={styles.header}>
                  <div className={styles.titleRow}>
                    <Text className={styles.title}>
                      {data.title || t('untitledTask')}
                    </Text>
                    {statusBadge}
                  </div>
                </div>

                <div className={styles.section}>
                  <Text className={styles.sectionLabel}>
                    {t('createTaskModal.descriptionLabel')}
                  </Text>
                  <Text className={styles.description}>
                    {data.description || t('noDescription')}
                  </Text>
                </div>

                <div className={styles.section}>
                  <Text className={styles.sectionLabel}>
                    {t('createTaskModal.projectsLabel')}
                  </Text>
                  {data.projects && data.projects.length > 0 ? (
                    <div className={styles.projectsList}>
                      {data.projects.map((project) => (
                        <div
                          key={project.id}
                          onClick={() => router.push(`/projects/${project.id}`)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              router.push(`/projects/${project.id}`);
                            }
                          }}
                        >
                          <ProjectRow project={project} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Text className={styles.emptyValue}>
                      {t('createTaskModal.noProjects')}
                    </Text>
                  )}
                </div>

                {data.meeting_id && (
                  <div className={styles.section}>
                    <Text className={styles.sectionLabel}>
                      {t('detailsModal.meetingSection')}
                    </Text>
                    {isMeetingLoading ? (
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                        <Spinner size="small" />
                      </div>
                    ) : meetingData ? (
                      <div
                        onClick={() => router.push(`/meetings/${meetingData.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            router.push(`/meetings/${meetingData.id}`);
                          }
                        }}
                      >
                        <MeetingRow meeting={meetingData} />
                      </div>
                    ) : (
                      <Text className={styles.emptyValue}>
                        {t('detailsModal.noMeeting')}
                      </Text>
                    )}
                  </div>
                )}

                <div className={styles.section}>
                  <Text className={styles.sectionLabel}>
                    {t('createTaskModal.dueDateLabel')}
                  </Text>
                  <div className={styles.metaCard}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaRowLabel}>
                        <CalendarClock20Regular />
                        {t('createTaskModal.dueDateLabel')}
                      </span>
                      <span className={styles.metaRowValue}>
                        {formatDateTime(data.due_date) || t('noDateSet')}
                      </span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaRowLabel}>
                        <CalendarClock20Regular />
                        {t('detailsModal.reminderLabel')}
                      </span>
                      <span className={styles.metaRowValue}>
                        {formatDateTime(data.reminder_at) || t('noDateSet')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <Text className={styles.sectionLabel}>
                    {t('detailsModal.peopleSection')}
                  </Text>
                  <div className={styles.peopleList}>
                    <div className={styles.personCard}>
                      <div className={styles.personInfo}>
                        <Avatar
                          name={data.creator?.name || data.creator?.email}
                          size={36}
                          image={
                            data.creator?.avatar_url
                              ? { src: data.creator.avatar_url }
                              : undefined
                          }
                        />
                        <div className={styles.personMeta}>
                          <Text>
                            {data.creator?.name || data.creator?.email}
                          </Text>
                          <Caption1 className={styles.personLabel}>
                            {t('createdBy')}
                          </Caption1>
                        </div>
                      </div>
                      <Caption1 className={styles.emptyValue}>
                        {formatDateTime(data.created_at)}
                      </Caption1>
                    </div>
                    <div className={styles.personCard}>
                      <div className={styles.personInfo}>
                        <Avatar
                          name={
                            data.assignee?.name ||
                            data.assignee?.email ||
                            t('unassigned')
                          }
                          size={36}
                          image={
                            data.assignee?.avatar_url
                              ? { src: data.assignee.avatar_url }
                              : undefined
                          }
                        />
                        <div className={styles.personMeta}>
                          <Text>
                            {data.assignee?.name ||
                              data.assignee?.email ||
                              t('unassigned')}
                          </Text>
                          <Caption1 className={styles.personLabel}>
                            {t('assignedTo')}
                          </Caption1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {t('createTaskModal.cancel')}
            </Button>
            <Button
              appearance="primary"
              onClick={handleEditClick}
              disabled={!data}
              icon={<Edit20Regular />}
            >
              {t('actions.edit')}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
