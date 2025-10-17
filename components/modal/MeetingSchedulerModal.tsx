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
  Radio,
  RadioGroup,
  Textarea,
  Dropdown,
  Option,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DatePicker, DatePickerProps } from '@fluentui/react-datepicker-compat';
import { CalendarAdd24Regular } from '@fluentui/react-icons';
import {
  TimePicker,
  TimePickerProps,
  formatDateToTimeString,
} from '@fluentui/react-timepicker-compat';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { createMeeting } from '@/services/api/meeting';
import { getProjects } from '@/services/api/project';
import { queryKeys } from '@/lib/queryClient';
import type { MeetingCreate } from 'types/meeting.type';
import type { ProjectResponse } from 'types/project.type';

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
  dateTimeContainer: {
    display: 'grid',
    columnGap: '20px',
    gridTemplateColumns: 'repeat(2, 1fr)',
    maxWidth: '600px',
    marginBottom: '10px',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
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
  startTime: Date | null;
  isPersonal: boolean;
  selectedProject: string;
}

interface MeetingSchedulerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MeetingSchedulerModal({
  open,
  onOpenChange,
}: MeetingSchedulerModalProps) {
  const styles = useStyles();
  const t = useTranslations('MeetingScheduler');
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch projects from API
  const { data: projectsData } = useQuery({
    queryKey: queryKeys.projects,
    queryFn: () => getProjects({ limit: 50 }),
    enabled: open,
  });

  const projects: ProjectResponse[] = projectsData?.data || [];

  // Create meeting mutation
  const createMeetingMutation = useMutation({
    mutationFn: (meetingData: MeetingCreate) => createMeeting(meetingData),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
      queryClient.invalidateQueries({ queryKey: queryKeys.personalMeetings });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });

      // Show success toast
      showToast('success', t('meetingCreated'), {
        duration: 4000,
        action: {
          label: t('viewMeeting'),
          onClick: () => {
            router.push('/meetings');
          },
        },
      });

      // Reset form and close modal
      reset();
      setSelectedDate(null);
      setSelectedTime(null);
      setTimePickerValue('');
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Error creating meeting:', error);
      showToast('error', t('meetingCreateError'));
    },
  });

  // Separate state for date and time
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(
    null,
  );
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [timePickerValue, setTimePickerValue] = useState<string>(
    selectedTime ? formatDateToTimeString(selectedTime) : '',
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<MeetingFormData>({
    defaultValues: {
      title: '',
      description: '',
      url: '',
      startTime: null,
      isPersonal: true,
      selectedProject: '',
    },
  });

  const isPersonal = watch('isPersonal');

  // Update combined date/time when either changes
  React.useEffect(() => {
    if (selectedDate && selectedTime) {
      const combinedDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
      );
      setValue('startTime', combinedDateTime);
    } else if (selectedDate) {
      setValue('startTime', selectedDate);
    } else {
      setValue('startTime', null);
    }
  }, [selectedDate, selectedTime, setValue]);

  const onSelectDate: DatePickerProps['onSelectDate'] = (date) => {
    setSelectedDate(date);
    if (date && selectedTime) {
      setSelectedTime(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes(),
        ),
      );
    }
  };

  const onTimeChange: TimePickerProps['onTimeChange'] = (_ev, data) => {
    setSelectedTime(data.selectedTime);
    setTimePickerValue(data.selectedTimeText ?? '');
  };

  const onTimePickerInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setTimePickerValue(ev.target.value);
  };

  const onSubmit = async (data: MeetingFormData) => {
    // Validate start time is selected
    if (!data.startTime) {
      showToast(
        'error',
        t('startTimeRequired') || 'Please select a start time',
      );
      return;
    }

    try {
      // Transform form data to MeetingCreate format
      const meetingData: MeetingCreate = {
        title: data.title,
        description: data.description || undefined,
        url: data.url || undefined,
        start_time: data.startTime.toISOString(),
        is_personal: data.isPersonal,
        project_ids: data.isPersonal
          ? []
          : data.selectedProject
            ? [data.selectedProject]
            : [],
      };

      // Call mutation to create meeting
      createMeetingMutation.mutate(meetingData);
    } catch (error) {
      console.error('Error preparing meeting data:', error);
      showToast('error', t('meetingCreateError'));
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedDate(null);
    setSelectedTime(null);
    setTimePickerValue('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => onOpenChange(data.open)}>
      <DialogSurface>
        <DialogTitle>{t('scheduleMeeting')}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <DialogBody>
            <DialogContent>
              {/* Meeting Title */}
              <Field
                label={t('meetingTitle')}
                validationMessage={errors.title?.message}
                required
              >
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: t('titleRequired'),
                    minLength: { value: 3, message: t('titleMinLength') },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t('titlePlaceholder')}
                      appearance="outline"
                    />
                  )}
                />
              </Field>

              {/* Meeting Description */}
              <Field
                label={t('meetingDescription')}
                validationMessage={errors.description?.message}
              >
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder={t('descriptionPlaceholder')}
                      appearance="outline"
                      resize="vertical"
                      rows={3}
                    />
                  )}
                />
              </Field>

              {/* Meeting URL */}
              <Field
                label={t('meetingUrl')}
                validationMessage={errors.url?.message}
              >
                <Controller
                  name="url"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: t('urlInvalid'),
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder={t('urlPlaceholder')}
                      appearance="outline"
                      type="url"
                    />
                  )}
                />
              </Field>

              {/* Start Time */}
              <Field
                label={t('startTime')}
                validationMessage={errors.startTime?.message}
                required
              >
                <div className={styles.dateTimeContainer}>
                  <Field label={t('selectDate')}>
                    <DatePicker
                      placeholder={t('selectDatePlaceholder')}
                      value={selectedDate}
                      onSelectDate={onSelectDate}
                    />
                  </Field>
                  <Field label={t('selectTime')}>
                    <TimePicker
                      placeholder={t('selectTimePlaceholder')}
                      freeform
                      dateAnchor={selectedDate ?? undefined}
                      selectedTime={selectedTime}
                      onTimeChange={onTimeChange}
                      value={timePickerValue}
                      onInput={onTimePickerInput}
                    />
                  </Field>
                </div>
              </Field>

              {/* Meeting Type */}
              <Field label={t('meetingType')}>
                <Controller
                  name="isPersonal"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value ? 'personal' : 'project'}
                      onChange={(_, data) =>
                        field.onChange(data.value === 'personal')
                      }
                      className={styles.radioGroup}
                    >
                      <Radio value="personal" label={t('personalMeeting')} />
                      <Radio value="project" label={t('projectMeeting')} />
                    </RadioGroup>
                  )}
                />
              </Field>

              {/* Project Selection */}
              {!isPersonal && (
                <Field label={t('selectProjects')}>
                  <Controller
                    name="selectedProject"
                    control={control}
                    render={({ field }) => (
                      <Dropdown
                        placeholder={
                          t('selectProjectPlaceholder') || 'Select a project'
                        }
                        value={field.value}
                        selectedOptions={field.value ? [field.value] : []}
                        onOptionSelect={(_, data) => {
                          field.onChange(data.optionValue || '');
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
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'var(--colorNeutralForeground2)',
                      }}
                    >
                      {t('noProjectsAvailable')}
                    </div>
                  )}
                </Field>
              )}
            </DialogContent>
          </DialogBody>

          <DialogActions className={styles.actions}>
            <Button appearance="secondary" onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button
              appearance="primary"
              type="submit"
              disabled={createMeetingMutation.isPending}
              icon={
                createMeetingMutation.isPending ? undefined : (
                  <CalendarAdd24Regular />
                )
              }
            >
              {createMeetingMutation.isPending
                ? t('creating')
                : t('createMeeting')}
            </Button>
          </DialogActions>
        </form>
      </DialogSurface>
    </Dialog>
  );
}
