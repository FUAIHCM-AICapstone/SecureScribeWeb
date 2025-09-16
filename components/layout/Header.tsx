'use client';

import MeetingSchedulerModal from '@/components/modal/MeetingSchedulerModal';
import SearchBoxWithResults from '@/components/search/SearchBoxWithResults';
import { showToast } from '@/hooks/useShowToast';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Avatar, Badge, Button, CounterBadge, Divider, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerHeaderTitle, Tooltip, makeStyles, tokens } from '@fluentui/react-components';
import { AlertUrgent24Regular, ArrowUpload24Regular, CalendarAdd24Regular, Navigation24Regular } from '@fluentui/react-icons';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { useSidebar } from '@/context/SidebarContext';

const useStyles = makeStyles({
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 16px',
        backgroundColor: 'var(--colorNeutralBackground1)',
        borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
    },
    breadcrumbs: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--colorNeutralForeground2)',
        fontSize: '12px',
        whiteSpace: 'nowrap',
    },
    grow: { flex: 1, minWidth: 0 },
    searchWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '700px',
        maxWidth: '1200px',
        width: '75%',
        '@media (max-width: 768px)': {
            minWidth: '400px',
            maxWidth: '600px',
            width: '100%',
        },
        '@media (max-width: 480px)': {
            minWidth: '300px',
            maxWidth: '400px',
            width: '100%',
        }
    },
    filter: { width: '180px' },
    right: { display: 'flex', alignItems: 'center', gap: '12px' },
    buttonText: {
        whiteSpace: 'nowrap',
    },
    scheduleButton: {
        justifyContent: 'center',
        display: 'inline-flex',
        alignItems: 'center',
        minWidth: 'max-content',
    },
    actionButton: {
        justifyContent: 'center',
        display: 'inline-flex',
        alignItems: 'center',
        minWidth: 'max-content',
    },
    menuButton: {
        // Always visible on all breakpoints
    },
    searchContainer: {
        // Ensure consistent width for SearchBox regardless of dismiss icon state
        position: 'relative',
        width: '100%',
        minHeight: '32px', // Match SearchBox height
        '& .fui-SearchBox': {
            width: '100%',
            '& .fui-Input': {
                width: '100%',
            },
        },
    },
    suggestionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        cursor: 'pointer',
    },
    drawerList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    drawerItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        padding: '10px 12px',
        borderRadius: tokens.borderRadiusMedium,
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        backgroundColor: 'var(--colorNeutralBackground1)',
        cursor: 'pointer',
        transition: 'background .15s ease',
        ':hover': {
            backgroundColor: 'var(--colorNeutralBackground1Hover)'
        }
    },
    drawerItemHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        fontWeight: 600,
    },
    drawerItemSub: {
        color: 'var(--colorNeutralForeground3)'
    }
});

// Removed legacy inline search types in favor of reusable SearchBoxWithResults

