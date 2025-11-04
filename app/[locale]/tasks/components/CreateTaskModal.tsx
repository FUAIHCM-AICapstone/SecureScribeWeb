'use client';

import React, { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
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
  Textarea,
  makeStyles,
  tokens,
  shorthands,
  type OptionOnSelectData,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { TimePicker, formatDateToTimeString } from '@fluentui/react-timepicker-compat';
import { showToast } from '@/hooks/useShowToast';
import { createTask, toIsoUtc, updateTask } from '@/services/api/task';
import { getProjects } from '@/services/api/project';
import { getUsers } from '@/services/api/user';
import { queryKeys } from '@/lib/queryClient';
import type { TaskCreate, TaskStatus, TaskUpdate, TaskResponse } from 'types/task.type';
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
  project_ids: string[];
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
  project_ids: [],
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
}

export function CreateTaskModal({
  open,
  onClose,
  mode = 'create',
  taskId,
  initialTask,
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
    return;
  }

  if (isEditMode && initialTask) {
    const dueDateValue = initialTask.due_date ? new Date(initialTask.due_date) : null;
    const safeDueDate =
      dueDateValue && !Number.isNaN(dueDateValue.getTime()) ? dueDateValue : null;
    const reminderValue = initialTask.reminder_at ? new Date(initialTask.reminder_at) : null;
    const safeReminder =
      reminderValue && !Number.isNaN(reminderValue.getTime()) ? reminderValue : null;

    reset({
      title: initialTask.title ?? '',
      description: initialTask.description ?? '',
      project_ids:
        initialTask.projects?.map((project) => project.id).filter(Boolean) ?? [],
      assignee_id: initialTask.assignee_id ?? undefined,
      due_date: safeDueDate,
      due_time: safeDueDate ? formatDateToTimeString(safeDueDate) : '',
      reminder_at: safeReminder,
      reminder_time: safeReminder ? formatDateToTimeString(safeReminder) : '',
      status: (initialTask.status as TaskStatus) ?? 'todo',
    });
    return;
  }

  reset(defaultFormValues);
  }, [open, reset, initialTask, isEditMode]);

  const { data: projectsData } = useQuery({
    queryKey: [...queryKeys.projects, 'task-create', 'my-projects'],
    queryFn: () => getProjects({}, { limit: 50, my_projects_only: true }),
    enabled: open,
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', 'task-create'],
    queryFn: () => getUsers({ limit: 50, page: 1 }),
    enabled: open,
  });

  const projects: ProjectResponse[] = projectsData?.data || [];
  const users: User[] = usersData?.data || [];

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
    () => (isEditMode ? 'Task updated successfully' : tTasks('createTaskSuccess')),
    [isEditMode, tTasks],
  );

  const taskMutation = useMutation({
    mutationFn: (payload: TaskCreate | TaskUpdate) => {
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
            ? 'Failed to update task. Please try again.'
            : tTasks('createTaskError')),
      );
    },
  });

  const onSubmit = (values: CreateTaskFormValues) => {
    const projectIds = (values.project_ids ?? []).filter(
      (id): id is string => Boolean(id),
    );

    if (projectIds.length === 0) {
      setError('project_ids', {
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
      project_ids: projectIds,
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

              <Field
                label={tModal('projectsLabel')}
                validationMessage={errors.project_ids?.message}
                required
              >
                <Controller
                  name="project_ids"
                  control={control}
                  defaultValue={defaultFormValues.project_ids}
                  rules={{
                    validate: (value) =>
                      value.length > 0 || tModal('projectsRequired'),
                  }}
                  render={({ field }) => (
                    <Dropdown
                      multiselect
                      placeholder={tModal('projectsPlaceholder')}
                      selectedOptions={field.value ?? []}
                      onOptionSelect={(_, data: OptionOnSelectData) => {
                        const next = data.selectedOptions ?? field.value ?? [];
                        field.onChange(next);
                      }}
                    >
                      {projects.map((project) => (
                        <Option key={project.id} value={project.id}>
                          {project.name}
                        </Option>
                      ))}
                    </Dropdown>
                  )}
                />
                {projects.length === 0 && (
                  <span className={styles.helper}>{tModal('noProjects')}</span>
                )}
              </Field>

              <Field label={tModal('assigneeLabel')}>
                <Controller
                  name="assignee_id"
                  control={control}
                  defaultValue={defaultFormValues.assignee_id}
                  render={({ field }) => (
                    <Dropdown
                      placeholder={tModal('assigneePlaceholder')}
                      selectedOptions={field.value ? [field.value] : []}
                      onOptionSelect={(_, data: OptionOnSelectData) =>
                        field.onChange(data.optionValue || undefined)
                      }
                    >
                      <Option value="">{tModal('unassigned')}</Option>
                      {users.map((user) => (
                        <Option key={user.id} value={user.id}>
                          {user.name || user.email}
                        </Option>
                      ))}
                    </Dropdown>
                  )}
                />
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
                        selectedTime={buildSelectedTime(field.value, dueDateValue)}
                        value={field.value ?? ''}
                        onTimeChange={(_event, data) =>
                          field.onChange(data.selectedTimeText ?? '')
                        }
                        onInput={(event) => field.onChange(event.currentTarget.value)}
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
                        selectedTime={buildSelectedTime(field.value, reminderDateValue)}
                        value={field.value ?? ''}
                        onTimeChange={(_event, data) =>
                          field.onChange(data.selectedTimeText ?? '')
                        }
                        onInput={(event) => field.onChange(event.currentTarget.value)}
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
                  render={({ field }) => (
                    <Dropdown
                      selectedOptions={[field.value ?? 'todo']}
                      onOptionSelect={(_, data: OptionOnSelectData) =>
                        field.onChange((data.optionValue as TaskStatus) || 'todo')
                      }
                    >
                      <Option value="todo">{tStatus('todo')}</Option>
                      <Option value="in_progress">{tStatus('in_progress')}</Option>
                      <Option value="done">{tStatus('done')}</Option>
                    </Dropdown>
                  )}
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

