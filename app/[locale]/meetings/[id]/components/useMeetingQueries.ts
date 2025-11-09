'use client';

import { queryKeys } from '@/lib/queryClient';
import { getMeetingAudioFiles } from '@/services/api/audio';
import { getMeeting } from '@/services/api/meeting';
import { getMeetingNote } from '@/services/api/meetingNote';
import { getTranscriptsByMeeting } from '@/services/api/transcript';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import type { AudioFileResponse } from 'types/audio_file.type';
import type { MeetingWithProjects } from 'types/meeting.type';
import type { MeetingNoteResponse } from 'types/meeting_note.type';
import type { TranscriptResponse } from 'types/transcript.type';

export const useMeetingQueries = (meetingId: string) => {
    const [audioFiles, setAudioFiles] = React.useState<AudioFileResponse[]>([]);
    const [transcripts, setTranscripts] = React.useState<TranscriptResponse[]>([]);
    const [meetingNote, setMeetingNote] = React.useState<MeetingNoteResponse | null>(null);
    const [audioError, setAudioError] = React.useState<string | null>(null);
    const [transcriptError, setTranscriptError] = React.useState<string | null>(null);
    const [noteError, setNoteError] = React.useState<string | null>(null);

    // Query: Fetch meeting data
    const meeting = useQuery<MeetingWithProjects>({
        queryKey: queryKeys.meeting(meetingId),
        queryFn: () => getMeeting(meetingId),
    });

    // Query: Fetch audio files for the meeting
    const audioQuery = useQuery({
        queryKey: ['audioFiles', meetingId],
        queryFn: async () => {
            try {
                setAudioError(null);
                const files = await getMeetingAudioFiles(meetingId);
                setAudioFiles(files);
                return files;
            } catch (error: any) {
                const errorMsg = error?.response?.data?.detail || 'Failed to load audio files';
                setAudioError(errorMsg);
                throw error;
            }
        },
        enabled: !!meetingId,
    });

    // Query: Fetch transcripts for the meeting
    const transcriptQuery = useQuery({
        queryKey: ['transcripts', meetingId],
        queryFn: async () => {
            try {
                setTranscriptError(null);
                const transcriptList = await getTranscriptsByMeeting(meetingId);
                setTranscripts(transcriptList);
                return transcriptList;
            } catch (error: any) {
                const errorMsg = error?.response?.data?.detail || 'Failed to load transcripts';
                setTranscriptError(errorMsg);
                throw error;
            }
        },
        enabled: !!meetingId,
    });

    // Query: Fetch meeting note
    const noteQuery = useQuery({
        queryKey: ['meetingNote', meetingId],
        queryFn: async () => {
            try {
                setNoteError(null);
                const note = await getMeetingNote(meetingId);
                setMeetingNote(note);
                return note;
            } catch (error: any) {
                // Note might not exist, so we don't show error for 404
                if (error?.response?.status !== 404) {
                    const errorMsg = error?.response?.data?.detail || 'Failed to load meeting note';
                    setNoteError(errorMsg);
                }
                return null;
            }
        },
        enabled: !!meetingId,
    });

    return {
        meeting: meeting.data,
        isLoadingMeeting: meeting.isLoading,
        isErrorMeeting: meeting.isError,

        audioFiles,
        isLoadingAudio: audioQuery.isLoading,
        audioError,

        transcripts,
        isLoadingTranscripts: transcriptQuery.isLoading,
        transcriptError,

        meetingNote,
        isLoadingNote: noteQuery.isLoading,
        noteError,
    };
};
