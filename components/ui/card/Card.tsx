import React from 'react';
import { makeStyles, mergeClasses } from '@fluentui/react-components';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'outlined';
    onClick?: () => void;
    interactive?: boolean;
}

const useStyles = makeStyles({
    root: {
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: 'var(--colorNeutralBackground1)',
        border: '1px solid var(--colorNeutralStroke1)',
        boxShadow: 'var(--shadow4)',
        transition: 'all 0.2s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '200px',
    },
    content: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    default: {
        boxShadow: 'var(--shadow4)',
    },
    elevated: {
        boxShadow: 'var(--shadow16)',
        border: '1px solid var(--colorNeutralStroke2)',
    },
    outlined: {
        boxShadow: 'none',
        border: '2px solid var(--colorNeutralStroke1)',
        backgroundColor: 'transparent',
    },
    interactive: {
        cursor: 'pointer',
        '&:hover': {
            boxShadow: 'var(--shadow8)',
            transform: 'translateY(-2px)',
        },
        '&:active': {
            transform: 'translateY(0)',
        },
    },
});

const Card: React.FC<CardProps> = ({
    children,
    className,
    variant = 'default',
    onClick,
    interactive = false,
}) => {
    const styles = useStyles();

    const cardClasses = mergeClasses(
        styles.root,
        styles[variant],
        interactive || onClick ? styles.interactive : undefined,
        className
    );

    return (
        <div
            className={cardClasses}
            onClick={onClick}
            role={interactive || onClick ? 'button' : undefined}
            tabIndex={interactive || onClick ? 0 : undefined}
            onKeyDown={(e) => {
                if ((interactive || onClick) && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default Card;
