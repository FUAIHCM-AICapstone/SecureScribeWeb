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
import { Edit20Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMeeting } from '@/services/api/meeting';
import { queryKeys } from '@/lib/queryClient';
import type { MeetingResponse, MeetingUpdate } from 'types/meeting.type';

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

interface MeetingFormData {
  title: string;
  description: string;
  url: string;
}

interface MeetingEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: MeetingResponse;
  onEditSuccess?: () => void;
}

export default function MeetingEditModal({
  open,
  onOpenChange,
  meeting,
  onEditSuccess,
}: MeetingEditModalProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingEdit');
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MeetingFormData>({
    defaultValues: {
      title: meeting.title || '',
      description: meeting.description || '',
      url: meeting.url || '',
    },
  });

  // Reset form when meeting changes or modal opens
  useEffect(() => {
    if (open) {
      reset({
        title: meeting.title || '',
        description: meeting.description || '',
        url: meeting.url || '',
      });
    }
  }, [open, meeting, reset]);

  // Update meeting mutation
  const updateMeetingMutation = useMutation({
    mutationFn: (meetingData: MeetingUpdate) =>
      updateMeeting(meeting.id, meetingData),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({
        queryKey: queryKeys.meeting(meeting.id),
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
      console.error('Error updating meeting:', error);
      const errorMessage = error?.message || t('editError');
      showToast('error', errorMessage, {
        duration: 5000,
      });
    },
  });

  const onSubmit = (data: MeetingFormData) => {
    try {
      const meetingData: MeetingUpdate = {
        title: data.title.trim() || undefined,
        description: data.description?.trim() || undefined,
        url: data.url?.trim() || undefined,
      };

      updateMeetingMutation.mutate(meetingData);
    } catch (error) {
      console.error('Error preparing meeting data:', error);
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
        <DialogTitle>{t('editMeeting')}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody>
            <DialogContent className={styles.form}>
              {/* Meeting Title */}
              <Field
                label={t('meetingTitle')}
                validationMessage={errors.title?.message}
                validationState={errors.title ? 'error' : 'none'}
              >
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    maxLength: {
                      value: 200,
                      message: t('meetingTitleMaxLength'),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t('meetingTitlePlaceholder')}
                      disabled={updateMeetingMutation.isPending}
                    />
                  )}
                />
              </Field>

              {/* Meeting Description */}
              <Field
                label={t('meetingDescription')}
                validationMessage={errors.description?.message}
                validationState={errors.description ? 'error' : 'none'}
              >
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    maxLength: {
                      value: 1000,
                      message: t('meetingDescriptionMaxLength'),
                    },
                  }}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder={t('meetingDescriptionPlaceholder')}
                      rows={4}
                      disabled={updateMeetingMutation.isPending}
                    />
                  )}
                />
              </Field>

              {/* Meeting URL */}
              <Field
                label={t('meetingUrl')}
                validationMessage={errors.url?.message}
                validationState={errors.url ? 'error' : 'none'}
              >
                <Controller
                  name="url"
                  control={control}
                  rules={{
                    pattern: {
                      value:
                        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                      message: t('meetingUrlInvalid'),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="url"
                      placeholder={t('meetingUrlPlaceholder')}
                      disabled={updateMeetingMutation.isPending}
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
              disabled={updateMeetingMutation.isPending}
            >
              {t('cancel')}
            </Button>
            <Button
              appearance="primary"
              type="submit"
              disabled={updateMeetingMutation.isPending}
              icon={
                updateMeetingMutation.isPending ? undefined : <Edit20Regular />
              }
            >
              {updateMeetingMutation.isPending ? t('saving') : t('save')}
            </Button>
          </DialogActions>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
