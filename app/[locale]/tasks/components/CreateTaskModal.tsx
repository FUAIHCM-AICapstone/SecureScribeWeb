'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Button,
  Caption1,
  Combobox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Dropdown,
  Field,
  Input,
  Option,
  Spinner,
  Textarea,
  makeStyles,
  tokens,
  shorthands,
  type OptionOnSelectData,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import {
  TimePicker,
  formatDateToTimeString,
} from '@fluentui/react-timepicker-compat';
import { useDebounce } from '@/hooks/useDebounce';
import { showToast } from '@/hooks/useShowToast';
import { createTask, toIsoUtc, updateTask } from '@/services/api/task';
import { getProjects } from '@/services/api/project';
import { getUsers } from '@/services/api/user';
import { queryKeys } from '@/lib/queryClient';
import type {
  TaskCreate,
  TaskStatus,
  TaskUpdate,
  TaskResponse,
} from 'types/task.type';
import type { ProjectResponse } from 'types/project.type';
import type { User } from 'types/user.type';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    maxWidth: '520px',
    width: '100%',
    ...shorthands.padding(tokens.spacingVerticalL),
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  helper: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  dateTimeRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap(tokens.spacingHorizontalS),
    '@media (max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

interface CreateTaskFormValues {
  title: string;
  description?: string;
  selectedProject: string;
  assignee_id?: string;
  due_date?: Date | null;
  due_time?: string;
  reminder_at?: Date | null;
  reminder_time?: string;
  status: TaskStatus;
}

const defaultFormValues: CreateTaskFormValues = {
  title: '',
  description: '',
  selectedProject: '',
  assignee_id: undefined,
  due_date: null,
  due_time: '',
  reminder_at: null,
  reminder_time: '',
  status: 'todo',
};

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  taskId?: string;
  initialTask?: TaskResponse;
  defaultProjectId?: string;
  onTaskRefetch?: () => void;
}

