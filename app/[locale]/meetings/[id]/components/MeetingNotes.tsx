'use client';

import { Body1, Button, Card, Spinner, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Document20Regular, Edit20Regular } from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';
import React from 'react';
import type { MeetingNoteResponse } from 'types/meeting_note.type';
import { parseMarkdownNote, useMeetingNoteStyles, type MarkdownSection, HEADING_SIZE_CONFIG, type HeadingSize } from './meetingNoteUtils';

const useStyles = makeStyles({
    section: {
        ...shorthands.padding('28px'),
        backgroundColor: tokens.colorNeutralBackground1,
        ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
        ...shorthands.borderRadius(tokens.borderRadiusXLarge),
        boxShadow: tokens.shadow4,
        ...shorthands.transition('box-shadow', '0.2s', 'ease'),
        ':hover': {
            boxShadow: tokens.shadow8,
        },
    },
    sectionTitle: {
        marginBottom: '20px',
        paddingBottom: '16px',
        ...shorthands.borderBottom('2px', 'solid', tokens.colorNeutralStroke2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...shorthands.gap('12px'),
    },
    sectionTitleContent: {
        display: 'flex',
        alignItems: 'center',
        ...shorthands.gap('12px'),
    },
    headingSizeSelector: {
        minWidth: '80px',
    },
    sectionIcon: {
        color: tokens.colorBrandForeground2,
        opacity: 0.8,
    },
    sectionHeading: {
        fontSize: tokens.fontSizeBase400,
        fontWeight: 700,
        color: tokens.colorNeutralForeground1,
    },
    noteContent: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground1,
        lineHeight: '1.6',
        ...shorthands.padding('16px'),
        backgroundColor: tokens.colorNeutralBackground2,
        ...shorthands.borderRadius(tokens.borderRadiusMedium),
        marginBottom: '16px',
    },
    noteEmpty: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground3,
        fontStyle: 'italic',
        textAlign: 'center',
        ...shorthands.padding('24px'),
    },
    expandButton: {
        minWidth: '32px',
    },
    notePreview: {
        maxHeight: '120px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
    },
    expandedContent: {
        maxHeight: '500px',
        overflowY: 'auto',
    },
});

interface MeetingNotesProps {
    note: MeetingNoteResponse | null;
    isLoading: boolean;
    error: string | null;
    onCreateNote: () => void;
    onEditNote: () => void;
    isCreating: boolean;
    isUpdating: boolean;
}

// Component to render a single markdown section
function MarkdownSectionView({ section, headingSize = 'small' }: { section: MarkdownSection; headingSize?: HeadingSize }) {
    const noteStyles = useMeetingNoteStyles();
    const headingSizeStyles = HEADING_SIZE_CONFIG[headingSize];

    switch (section.type) {
        case 'heading1':
            return (
                <div style={{ ...headingSizeStyles.h1, color: tokens.colorBrandForeground1, marginTop: '20px', marginBottom: '14px', paddingBottom: '10px', borderBottomStyle: 'solid', borderBottomWidth: '2px', borderBottomColor: tokens.colorBrandForeground1 }}>
                    {section.content}
                </div>
            );
        case 'heading2':
            return (
                <div style={{ ...headingSizeStyles.h2, color: tokens.colorBrandForeground1, marginTop: '16px', marginBottom: '10px', paddingBottom: '6px', borderBottomStyle: 'solid', borderBottomWidth: '1px', borderBottomColor: tokens.colorBrandForeground2 }}>
                    {section.content}
                </div>
            );
        case 'heading3':
            return (
                <div style={{ ...headingSizeStyles.h3, color: tokens.colorBrandForeground2, marginTop: '12px', marginBottom: '6px', fontWeight: 600 }}>
                    {section.content}
                </div>
            );
        case 'paragraph':
            return (
                <div className={noteStyles.paragraph}>
                    {section.children && section.children.length > 0 ? (
                        <InlineContent sections={section.children} />
                    ) : (
                        section.content
                    )}
                </div>
            );
        case 'list':
            return (
                <ul className={noteStyles.list}>
                    {section.children?.map((item, idx) => (
                        <li key={idx} className={noteStyles.listItem}>
                            {item.children && item.children.length > 0 ? (
                                <InlineContent sections={item.children} />
                            ) : (
                                item.content
                            )}
                        </li>
                    ))}
                </ul>
            );
        default:
            return <div>{section.content}</div>;
    }
}

