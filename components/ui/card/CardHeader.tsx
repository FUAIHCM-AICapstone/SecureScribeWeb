import React from 'react';
import { makeStyles, mergeClasses, Text } from '@fluentui/react-components';

export interface CardHeaderProps {
    title?: string;
    subtitle?: string;
    avatar?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        gap: '0.75rem',
        flexShrink: 0,
    },
    content: {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    avatar: {
        flexShrink: 0,
    },
    action: {
        flexShrink: 0,
    },
    title: {
        fontSize: '1.125rem',
        fontWeight: '600',
        lineHeight: '1.5',
        color: 'var(--colorNeutralForeground1)',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: 'var(--colorNeutralForeground3)',
        lineHeight: '1.4',
    },
});

const CardHeader: React.FC<CardHeaderProps> = ({
    title,
    subtitle,
    avatar,
    action,
    className,
}) => {
    const styles = useStyles();

    return (
        <div className={mergeClasses(styles.root, className)}>
            <div className={styles.avatar}>{avatar}</div>

            <div className={styles.content}>
                {title && <Text className={styles.title}>{title}</Text>}
                {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
            </div>

            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
};

export default CardHeader;
