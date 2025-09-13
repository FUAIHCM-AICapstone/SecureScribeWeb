"use client";

import React from "react";
import { Badge, CounterBadge, PresenceBadge } from "@/components/ui";
import {
    Mail24Regular,
    Heart24Regular,
    Checkmark24Regular,
    Add24Regular,
    Info24Regular,
    Warning24Regular,
    ErrorCircle24Regular,
} from "@fluentui/react-icons";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    section: { marginBottom: "3rem" },
    sectionTitle: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1.5rem",
        color: "var(--colorNeutralForeground1)",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "1.5rem",
    },
    demoCard: {
        padding: "1.5rem",
        border: `1px solid var(--colorNeutralStroke1)`,
        borderRadius: "8px",
        backgroundColor: "var(--colorNeutralBackground1)",
    },
    demoTitle: {
        fontSize: "1.125rem",
        fontWeight: 600,
        marginBottom: "1rem",
        color: "var(--colorNeutralForeground1)",
    },
    badgeGroup: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        alignItems: "center",
        marginBottom: "1rem",
    },
    counterBadgeExample: {
        position: "relative",
        display: "inline-block",
    },
});

const BadgeLibrary: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Badges</h2>
            <div className={styles.grid}>
                {/* Regular Badge Section */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Badge Appearances</h3>
                    <div className={styles.badgeGroup}>
                        <Badge appearance="filled">Filled</Badge>
                        <Badge appearance="outline">Outline</Badge>
                        <Badge appearance="tint">Tint</Badge>
                        <Badge appearance="ghost">Ghost</Badge>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Badge Colors</h3>
                    <div className={styles.badgeGroup}>
                        <Badge color="brand">Brand</Badge>
                        <Badge color="success">Success</Badge>
                        <Badge color="warning">Warning</Badge>
                        <Badge color="danger">Danger</Badge>
                        <Badge color="important">Important</Badge>
                        <Badge color="informative">Informative</Badge>
                        <Badge color="severe">Severe</Badge>
                        <Badge color="subtle">Subtle</Badge>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Badge Sizes</h3>
                    <div className={styles.badgeGroup}>
                        <Badge size="small">Small</Badge>
                        <Badge size="medium">Medium</Badge>
                        <Badge size="large">Large</Badge>
                        <Badge size="extra-large">Extra Large</Badge>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Badge Shapes</h3>
                    <div className={styles.badgeGroup}>
                        <Badge shape="circular">Circular</Badge>
                        <Badge shape="rounded">Rounded</Badge>
                        <Badge shape="square">Square</Badge>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Badge with Icons</h3>
                    <div className={styles.badgeGroup}>
                        <Badge icon={<Heart24Regular />} iconPosition="before">Like</Badge>
                        <Badge icon={<Checkmark24Regular />} iconPosition="before">Done</Badge>
                        <Badge icon={<Add24Regular />} iconPosition="before">Add</Badge>
                        <Badge icon={<Info24Regular />} iconPosition="after">Info</Badge>
                        <Badge icon={<Warning24Regular />} iconPosition="after">Warning</Badge>
                        <Badge icon={<ErrorCircle24Regular />} iconPosition="after">Error</Badge>
                    </div>
                </div>

                {/* Counter Badge Section */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Counter Badge</h3>
                    <div className={styles.badgeGroup}>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={1} />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={5} />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={25} />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={125} overflowCount={99} />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={0} showZero />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge dot />
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Counter Badge Colors</h3>
                    <div className={styles.badgeGroup}>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={3} color="brand" />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={7} color="important" />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={12} color="informative" />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={99} color="danger" />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={5} color="important" />
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Counter Badge Sizes</h3>
                    <div className={styles.badgeGroup}>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={1} size="small" />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={5} size="medium" />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={25} size="large" />
                        </div>
                        <div className={styles.counterBadgeExample}>
                            <CounterBadge count={99} size="extra-large" />
                        </div>
                    </div>
                </div>

                {/* Presence Badge Section */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Presence Badge</h3>
                    <div className={styles.badgeGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="available" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Available</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="away" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Away</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="busy" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Busy</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="do-not-disturb" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Do Not Disturb</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="offline" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Offline</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="out-of-office" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Out of Office</span>
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Presence Badge Sizes</h3>
                    <div className={styles.badgeGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="available" size="small" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Small</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="available" size="medium" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Medium</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="available" size="large" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Large</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="available" size="extra-large" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Extra Large</span>
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Out of Office</h3>
                    <div className={styles.badgeGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="available" outOfOffice />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Available OOF</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="away" outOfOffice />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Away OOF</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <PresenceBadge status="busy" outOfOffice />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Busy OOF</span>
                        </div>
                    </div>
                </div>

                {/* Practical Examples */}
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Practical Examples</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Email with Counter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail24Regular />
                            <span style={{ fontSize: '0.875rem' }}>Inbox</span>
                            <div className={styles.counterBadgeExample}>
                                <CounterBadge count={5} color="brand" />
                            </div>
                        </div>

                        {/* Like Button with Counter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Heart24Regular />
                            <span style={{ fontSize: '0.875rem' }}>Likes</span>
                            <div className={styles.counterBadgeExample}>
                                <CounterBadge count={127} color="danger" />
                            </div>
                        </div>

                        {/* User Status */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                JD
                            </div>
                            <span style={{ fontSize: '0.875rem' }}>John Doe</span>
                            <PresenceBadge status="available" size="small" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BadgeLibrary;