export function CreateTaskModal({
  open,
  onClose,
  mode = 'create',
  taskId,
  initialTask,
  defaultProjectId,
  onTaskRefetch,
}: CreateTaskModalProps) {
  const styles = useStyles();
  const tTasks = useTranslations('Tasks');
  const tModal = useTranslations('Tasks.createTaskModal');
  const tStatus = useTranslations('Tasks.status');
  const queryClient = useQueryClient();
  const isEditMode = mode === 'edit';

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!open) {
      reset(defaultFormValues);
      setUserSearchQuery('');
      return;
    }

    if (isEditMode && initialTask) {
      const dueDateValue = initialTask.due_date
        ? new Date(initialTask.due_date)
        : null;
      const safeDueDate =
        dueDateValue && !Number.isNaN(dueDateValue.getTime())
          ? dueDateValue
          : null;
      const reminderValue = initialTask.reminder_at
        ? new Date(initialTask.reminder_at)
        : null;
      const safeReminder =
        reminderValue && !Number.isNaN(reminderValue.getTime())
          ? reminderValue
          : null;

      reset({
        title: initialTask.title ?? '',
        description: initialTask.description ?? '',
        selectedProject: initialTask.projects?.[0]?.id ?? '',
        assignee_id: initialTask.assignee_id ?? undefined,
        due_date: safeDueDate,
        due_time: safeDueDate ? formatDateToTimeString(safeDueDate) : '',
        reminder_at: safeReminder,
        reminder_time: safeReminder ? formatDateToTimeString(safeReminder) : '',
        status: (initialTask.status as TaskStatus) ?? 'todo',
      });
      return;
    }

    // Use defaultProjectId if provided
    reset({
      ...defaultFormValues,
      selectedProject: defaultProjectId ?? defaultFormValues.selectedProject,
    });
  }, [open, reset, initialTask, isEditMode, defaultProjectId]);

  // Project search state
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const debouncedProjectQuery = useDebounce(projectSearchQuery, 300);

  // Infinite query for projects with search
  const {
    data: projectsData,
    isLoading: isLoadingProjects,
    fetchNextPage: fetchNextProjectsPage,
    hasNextPage: hasNextProjectsPage,
    isFetchingNextPage: isFetchingNextProjectsPage,
  } = useInfiniteQuery({
    queryKey: [
      ...queryKeys.projects,
      'task-create',
      'infinite',
      debouncedProjectQuery,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getProjects(
        debouncedProjectQuery ? { name: debouncedProjectQuery } : {},
        { limit: 20, page: pageParam },
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination && lastPage.pagination.has_next) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: open,
  });

  const projects: ProjectResponse[] = useMemo(() => {
    if (!projectsData?.pages) return [];
    return projectsData.pages.flatMap((page) => page.data || []);
  }, [projectsData]);

  const handleProjectsListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight * 1.5;
    if (isNearBottom && hasNextProjectsPage && !isFetchingNextProjectsPage) {
      fetchNextProjectsPage();
    }
  };

  // User search state
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const debouncedUserQuery = useDebounce(userSearchQuery, 400);

  // Determine project ID for user filtering
  // In create mode: use defaultProjectId (selected project)
  // In edit mode: use task's project ID
  const projectIdForUsers = isEditMode
    ? initialTask?.projects?.[0]?.id
    : defaultProjectId;

  // Infinite query for users with search
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    fetchNextPage: fetchNextUsersPage,
    hasNextPage: hasNextUsersPage,
    isFetchingNextPage: isFetchingNextUsersPage,
  } = useInfiniteQuery({
    queryKey: [
      'users',
      'task-create',
      'infinite',
      debouncedUserQuery,
      projectIdForUsers,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getUsers({
        ...(debouncedUserQuery ? { name: debouncedUserQuery } : {}),
        ...(projectIdForUsers && { project_id: projectIdForUsers }),
        limit: 50,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination && lastPage.pagination.has_next) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const users: User[] = useMemo(() => {
    if (!usersData?.pages) return [];
    return usersData.pages.flatMap((page) => page.data || []);
  }, [usersData]);

  const handleUsersListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const isNearBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight * 1.5;
    if (isNearBottom && hasNextUsersPage && !isFetchingNextUsersPage) {
      fetchNextUsersPage();
    }
  };

  const dueDateValue = watch('due_date');
  const reminderDateValue = watch('reminder_at');

  const parseTimeString = (value?: string) => {
    if (!value) {
      return null;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }
    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?$/);
    if (!match) {
      return null;
    }
    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes > 59) {
      return null;
    }
    const period = match[3];
    if (period) {
      const upper = period.toUpperCase();
      if (upper === 'PM' && hours < 12) {
        hours += 12;
      }
      if (upper === 'AM' && hours === 12) {
        hours = 0;
      }
    } else if (hours > 23) {
      return null;
    }
    return { hours, minutes };
  };

  const toIsoWithTime = (dateValue?: Date | null, timeValue?: string) => {
    if (!dateValue) {
      return undefined;
    }
    const combined = new Date(dateValue);
    if (timeValue) {
      const parsed = parseTimeString(timeValue);
      if (parsed) {
        combined.setHours(parsed.hours, parsed.minutes, 0, 0);
      }
    }
    return toIsoUtc(combined.toISOString());
  };

  const buildSelectedTime = (value?: string, dateAnchor?: Date | null) => {
    const parsed = parseTimeString(value);
    if (!parsed) {
      return undefined;
    }
    const base = dateAnchor ? new Date(dateAnchor) : new Date();
    base.setHours(parsed.hours, parsed.minutes, 0, 0);
    return base;
  };

  const successToastMessage = useMemo(
    () =>
      isEditMode ? tTasks('updateTaskSuccess') : tTasks('createTaskSuccess'),
    [isEditMode, tTasks],
  );

  const taskMutation = useMutation({
    mutationFn: (payload: TaskCreate | TaskUpdate) => {
      console.log('Mutate payload:', payload);
      if (isEditMode) {
        if (!taskId) {
          return Promise.reject(new Error('Missing task identifier.'));
        }
        return updateTask(taskId, payload as TaskUpdate);
      }

      return createTask(payload as TaskCreate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.myTasks });
      if (isEditMode && taskId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.task(taskId) });
      }
      showToast('success', successToastMessage);
      // Call refetch callback if provided
      if (onTaskRefetch) {
        onTaskRefetch();
      }
      reset(defaultFormValues);
      onClose();
    },
    onError: (error: unknown) => {
      const apiMessage =
        typeof (error as { message?: string })?.message === 'string'
          ? (error as { message?: string }).message
          : undefined;
      showToast(
        'error',
        apiMessage ||
        (isEditMode
          ? tTasks('updateTaskError')
          : tTasks('createTaskError')),
      );
    },
  });

  const onSubmit = (values: CreateTaskFormValues) => {
    const projectId = values.selectedProject?.trim();

    if (!projectId) {
      setError('selectedProject', {
        type: 'manual',
        message: tModal('projectsRequired'),
      });
      return;
    }

    const trimmedTitle = values.title.trim();

    if (isEditMode) {
      if (!taskId) {
        showToast('error', 'Missing task identifier.');
        return;
      }

      const updatePayload: TaskUpdate = {
        title: trimmedTitle,
        description: values.description?.trim() || undefined,
        assignee_id: values.assignee_id || undefined,
        status: values.status,
        due_date: toIsoWithTime(values.due_date, values.due_time),
        reminder_at: toIsoWithTime(values.reminder_at, values.reminder_time),
      };

      taskMutation.mutate(updatePayload);
      return;
    }

    const payload: TaskCreate = {
      title: trimmedTitle,
      description: values.description?.trim() || undefined,
      assignee_id: values.assignee_id || undefined,
      project_ids: [projectId],
      due_date: toIsoWithTime(values.due_date, values.due_time),
      reminder_at: toIsoWithTime(values.reminder_at, values.reminder_time),
      status: values.status === 'todo' ? undefined : values.status,
    };

    taskMutation.mutate(payload);
  };

  const handleClose = () => {
    if (!taskMutation.isPending) {
      reset(defaultFormValues);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(_, data) => {
        if (!data.open) {
          handleClose();
        }
      }}
    >
      <DialogSurface>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <DialogTitle>
              {isEditMode ? tTasks('actions.edit') : tModal('title')}
            </DialogTitle>
            <DialogContent className={styles.content}>
              <Field
                label={tModal('titleLabel')}
                validationMessage={errors.title?.message}
                required
              >
                <Controller
                  name="title"
                  control={control}
                  defaultValue={defaultFormValues.title}
                  rules={{
                    validate: (value: string) => {
                      const trimmed = value.trim();
                      if (!trimmed) {
                        return tModal('titleRequired');
                      }
                      if (trimmed.length < 2) {
                        return tModal('titleTooShort');
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      appearance="outline"
                      placeholder={tModal('titlePlaceholder')}
                    />
                  )}
                />
              </Field>

              <Field label={tModal('descriptionLabel')}>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={defaultFormValues.description}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      appearance="outline"
                      placeholder={tModal('descriptionPlaceholder')}
                      rows={4}
                    />
                  )}
                />
              </Field>

              {!defaultProjectId && !isEditMode ? (
                <Field
                  label={tModal('projectsLabel')}
                  validationMessage={errors.selectedProject?.message}
                  required
                >
                  <Controller
                    name="selectedProject"
                    control={control}
                    defaultValue={defaultFormValues.selectedProject}
                    rules={{
                      validate: (value) =>
                        (typeof value === 'string' && value.trim() !== '') ||
                        tModal('projectsRequired'),
                    }}
                    render={({ field }) => {
                      const selectedProjectName = field.value
                        ? projects.find((p) => p.id === field.value)?.name
                        : '';
                      return (
                        <Combobox
                          placeholder={
                            isLoadingProjects
                              ? 'Loading...'
                              : tModal('projectsPlaceholder')
                          }
                          value={selectedProjectName || projectSearchQuery}
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setProjectSearchQuery(e.target.value);
                          }}
                          onOptionSelect={(_: any, data: any) => {
                            field.onChange(data.optionValue || '');
                            setProjectSearchQuery('');
                          }}
                          listbox={{
                            onScroll: handleProjectsListScroll,
                          }}
                        >
                          {projects.map((project) => (
                            <Option key={project.id} value={project.id}>
                              {project.name}
                            </Option>
                          ))}
                          {isFetchingNextProjectsPage && (
                            <div
                              style={{
                                padding: '8px 12px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <Spinner size="small" />
                              <Caption1>Loading...</Caption1>
                            </div>
                          )}
                          {!isLoadingProjects &&
                            projects.length === 0 &&
                            debouncedProjectQuery && (
                              <div
                                style={{ padding: '12px', textAlign: 'center' }}
                              >
                                <Caption1>{tModal('noProjects')}</Caption1>
                              </div>
                            )}
                        </Combobox>
                      );
                    }}
                  />
                  {!isLoadingProjects &&
                    projects.length === 0 &&
                    !debouncedProjectQuery && (
                      <span className={styles.helper}>
                        {tModal('noProjects')}
                      </span>
                    )}
                </Field>
              ) : (
                <Field label={tModal('projectsLabel')}>
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: tokens.colorNeutralBackground3,
                      borderRadius: tokens.borderRadiusSmall,
                      border: `1px solid ${tokens.colorNeutralStroke2}`,
                      color: tokens.colorNeutralForeground2,
                    }}
                  >
                    {isEditMode
                      ? initialTask?.projects?.[0]?.name || initialTask?.projects?.[0]?.id
                      : projects.find((p) => p.id === defaultProjectId)?.name || defaultProjectId}
                  </div>
                </Field>
              )}

              <Field label={tModal('assigneeLabel')}>
                <Controller
                  name="assignee_id"
                  control={control}
                  defaultValue={defaultFormValues.assignee_id}
                  render={({ field }) => (
                    <Combobox
                      placeholder={tModal('assigneePlaceholder')}
                      value={
                        field.value && users.length > 0
                          ? users.find((u) => u.id === field.value)?.name ||
                          users.find((u) => u.id === field.value)?.email ||
                          userSearchQuery
                          : userSearchQuery
                      }
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setUserSearchQuery(e.target.value);
                      }}
                      onOptionSelect={(_: any, data: any) => {
                        field.onChange(data.optionValue || undefined);
                        setUserSearchQuery('');
                      }}
                      listbox={{
                        onScroll: handleUsersListScroll,
                      }}
                    >
                      <Option value="">{tModal('unassigned')}</Option>
                      {users.map((user) => (
                        <Option key={user.id} value={user.id}>
                          {user.name || user.email}
                        </Option>
                      ))}
                      {isFetchingNextUsersPage && (
                        <div
                          style={{
                            padding: '8px 12px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <Spinner size="small" />
                          <Caption1>{tModal('loading')}</Caption1>
                        </div>
                      )}
                      {!isLoadingUsers &&
                        users.length === 0 &&
                        debouncedUserQuery && (
                          <div
                            style={{ padding: '12px', textAlign: 'center' }}
                          >
                            <Caption1>{tModal('noUsers')}</Caption1>
                          </div>
                        )}
                    </Combobox>
                  )}
                />
                {!debouncedUserQuery && (
                  <span className={styles.helper}>
                    {tModal('searchAssignee')}
                  </span>
                )}
              </Field>

              <Field label={tModal('dueDateLabel')}>
                <div className={styles.dateTimeRow}>
                  <Controller
                    name="due_date"
                    control={control}
                    defaultValue={defaultFormValues.due_date}
                    render={({ field }) => (
                      <DatePicker
                        placeholder={tModal('dueDatePlaceholder')}
                        value={field.value ?? undefined}
                        onSelectDate={(date) => field.onChange(date ?? null)}
                      />
                    )}
                  />
                  <Controller
                    name="due_time"
                    control={control}
                    defaultValue={defaultFormValues.due_time}
                    render={({ field }) => (
                      <TimePicker
                        placeholder={tModal('dueTimePlaceholder')}
                        dateAnchor={dueDateValue ?? undefined}
                        selectedTime={buildSelectedTime(
                          field.value,
                          dueDateValue,
                        )}
                        value={field.value ?? ''}
                        onTimeChange={(_event, data) =>
                          field.onChange(data.selectedTimeText ?? '')
                        }
                        onInput={(event) =>
                          field.onChange(event.currentTarget.value)
                        }
                        freeform
                      />
                    )}
                  />
                </div>
              </Field>

              <Field label={tModal('reminderLabel')}>
                <div className={styles.dateTimeRow}>
                  <Controller
                    name="reminder_at"
                    control={control}
                    defaultValue={defaultFormValues.reminder_at}
                    render={({ field }) => (
                      <DatePicker
                        placeholder={tModal('reminderPlaceholder')}
                        value={field.value ?? undefined}
                        onSelectDate={(date) => field.onChange(date ?? null)}
                      />
                    )}
                  />
                  <Controller
                    name="reminder_time"
                    control={control}
                    defaultValue={defaultFormValues.reminder_time}
                    render={({ field }) => (
                      <TimePicker
                        placeholder={tModal('reminderTimePlaceholder')}
                        dateAnchor={reminderDateValue ?? undefined}
                        selectedTime={buildSelectedTime(
                          field.value,
                          reminderDateValue,
                        )}
                        value={field.value ?? ''}
                        onTimeChange={(_event, data) =>
                          field.onChange(data.selectedTimeText ?? '')
                        }
                        onInput={(event) =>
                          field.onChange(event.currentTarget.value)
                        }
                        freeform
                      />
                    )}
                  />
                </div>
              </Field>

              <Field label={tModal('statusLabel')}>
                <Controller
                  name="status"
                  control={control}
                  defaultValue={defaultFormValues.status}
                  render={({ field }) => {
                    const getStatusLabel = (status: string) => {
                      switch (status) {
                        case 'todo':
                          return tStatus('todo');
                        case 'in_progress':
                          return tStatus('in_progress');
                        case 'done':
                          return tStatus('done');
                        default:
                          return tStatus('todo');
                      }
                    };
                    return (
                      <Dropdown
                        value={getStatusLabel(field.value ?? 'todo')}
                        selectedOptions={[field.value ?? 'todo']}
                        onOptionSelect={(_, data: OptionOnSelectData) =>
                          field.onChange(
                            (data.optionValue as TaskStatus) || 'todo',
                          )
                        }
                      >
                        <Option value="todo">{tStatus('todo')}</Option>
                        <Option value="in_progress">
                          {tStatus('in_progress')}
                        </Option>
                        <Option value="done">{tStatus('done')}</Option>
                      </Dropdown>
                    );
                  }}
                />
              </Field>
            </DialogContent>
            <DialogActions className={styles.actions}>
              <Button appearance="secondary" onClick={handleClose}>
                {tModal('cancel')}
              </Button>
              <Button
                appearance="primary"
                type="submit"
                disabled={taskMutation.isPending}
              >
                {taskMutation.isPending
                  ? tModal('submitting')
                  : isEditMode
                    ? tTasks('actions.edit')
                    : tModal('submit')}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
