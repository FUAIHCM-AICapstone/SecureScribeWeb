'use client';

import { showToast } from '@/hooks/useShowToast';
import {
    Button,
    Checkbox,
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
    makeStyles,
    tokens
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
    projectList: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalXS,
        maxHeight: '200px',
        overflowY: 'auto',
    },
    projectItem: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
        padding: tokens.spacingVerticalXS,
        borderRadius: tokens.borderRadiusSmall,
        '&:hover': {
            backgroundColor: 'var(--colorNeutralBackground1Hover)',
        },
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
    selectedProjects: string[];
}

interface Project {
    id: string;
    name: string;
    description: string;
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

    // Mock projects data - in real app, this would come from API
    const [projects] = useState<Project[]>([
        { id: '1', name: 'Project Alpha', description: 'Main development project' },
        { id: '2', name: 'Project Beta', description: 'Research and development' },
        { id: '3', name: 'Project Gamma', description: 'Marketing campaign' },
    ]);

    // Separate state for date and time
    const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(null);
    const [selectedTime, setSelectedTime] = useState<Date | null>(null);
    const [timePickerValue, setTimePickerValue] = useState<string>(
        selectedTime ? formatDateToTimeString(selectedTime) : ""
    );

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
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
            selectedProjects: [],
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
                selectedTime.getMinutes()
            );
            setValue('startTime', combinedDateTime);
        } else if (selectedDate) {
            setValue('startTime', selectedDate);
        } else {
            setValue('startTime', null);
        }
    }, [selectedDate, selectedTime, setValue]);

    const onSelectDate: DatePickerProps["onSelectDate"] = (date) => {
        setSelectedDate(date);
        if (date && selectedTime) {
            setSelectedTime(
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                )
            );
        }
    };

    const onTimeChange: TimePickerProps["onTimeChange"] = (_ev, data) => {
        setSelectedTime(data.selectedTime);
        setTimePickerValue(data.selectedTimeText ?? "");
    };

    const onTimePickerInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setTimePickerValue(ev.target.value);
    };

    const onSubmit = async (data: MeetingFormData) => {
        try {
            // Mock API call - in real app, this would call the actual API
            console.log('Creating meeting:', data);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            showToast('success', t('meetingCreated'), {
                duration: 4000,
                action: {
                    label: t('viewMeeting'),
                    onClick: () => {
                        // TODO: Navigate to meeting details page
                        console.log('Navigate to meeting details');
                    }
                }
            });

            // Reset form and close modal
            reset();
            onOpenChange(false);
        } catch (error) {
            console.error('Error creating meeting:', error);
            showToast('error', t('meetingCreateError'));
        }
    };

    const handleCancel = () => {
        reset();
        setSelectedDate(null);
        setSelectedTime(null);
        setTimePickerValue("");
        onOpenChange(false);
    };

    const handleProjectToggle = (projectId: string, checked: boolean) => {
        const currentProjects = watch('selectedProjects');
        if (checked) {
            setValue('selectedProjects', [...currentProjects, projectId]);
        } else {
            setValue('selectedProjects', currentProjects.filter(id => id !== projectId));
        }
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
                                            onChange={(_, data) => field.onChange(data.value === 'personal')}
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
                                    <div className={styles.projectList}>
                                        {projects.map((project) => (
                                            <Controller
                                                key={project.id}
                                                name="selectedProjects"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className={styles.projectItem}>
                                                        <Checkbox
                                                            checked={field.value.includes(project.id)}
                                                            onChange={(_, data) =>
                                                                handleProjectToggle(project.id, !!data.checked)
                                                            }
                                                        />
                                                        <div>
                                                            <div style={{ fontWeight: 600 }}>{project.name}</div>
                                                            <div style={{ fontSize: '12px', color: 'var(--colorNeutralForeground2)' }}>
                                                                {project.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    {projects.length === 0 && (
                                        <div style={{ fontSize: '14px', color: 'var(--colorNeutralForeground2)' }}>
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
                            disabled={isSubmitting}
                            icon={isSubmitting ? undefined : <CalendarAdd24Regular />}
                        >
                            {isSubmitting ? t('creating') : t('createMeeting')}
                        </Button>
                    </DialogActions>
                </form>
            </DialogSurface>
        </Dialog>
    );
}
