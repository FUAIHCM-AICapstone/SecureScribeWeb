'use client';

import { makeStyles, shorthands, tokens } from '@fluentui/react-components';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface SpeakerSegment {
    speaker: string;
    startTime: string;
    endTime: string;
    content: string;
}

export interface ParseResult {
    segments: SpeakerSegment[];
    error?: string;
}

// ============================================================================
// Parsing Functions
// ============================================================================

/**
 * Parse transcript content in format: SPEAKER_XX [start - end]: content
 * Returns structured segments with error handling
 */
export function parseTranscriptContent(content: string): ParseResult {
    if (!content || typeof content !== 'string') {
        console.warn('[Transcript Parser] Invalid content - empty or not string');
        return { segments: [], error: 'Invalid content' };
    }

    try {

        // Pattern: SPEAKER_XX [start - end]: content
        // Matches both single and multiple segments (newline-separated or end-of-string)
        const speakerPattern = /(\w+)\s+\[(\d+\.?\d*s)\s*-\s*(\d+\.?\d*s)\]\s*:\s*(.+?)(?=\n\w+\s+\[|\s*$)/gm;
        const segments: SpeakerSegment[] = [];

        let match;
        while ((match = speakerPattern.exec(content)) !== null) {
            const segment: SpeakerSegment = {
                speaker: match[1],
                startTime: match[2],
                endTime: match[3],
                content: match[4].trim(),
            };
            segments.push(segment);
        }

        return { segments };
    } catch (err) {
        console.error('[Transcript Parser] Parse error:', err);
        return {
            segments: [],
            error: 'Failed to parse transcript',
        };
    }
}

/**
 * Format speaker label from SPEAKER_00 to "Speaker 00"
 */
export function formatSpeakerLabel(speaker: string): string {
    if (!speaker) return 'Unknown Speaker';
    return speaker
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ============================================================================
// Styles for Speaker Segments
// ============================================================================

export const useSpeakerSegmentStyles = makeStyles({
    speakerSegment: {
        ...shorthands.padding('12px'),
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        marginBottom: '12px',
        ...shorthands.borderLeft('4px', 'solid', tokens.colorBrandForeground1),
    },
    speakerLabel: {
        fontWeight: 600,
        color: tokens.colorBrandForeground1,
        fontSize: tokens.fontSizeBase300,
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('8px'),
    },
    speakerTimestamp: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        fontFamily: 'monospace',
    },
    speakerContent: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
        lineHeight: '1.5',
        marginTop: '8px',
    },
});