export default function Header() {
    const styles = useStyles();
    const pathname = usePathname();
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations('Header');
    const { toggle } = useSidebar();

    const [isNotiOpen, setIsNotiOpen] = useState(false);
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
    type NotificationItem = { id: string; title: string; message: string; isRead: boolean };
    const [notifications, setNotifications] = useState<NotificationItem[]>([
        { id: '1', title: 'Task reminder', message: 'Task "Fix authentication bug" is due tomorrow', isRead: false },
        { id: '2', title: 'Meeting reminder', message: '"Sprint Planning" starts in 30 minutes', isRead: false },
        { id: '3', title: 'Bot update', message: 'New bot session completed for Client Meeting', isRead: true },
    ]);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const toggleNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n));
        const target = notifications.find(n => n.id === id);
        if (target) {
            if (!target.isRead) {
                showToast('success', 'Marked as read');
            } else {
                showToast('info', 'Marked as unread');
            }
        }
    };

    // Breadcrumbs: from URL segments, then title map via i18n keys
    const segments = pathname.replace(/^\/(en|vi)/, '').split('/').filter(Boolean);
    const crumbLabels = segments.map((seg) => {
        try {
            return t(`crumb.${seg}` as any);
        } catch {
            return seg;
        }
    });

    const onSelectResult = (result: any) => {
        // Host app can navigate here; for now show toast with type+id
        showToast('info', `Open ${result.type}: ${result.title}`);
    };

    const onPreviewResult = (result: any) => {
        showToast('info', `Preview ${result.type}: ${result.title}`);
    };

    const onClickBrand = () => {
        router.push('/', { locale });
    };

    const onUpload = async () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.onchange = () => {
                showToast('success', 'Selected files uploaded (mock)');
            };
            input.click();
        } catch {
            showToast('error', 'Upload failed');
        }
    };

    const onSchedule = () => {
        setIsSchedulerOpen(true);
    };

    return (
        <>
            <header className={styles.header}>
                <Tooltip content={t('menu')} relationship="label">
                    <Button
                        appearance="subtle"
                        icon={<Navigation24Regular />}
                        onClick={toggle}
                        className={styles.menuButton}
                        aria-label="Toggle menu"
                    />
                </Tooltip>
                <div
                    className={styles.brand}
                    role="button"
                    tabIndex={0}
                    onClick={onClickBrand}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClickBrand(); }}
                >
                    <Image src="/images/logos/logo.png" alt="SecureScribe" width={28}
                        height={28} />
                    <strong>SecureScribe</strong>
                </div>

                <div className={styles.breadcrumbs}>
                    {crumbLabels.length === 0 ? (
                        <span>{t('home')}</span>
                    ) : (
                        crumbLabels.map((c, i) => (
                            <React.Fragment key={`${c}-${i}`}>
                                <span>{c}</span>
                                {i < crumbLabels.length - 1 && <span>/</span>}
                            </React.Fragment>
                        ))
                    )}
                </div>

                <div className={styles.grow} />

                <div className={styles.right}>
                    <div className={styles.searchWrap}>
                        <div className={styles.searchContainer}>
                            <SearchBoxWithResults
                                placeholder={t('searchPlaceholder')}
                                onSelect={onSelectResult}
                                onPreview={onPreviewResult}
                                align="end"
                                appearance="outline"
                                size="large"
                            />
                        </div>
                    </div>
                    <Tooltip content={t('upload')} relationship="label">
                        <Button appearance="primary" size="large" className={styles.actionButton}
                            icon={<ArrowUpload24Regular />}
                            onClick={onUpload}
                        >
                            {t('upload')}
                        </Button>
                    </Tooltip>
                    <Tooltip content={t('schedule')} relationship="label">
                        <Button
                            appearance="secondary"
                            size="large"
                            icon={<CalendarAdd24Regular />}
                            onClick={onSchedule}
                            className={`${styles.scheduleButton} ${styles.actionButton}`}
                        >
                            {t('schedule')}
                        </Button>
                    </Tooltip>


                    {/* Notifications */}
                    <Tooltip content="Notifications" relationship="label">
                        <Button appearance="subtle" icon={<AlertUrgent24Regular />} onClick={() => setIsNotiOpen(true)}>
                            {unreadCount > 0 && (
                                <CounterBadge count={unreadCount} appearance="filled" color="danger"
                                    size="small" />
                            )}
                        </Button>
                    </Tooltip>

                    {/* User Avatar */}
                    <Tooltip content="Profile" relationship="label">
                        <div role="button" tabIndex={0} onClick={() => showToast('info', 'Profile opened')}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') showToast('info', 'Profile opened'); }}>
                            <Avatar name="Secure User" size={28} />
                        </div>
                    </Tooltip>

                    <Divider vertical style={{ height: 28 }} />
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
            </header>
            <Drawer open={isNotiOpen} position="end" onOpenChange={(_, data) => setIsNotiOpen(!!data.open)}>
                <DrawerHeader>
                    <DrawerHeaderTitle>Notifications</DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody>
                    <div className={styles.drawerList}>
                        {notifications.map(n => (
                            <div
                                key={n.id}
                                className={styles.drawerItem}
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleNotificationRead(n.id)}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleNotificationRead(n.id); }}
                            >
                                <div className={styles.drawerItemHeader}>
                                    <span>{n.title}</span>
                                    {!n.isRead && <Badge appearance="filled" color="brand" size="small">New</Badge>}
                                </div>
                                <div className={styles.drawerItemSub}>{n.message}</div>
                            </div>
                        ))}
                    </div>
                </DrawerBody>
                <DrawerFooter>
                    <Button appearance="secondary" onClick={() => setIsNotiOpen(false)}>Close</Button>
                </DrawerFooter>
            </Drawer>
            <MeetingSchedulerModal open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen} />
        </>
    );
}


