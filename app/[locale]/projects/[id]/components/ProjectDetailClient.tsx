'use client';

import MeetingSchedulerModal from '@/components/modal/MeetingSchedulerModal';
import { FileUploadModal } from '@/components/modal/FileUploadModal';
import { AddMemberModal } from '@/components/modal/AddMemberModal';
import { CreateTaskModal } from '@/app/[locale]/tasks/components/CreateTaskModal';
import { showToast } from '@/hooks/useShowToast';
import { useAuth } from '@/context/AuthContext';
import { queryKeys } from '@/lib/queryClient';
import { getProjectFiles } from '@/services/api/file';
import { getProjectMeetings } from '@/services/api/meeting';
import {
  archiveProject,
  deleteProject,
  getProject,
  unarchiveProject,
} from '@/services/api/project';
import { getTasks } from '@/services/api/task';
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
  Add20Regular,
  Archive20Regular,
  ArrowLeft20Regular,
  Calendar20Regular,
  CalendarClock20Regular,
  Delete20Regular,
  Edit20Regular,
  Folder20Regular,
  MoreVertical20Regular,
  People20Regular,
  TaskListSquareLtr20Regular,
} from '@fluentui/react-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FilesTable } from './FilesTable';
import { MeetingsTable } from './MeetingsTable';
import { TasksTable } from './TasksTable';
import { MembersTable } from './MembersTable';

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
    marginBottom: '16px',
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
    justifyContent: 'space-between',
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
  placeholder: {
    ...shorthands.padding('48px', '32px'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
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

interface ProjectDetailClientProps {
  projectId: string;
}

interface ProjectDetailClientProps {
  projectId: string;
}

export function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const styles = useStyles();
  const t = useTranslations('ProjectDetail');
  const tProjects = useTranslations('Projects');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [meetingsPage, setMeetingsPage] = useState(1);
  const [filesPage, setFilesPage] = useState(1);
  const [tasksPage, setTasksPage] = useState(1);

  // Meeting modal state
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  // File modal state
  const [showFileModal, setShowFileModal] = useState(false);

  // Add member modal state
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Create task modal state
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Helper function to get current user's role in the project
  const getCurrentUserRole = (): string | null => {
    if (!user?.id || !project?.members) return null;
    const currentMember = project.members.find((m) => m.user_id === user.id);
    return currentMember?.role || null;
  };

  // Helper function to check if user can manage project resources
  const canManageProject = (): boolean => {
    const role = getCurrentUserRole();
    return role === 'owner' || role === 'admin';
  };

  // Fetch project data
  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.project(projectId),
    queryFn: () => getProject(projectId, true),
  });

  // Fetch meetings for this project
  const {
    data: meetingsData,
    isLoading: meetingsLoading,
  } = useQuery({
    queryKey: queryKeys.projectMeetings(projectId, meetingsPage),
    queryFn: () => getProjectMeetings(projectId, { page: meetingsPage, limit: 10 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch files for this project
  const {
    data: filesData,
    isLoading: filesLoading,
  } = useQuery({
    queryKey: queryKeys.projectFiles(projectId, filesPage),
    queryFn: () => getProjectFiles(projectId, { page: filesPage, limit: 10 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch all tasks (backend doesn't filter by project, so we filter client-side)
  const {
    data: tasksData,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: queryKeys.projectTasks(projectId, tasksPage),
    queryFn: () => getTasks({}, { page: tasksPage, limit: 10 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const projectTasks = tasksData?.data?.filter(
    (task) => task.projects?.some((p) => p.id === projectId)
  ) || [];


  const hasMoreProjectTasks = tasksData?.pagination?.has_next || false;

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: () => archiveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'meetings'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'files'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      showToast('success', t('projectArchived'));
    },
    onError: (error: any) => {
      showToast('error', error?.response?.data?.detail || t('archiveError'));
    },
  });

  // Unarchive mutation
  const unarchiveMutation = useMutation({
    mutationFn: () => unarchiveProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'meetings'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'files'] });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'tasks'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      showToast('success', t('projectUnarchived'));
    },
    onError: (error: any) => {
      showToast('error', error?.response?.data?.detail || t('unarchiveError'));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(projectId),
    onSuccess: () => {
      showToast('success', t('projectDeleted'));
      router.push('/projects');
    },
    onError: (error: any) => {
      showToast('error', error?.response?.data?.detail || t('deleteError'));
      setIsDeleting(false);
    },
  });

  const handleEdit = () => {
    // TODO: Open edit modal
    showToast('info', 'Edit functionality coming soon');
  };

  const handleMeetingCreated = () => {
    // Invalidate meetings query to refresh the list
    queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'meetings'] });
  };

  const handleMeetingDeleted = () => {
    // Invalidate meetings query to refresh the list after deletion
    queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'meetings'] });
  };

  const handleMeetingModalOpen = () => {
    setShowMeetingModal(true);
  };

  const handleMeetingModalClose = (open: boolean) => {
    setShowMeetingModal(open);
    if (!open) {
      handleMeetingCreated();
    }
  };

  const handleFileModalOpen = () => {
    setShowFileModal(true);
  };

  const handleFileModalClose = () => {
    setShowFileModal(false);
    // Invalidate files queries to refresh the list
    queryClient.invalidateQueries({ queryKey: queryKeys.files });
    queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'files'] });
  };

  const handleFileDeleted = () => {
    // Invalidate files query to refresh the list after deletion
    queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'files'] });
  };

  const handleFileRenamed = () => {
    // Invalidate files query to refresh the list after rename
    queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'files'] });
  };

  const handleFileMoved = () => {
    // Invalidate files query to refresh the list after move
    queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'files'] });
  };

  const handleMemberRemoved = () => {
    // Invalidate project query to refresh members list after removal
    queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
  };

  const handleMemberRoleChanged = () => {
    // Invalidate project query to refresh members list after role change
    queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
  };

  const handleTaskModalOpen = () => {
    setShowTaskModal(true);
  };

  const handleTaskModalClose = (open: boolean) => {
    setShowTaskModal(open);
    if (!open) {
      // Invalidate tasks query to refresh the list
      queryClient.invalidateQueries({ queryKey: queryKeys.projectTasks(projectId, tasksPage) });
    }
  };

  const handleTaskDeleted = () => {
    // Invalidate tasks query to refresh the list after deletion
    queryClient.invalidateQueries({ queryKey: queryKeys.projectTasks(projectId, tasksPage) });
  };

  const handleTaskUpdated = () => {
    // Invalidate tasks query to refresh the list after update
    queryClient.invalidateQueries({ queryKey: queryKeys.projectTasks(projectId, tasksPage) });
  };

  const handleArchiveToggle = () => {
    if (project?.is_archived) {
      unarchiveMutation.mutate();
    } else {
      archiveMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (window.confirm(t('deleteConfirmation'))) {
      setIsDeleting(true);
      deleteMutation.mutate();
    }
  };

  const getStatusBadge = (isArchived: boolean) => {
    if (isArchived) {
      return (
        <Badge appearance="filled" color="warning" size="large">
          {tProjects('status.archived')}
        </Badge>
      );
    }
    return (
      <Badge appearance="filled" color="success" size="large">
        {tProjects('status.active')}
      </Badge>
    );
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return t('noDate');
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return t('invalidDate');
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

  if (isError || !project) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <Text className={styles.errorTitle}>{t('errorTitle')}</Text>
          <Text>{t('errorMessage')}</Text>
          <Button
            appearance="primary"
            icon={<ArrowLeft20Regular />}
            onClick={() => router.push('/projects')}
          >
            {t('backToProjects')}
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
        onClick={() => router.push('/projects')}
        className={styles.backButton}
      >
        {t('backToProjects')}
      </Button>

      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.titleSection}>
            <Text className={styles.title}>{project.name}</Text>
            <div className={styles.badgesRow}>
              {getStatusBadge(project.is_archived)}
              <Badge appearance="outline" size="large">
                {t('memberCount', { count: project.members?.length || 0 })}
              </Badge>
            </div>
            {project.description && (
              <Body1 className={styles.description}>
                {project.description}
              </Body1>
            )}
          </div>
          <div className={styles.actionsRow}>
            <Button
              appearance="secondary"
              icon={<Edit20Regular />}
              onClick={handleEdit}
              disabled={!canManageProject()}
            >
              {t('edit')}
            </Button>
            <Button
              appearance="secondary"
              icon={<Archive20Regular />}
              onClick={handleArchiveToggle}
              disabled={
                !canManageProject() || archiveMutation.isPending || unarchiveMutation.isPending
              }
            >
              {project.is_archived ? t('unarchive') : t('archive')}
            </Button>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button appearance="subtle" icon={<MoreVertical20Regular />} disabled={!canManageProject()} />
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
          <div className={styles.metaItem}>
            <CalendarClock20Regular className={styles.metaIcon} />
            <div className={styles.metaContent}>
              <Caption1 className={styles.metaLabel}>
                {t('createdAt')}:
              </Caption1>
              <Body1 className={styles.metaValue}>
                {formatDateTime(project.created_at)}
              </Body1>
            </div>
          </div>
          <div className={styles.metaItem}>
            <People20Regular className={styles.metaIcon} />
            <div className={styles.metaContent}>
              <Caption1 className={styles.metaLabel}>{t('membersLabel')}:</Caption1>
              <Body1 className={styles.metaValue}>
                {project.members?.length || 0}
              </Body1>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainColumn}>
          {/* Related Meetings Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <div>
                <Calendar20Regular className={styles.sectionIcon} />
                <Text className={styles.sectionHeading}>
                  {t('relatedMeetings')}
                </Text>
              </div>
              <Button
                appearance="primary"
                icon={<Add20Regular />}
                onClick={handleMeetingModalOpen}
              >
                {t('createMeeting')}
              </Button>
            </div>

            <MeetingsTable
              data={meetingsData?.data || []}
              isLoading={meetingsLoading}
              page={meetingsPage}
              onPageChange={setMeetingsPage}
              hasMore={meetingsData?.pagination?.has_next || false}
              onMeetingDeleted={handleMeetingDeleted}
            />
          </Card>

          {/* Files Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <div>
                <Folder20Regular className={styles.sectionIcon} />
                <Text className={styles.sectionHeading}>{t('files')}</Text>
              </div>
              <Button
                appearance="primary"
                icon={<Add20Regular />}
                onClick={handleFileModalOpen}
              >
                {t('uploadFile')}
              </Button>
            </div>
            <FilesTable
              data={filesData?.data || []}
              isLoading={filesLoading}
              page={filesPage}
              onPageChange={setFilesPage}
              hasMore={filesData?.pagination?.has_next || false}
              onFileDeleted={handleFileDeleted}
              onFileRenamed={handleFileRenamed}
              onFileMoved={handleFileMoved}
            />
          </Card>
        </div>

        <div className={styles.sideColumn}>
          {/* Members Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <div>
                <People20Regular className={styles.sectionIcon} />
                <Text className={styles.sectionHeading}>{t('membersLabel')}</Text>
              </div>
              <Button
                appearance="primary"
                icon={<Add20Regular />}
                onClick={() => setShowAddMemberModal(true)}
                disabled={!canManageProject()}
              >
                {t('addMember')}
              </Button>
            </div>
            {project.members && project.members.length > 0 ? (
              <MembersTable
                members={project.members}
                formatDateTime={formatDateTime}
                currentUserRole={getCurrentUserRole()}
                projectId={projectId}
                onMemberRemoved={handleMemberRemoved}
                onMemberRoleChanged={handleMemberRoleChanged}
              />
            ) : (
              <Body1 className={styles.noContent}>{t('noMembers')}</Body1>
            )}
          </Card>

          {/* Tasks Section */}
          <Card className={styles.section}>
            <div className={styles.sectionTitle}>
              <div>
                <TaskListSquareLtr20Regular className={styles.sectionIcon} />
                <Text className={styles.sectionHeading}>{t('tasks')}</Text>
              </div>
              <Button
                appearance="primary"
                icon={<Add20Regular />}
                onClick={handleTaskModalOpen}
              >
                {t('createTask')}
              </Button>
            </div>
            <TasksTable
              data={projectTasks}
              isLoading={tasksLoading}
              page={tasksPage}
              onPageChange={setTasksPage}
              hasMore={hasMoreProjectTasks}
              projectId={projectId}
              onTaskDeleted={handleTaskDeleted}
              onTaskUpdated={handleTaskUpdated}
              onTaskRefetch={refetchTasks}
            />
          </Card>
        </div>
      </div>

      {/* Meeting Scheduler Modal */}
      <MeetingSchedulerModal
        open={showMeetingModal}
        onOpenChange={handleMeetingModalClose}
        defaultProjectId={projectId}
      />

      {/* File Upload Modal */}
      <FileUploadModal
        open={showFileModal}
        onClose={handleFileModalClose}
        defaultProjectId={projectId}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        open={showAddMemberModal}
        onOpenChange={setShowAddMemberModal}
        projectId={projectId}
        existingMembers={project?.members || []}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        open={showTaskModal}
        onClose={() => handleTaskModalClose(false)}
        defaultProjectId={projectId}
      />
    </div>
  );
}
