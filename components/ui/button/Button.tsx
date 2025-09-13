import React from 'react';
import { Button as FluentButton, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
  customButton: {
    minWidth: 'auto',
    fontWeight: '600',
    borderRadius: '6px',
  },
});

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  icon,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
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
    width: fullWidth ? '100%' : 'auto',
    ...(variant === 'danger' && {
      backgroundColor: 'var(--colorStatusDangerBackground1)',
      color: 'var(--colorStatusDangerForeground1)',
      borderColor: 'var(--colorStatusDangerBorder1)',
    }),
  };

  return (
    <FluentButton
      type={type}
      onClick={onClick}
      appearance={getAppearance()}
      size={getSize()}
      disabled={disabled || loading}
      className={styles.customButton}
      style={buttonStyle}
    >
      {loading ? (
        'Loading...'
      ) : (
        <>
          {icon && <span style={{ marginRight: children ? '8px' : '0' }}>{icon}</span>}
          {children}
        </>
      )}
    </FluentButton>
  );
};

export default Button;
