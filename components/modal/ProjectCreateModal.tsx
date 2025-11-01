'use client';

import { showToast } from '@/hooks/useShowToast';
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  Textarea,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { FolderAdd24Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject } from '@/services/api/project';
import { queryKeys } from '@/lib/queryClient';
import type { ProjectCreate } from 'types/project.type';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
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
    padding: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
  },
});

interface ProjectFormData {
  name: string;
  description: string;
}

interface ProjectCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectCreateModal({
  open,
  onOpenChange,
}: ProjectCreateModalProps) {
  const styles = useStyles();
  const t = useTranslations('ProjectCreate');
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: (projectData: ProjectCreate) => createProject(projectData),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });

      // Show success toast
      showToast('success', t('projectCreated'), {
        duration: 3000,
      });

      // Reset form and close modal
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Error creating project:', error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        t('projectCreateError');
      showToast('error', errorMessage, {
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    try {
      const projectData: ProjectCreate = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      };

      createProjectMutation.mutate(projectData);
    } catch (error) {
      console.error('Error preparing project data:', error);
      showToast('error', t('projectCreateError'));
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogTitle>{t('createProject')}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <DialogContent className={styles.form}>
              {/* Project Name */}
              <Field
                label={t('projectName')}
                required
                validationMessage={errors.name?.message}
                validationState={errors.name ? 'error' : 'none'}
              >
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: t('projectNameRequired'),
                    minLength: {
                      value: 3,
                      message: t('projectNameMinLength'),
                    },
                    maxLength: {
                      value: 100,
                      message: t('projectNameMaxLength'),
                    },
                    validate: (value) =>
                      value.trim().length >= 3 || t('projectNameRequired'),
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t('projectNamePlaceholder')}
                      disabled={createProjectMutation.isPending}
                    />
                  )}
                />
              </Field>

              {/* Project Description */}
              <Field
                label={t('projectDescription')}
                validationMessage={errors.description?.message}
                validationState={errors.description ? 'error' : 'none'}
              >
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    maxLength: {
                      value: 500,
                      message: t('projectDescriptionMaxLength'),
                    },
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder={t('projectDescriptionPlaceholder')}
                      rows={4}
                      disabled={createProjectMutation.isPending}
                    />
                  )}
                />
              </Field>
            </DialogContent>
          </DialogBody>

          <DialogActions className={styles.actions}>
            <Button appearance="secondary" onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button
              appearance="primary"
              type="submit"
              disabled={createProjectMutation.isPending}
              icon={
                createProjectMutation.isPending ? undefined : (
                  <FolderAdd24Regular />
                )
              }
            >
              {createProjectMutation.isPending
                ? t('creating')
                : t('createProject')}
            </Button>
          </DialogActions>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
