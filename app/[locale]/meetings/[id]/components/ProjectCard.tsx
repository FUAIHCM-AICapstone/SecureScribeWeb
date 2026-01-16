'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    Card,
    Text,
    Body1,
    Caption1,
    Badge,
    Button,
    Spinner,
    Avatar,
    makeStyles,
    tokens,
    shorthands,
} from '@fluentui/react-components';
import {
    CalendarClock20Regular,
    People20Regular,
    Document20Regular,
    ArrowRight20Regular,
} from '@/lib/icons';
import { formatDate } from '@/lib/dateFormatter';
import { queryKeys } from '@/lib/queryClient';
import { getProject } from '@/services/api/project';
import type { ProjectWithMembers } from 'types/project.type';

const useStyles = makeStyles({
    card: {
        ...shorthands.padding('20px'),
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        boxShadow: tokens.shadow2,
        ...shorthands.transition('all', '0.2s', 'ease'),
        ':hover': {
            boxShadow: tokens.shadow8,
            transform: 'translateY(-2px)',
        },
    },
    header: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        ...shorthands.gap('12px'),
        marginBottom: '16px',
    },
    titleSection: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('8px'),
        flex: 1,
    },
    projectName: {
        fontSize: tokens.fontSizeBase400,
        fontWeight: 700,
        color: tokens.colorNeutralForeground1,
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('4px'),
    },
    description: {
        lineHeight: '1.6',
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase300,
        marginBottom: '16px',
        ...shorthands.padding('0', '0', '12px', '0'),
        ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    },
    metaGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        ...shorthands.gap('12px'),
        marginBottom: '16px',
    },
    metaItem: {
        display: 'flex',
        alignItems: 'flex-start',
        ...shorthands.gap('8px'),
    },
    metaIcon: {
        color: tokens.colorBrandForeground2,
        marginTop: '2px',
        opacity: 0.8,
        fontSize: '16px',
    },
    metaContent: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('2px'),
    },
    metaLabel: {
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
        fontWeight: 600,
    },
    metaValue: {
        fontWeight: 500,
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
    },
    ownerSection: {
        ...shorthands.padding('12px', '0', '0', '0'),
        ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('12px'),
    },
    ownerAvatar: {
        width: '40px',
        height: '40px',
    },
    ownerContent: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('2px'),
        flex: 1,
    },
    ownerName: {
        fontWeight: 600,
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
    },
    ownerEmail: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
    },
    ownerRole: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('4px'),
    },
    ownerLabel: {
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
        fontWeight: 600,
        marginBottom: '4px',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    viewButton: {
        width: '100%',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('24px'),
        ...shorthands.gap('12px'),
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('24px'),
        textAlign: 'center',
        color: tokens.colorPaletteRedForeground1,
    },
    noDescriptionText: {
        color: tokens.colorNeutralForeground3,
        fontStyle: 'italic',
    },
});

interface ProjectCardProps {
    projectId: string;
}

export function ProjectCard({ projectId }: ProjectCardProps) {
    const styles = useStyles();
    const t = useTranslations('MeetingDetail');
    const tProjects = useTranslations('Projects');
    const router = useRouter();

    const { data: project, isLoading, isError } = useQuery<ProjectWithMembers>({
        queryKey: queryKeys.project(projectId),
        queryFn: () => getProject(projectId, true),
    });

    const formatDateTime = (dateString: string | null | undefined) => {
        if (!dateString) return t('noDate');
        try {
            return formatDate(dateString, 'datetime');
        } catch {
            return t('invalidDate');
        }
    };

    const getStatusBadge = (isArchived: boolean) => {
        if (isArchived) {
            return (
                <Badge appearance="filled" color="warning" size="medium">
                    {tProjects('status.archived')}
                </Badge>
            );
        }
        return (
            <Badge appearance="filled" color="success" size="medium">
                {tProjects('status.active')}
            </Badge>
        );
    };

    const getProjectOwner = () => {
        if (!project?.members || !project?.created_by) return null;
        return project.members.find((member) => member.user_id === project.created_by);
    };

    if (isLoading) {
        return (
            <Card className={styles.card}>
                <div className={styles.loadingContainer}>
                    <Spinner size="small" />
                    <Text size={300}>{t('loading')}</Text>
                </div>
            </Card>
        );
    }

    if (isError || !project) {
        return (
            <Card className={styles.card}>
                <div className={styles.errorContainer}>
                    <Text>{t('errorLoadingProject')}</Text>
                </div>
            </Card>
        );
    }

    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <Text className={styles.projectName}>
                        {project.name || tProjects('untitledProject')}
                    </Text>
                    <div className={styles.statusBadge}>
                        {getStatusBadge(project.is_archived)}
                    </div>
                </div>
            </div>

            {project.description && (
                <Body1 className={styles.description}>{project.description}</Body1>
            )}

            <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                    <People20Regular className={styles.metaIcon} />
                    <div className={styles.metaContent}>
                        <Caption1 className={styles.metaLabel}>
                            {t('members')}
                        </Caption1>
                        <Body1 className={styles.metaValue}>
                            {project.members?.length || 0}
                        </Body1>
                    </div>
                </div>

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

                {project.updated_at && (
                    <div className={styles.metaItem}>
                        <Document20Regular className={styles.metaIcon} />
                        <div className={styles.metaContent}>
                            <Caption1 className={styles.metaLabel}>
                                {t('updatedAt')}:
                            </Caption1>
                            <Body1 className={styles.metaValue}>
                                {formatDateTime(project.updated_at)}
                            </Body1>
                        </div>
                    </div>
                )}
            </div>

            {getProjectOwner()?.user && (
                <div className={styles.ownerSection}>
                    <Avatar
                        name={getProjectOwner()?.user?.name}
                        image={{ src: getProjectOwner()?.user?.avatar_url }}
                        color="colorful"
                        className={styles.ownerAvatar}
                    />
                    <div className={styles.ownerContent}>
                        <Text className={styles.ownerName}>
                            {getProjectOwner()?.user?.name}
                        </Text>
                        <Text className={styles.ownerEmail}>
                            {getProjectOwner()?.user?.email}
                        </Text>
                    </div>
                    <Badge
                        appearance="filled"
                        color="brand"
                        size="medium"
                    >
                        {getProjectOwner()?.role === 'owner' ? t('owner') : t('member')}
                    </Badge>
                </div>
            )}

            <div className={styles.footer}>
                <Button
                    appearance="primary"
                    icon={<ArrowRight20Regular />}
                    onClick={() => router.push(`/projects/${projectId}`)}
                    className={styles.viewButton}
                >
                    {t('viewProject')}
                </Button>
            </div>
        </Card>
    );
}
