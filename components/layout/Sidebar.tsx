'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import {
    makeStyles,
    mergeClasses,
    tokens,
    Drawer,
    DrawerHeader,
    DrawerHeaderTitle,
    DrawerBody,
    Accordion,
    AccordionItem,
    AccordionHeader,
    AccordionPanel,
    List,
    ListItem,
    ToggleButton,
    // nếu MenuList hợp hơn thì import MenuList, MenuItem
} from '@fluentui/react-components';
import { useTranslations } from 'next-intl';
import { useSidebar } from '@/context/SidebarContext';
import { useLocale } from 'next-intl';
import {
    Home24Regular,
    Folder24Regular,
    CalendarLtr24Regular,
    Briefcase24Regular,
    ClipboardTaskListLtr24Regular,
    Person24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
    container: {
        width: '280px',
        transition: 'width 0.2s ease-in-out',
        borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
        height: '100%',
        backgroundColor: tokens.colorNeutralBackground1,
        overflow: 'hidden',
    },
    collapsed: {
        display: 'none',
    },
    section: {
        padding: tokens.spacingVerticalS,
    },
    linkItem: {
        textDecoration: 'none',
        color: tokens.colorNeutralForeground1,  // hoặc token phù hợp
        display: 'block',
        width: '100%',
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
        // có thể thêm hover/focus styles nếu muốn
    },
    toggleGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalS,
        overflowX: 'hidden',
    },
    toggleButton: {
        width: '100%',
        justifyContent: 'flex-start',
        maxWidth: '100%',
        overflow: 'hidden',
        textAlign: 'left',
        minWidth: 0,
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
    },
    panelPadding: {
        paddingLeft: tokens.spacingHorizontalM,
        paddingRight: tokens.spacingHorizontalM,
    },
});

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
    const styles = useStyles();
    const t = useTranslations('Sidebar');
    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const { isOpen, close } = useSidebar();
    const [drawerType, setDrawerType] = useState<'inline' | 'overlay'>('inline');
    const didInitToggleWatch = useRef(false);
    const prevPathRef = useRef(pathname);

    useEffect(() => {
        const normalize = (p: string) => p.replace(/\/+$/, '');
        if (normalize(prevPathRef.current) !== normalize(pathname)) {
            prevPathRef.current = pathname;
        }
    }, [pathname, close]);

    useEffect(() => {
        if (!didInitToggleWatch.current) {
            didInitToggleWatch.current = true;
            return;
        }
    }, [isOpen]);

    useEffect(() => {
        const updateType = () => {
            const isMobile = window.matchMedia('(max-width: 1023px)').matches;
            setDrawerType(isMobile ? 'overlay' : 'inline');
        };
        updateType();
        window.addEventListener('resize', updateType);
        return () => window.removeEventListener('resize', updateType);
    }, []);

    const currentPath = pathname.replace(/^\/(en|vi)/, '') || '/';
    const isActive = (href: string) =>
        href === '/' ? currentPath === '/' : currentPath.startsWith(href);

    const navToggles: Array<{
        key: string;
        label: string;
        href: string;
        icon: React.ReactNode;
    }> = [
            { key: 'home', label: t('home'), href: '/', icon: <Home24Regular /> },
            { key: 'files', label: t('files'), href: '/files', icon: <Folder24Regular /> },
            { key: 'meetings', label: t('meetings'), href: '/meetings', icon: <CalendarLtr24Regular /> },
            { key: 'projects', label: t('projects'), href: '/projects', icon: <Briefcase24Regular /> },
            { key: 'tasks', label: t('tasks'), href: '/tasks', icon: <ClipboardTaskListLtr24Regular /> },
            { key: 'profile', label: t('profile'), href: '/profile', icon: <Person24Regular /> },
        ];

    return (
        <aside
            className={mergeClasses(
                styles.container,
                drawerType === 'inline' && !isOpen && styles.collapsed,
                className
            )}
            data-sidebar
            tabIndex={-1}
            aria-hidden={drawerType === 'overlay' ? !isOpen : false}
            style={
                drawerType === 'overlay'
                    ? { width: 0, borderRight: 'none', background: 'transparent', overflow: 'visible' }
                    : undefined
            }
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
                <DrawerBody>
                    <Accordion multiple collapsible>
                        <AccordionItem value="pages">
                            <AccordionHeader>{t('pages')}</AccordionHeader>
                            <AccordionPanel>
                                <div className={styles.panelPadding}>
                                    <div className={styles.toggleGroup}>
                                        {navToggles.map((item) => (
                                            <ToggleButton
                                                key={item.key}
                                                appearance="subtle"
                                                size="large"
                                                icon={{ children: item.icon }}
                                                checked={isActive(item.href)}
                                                className={styles.toggleButton}
                                                onClick={() => {
                                                    router.push(item.href, { locale });
                                                }}
                                            >
                                                {item.label}
                                            </ToggleButton>
                                        ))}
                                    </div>
                                </div>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem value="extra">
                            <AccordionHeader>{t('extra')}</AccordionHeader>
                            <AccordionPanel>
                                <List>
                                    <ListItem>
                                        <Link href="/help" className={styles.linkItem}>
                                            {t('help')}
                                        </Link>
                                    </ListItem>
                                    <ListItem>
                                        <Link href="/about" className={styles.linkItem}>
                                            {t('about')}
                                        </Link>
                                    </ListItem>
                                </List>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </DrawerBody>
            </Drawer>
        </aside>
    );
}
