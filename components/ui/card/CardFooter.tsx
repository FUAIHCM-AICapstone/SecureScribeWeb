import React from 'react';
import { makeStyles, mergeClasses } from '@fluentui/react-components';

export interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
    align?: 'start' | 'center' | 'end' | 'space-between';
}

const useStyles = makeStyles({
    root: {
        marginTop: 'auto',
        paddingTop: '1rem',
        borderTop: '1px solid var(--colorNeutralStroke2)',
        flexShrink: 0,
    },
    start: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    end: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    'space-between': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

const CardFooter: React.FC<CardFooterProps> = ({
    children,
    className,
    align = 'start',
}) => {
    const styles = useStyles();

    return (
        <div className={mergeClasses(styles.root, styles[align], className)}>
            {children}
        </div>
    );
};

export default CardFooter;
