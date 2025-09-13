"use client";

import React from 'react';
import { PresenceBadge as FluentPresenceBadge, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    presenceBadge: {
        borderRadius: '50%',
    },
});

interface PresenceBadgeProps {
    status?: 'available' | 'away' | 'busy' | 'do-not-disturb' | 'offline' | 'out-of-office' | 'unknown';
    outOfOffice?: boolean;
    size?: 'small' | 'medium' | 'large' | 'extra-large';
}

const PresenceBadge: React.FC<PresenceBadgeProps> = ({
    status = 'available',
    outOfOffice = false,
    size = 'medium',
}) => {
    const styles = useStyles();

    return (
        <FluentPresenceBadge
            status={status}
            outOfOffice={outOfOffice}
            size={size}
            className={styles.presenceBadge}
        />
    );
};

export default PresenceBadge;
