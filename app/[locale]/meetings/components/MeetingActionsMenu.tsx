'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuButton,
  MenuDivider,
} from '@fluentui/react-components';
import {
  MoreHorizontal20Regular,
  Eye20Regular,
  Edit20Regular,
  Delete20Regular,
  Share20Regular,
  Archive20Regular,
} from '@fluentui/react-icons';
import type { MeetingResponse } from 'types/meeting.type';

interface MeetingActionsMenuProps {
  meeting: MeetingResponse;
}

export function MeetingActionsMenu({ meeting }: MeetingActionsMenuProps) {
  const t = useTranslations('Meetings');
  const router = useRouter();

  const handleAction = (action: string) => {
    switch (action) {
      case 'view':
        router.push(`/meetings/${meeting.id}`);
        break;
      case 'edit':
        console.log('Edit meeting:', meeting.title);
        // TODO: Implement edit functionality
        break;
      case 'share':
        console.log('Share meeting:', meeting.title);
        // TODO: Implement share functionality
        break;
      case 'archive':
        console.log('Archive meeting:', meeting.title);
        // TODO: Implement archive functionality
        break;
      case 'delete':
        console.log('Delete meeting:', meeting.title);
        // TODO: Implement delete functionality
        break;
      default:
        break;
    }
  };

  return (
    <Menu positioning="below-end">
      <MenuTrigger disableButtonEnhancement>
        <MenuButton
          appearance="subtle"
          icon={<MoreHorizontal20Regular />}
          size="small"
          aria-label={t('actions.label')}
        />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={<Eye20Regular />}
            onClick={() => handleAction('view')}
          >
            {t('actions.view')}
          </MenuItem>
          <MenuItem
            icon={<Edit20Regular />}
            onClick={() => handleAction('edit')}
          >
            {t('actions.edit')}
          </MenuItem>
          <MenuItem
            icon={<Share20Regular />}
            onClick={() => handleAction('share')}
          >
            {t('actions.share')}
          </MenuItem>
          <MenuItem
            icon={<Archive20Regular />}
            onClick={() => handleAction('archive')}
          >
            {t('actions.archive')}
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<Delete20Regular />}
            onClick={() => handleAction('delete')}
            style={{ color: 'var(--colorPaletteRedForeground1)' }}
          >
            {t('actions.delete')}
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
