import React from 'react';
import { MenuButton as FluentMenuButton, makeStyles, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';

const useStyles = makeStyles({
    menuButton: {
        minWidth: 'auto',
        fontWeight: '600',
        borderRadius: '6px',
    },
});

interface MenuItem {
    key: string;
    content: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

interface MenuButtonProps {
    children: React.ReactNode;
    menuItems: MenuItem[];
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({
    children,
    menuItems,
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
        <Menu>
            <MenuTrigger>
                <FluentMenuButton
                    onClick={onClick}
                    appearance={getAppearance()}
                    size={getSize()}
                    disabled={disabled}
                    className={styles.menuButton}
                    style={buttonStyle}
                >
                    {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
                    {children}
                </FluentMenuButton>
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.key}
                            onClick={item.onClick}
                            disabled={item.disabled}
                        >
                            {item.icon && <span style={{ marginRight: '8px' }}>{item.icon}</span>}
                            {item.content}
                        </MenuItem>
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};

export default MenuButton;
