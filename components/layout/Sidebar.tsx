'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { makeStyles, mergeClasses, tokens, Drawer, DrawerHeader, DrawerHeaderTitle, DrawerBody } from '@fluentui/react-components';
import { useTranslations } from 'next-intl';
import { useSidebar } from '@/context/SidebarContext';

const useStyles = makeStyles({
    container: {
        width: '280px',
        transition: 'width 0.2s ease-in-out',
        borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
        height: '100%',
        backgroundColor: 'var(--colorNeutralBackground1)',
        overflow: 'hidden',
    },
    collapsed: {
        display: 'none',
    },
    section: {
        padding: tokens.spacingVerticalS,
    },
});

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
    const styles = useStyles();
    const t = useTranslations('Sidebar');
    const pathname = usePathname();
    const { isOpen, close } = useSidebar();
    const [drawerType, setDrawerType] = useState<'inline' | 'overlay'>('inline');
    const didInitToggleWatch = useRef(false);
    const prevPathRef = useRef(pathname);

    // Auto-close only when pathname actually changes
    useEffect(() => {
        const normalize = (p: string) => p.replace(/\/+$/, '');
        if (normalize(prevPathRef.current) !== normalize(pathname)) {
            prevPathRef.current = pathname;
            close();
        }
    }, [pathname, close]);

    // Notify on toggle (open/close)
    useEffect(() => {
        if (!didInitToggleWatch.current) {
            didInitToggleWatch.current = true;
            return;
        }
    }, [isOpen]);

    // Responsive Drawer type: overlay on mobile, inline on desktop
    useEffect(() => {
        const updateType = () => {
            const isMobile = window.matchMedia('(max-width: 1023px)').matches;
            setDrawerType(isMobile ? 'overlay' : 'inline');
        };
        updateType();
        window.addEventListener('resize', updateType);
        return () => window.removeEventListener('resize', updateType);
    }, []);

    return (
        <>
            <aside
                className={mergeClasses(styles.container, drawerType === 'inline' && !isOpen && styles.collapsed, className)}
                data-sidebar
                tabIndex={-1}
                aria-hidden={drawerType === 'overlay' ? !isOpen : false}
                style={drawerType === 'overlay' ? { width: 0, borderRight: 'none', background: 'transparent', overflow: 'visible' } : undefined}
            >
                <Drawer
                    open={isOpen}
                    type={drawerType}
                    onOpenChange={(_, data) => {
                        if (!data.open) close();
                    }}
                >
                    <DrawerHeader>
                        <DrawerHeaderTitle>{t('navigation')}</DrawerHeaderTitle>
                    </DrawerHeader>
                    <DrawerBody />
                </Drawer>
            </aside>
        </>
    );
}
