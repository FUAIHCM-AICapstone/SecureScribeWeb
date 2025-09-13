'use client';

import AvatarLibrary from '@/components/library/AvatarLibrary';
import BadgeLibrary from '@/components/library/BadgeLibrary';
import ButtonLibrary from '@/components/library/ButtonLibrary';
import CardLibrary from '@/components/library/CardLibrary';
import ComboboxLibrary from '@/components/library/ComboboxLibrary';
import InputLibrary from '@/components/library/InputLibrary';
import { Spinner } from '@/components/ui';
import { Text, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    section: {
        marginBottom: '3rem',
    },
    sectionTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: 'var(--colorNeutralForeground1)',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    demoCard: {
        padding: '1.5rem',
        border: `1px solid var(--colorNeutralStroke1)`,
        borderRadius: '8px',
        backgroundColor: 'var(--colorNeutralBackground1)',
    },
    demoTitle: {
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: 'var(--colorNeutralForeground1)',
    },
    buttonGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '1rem',
    },
    badgeGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        alignItems: 'center',
        marginBottom: '1rem',
    },
});

function LibraryPage() {
    const styles = useStyles();
    // Buttons are showcased inside ButtonLibrary
    // Layout demos moved to layout.tsx

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <Text as="h1" size={700} style={{ marginBottom: '2rem' }}>
                    UI Components Library
                </Text>
                <Text style={{ color: 'var(--colorNeutralForeground3)', marginBottom: '2rem' }}>
                    Showcase of all common UI components built with Fluent UI for React
                </Text>
            </div>

            {/* Buttons Section */}
            <ButtonLibrary />

            {/* Cards Section */}
            <CardLibrary />

            {/* Inputs Section */}
            <InputLibrary />

            {/* Combobox Section */}
            <ComboboxLibrary />

            {/* Avatars Section */}
            <AvatarLibrary />

            {/* Badge Library Section */}
            <BadgeLibrary />




            {/* Spinner Section */}
            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Spinner</h2>
                <div className={styles.grid}>
                    <div className={styles.demoCard}>
                        <h3 className={styles.demoTitle}>Spinner Sizes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Spinner size="small" label="Small spinner" />
                            <Spinner size="medium" label="Medium spinner" />
                            <Spinner size="large" label="Large spinner" />
                            <Spinner size="extra-large" label="Extra large spinner" />
                        </div>
                    </div>

                    <div className={styles.demoCard}>
                        <h3 className={styles.demoTitle}>Spinner Appearances</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Spinner appearance="primary" label="Primary spinner" />
                            <Spinner appearance="inverted" label="Inverted spinner" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Layout preview moved to route layout */}
        </div>
    );
}

export default LibraryPage;

