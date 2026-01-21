'use client';

import { makeStyles, shorthands, tokens, typographyStyles } from '@/lib/components';
import { lazy, Suspense } from 'react';
import remarkGfm from 'remark-gfm';

const ReactMarkdown = lazy(() => import('react-markdown'));

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface MarkdownSection {
    type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'listItem' | 'bold' | 'text' | 'table' | 'tableRow' | 'tableCell';
    content: string;
    level?: number;
    children?: MarkdownSection[];
    isHeader?: boolean;
}

export interface ParsedMeetingNote {
    sections: MarkdownSection[];
    metadata: {
        title?: string;
        generalInfo?: Record<string, string>;
        summary?: string;
    };
    error?: string;
    rawContent?: string;
}

// ============================================================================
// Markdown Parsing Functions
// ============================================================================

/**
 * Parse markdown content into structured sections
 * Supports: headers (h1-h3), paragraphs, lists, bold text, tables
 * Note: For tables, we store raw markdown and rely on react-markdown + remarkGfm for rendering
 */
export function parseMarkdownNote(content: string): ParsedMeetingNote {
    if (!content || typeof content !== 'string') {
        console.warn('[Meeting Note Parser] Invalid content - empty or not string');
        return {
            sections: [],
            metadata: {},
            rawContent: '',
            error: 'Invalid content',
        };
    }

    try {
        const sections: MarkdownSection[] = [];
        const metadata: ParsedMeetingNote['metadata'] = {};

        // Normalize escaped newlines to actual newlines
        const normalizedContent = content.replace(/\\n/g, '\n');

        // Extract title from first H1
        const titleMatch = normalizedContent.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1].trim();
        }

        // For simple parsing, just split into basic sections
        const lines = normalizedContent.split('\n');
        let currentParagraph = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Headings
            if (trimmed.match(/^#+\s+/)) {
                if (currentParagraph.trim()) {
                    sections.push({
                        type: 'paragraph',
                        content: currentParagraph.trim(),
                        children: parseInlineFormatting(currentParagraph.trim()),
                    });
                    currentParagraph = '';
                }

                const level = trimmed.match(/^#+/)?.[0].length ?? 1;
                const headingContent = trimmed.replace(/^#+\s+/, '').trim();
                sections.push({
                    type: (level === 1 ? 'heading1' : level === 2 ? 'heading2' : 'heading3') as any,
                    content: headingContent,
                    level,
                });
                continue;
            }

            // List items
            if (trimmed.match(/^[-*+]\s/) || trimmed.match(/^\d+\.\s/)) {
                if (currentParagraph.trim()) {
                    sections.push({
                        type: 'paragraph',
                        content: currentParagraph.trim(),
                        children: parseInlineFormatting(currentParagraph.trim()),
                    });
                    currentParagraph = '';
                }

                const itemContent = trimmed.replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, '').trim();
                sections.push({
                    type: 'listItem',
                    content: itemContent,
                    children: parseInlineFormatting(itemContent),
                });
                continue;
            }

            // Tables - just skip and let react-markdown handle
            if (trimmed.match(/^\|.+\|$/)) {
                if (currentParagraph.trim()) {
                    sections.push({
                        type: 'paragraph',
                        content: currentParagraph.trim(),
                        children: parseInlineFormatting(currentParagraph.trim()),
                    });
                    currentParagraph = '';
                }
                // Add placeholder for table
                sections.push({
                    type: 'table',
                    content: '[Table - rendered by markdown]',
                });
                continue;
            }

            // Paragraphs
            if (trimmed) {
                currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
            } else if (currentParagraph.trim()) {
                sections.push({
                    type: 'paragraph',
                    content: currentParagraph.trim(),
                    children: parseInlineFormatting(currentParagraph.trim()),
                });
                currentParagraph = '';
            }
        }

        // Add remaining paragraph
        if (currentParagraph.trim()) {
            sections.push({
                type: 'paragraph',
                content: currentParagraph.trim(),
                children: parseInlineFormatting(currentParagraph.trim()),
            });
        }

        return { 
            sections, 
            metadata,
            rawContent: normalizedContent,
        };
    } catch (err) {
        console.error('[Meeting Note Parser] Parse error:', err);
        return {
            sections: [],
            metadata: {},
            rawContent: content,
            error: 'Failed to parse markdown note',
        };
    }
}

/**
 * Parse inline formatting: **bold**, *italic*, `code`
 */
