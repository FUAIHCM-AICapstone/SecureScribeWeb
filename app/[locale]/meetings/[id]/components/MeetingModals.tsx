'use client';

import { DeleteConfirmationModal } from '@/components/modal/DeleteConfirmationModal';
import { NoteModal } from '@/components/modal/NoteModal';
import { AudioUploadModal } from '@/components/modal/AudioUploadModal';

interface MeetingModalsProps {
    // Note Modal
    showNoteModal: boolean;
    noteModalMode: 'create' | 'edit';
    customNotePrompt: string;
    noteContent: string;
    isCreatingNote: boolean;
    isUpdatingNote: boolean;
    onNoteModalOpenChange: (open: boolean) => void;
    onCustomPromptChange: (value: string) => void;
    onNoteContentChange: (value: string) => void;
    onSaveNote: () => void;

    // Upload Modal
    showUploadModal: boolean;
    uploadedFile: File | null;
    isUploadingAudio: boolean;
    onUploadModalOpenChange: (open: boolean) => void;
    onUploadedFileChange: (file: File | null) => void;
    onFileUpload: (file: File) => void;

    // Delete Confirmation Modal - Audio/Transcript
    showDeleteConfirm: boolean;
    deleteTarget: { type: 'audio' | 'transcript'; id: string } | null;
    isDeletingAudio: boolean;
    isDeletingTranscript: boolean;
    onDeleteConfirmOpenChange: (open: boolean) => void;
    onConfirmDelete: () => void;
    deleteTitle: string;
    deleteItemName: string;

    // Delete Meeting Modal
    showDeleteModal: boolean;
    isDeleting: boolean;
    onDeleteModalOpenChange: (open: boolean) => void;
    onConfirmMeetingDelete: () => void;
    meetingDeleteTitle: string;
    meetingDeleteItemName: string;
}

export function MeetingModals({
    // Note Modal
    showNoteModal,
    noteModalMode,
    customNotePrompt,
    noteContent,
    isCreatingNote,
    isUpdatingNote,
    onNoteModalOpenChange,
    onCustomPromptChange,
    onNoteContentChange,
    onSaveNote,

    // Upload Modal
    showUploadModal,
    uploadedFile,
    isUploadingAudio,
    onUploadModalOpenChange,
    onUploadedFileChange,
    onFileUpload,

    // Delete Confirmation Modal - Audio/Transcript
    showDeleteConfirm,
    deleteTarget,
    isDeletingAudio,
    isDeletingTranscript,
    onDeleteConfirmOpenChange,
    onConfirmDelete,
    deleteTitle,
    deleteItemName,

    // Delete Meeting Modal
    showDeleteModal,
    isDeleting,
    onDeleteModalOpenChange,
    onConfirmMeetingDelete,
    meetingDeleteTitle,
    meetingDeleteItemName,
}: MeetingModalsProps) {
    return (
        <>
            {/* Note Modal - Create/Edit */}
            <NoteModal
                isOpen={showNoteModal}
                mode={noteModalMode}
                customNotePrompt={customNotePrompt}
                noteContent={noteContent}
                isCreatingNote={isCreatingNote}
                isUpdatingNote={isUpdatingNote}
                onOpenChange={onNoteModalOpenChange}
                onCustomPromptChange={onCustomPromptChange}
                onNoteContentChange={onNoteContentChange}
                onSaveNote={onSaveNote}
            />

            {/* Upload Audio Modal */}
            <AudioUploadModal
                isOpen={showUploadModal}
                uploadedFile={uploadedFile}
                isUploadingAudio={isUploadingAudio}
                onOpenChange={onUploadModalOpenChange}
                onUploadedFileChange={onUploadedFileChange}
                onFileUpload={onFileUpload}
            />

            {/* Delete Confirmation Modal - for audio/transcript */}
            {deleteTarget && (
                <DeleteConfirmationModal
                    isOpen={showDeleteConfirm}
                    onOpenChange={onDeleteConfirmOpenChange}
                    onConfirm={onConfirmDelete}
                    isDeleting={isDeletingAudio || isDeletingTranscript}
                    title={deleteTitle}
                    itemName={deleteItemName}
                />
            )}

            {/* Delete Meeting Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onOpenChange={onDeleteModalOpenChange}
                onConfirm={onConfirmMeetingDelete}
                isDeleting={isDeleting}
                title={meetingDeleteTitle}
                itemName={meetingDeleteItemName}
            />
        </>
    );
}
