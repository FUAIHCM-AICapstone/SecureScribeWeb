import React from 'react';
import { ToggleButton as FluentToggleButton, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    toggleButton: {
        minWidth: 'auto',
        fontWeight: '600',
        borderRadius: '6px',
    },
});

interface ToggleButtonProps {
    children: React.ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    onClick?: (checked: boolean) => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
    children,
    checked,
    defaultChecked,
    onClick,
    icon,
    variant = 'primary',
    size = 'medium',
    disabled = false,
}) => {
    const styles = useStyles();

    const getAppearance = () => {
        switch (variant) {
            case 'secondary':
                return 'secondary';
            case 'outline':
                return 'outline';
            case 'ghost':
                return 'subtle';
            case 'danger':
                return 'primary';
            default:
                return 'primary';
        }
    };

    const getSize = () => {
        switch (size) {
            case 'small':
                return 'small';
            case 'large':
                return 'large';
            default:
                return 'medium';
        }
    };

    const buttonStyle = {
        ...(variant === 'danger' && {
            backgroundColor: 'var(--colorStatusDangerBackground1)',
            color: 'var(--colorStatusDangerForeground1)',
            borderColor: 'var(--colorStatusDangerBorder1)',
        }),
    };

    const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
        const target = ev.currentTarget as any;
        onClick?.(target.checked);
    };

    return (
        <FluentToggleButton
            checked={checked}
            defaultChecked={defaultChecked}
            onClick={handleClick}
            appearance={getAppearance()}
            size={getSize()}
            disabled={disabled}
            className={styles.toggleButton}
            style={buttonStyle}
        >
            {icon && <span style={{ marginRight: children ? '8px' : '0' }}>{icon}</span>}
            {children}
        </FluentToggleButton>
    );
};

export default ToggleButton;
