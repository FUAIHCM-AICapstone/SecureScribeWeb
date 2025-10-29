'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
  makeStyles,
} from '@fluentui/react-components';
import {
  MoreVertical20Regular,
  Eye20Regular,
  Edit20Regular,
  Delete20Regular,
} from '@fluentui/react-icons';
import type { TaskResponse } from 'types/task.type';

const useStyles = makeStyles({
  menuButton: {
    minWidth: 'auto',
  },
});

interface TaskActionsMenuProps {
  task: TaskResponse;
}

export function TaskActionsMenu({ task }: TaskActionsMenuProps) {
  const styles = useStyles();
  const t = useTranslations('Tasks');

  const handleView = () => {
    console.log('View task:', task.id);
    // TODO: Implement view action
  };

  const handleEdit = () => {
    console.log('Edit task:', task.id);
    // TODO: Implement edit action
  };

  const handleDelete = () => {
    console.log('Delete task:', task.id);
    // TODO: Implement delete action
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<MoreVertical20Regular />}
          aria-label={t('actions.label')}
          className={styles.menuButton}
          onClick={(e) => e.stopPropagation()}
        />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem icon={<Eye20Regular />} onClick={handleView}>
            {t('actions.view')}
          </MenuItem>
          <MenuItem icon={<Edit20Regular />} onClick={handleEdit}>
            {t('actions.edit')}
          </MenuItem>
          <MenuItem icon={<Delete20Regular />} onClick={handleDelete}>
            {t('actions.delete')}
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
