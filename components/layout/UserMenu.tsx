'use client';

import React from 'react';
import {
  Avatar,
  Button,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Tooltip,
} from '@fluentui/react-components';
import { SignOut24Regular } from '@fluentui/react-icons';
import type { User } from 'types/user.type';

interface UserMenuProps {
  user: User | null;
  onLogout: () => void;
  t: any;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, t }) => {
  return (
    <Menu>
      <MenuTrigger>
        <Tooltip content="Profile" relationship="label">
          <Button appearance="subtle" size="small">
            <Avatar
              name={user?.name || user?.email || 'User'}
              image={user?.avatar_url ? { src: user.avatar_url } : undefined}
              size={28}
            />
          </Button>
        </Tooltip>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
            <div style={{ fontSize: '12px', color: 'var(--colorNeutralForeground3)' }}>
              {user?.email}
            </div>
            {user?.position && (
              <div style={{ fontSize: '12px', color: 'var(--colorNeutralForeground3)' }}>
                {user.position}
              </div>
            )}
          </div>
          <Divider />
          <MenuItem icon={<SignOut24Regular />} onClick={onLogout}>
            {t('logout') || 'Logout'}
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
