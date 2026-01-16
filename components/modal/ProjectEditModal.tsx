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
} from '@/lib/components';
import { Edit20Regular } from '@/lib/icons';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProject } from '@/services/api/project';
import { queryKeys } from '@/lib/queryClient';
import type { ProjectResponse, ProjectUpdate } from 'types/project.type';

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

interface ProjectEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectResponse;
  onEditSuccess?: () => void;
}

export default function ProjectEditModal({
  open,
  onOpenChange,
  project,
  onEditSuccess,
}: ProjectEditModalProps) {
  const styles = useStyles();
  const t = useTranslations('ProjectEdit');
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: project.name,
      description: project.description || '',
    },
  });

  // Reset form when project changes or modal opens
  useEffect(() => {
    if (open) {
      reset({
        name: project.name,
        description: project.description || '',
      });
    }
  }, [open, project, reset]);

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: (projectData: ProjectUpdate) =>
      updateProject(project.id, projectData),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({
        queryKey: queryKeys.project(project.id),
      });

      // Show success toast
      showToast('success', t('editSuccess'), {
        duration: 3000,
      });

      // Call the callback to notify parent of successful edit
      if (onEditSuccess) {
        onEditSuccess();
      }

      // Reset form and close modal
      reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      console.error('Error updating project:', error);
      const errorMessage = error?.message || t('editError');
      showToast('error', errorMessage, {
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    try {
      const projectData: ProjectUpdate = {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      };

      updateProjectMutation.mutate(projectData);
    } catch (error) {
      console.error('Error preparing project data:', error);
      showToast('error', t('editError'));
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogTitle>{t('editProject')}</DialogTitle>
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
                      disabled={updateProjectMutation.isPending}
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
                      disabled={updateProjectMutation.isPending}
                    />
                  )}
                />
              </Field>
            </DialogContent>
          </DialogBody>

          <DialogActions className={styles.actions}>
            <Button
              appearance="secondary"
              onClick={handleCancel}
              disabled={updateProjectMutation.isPending}
            >
              {t('cancel')}
            </Button>
            <Button
              appearance="primary"
              type="submit"
              disabled={updateProjectMutation.isPending}
              icon={
                updateProjectMutation.isPending ? undefined : <Edit20Regular />
              }
            >
              {updateProjectMutation.isPending ? t('saving') : t('save')}
            </Button>
          </DialogActions>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