function parseInlineFormatting(content: string): MarkdownSection[] {
    const sections: MarkdownSection[] = [];
    const boldPattern = /\*\*(.+?)\*\*/g;

    let lastIndex = 0;
    let match;

    // Find all bold text
    const boldMatches: Array<{ start: number; end: number; content: string }> = [];
    while ((match = boldPattern.exec(content)) !== null) {
        boldMatches.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[1],
        });
    }

    // Build sections with bold and regular text
    if (boldMatches.length === 0) {
        sections.push({
            type: 'text',
            content,
        });
    } else {
        for (const bold of boldMatches) {
            if (lastIndex < bold.start) {
                sections.push({
                    type: 'text',
                    content: content.substring(lastIndex, bold.start),
                });
            }
            sections.push({
                type: 'bold',
                content: bold.content,
            });
            lastIndex = bold.end;
        }
        if (lastIndex < content.length) {
            sections.push({
                type: 'text',
                content: content.substring(lastIndex),
            });
        }
    }

    return sections;
}

// ============================================================================
// Heading Size Configuration
// ============================================================================

export type HeadingSize = 'small' | 'medium' | 'large';

export const HEADING_SIZE_CONFIG: Record<HeadingSize, Record<'h1' | 'h2' | 'h3', any>> = {
    small: {
        h1: typographyStyles.title3,
        h2: typographyStyles.subtitle1,
        h3: typographyStyles.subtitle2,
    },
    medium: {
        h1: typographyStyles.title2,
        h2: typographyStyles.title3,
        h3: typographyStyles.subtitle1,
    },
    large: {
        h1: typographyStyles.title1,
        h2: typographyStyles.title2,
        h3: typographyStyles.title3,
    },
};

// ============================================================================
// Fluent UI Styles for Markdown Elements
// ============================================================================

export const useMeetingNoteStyles = makeStyles({
    heading1: {
        ...typographyStyles.title2,
        color: tokens.colorBrandForeground1,
        marginTop: '20px',
        marginBottom: '14px',
        paddingBottom: '10px',
        borderBottomStyle: 'solid',
        borderBottomWidth: '2px',
        borderBottomColor: tokens.colorBrandForeground1,
    },

    heading2: {
        ...typographyStyles.title3,
        color: tokens.colorBrandForeground1,
        marginTop: '16px',
        marginBottom: '10px',
        paddingBottom: '6px',
        borderBottomStyle: 'solid',
        borderBottomWidth: '1px',
        borderBottomColor: tokens.colorBrandForeground2,
    },

    heading3: {
        ...typographyStyles.subtitle1,
        color: tokens.colorBrandForeground2,
        marginTop: '12px',
        marginBottom: '6px',
        fontWeight: 600,
    },

    paragraph: {
        ...typographyStyles.body1,
        color: tokens.colorNeutralForeground1,
        marginBottom: '12px',
        lineHeight: '1.6',
        textAlign: 'justify',
    },

    list: {
        marginBottom: '16px',
        marginLeft: '24px',
    },

    listItem: {
        ...typographyStyles.body1,
        color: tokens.colorNeutralForeground1,
        marginBottom: '8px',
        lineHeight: '1.5',
    },

    bold: {
        fontWeight: 600,
        color: tokens.colorBrandForeground1,
    },

    italic: {
        fontStyle: 'italic',
        color: tokens.colorNeutralForeground2,
    },

    code: {
        fontFamily: 'monospace',
        backgroundColor: tokens.colorNeutralBackground3,
        color: tokens.colorBrandForeground1,
        paddingLeft: '4px',
        paddingRight: '4px',
        borderRadius: tokens.borderRadiusSmall,
    },

    section: {
        ...shorthands.padding('16px'),
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
        marginBottom: '12px',
        borderLeftStyle: 'solid',
        borderLeftWidth: '4px',
        borderLeftColor: tokens.colorBrandForeground1,
    },

    metadataLabel: {
        fontWeight: 600,
        color: tokens.colorBrandForeground1,
        marginRight: '8px',
        minWidth: '120px',
    },

    metadataValue: {
        color: tokens.colorNeutralForeground1,
    },

    metadataRow: {
        display: 'flex',
        marginBottom: '8px',
        lineHeight: '1.5',
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '16px',
        overflow: 'hidden',
    },

    tableRow: {
        display: 'table-row',
        borderBottomWidth: '1px',
        borderBottomColor: tokens.colorNeutralStroke1,
    },

    tableRowHeader: {
        backgroundColor: tokens.colorBrandBackground2,
    },

    tableCell: {
        ...typographyStyles.body1,
        padding: '12px 16px',
        textAlign: 'left',
        color: tokens.colorNeutralForeground1,
        borderRightWidth: '1px',
        borderRightColor: tokens.colorNeutralStroke1,
        borderBottomWidth: '1px',
        borderBottomColor: tokens.colorNeutralStroke1,
    },

    tableCellHeader: {
        fontWeight: 600,
        color: tokens.colorBrandForeground1,
        backgroundColor: tokens.colorBrandBackground2,
    },
});

