'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Button,
    Input,
    Textarea,
    Field,
    RadioGroup,
    Radio,
    makeStyles,
    tokens,
    Checkbox,
} from '@fluentui/react-components';
import { CalendarAdd24Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { showToast } from '@/hooks/useShowToast';

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
    datePickerWrapper: {
        position: 'relative',
        '& .react-datepicker-wrapper': {
            width: '100%',
        },
        '& .react-datepicker__input-container input': {
            width: '100%',
            padding: '8px 12px',
            border: `1px solid ${tokens.colorNeutralStroke1}`,
            borderRadius: tokens.borderRadiusMedium,
            backgroundColor: 'var(--colorNeutralBackground1)',
            color: 'var(--colorNeutralForeground1)',
            fontSize: '14px',
            '&:focus': {
                outline: 'none',
                borderColor: 'var(--colorCompoundBrandStroke)',
                boxShadow: `0 0 0 2px var(--colorCompoundBrandStroke)`,
            },
        },
        '& .react-datepicker': {
            fontSize: '14px',
            border: `1px solid ${tokens.colorNeutralStroke1}`,
            borderRadius: tokens.borderRadiusMedium,
            backgroundColor: 'var(--colorNeutralBackground1)',
        },
        '& .react-datepicker__header': {
            backgroundColor: 'var(--colorNeutralBackground2)',
            borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
        },
        '& .react-datepicker__current-month': {
            color: 'var(--colorNeutralForeground1)',
        },
        '& .react-datepicker__day-name': {
            color: 'var(--colorNeutralForeground2)',
        },
        '& .react-datepicker__day': {
            color: 'var(--colorNeutralForeground1)',
            '&:hover': {
                backgroundColor: 'var(--colorNeutralBackground1Hover)',
            },
            '&.react-datepicker__day--selected': {
                backgroundColor: 'var(--colorCompoundBrandBackground)',
                color: 'var(--colorNeutralForegroundOnBrand)',
            },
            '&.react-datepicker__day--today': {
                backgroundColor: 'var(--colorNeutralBackground2)',
            },
        },
        '& .react-datepicker__navigation': {
            border: 'none',
            backgroundColor: 'transparent',
        },
        '& .react-datepicker__navigation-icon::before': {
            borderColor: 'var(--colorNeutralForeground2)',
        },
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

    const onSubmit = async (data: MeetingFormData) => {
        try {
            // Mock API call - in real app, this would call the actual API
            console.log('Creating meeting:', data);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            showToast('success', t('meetingCreated'));

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
                                <Controller
                                    name="startTime"
                                    control={control}
                                    rules={{ required: t('startTimeRequired') }}
                                    render={({ field }) => (
                                        <div className={styles.datePickerWrapper}>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date) => field.onChange(date)}
                                                showTimeSelect
                                                timeFormat="HH:mm"
                                                timeIntervals={15}
                                                dateFormat="yyyy-MM-dd HH:mm"
                                                placeholderText={t('selectDateTime')}
                                                minDate={new Date()}
                                                timeCaption={t('time')}
                                            />
                                        </div>
                                    )}
                                />
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
