'use client';

import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@/lib/components';
import {
  MoreVertical20Regular,
  Play20Regular,
  History20Regular,
  Delete20Regular,
} from '@/lib/icons';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('Bots');
  const [isOpen, setIsOpen] = useState(false);

  const canRetry = status === 'failed';

  return (
    <Menu open={isOpen} onOpenChange={(e, data) => setIsOpen(data.open)}>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={<MoreVertical20Regular />}
          aria-label={t('actions')}
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
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
        </MenuList>
      </MenuPopover>
    </Menu>
  );
}
