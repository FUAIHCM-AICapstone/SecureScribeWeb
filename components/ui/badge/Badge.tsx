"use client";

import React from 'react';
import { Badge as FluentBadge, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    badge: {
        fontWeight: '500',
        borderRadius: '12px',
    },
});

interface BadgeProps {
    children: React.ReactNode;
    appearance?: 'filled' | 'outline' | 'tint' | 'ghost';
    color?: 'brand' | 'danger' | 'important' | 'informative' | 'severe' | 'subtle' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large' | 'extra-large';
    shape?: 'circular' | 'rounded' | 'square';
    icon?: React.ReactNode;
    iconPosition?: 'before' | 'after';
}

const Badge: React.FC<BadgeProps> = ({
    children,
    appearance = 'filled',
    color = 'brand',
    size = 'medium',
    shape = 'rounded',
    icon,
    iconPosition = 'before',
}) => {
    const styles = useStyles();

    const getSize = () => {
        switch (size) {
            case 'small':
                return 'small';
            case 'large':
                return 'large';
            case 'extra-large':
                return 'extra-large';
            default:
                return 'medium';
        }
    };

    // Set max dimensions for icon like Input.tsx
    const getMaxWidth = size === 'small' ? '15px' : size === 'large' ? '23px' : '19px';
    const getMaxHeight = size === 'small' ? '15px' : size === 'large' ? '23px' : '19px';

    return (
        <FluentBadge
            appearance={appearance}
            color={color}
            size={getSize()}
            shape={shape}
            icon={icon ? React.cloneElement(icon as React.ReactElement, {
                style: { ...((icon as React.ReactElement).props.style || {}), maxWidth: getMaxWidth, maxHeight: getMaxHeight }
            }) : undefined}
            iconPosition={iconPosition}
            className={styles.badge}
        >
            {children}
        </FluentBadge>
    );
};

export default Badge;
