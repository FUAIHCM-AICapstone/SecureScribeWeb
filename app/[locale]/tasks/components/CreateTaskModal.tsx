'use client';

import React, { useEffect } from 'react';
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
import { showToast } from '@/hooks/useShowToast';
import { createTask, toIsoUtc } from '@/services/api/task';
import { getProjects } from '@/services/api/project';
import { getUsers } from '@/services/api/user';
import { queryKeys } from '@/lib/queryClient';
import type { TaskCreate, TaskStatus } from 'types/task.type';
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
});

interface CreateTaskFormValues {
  title: string;
  description?: string;
  project_ids: string[];
  assignee_id?: string;
  due_date?: Date | null;
  status: TaskStatus;
}

const defaultFormValues: CreateTaskFormValues = {
  title: '',
  description: '',
  project_ids: [],
  assignee_id: undefined,
  due_date: null,
  status: 'todo',
};

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
  const styles = useStyles();
  const tTasks = useTranslations('Tasks');
  const tModal = useTranslations('Tasks.createTaskModal');
  const tStatus = useTranslations('Tasks.status');
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (!open) {
      reset(defaultFormValues);
    }
  }, [open, reset]);

  const { data: projectsData } = useQuery({
    queryKey: [...queryKeys.projects, 'task-create'],
    queryFn: () => getProjects({}, { limit: 50 }),
    enabled: open,
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', 'task-create'],
    queryFn: () => getUsers({ limit: 50, page: 1 }),
    enabled: open,
  });

  const projects: ProjectResponse[] = projectsData?.data || [];
  const users: User[] = usersData?.data || [];

  const createTaskMutation = useMutation({
    mutationFn: (payload: TaskCreate) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.myTasks });
      showToast('success', tTasks('createTaskSuccess'));
      reset(defaultFormValues);
      onClose();
    },
    onError: (error: unknown) => {
      const apiMessage =
        typeof (error as { message?: string })?.message === 'string'
          ? (error as { message?: string }).message
          : undefined;
      showToast('error', apiMessage || tTasks('createTaskError'));
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

    const payload: TaskCreate = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      assignee_id: values.assignee_id || undefined,
      project_ids: projectIds,
      due_date: values.due_date
        ? toIsoUtc(values.due_date.toISOString())
        : undefined,
      status: values.status === 'todo' ? undefined : values.status,
    };

    createTaskMutation.mutate(payload);
  };

  const handleClose = () => {
    if (!createTaskMutation.isPending) {
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
            <DialogTitle>{tModal('title')}</DialogTitle>
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
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending
                  ? tModal('submitting')
                  : tModal('submit')}
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
}