// Component to render inline formatted content (bold, italic, etc.)
function InlineContent({ sections }: { sections: MarkdownSection[] }) {
    const noteStyles = useMeetingNoteStyles();

    return (
        <>
            {sections.map((section, idx) => {
                if (section.type === 'bold') {
                    return (
                        <span key={idx} className={noteStyles.bold}>
                            {section.content}
                        </span>
                    );
                }
                return <span key={idx}>{section.content}</span>;
            })}
        </>
    );
}

export function MeetingNotes({
    note,
    isLoading,
    error,
    onCreateNote,
    onEditNote,
    isCreating,
    isUpdating,
}: MeetingNotesProps) {
    const styles = useStyles();
    const t = useTranslations('MeetingDetail');
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [parsedNote, setParsedNote] = React.useState<ReturnType<typeof parseMarkdownNote> | null>(null);
    const [headingSize, setHeadingSize] = React.useState<'small' | 'medium' | 'large'>('small');

    // Parse markdown when note changes
    React.useEffect(() => {
        if (note?.content) {
            console.log(`[MeetingNotes] Processing note: ${note.id}`);
            const parsed = parseMarkdownNote(note.content as string);
            if (parsed.error) {
                console.warn(`[MeetingNotes] Parse error for note ${note.id}:`, parsed.error);
            } else {
                console.log(`[MeetingNotes] Successfully parsed ${parsed.sections.length} sections from note ${note.id}`);
            }
            setParsedNote(parsed);
        }
    }, [note]);

    return (
        <Card className={styles.section}>
            <div className={styles.sectionTitle}>
                <div className={styles.sectionTitleContent}>
                    <Document20Regular className={styles.sectionIcon} />
                    <Text className={styles.sectionHeading}>{t('notes')}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <select
                        value={headingSize}
                        onChange={(e) => setHeadingSize(e.target.value as 'small' | 'medium' | 'large')}
                        className={styles.headingSizeSelector}
                        style={{
                            padding: '4px 8px',
                            borderRadius: tokens.borderRadiusSmall,
                            border: `1px solid ${tokens.colorNeutralStroke1}`,
                            backgroundColor: tokens.colorNeutralBackground1,
                            color: tokens.colorNeutralForeground1,
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                    {note ? (
                        <Button
                            appearance="primary"
                            icon={<Edit20Regular />}
                            onClick={onEditNote}
                            disabled={isUpdating}
                        >
                            {t('edit')}
                        </Button>
                    ) : (
                        <Button
                            appearance="primary"
                            onClick={onCreateNote}
                            disabled={isCreating}
                        >
                            {t('createNote')}
                        </Button>
                    )}
                </div>
            </div>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                    <Spinner size="small" />
                </div>
            ) : error ? (
                <div style={{ color: tokens.colorPaletteRedForeground1, padding: '16px', textAlign: 'center' }}>
                    <Body1>{error}</Body1>
                </div>
            ) : note ? (
                <div>
                    {parsedNote?.error ? (
                        // Fallback to raw content if parsing fails
                        <div className={styles.noteContent}>
                            <Text>{note.content || 'No content'}</Text>
                        </div>
                    ) : parsedNote?.sections && parsedNote.sections.length > 0 ? (
                        // Render parsed markdown with expandable view
                        <div>
                            <div className={isExpanded ? styles.expandedContent : styles.notePreview}>
                                {parsedNote.sections.map((section, idx) => (
                                    <MarkdownSectionView key={idx} section={section} headingSize={headingSize} />
                                ))}
                            </div>
                            <Button
                                appearance="subtle"
                                onClick={() => {
                                    console.log(`[MeetingNotes] Toggle expanded for note: ${note.id}`);
                                    setIsExpanded(!isExpanded);
                                }}
                                className={styles.expandButton}
                            >
                                {isExpanded ? t('showLess') || 'Show Less' : t('showMore') || 'Show More'}
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.noteEmpty}>
                            <Body1>{t('noNotes')}</Body1>
                        </div>
                    )}
                </div>
            ) : (
                <div className={styles.noteEmpty}>
                    <Body1>{t('noNotes')}</Body1>
                </div>
            )}
        </Card>
    );
}
