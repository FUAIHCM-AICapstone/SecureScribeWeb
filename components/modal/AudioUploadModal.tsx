'use client';

import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    Button,
    Spinner,
    Text,
    Caption1,
    makeStyles,
    tokens,
    shorthands,
} from '@fluentui/react-components';
import { ArrowUpload24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { showToast } from '@/hooks/useShowToast';

const useStyles = makeStyles({
    dialog: {
        minWidth: '500px',
        '@media (max-width: 768px)': {
            minWidth: '100%',
        },
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap(tokens.spacingVerticalL),
        padding: tokens.spacingVerticalM,
    },
    uploadArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        ...shorthands.padding('40px', '24px'),
        ...shorthands.border('2px', 'dashed', tokens.colorNeutralStroke1),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        backgroundColor: tokens.colorNeutralBackground2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        ':hover': {
            backgroundColor: tokens.colorNeutralBackground2Hover,
            ...shorthands.borderColor(tokens.colorBrandStroke1),
        },
    },
    uploadAreaActive: {
        backgroundColor: tokens.colorBrandBackground2,
        ...shorthands.borderColor(tokens.colorBrandStroke1),
    },
    uploadIcon: {
        fontSize: '48px',
        color: tokens.colorBrandForeground1,
        marginBottom: tokens.spacingVerticalS,
    },
    uploadText: {
        fontSize: '16px',
        fontWeight: 600,
        color: tokens.colorNeutralForeground1,
        marginBottom: tokens.spacingVerticalXS,
    },
    uploadHint: {
        fontSize: '12px',
        color: tokens.colorNeutralForeground3,
        textAlign: 'center',
    },
    fileInfo: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingHorizontalM),
        ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        backgroundColor: tokens.colorNeutralBackground1,
    },
    fileDetails: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.gap('4px'),
    },
    fileName: {
        fontSize: '14px',
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        color: tokens.colorNeutralForeground1,
    },
    fileSize: {
        fontSize: '12px',
        color: tokens.colorNeutralForeground3,
    },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingVerticalM),
        ...shorthands.padding(tokens.spacingVerticalL),
    },
    progressText: {
        fontSize: '14px',
        color: tokens.colorNeutralForeground1,
    },
    removeButton: {
        minWidth: 'auto',
    },
    hiddenInput: {
        display: 'none',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        ...shorthands.gap(tokens.spacingHorizontalS),
        padding: tokens.spacingVerticalM,
        borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    },
});

interface AudioUploadModalProps {
    isOpen: boolean;
    uploadedFile: File | null;
    isUploadingAudio: boolean;
    onOpenChange: (open: boolean) => void;
    onUploadedFileChange: (file: File | null) => void;
    onFileUpload: (file: File) => void;
}

const ACCEPTED_AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/mp4'];
const ACCEPTED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.webm', '.m4a'];

export function AudioUploadModal({
    isOpen,
    uploadedFile,
    isUploadingAudio,
    onOpenChange,
    onUploadedFileChange,
    onFileUpload,
}: AudioUploadModalProps) {
    const styles = useStyles();
    const t = useTranslations('MeetingDetail');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const validateAudioFile = (file: File): boolean => {
        // Check file type
        if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
            showToast('error', t('invalidAudioFormat') || 'Invalid audio format. Please upload MP3, WAV, WEBM, or M4A.');
            return false;
        }

        // Check file extension
        const fileName = file.name.toLowerCase();
        const isValidExtension = ACCEPTED_AUDIO_EXTENSIONS.some(ext =>
            fileName.endsWith(ext)
        );

        if (!isValidExtension) {
            showToast('error', t('invalidAudioExtension') || 'Invalid file extension. Please upload MP3, WAV, WEBM, or M4A.');
            return false;
        }

        return true;
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const handleFileSelect = (file: File) => {
        if (validateAudioFile(file)) {
            onUploadedFileChange(file);
            onFileUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleUploadAreaClick = () => {
        fileInputRef.current?.click();
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleRemoveFile = () => {
        onUploadedFileChange(null);
    };

    const handleOpenChange = (event: any, data: { open: boolean }) => {
        onOpenChange(data.open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogSurface className={styles.dialog}>
                <DialogTitle>{t('uploadAudio') || 'Upload Audio'}</DialogTitle>
                <DialogBody className={styles.content}>
                    {!uploadedFile || isUploadingAudio ? (
                        <>
                            <div
                                className={`${styles.uploadArea} ${isDragging ? styles.uploadAreaActive : ''
                                    }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={handleUploadAreaClick}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleUploadAreaClick();
                                    }
                                }}
                            >
                                <ArrowUpload24Regular className={styles.uploadIcon} />
                                <Text className={styles.uploadText}>
                                    {t('dragDropAudio') || 'Drag and drop your audio file here'}
                                </Text>
                                <Caption1 className={styles.uploadHint}>
                                    {t('supportedFormats') || 'Supported formats: MP3, WAV, WEBM, M4A'}
                                </Caption1>
                            </div>

                            {isUploadingAudio && (
                                <div className={styles.progressContainer}>
                                    <Spinner label={t('uploading') || 'Uploading...'} />
                                    <Text className={styles.progressText}>
                                        {t('processingAudio') || 'Processing your audio file...'}
                                    </Text>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.fileInfo}>
                            <div className={styles.fileDetails}>
                                <div className={styles.fileName}>{uploadedFile.name}</div>
                                <div className={styles.fileSize}>
                                    {formatFileSize(uploadedFile.size)}
                                </div>
                            </div>
                            <Button
                                icon={<Dismiss24Regular />}
                                appearance="subtle"
                                onClick={handleRemoveFile}
                                disabled={isUploadingAudio}
                                className={styles.removeButton}
                            />
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_AUDIO_EXTENSIONS.join(',')}
                        onChange={handleFileInputChange}
                        className={styles.hiddenInput}
                        aria-label="Upload audio file"
                    />
                </DialogBody>
                <DialogActions className={styles.actions}>
                    <Button
                        appearance="secondary"
                        onClick={handleClose}
                        disabled={isUploadingAudio}
                    >
                        {t('close') || 'Close'}
                    </Button>
                </DialogActions>
            </DialogSurface>
        </Dialog>
    );
}
