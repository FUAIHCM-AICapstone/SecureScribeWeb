'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Button,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  makeStyles,
} from '@fluentui/react-components';
import {
  MoreVertical20Regular,
  Eye20Regular,
  Edit20Regular,
  Archive20Regular,
  ArchiveArrowBack20Regular,
  Delete20Regular,
} from '@fluentui/react-icons';
import type { ProjectResponse } from 'types/project.type';

const useStyles = makeStyles({
  menuButton: {
    minWidth: 'auto',
  },
});

interface ProjectActionsMenuProps {
  project: ProjectResponse;
}

export function ProjectActionsMenu({ project }: ProjectActionsMenuProps) {
  const styles = useStyles();
  const router = useRouter();
  const t = useTranslations('Projects');

  const handleViewDetails = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit project:', project.id);
  };

  const handleArchive = () => {
    // TODO: Implement archive functionality
    console.log('Archive project:', project.id);
  };

  const handleUnarchive = () => {
    // TODO: Implement unarchive functionality
    console.log('Unarchive project:', project.id);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete project:', project.id);
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<MoreVertical20Regular />}
          aria-label={t('actions.label')}
          className={styles.menuButton}
        />
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuItem icon={<Eye20Regular />} onClick={handleViewDetails}>
            {t('actions.view')}
          </MenuItem>
          <MenuItem icon={<Edit20Regular />} onClick={handleEdit}>
            {t('actions.edit')}
          </MenuItem>
          {project.is_archived ? (
            <MenuItem
              icon={<ArchiveArrowBack20Regular />}
              onClick={handleUnarchive}
            >
              {t('actions.unarchive')}
            </MenuItem>
          ) : (
            <MenuItem icon={<Archive20Regular />} onClick={handleArchive}>
              {t('actions.archive')}
            </MenuItem>
          )}
          <MenuItem icon={<Delete20Regular />} onClick={handleDelete}>
            {t('actions.delete')}
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
