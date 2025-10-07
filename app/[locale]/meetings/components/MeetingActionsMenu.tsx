'use client';

import React from 'react';
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
  const handleAction = (action: string) => {
    console.log(`Action ${action} for meeting ${meeting.id}`);
    // TODO: Implement actual actions later
    switch (action) {
      case 'view':
        console.log('View meeting details:', meeting.title);
        break;
      case 'edit':
        console.log('Edit meeting:', meeting.title);
        break;
      case 'share':
        console.log('Share meeting:', meeting.title);
        break;
      case 'archive':
        console.log('Archive meeting:', meeting.title);
        break;
      case 'delete':
        console.log('Delete meeting:', meeting.title);
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
          aria-label="Meeting actions"
        />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={<Eye20Regular />}
            onClick={() => handleAction('view')}
          >
            View Details
          </MenuItem>
          <MenuItem
            icon={<Edit20Regular />}
            onClick={() => handleAction('edit')}
          >
            Edit Meeting
          </MenuItem>
          <MenuItem
            icon={<Share20Regular />}
            onClick={() => handleAction('share')}
          >
            Share
          </MenuItem>
          <MenuItem
            icon={<Archive20Regular />}
            onClick={() => handleAction('archive')}
          >
            Archive
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<Delete20Regular />}
            onClick={() => handleAction('delete')}
            style={{ color: 'var(--colorPaletteRedForeground1)' }}
          >
            Delete
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
