'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Button,
  makeStyles,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Text,
} from '@fluentui/react-components';
import {
  MoreVertical20Regular,
  Eye20Regular,
  Edit20Regular,
  Delete20Regular,
} from '@fluentui/react-icons';
import type { TaskResponse } from 'types/task.type';
import { showToast } from '@/hooks/useShowToast';
import { deleteTask } from '@/services/api/task';
import { queryKeys } from '@/lib/queryClient';
import { CreateTaskModal } from './CreateTaskModal';
import { TaskDetailsModal } from './TaskDetailsModal';

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
  const tCommon = useTranslations('Common');
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState<TaskResponse>(task);

  useEffect(() => {
    setEditTaskData(task);
  }, [task]);

  type MenuInteractionEvent =
    | React.MouseEvent<HTMLElement>
    | React.KeyboardEvent<HTMLElement>;

  const deleteTaskMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.myTasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.task(task.id) });
      showToast('success', t('deleteTask.deleteSuccess'));
      setIsDeleteOpen(false);
      setIsDetailsOpen(false);
    },
    onError: (error: unknown) => {
      const apiMessage =
        typeof (error as { message?: string })?.message === 'string'
          ? (error as { message?: string }).message
          : undefined;
      showToast('error', apiMessage || t('deleteTask.deleteError'));
    },
  });

  const handleView = (event: MenuInteractionEvent) => {
    event.stopPropagation();
    setIsDetailsOpen(true);
  };

  const handleEdit = (event: MenuInteractionEvent) => {
    event.stopPropagation();
    setEditTaskData(task);
    setIsEditOpen(true);
  };

  const handleDelete = (event: MenuInteractionEvent) => {
    event.stopPropagation();
    setIsDeleteOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleCloseDelete = () => {
    if (!deleteTaskMutation.isPending) {
      setIsDeleteOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    deleteTaskMutation.mutate();
  };

  return (
    <>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Button
            appearance="subtle"
            icon={<MoreVertical20Regular />}
            aria-label={t('actions.label')}
            className={styles.menuButton}
            onClick={(event) => event.stopPropagation()}
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

      <TaskDetailsModal
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        taskId={task.id}
        initialTask={task}
        onEdit={(latestTask) => {
          setEditTaskData(latestTask);
          setIsDetailsOpen(false);
          setIsEditOpen(true);
        }}
      />

      <CreateTaskModal
        open={isEditOpen}
        onClose={handleCloseEdit}
        mode="edit"
        taskId={task.id}
        initialTask={editTaskData}
      />

      <Dialog
        open={isDeleteOpen}
        onOpenChange={(_, data) => {
          if (data.open) {
            setIsDeleteOpen(true);
            return;
          }

          handleCloseDelete();
        }}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{t('actions.delete')}</DialogTitle>
            <DialogContent>
              <Text>
                {t('deleteTask.confirmMessage')}
              </Text>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={handleCloseDelete}>
                {t('createTaskModal.cancel')}
              </Button>
              <Button
                appearance="primary"
                onClick={handleConfirmDelete}
                disabled={deleteTaskMutation.isPending}
              >
                {deleteTaskMutation.isPending ? tCommon('deleting') : t('actions.delete')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}
