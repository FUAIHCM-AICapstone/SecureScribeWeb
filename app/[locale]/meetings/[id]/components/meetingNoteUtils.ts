'use client';

import { makeStyles, shorthands, tokens, typographyStyles } from '@fluentui/react-components';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface MarkdownSection {
    type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'listItem' | 'bold' | 'text';
    content: string;
    level?: number;
    children?: MarkdownSection[];
}

export interface ParsedMeetingNote {
    sections: MarkdownSection[];
    metadata: {
        title?: string;
        generalInfo?: Record<string, string>;
        summary?: string;
    };
    error?: string;
}

// ============================================================================
// Markdown Parsing Functions
// ============================================================================

/**
 * Parse markdown content into structured sections
 * Supports: headers (h1-h3), paragraphs, lists, bold text
 */
export function parseMarkdownNote(content: string): ParsedMeetingNote {
    if (!content || typeof content !== 'string') {
        console.warn('[Meeting Note Parser] Invalid content - empty or not string');
        return {
            sections: [],
            metadata: {},
            error: 'Invalid content',
        };
    }

    try {
        console.log('[Meeting Note Parser] Starting parse, content length:', content.length);

        const sections: MarkdownSection[] = [];
        const metadata: ParsedMeetingNote['metadata'] = {};

        // Normalize escaped newlines to actual newlines
        // Handle both \\n and actual newlines
        const normalizedContent = content.replace(/\\n/g, '\n');
        console.log('[Meeting Note Parser] After normalization, content length:', normalizedContent.length);

        // Split by lines, preserving empty lines for paragraph breaks
        const lines = normalizedContent.split('\n');

        let i = 0;
        while (i < lines.length) {
            const line = lines[i].trim();

            // Skip empty lines
            if (!line) {
                i++;
                continue;
            }

            // Parse H1
            if (line.match(/^# /)) {
                const heading = line.replace(/^# /, '').trim();
                metadata.title = heading;
                sections.push({
                    type: 'heading1',
                    content: heading,
                    level: 1,
                });
                console.log('[Meeting Note Parser] Parsed H1:', heading);
                i++;
                continue;
            }

            // Parse H2
            if (line.match(/^## /)) {
                const heading = line.replace(/^## /, '').trim();
                sections.push({
                    type: 'heading2',
                    content: heading,
                    level: 2,
                });
                console.log('[Meeting Note Parser] Parsed H2:', heading);
                i++;
                continue;
            }

            // Parse H3
            if (line.match(/^### /)) {
                const heading = line.replace(/^### /, '').trim();
                sections.push({
                    type: 'heading3',
                    content: heading,
                    level: 3,
                });
                console.log('[Meeting Note Parser] Parsed H3:', heading);
                i++;
                continue;
            }

            // Parse list items (starting with -, *, +, or numbered)
            if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
                const listItems: MarkdownSection[] = [];

                while (i < lines.length) {
                    const listLine = lines[i].trim();

                    if (!listLine || (!listLine.match(/^[-*+]\s/) && !listLine.match(/^\d+\.\s/))) {
                        break;
                    }

                    // Remove list marker
                    const itemContent = listLine.replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, '').trim();

                    // Parse inline formatting (bold, italic)
                    const parsed = parseInlineFormatting(itemContent);

                    listItems.push({
                        type: 'listItem',
                        content: itemContent,
                        children: parsed,
                    });

                    console.log('[Meeting Note Parser] Parsed list item:', itemContent.substring(0, 50));
                    i++;
                }

                if (listItems.length > 0) {
                    sections.push({
                        type: 'list',
                        content: '',
                        children: listItems,
                    });
                }
                continue;
            }

            // Parse paragraphs
            if (line) {
                const parsed = parseInlineFormatting(line);
                sections.push({
                    type: 'paragraph',
                    content: line,
                    children: parsed,
                });
                console.log('[Meeting Note Parser] Parsed paragraph:', line.substring(0, 50));
                i++;
                continue;
            }

            i++;
        }

        console.log('[Meeting Note Parser] Parse complete - Total sections:', sections.length);
        return { sections, metadata };
    } catch (err) {
        console.error('[Meeting Note Parser] Parse error:', err);
        return {
            sections: [],
            metadata: {},
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
    // Headings
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

    // Paragraphs
    paragraph: {
        ...typographyStyles.body1,
        color: tokens.colorNeutralForeground1,
        marginBottom: '12px',
        lineHeight: '1.6',
        textAlign: 'justify',
    },

    // Lists
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

    // Inline formatting
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

    // Section container
    section: {
        ...shorthands.padding('16px'),
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
        marginBottom: '12px',
        borderLeftStyle: 'solid',
        borderLeftWidth: '4px',
        borderLeftColor: tokens.colorBrandForeground1,
    },

    // Metadata info
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
});
