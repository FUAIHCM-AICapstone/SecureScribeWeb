import React from 'react';
import { Avatar as FluentAvatar, makeStyles } from '@fluentui/react-components';
import { PresenceBadge } from './badge';

const useStyles = makeStyles({
    avatar: {
        border: `2px solid var(--colorBrandForeground1)`,
        boxShadow: 'var(--shadow2)',
    },
    avatarWithBadge: {
        position: 'relative',
        display: 'inline-block',
    },
});

interface AvatarProps {
    name?: string;
    image?: string;
    icon?: React.ReactNode;
    size?: 'small' | 'medium' | 'large' | 'extra-large';
    shape?: 'circular' | 'square';
    badge?: {
        status?: 'available' | 'away' | 'busy' | 'do-not-disturb' | 'offline' | 'out-of-office' | 'unknown';
        outOfOffice?: boolean;
        icon?: React.ReactNode;
        content?: React.ReactNode;
    };
}

const Avatar: React.FC<AvatarProps> = ({
    name,
    image,
    icon,
    size = 'medium',
    shape = 'circular',
    badge,
}) => {
    const styles = useStyles();

    const getSize = () => {
        switch (size) {
            case 'small':
                return 32;
            case 'large':
                return 64;
            case 'extra-large':
                return 96;
            default:
                return 48;
        }
    };

    const avatarProps: any = {
        size: getSize(),
        shape,
        className: styles.avatar,
    };

    if (image) {
        avatarProps.image = { src: image };
    } else if (icon) {
        avatarProps.icon = icon;
    } else if (name) {
        avatarProps.name = name;
    }

    const avatarElement = <FluentAvatar {...avatarProps} />;

    // If badge is provided, wrap avatar with badge
    if (badge) {
        return (
            <div className={styles.avatarWithBadge}>
                {avatarElement}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                }}>
                    {badge.status ? (
                        <PresenceBadge
                            status={badge.status}
                            outOfOffice={badge.outOfOffice}
                            size={size === 'small' ? 'small' : size === 'large' || size === 'extra-large' ? 'large' : 'medium'}
                        />
                    ) : badge.content ? (
                        badge.content
                    ) : badge.icon ? (
                        <div style={{
                            width: size === 'small' ? '16px' : size === 'large' || size === 'extra-large' ? '20px' : '18px',
                            height: size === 'small' ? '16px' : size === 'large' || size === 'extra-large' ? '20px' : '18px',
                            borderRadius: '50%',
                            background: 'var(--colorBrandBackground)',
                            border: '2px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                            fontSize: size === 'small' ? '8px' : size === 'large' || size === 'extra-large' ? '12px' : '10px',
                            color: 'var(--colorBrandForeground1)',
                        }}>
                            {badge.icon}
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }

    return avatarElement;
};

export default Avatar;

