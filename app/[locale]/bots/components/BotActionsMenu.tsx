'use client';

import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuPopover,
  MenuTrigger,
  makeStyles,
} from '@fluentui/react-components';
import {
  MoreVertical20Regular,
  Play20Regular,
  History20Regular,
  Delete20Regular,
} from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

interface BotActionsMenuProps {
  botId: string;
  status: string;
  onStatusChange?: (botId: string, status: string) => void;
  onDelete?: (botId: string) => void;
  onViewLogs?: (botId: string) => void;
}

export function BotActionsMenu({
  botId,
  status,
  onStatusChange,
  onDelete,
  onViewLogs,
}: BotActionsMenuProps) {
  const styles = useStyles();
  const t = useTranslations('Bots');
  const [isOpen, setIsOpen] = useState(false);

  const canRetry = status === 'failed';

  return (
    <div className={styles.container}>
      <Menu
        open={isOpen}
        onOpenChange={(e, data) => setIsOpen(data.open)}
      >
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            icon={<MoreVertical20Regular />}
            title="Actions"
          />
        </MenuTrigger>
        <MenuPopover>
          {canRetry && (
            <MenuItem
              icon={<Play20Regular />}
              onClick={() => {
                onStatusChange?.(botId, 'scheduled');
                setIsOpen(false);
              }}
            >
              {t('retryBot')}
            </MenuItem>
          )}
          <MenuItem
            icon={<History20Regular />}
            onClick={() => {
              onViewLogs?.(botId);
              setIsOpen(false);
            }}
          >
            {t('viewLogs')}
          </MenuItem>
          <MenuItem
            icon={<Delete20Regular />}
            onClick={() => {
              onDelete?.(botId);
              setIsOpen(false);
            }}
          >
            {t('deleteBot')}
          </MenuItem>
        </MenuPopover>
      </Menu>
    </div>
  );
}
