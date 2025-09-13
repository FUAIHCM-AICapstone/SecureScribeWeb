'use client';

import React from 'react';
import { makeStyles, Text, Button } from '@fluentui/react-components';
import CardHeader from '@/components/ui/card/CardHeader';
import CardFooter from '@/components/ui/card/CardFooter';
import CardPreview from '@/components/ui/card/CardPreview';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/badge/Badge';
import { Person24Regular, MoreHorizontal24Regular, Heart24Regular, Share24Regular } from '@fluentui/react-icons';
import Card from '../ui/card/Card';

const useStyles = makeStyles({
    container: {
        marginBottom: '3rem',
    },
    section: {
        marginBottom: '2rem',
    },
    sectionTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'var(--colorNeutralForeground1)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    demoCard: {
        padding: '1.5rem',
    },
    demoTitle: {
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'var(--colorNeutralForeground1)',
    },
    previewImage: {
        width: '100%',
        height: '120px',
        backgroundColor: 'var(--colorNeutralBackground3)',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--colorNeutralForeground3)',
        fontSize: '0.875rem',
    },
});

export default function CardLibrary() {
    const styles = useStyles();

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Cards</h2>
                <div className={styles.grid}>
                    {/* Basic Card Variants */}
                    <Card variant="default">
                        <CardHeader title="Default Card" />
                        <Text>This is a default card with basic styling.</Text>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader title="Elevated Card" />
                        <Text>This card has an elevated appearance with shadow.</Text>
                    </Card>

                    <Card variant="outlined">
                        <CardHeader title="Outlined Card" />
                        <Text>This card has an outlined appearance without shadow.</Text>
                    </Card>

                    <Card variant="default" interactive>
                        <CardHeader title="Interactive Card" />
                        <Text>Click this card to see the hover effect.</Text>
                    </Card>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Card with Header</h2>
                <div className={styles.grid}>
                    <Card>
                        <CardHeader
                            title="Project Dashboard"
                            subtitle="Last updated 2 hours ago"
                            avatar={<Avatar name="JD" size="small" />}
                            action={<Button appearance="transparent" icon={<MoreHorizontal24Regular />} />}
                        />
                        <Text>Monitor your project's progress and key metrics in real-time.</Text>
                    </Card>

                    <Card>
                        <CardHeader
                            title="Team Meeting"
                            subtitle="Today at 3:00 PM"
                            avatar={<Avatar icon={<Person24Regular />} size="small" />}
                        />
                        <Text>Weekly standup meeting with the development team.</Text>
                    </Card>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Card with Preview</h2>
                <div className={styles.grid}>
                    <Card>
                        <CardHeader title="Document Preview" />
                        <CardPreview logo={<div className="text-2xl flex flex-row">📄</div>}>
                            <Text className="font-semibold">Project Proposal.pdf</Text>
                            <Text className="text-sm text-neutral-foreground-3">
                                2.5 MB • Last modified: Oct 15, 2024
                            </Text>
                        </CardPreview>
                        <Text>This document contains the latest project proposal details.</Text>
                    </Card>

                    <Card>
                        <CardHeader title="Image Gallery" />
                        <CardPreview>
                            <div className={styles.previewImage}>🖼️ Image Preview</div>
                        </CardPreview>
                        <Text>A collection of project screenshots and mockups.</Text>
                    </Card>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Card with Footer</h2>
                <div className={styles.grid}>
                    <Card>
                        <CardHeader title="Blog Post" subtitle="By John Doe" />
                        <Text>
                            This is an example of a blog post card with actions in the footer.
                            The footer provides space for interactive elements like buttons.
                        </Text>
                        <CardFooter>
                            <Button appearance="transparent" icon={<Heart24Regular />}>
                                Like
                            </Button>
                            <Button appearance="transparent" icon={<Share24Regular />}>
                                Share
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader title="Task Item" subtitle="Due tomorrow" />
                        <Text>Complete the user authentication flow implementation.</Text>
                        <CardFooter align="space-between">
                            <Badge color="warning">High Priority</Badge>
                            <Button size="small">Mark Complete</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Complete Card Examples</h2>
                <div className={styles.grid}>
                    <Card>
                        <CardHeader
                            title="Product Launch"
                            subtitle="Scheduled for Q4 2024"
                            avatar={<Avatar name="PM" size="small" />}
                            action={<Badge color="success">On Track</Badge>}
                        />
                        <CardPreview logo={<div className="text-2xl">🚀</div>}>
                            <Text className="font-semibold">SecureScribe Web Platform</Text>
                            <Text className="text-sm text-gray-600">
                                Advanced document processing with AI-powered analysis
                            </Text>
                        </CardPreview>
                        <Text>
                            A comprehensive web platform for secure document management and intelligent analysis.
                            Features include real-time collaboration, automated summarization, and advanced security protocols.
                        </Text>
                        <CardFooter align="space-between">
                            <Text className="text-sm text-gray-600">
                                Team: 12 members
                            </Text>
                            <div className="flex gap-2">
                                <Button size="small">View Details</Button>
                                <Button size="small" appearance="primary">Join Project</Button>
                            </div>
                        </CardFooter>
                    </Card>

                    <Card variant="elevated">
                        <CardHeader
                            title="Meeting Notes"
                            subtitle="Oct 10, 2024 • 45 min"
                            avatar={<Avatar icon={<Person24Regular />} size="small" />}
                        />
                        <Text>
                            Discussed the new authentication system implementation and timeline.
                            Key decisions made regarding the tech stack and deployment strategy.
                        </Text>
                        <CardPreview>
                            <div className="flex gap-2 flex-wrap">
                                <Badge size="small">Authentication</Badge>
                                <Badge size="small">Security</Badge>
                                <Badge size="small">Frontend</Badge>
                            </div>
                        </CardPreview>
                        <CardFooter>
                            <Button appearance="transparent" size="small">Edit Notes</Button>
                            <Button appearance="transparent" size="small">Share</Button>
                            <Button appearance="transparent" size="small">Archive</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