// ============================================================================
// Render Component (using react-markdown like ChatMessages.tsx)
// ============================================================================

/**
 * Render meeting notes with markdown support including tables
 * Uses react-markdown + remarkGfm for proper table rendering
 */
export function MeetingNoteContent({ content }: { content: string }) {
    if (!content) return null;

    const normalizedContent = content.replace(/\\n/g, '\n');

    return (
        <Suspense fallback={<div style={{ color: tokens.colorNeutralForeground3 }}>Loading...</div>}>
            <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: (props: any) => {
                            const { children, ...rest } = props;
                            return (
                                <h1 style={{ marginTop: '20px', marginBottom: '14px', paddingBottom: '10px', borderBottom: `2px solid ${tokens.colorBrandForeground1}`, fontSize: '24px', fontWeight: 'bold', color: tokens.colorBrandForeground1 }} {...rest}>
                                    {children}
                                </h1>
                            );
                        },
                        h2: (props: any) => {
                            const { children, ...rest } = props;
                            return (
                                <h2 style={{ marginTop: '16px', marginBottom: '10px', paddingBottom: '6px', borderBottom: `1px solid ${tokens.colorBrandForeground2}`, fontSize: '20px', fontWeight: 'bold', color: tokens.colorBrandForeground1 }} {...rest}>
                                    {children}
                                </h2>
                            );
                        },
                        h3: (props: any) => {
                            const { children, ...rest } = props;
                            return (
                                <h3 style={{ marginTop: '12px', marginBottom: '6px', fontSize: '16px', fontWeight: 600, color: tokens.colorBrandForeground2 }} {...rest}>
                                    {children}
                                </h3>
                            );
                        },
                        p: (props: any) => (
                            <p style={{ marginBottom: '12px', lineHeight: '1.6', color: tokens.colorNeutralForeground1, textAlign: 'justify' }} {...props} />
                        ),
                        ul: (props: any) => (
                            <ul style={{ marginBottom: '16px', marginLeft: '24px', color: tokens.colorNeutralForeground1 }} {...props} />
                        ),
                        ol: (props: any) => (
                            <ol style={{ marginBottom: '16px', marginLeft: '24px', color: tokens.colorNeutralForeground1 }} {...props} />
                        ),
                        li: (props: any) => (
                            <li style={{ marginBottom: '8px', lineHeight: '1.5', color: tokens.colorNeutralForeground1 }} {...props} />
                        ),
                        strong: (props: any) => (
                            <strong style={{ fontWeight: 600, color: tokens.colorBrandForeground1 }} {...props} />
                        ),
                        table: (props: any) => (
                            <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', border: `1px solid ${tokens.colorNeutralStroke1}` }} {...props} />
                            </div>
                        ),
                        thead: (props: any) => (
                            <thead {...props} />
                        ),
                        tbody: (props: any) => (
                            <tbody {...props} />
                        ),
                        tr: (props: any) => (
                            <tr style={{ borderBottom: `1px solid ${tokens.colorNeutralStroke1}` }} {...props} />
                        ),
                        th: (props: any) => (
                            <th style={{ padding: '12px 16px', textAlign: 'left', border: `1px solid ${tokens.colorNeutralStroke1}`, color: tokens.colorBrandForeground1, fontWeight: 600, backgroundColor: tokens.colorBrandBackground2 }} {...props} />
                        ),
                        td: (props: any) => (
                            <td style={{ padding: '12px 16px', textAlign: 'left', border: `1px solid ${tokens.colorNeutralStroke1}`, color: tokens.colorNeutralForeground1 }} {...props} />
                        ),
                    }}
                >
                    {normalizedContent}
                </ReactMarkdown>
            </div>
        </Suspense>
    );
}
