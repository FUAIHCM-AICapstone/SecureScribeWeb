import React from 'react';
import { makeStyles, mergeClasses } from '@fluentui/react-components';

export interface CardPreviewProps {
    children: React.ReactNode;
    className?: string;
    logo?: React.ReactNode;
    truncate?: boolean;
}

const useStyles = makeStyles({
    root: {
        marginBottom: '1rem',
        position: 'relative',
        flexShrink: 0,
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
    },
    logo: {
        flexShrink: 0,
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundColor: 'var(--colorNeutralBackground3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        flex: 1,
        minWidth: 0,
    },
    truncate: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
});

const CardPreview: React.FC<CardPreviewProps> = ({
    children,
    className,
    logo,
    truncate = false,
}) => {
    const styles = useStyles();

    return (
        <div className={mergeClasses(styles.root, className)}>
            <div className={styles.content}>
                {logo && <div className={styles.logo}>{logo}</div>}
                <div className={mergeClasses(styles.text, truncate && styles.truncate)}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CardPreview;
