'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
    Text,
    Body1,
    Button,
    makeStyles,
    shorthands,
    tokens,
} from '@fluentui/react-components';
import {
    People20Regular,
    ChevronLeft20Regular,
    ChevronRight20Regular,
} from '@fluentui/react-icons';
import { ProjectCard } from './ProjectCard';

const useStyles = makeStyles({
    section: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('20px'),
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('12px'),
        marginBottom: '16px',
    },
    sectionIcon: {
        color: tokens.colorBrandForeground2,
        opacity: 0.8,
    },
    sectionHeading: {
        fontSize: tokens.fontSizeBase400,
        fontWeight: 700,
        color: tokens.colorNeutralForeground1,
    },
    projectsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        ...shorthands.gap('16px'),
    },
    emptyState: {
        ...shorthands.padding('48px', '32px'),
        textAlign: 'center',
        color: tokens.colorNeutralForeground3,
        backgroundColor: tokens.colorNeutralBackground3,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke2),
    },
    emptyStateText: {
        fontSize: tokens.fontSizeBase300,
    },
    paginationContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.gap('16px'),
        marginTop: '24px',
    },
    paginationInfo: {
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase300,
        fontWeight: 500,
    },
    paginationButtons: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('8px'),
    },
});

interface LinkedProjectsSectionProps {
    projects: any[];
    itemsPerPage?: number;
}

export export function LinkedProjectsSection({
    projects,
    itemsPerPage = 6,
}: LinkedProjectsSectionProps) {
    const styles = useStyles();
    const t = useTranslations('MeetingDetail');
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil((projects?.length || 0) / itemsPerPage);
    const paginatedProjects = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        return projects.slice(startIndex, startIndex + itemsPerPage);
    }, [projects, currentPage, itemsPerPage]);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Empty state
    if (!projects || projects.length === 0) {
        return (
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    <People20Regular className={styles.sectionIcon} />
                    <Text className={styles.sectionHeading}>{t('projects')}</Text>
                </div>
                <div className={styles.emptyState}>
                    <Body1 className={styles.emptyStateText}>
                        {t('noProjectsLinked')}
                    </Body1>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionTitle}>
                <People20Regular className={styles.sectionIcon} />
                <Text className={styles.sectionHeading}>
                    {t('projects')} ({projects.length})
                </Text>
            </div>

            <div className={styles.projectsGrid}>
                {paginatedProjects.map((project) => (
                    <ProjectCard key={project.id} projectId={project.id} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <Button
                        appearance="subtle"
                        icon={<ChevronLeft20Regular />}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        {t('previous')}
                    </Button>

                    <Text className={styles.paginationInfo}>
                        {currentPage} / {totalPages}
                    </Text>

                    <Button
                        appearance="subtle"
                        icon={<ChevronRight20Regular />}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        {t('next')}
                    </Button>
                </div>
            )}
        </div>
    );
}
