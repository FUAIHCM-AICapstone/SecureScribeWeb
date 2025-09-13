"use client";

import React from "react";
import Avatar from "@/components/ui/Avatar";
import {
    Person24Regular,
    ContactCard24Regular,
    Image24Regular,
    Star24Regular,
    Heart24Regular,
    Checkmark24Regular,
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
    avatarGroup: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: "center",
        marginBottom: "1rem",
    },
});

const AvatarLibrary: React.FC = () => {
    const styles = useStyles();

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Avatars</h2>
            <div className={styles.grid}>
                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Avatar Types</h3>
                    <div className={styles.avatarGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="John Doe" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Name</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar icon={<Person24Regular />} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Icon</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar image="https://via.placeholder.com/100" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Image</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Empty</span>
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Avatar Sizes</h3>
                    <div className={styles.avatarGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="XS" size="small" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Small</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="MD" size="medium" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Medium</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="LG" size="large" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Large</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="XL" size="extra-large" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Extra Large</span>
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Avatar Shapes</h3>
                    <div className={styles.avatarGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="Circle" shape="circular" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Circular</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="Square" shape="square" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Square</span>
                        </div>
                    </div>
                </div>


                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>With Different Icons</h3>
                    <div className={styles.avatarGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar icon={<Person24Regular />} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Person</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar icon={<ContactCard24Regular />} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Contact</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar icon={<Image24Regular />} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Image</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar icon={<Star24Regular />} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Star</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar icon={<Heart24Regular />} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Heart</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar icon={<Checkmark24Regular />} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Check</span>
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Avatar with Presence Badge</h3>
                    <div className={styles.avatarGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="Online User"
                                size="large"
                                badge={{ status: 'available' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Available</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="Away User"
                                size="large"
                                badge={{ status: 'away' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Away</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="Busy User"
                                size="large"
                                badge={{ status: 'busy' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Busy</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="Do Not Disturb"
                                size="large"
                                badge={{ status: 'do-not-disturb' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Do Not Disturb</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="Offline User"
                                size="large"
                                badge={{ status: 'offline' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Offline</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="Out of Office"
                                size="large"
                                badge={{ status: 'available', outOfOffice: true }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Out of Office</span>
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Avatar with Custom Badge</h3>
                    <div className={styles.avatarGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="Custom Icon"
                                size="large"
                                badge={{ icon: <Checkmark24Regular /> }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Icon Badge</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="VIP User"
                                size="large"
                                badge={{
                                    content: (
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '6px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: '2px solid white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            color: 'white'
                                        }}>
                                            VIP
                                        </div>
                                    )
                                }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Custom Content</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar
                                name="Notification"
                                size="large"
                                badge={{
                                    content: (
                                        <div style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            background: '#dc2626',
                                            border: '2px solid white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            color: 'white'
                                        }}>
                                            5
                                        </div>
                                    )
                                }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Notification Count</span>
                        </div>
                    </div>
                </div>

                <div className={styles.demoCard}>
                    <h3 className={styles.demoTitle}>Real Examples</h3>
                    <div className={styles.avatarGroup}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="Alice Johnson" size="large" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Alice</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="Bob Smith" size="large" badge={{ status: 'available' }} />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Bob (Online)</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar name="Carol Davis" size="large" shape="square" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>Carol</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <Avatar image="https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=JD" size="large" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--colorNeutralForeground3)' }}>John Doe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarLibrary;
