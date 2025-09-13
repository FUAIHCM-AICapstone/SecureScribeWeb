"use client";

import React from 'react';
import { CounterBadge as FluentCounterBadge, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    counterBadge: {
        fontWeight: '600',
    },
});

interface CounterBadgeProps {
    count?: number;
    overflowCount?: number;
    showZero?: boolean;
    appearance?: 'filled' | 'ghost';
    color?: 'brand' | 'danger' | 'important' | 'informative';
    size?: 'small' | 'medium' | 'large' | 'extra-large';
    shape?: 'circular' | 'rounded';
    dot?: boolean;
    icon?: React.ReactNode;
}

const CounterBadge: React.FC<CounterBadgeProps> = ({
    count,
    overflowCount = 99,
    showZero = false,
    appearance = 'filled',
    color = 'brand',
    size = 'medium',
    shape = 'circular',
    dot = false,
    icon,
}) => {
    const styles = useStyles();

    // Handle unsupported color values for CounterBadge
    const getSupportedColor = () => {
        switch (color) {
            case 'brand':
            case 'danger':
            case 'important':
            case 'informative':
                return color;
            default:
                return 'brand';
        }
    };

    // Handle unsupported shape values for CounterBadge
    const getSupportedShape = () => {
        switch (shape) {
            case 'circular':
            case 'rounded':
                return shape;
            default:
                return 'circular';
        }
    };

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
        <FluentCounterBadge
            count={count}
            overflowCount={overflowCount}
            showZero={showZero}
            appearance={appearance}
            color={getSupportedColor()}
            size={getSize()}
            shape={getSupportedShape()}
            dot={dot}
            icon={icon ? React.cloneElement(icon as React.ReactElement, {
                style: { ...((icon as React.ReactElement).props.style || {}), maxWidth: getMaxWidth, maxHeight: getMaxHeight }
            }) : undefined}
            className={styles.counterBadge}
        />
    );
};

export default CounterBadge;
