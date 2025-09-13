import React from 'react';
import { CompoundButton as FluentCompoundButton, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    compoundButton: {
        minWidth: 'auto',
        fontWeight: '600',
        borderRadius: '6px',
    },
});

interface CompoundButtonProps {
    children: React.ReactNode;
    secondaryContent?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

const CompoundButton: React.FC<CompoundButtonProps> = ({
    children,
    secondaryContent,
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

    return (
        <FluentCompoundButton
            onClick={onClick}
            appearance={getAppearance()}
            size={getSize()}
            disabled={disabled}
            className={styles.compoundButton}
            style={buttonStyle}
            secondaryContent={secondaryContent}
        >
            {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
            {children}
        </FluentCompoundButton>
    );
};

export default CompoundButton;
