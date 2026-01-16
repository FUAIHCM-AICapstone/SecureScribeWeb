'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    Button,
} from '@/lib/components';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
    title: string;
    itemName: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onOpenChange,
    onConfirm,
    isDeleting,
    title,
    itemName,
}: DeleteConfirmationModalProps) {
    const t = useTranslations('Common');

    const handleOpenChange = (event: any, data: { open: boolean }) => {
        onOpenChange(data.open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogSurface>
                <DialogTitle>{title}</DialogTitle>
                <DialogBody>
                    {t('deleteConfirmMessage', { name: itemName })}
                </DialogBody>
                <DialogActions>
                    <Button
                        appearance="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                    >
                        {t('cancel')}
                    </Button>
                    <Button
                        appearance="primary"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        style={{ backgroundColor: 'var(--colorPaletteRedBackground3)' }}
                    >
                        {isDeleting ? t('deleting') : t('delete')}
                    </Button>
                </DialogActions>
            </DialogSurface>
        </Dialog>
    );
}