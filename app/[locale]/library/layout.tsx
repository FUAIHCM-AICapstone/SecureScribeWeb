"use client";

import React from 'react';
import { makeStyles } from '@fluentui/react-components';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';

const useStyles = makeStyles({
    container: {
        minHeight: '100vh',
        backgroundColor: 'var(--colorNeutralBackground1)',
        color: 'var(--colorNeutralForeground1)',
    },
});

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
    const styles = useStyles();
    return (
        <div className={styles.container}>
            {/* <Header /> */}
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1rem' }}>
                <Sidebar />
                <div>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
}


