'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import {
  makeStyles,
  mergeClasses,
  tokens,
  Drawer,
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
  Chat24Regular,
  Bot24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    transition: 'width 0.2s ease-in-out',
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    height: '100%',
    padding: '0px',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  collapsed: {
    display: 'none',
  },
  section: {
    padding: tokens.spacingVerticalS,
  },
  scrollArea: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'auto',
    paddingBottom: tokens.spacingVerticalL,
  },
  mobileTopPad: {
    paddingTop: tokens.spacingVerticalXL,
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
    paddingLeft: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalM,
  },
  footer: {
    marginTop: tokens.spacingVerticalL,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
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

  const tSafe = (key: string, fallback: string) => {
    try {
      return (t as any)(key);
    } catch {
      return fallback;
    }
  };

  // const navigate = (href: string) => router.push(href, { locale });

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
      {
        key: 'files',
        label: t('files'),
        href: '/files',
        icon: <Folder24Regular />,
      },
      {
        key: 'meetings',
        label: t('meetings'),
        href: '/meetings',
        icon: <CalendarLtr24Regular />,
      },
      {
        key: 'projects',
        label: t('projects'),
        href: '/projects',
        icon: <Briefcase24Regular />,
      },
      {
        key: 'tasks',
        label: t('tasks'),
        href: '/tasks',
        icon: <ClipboardTaskListLtr24Regular />,
      },
      {
        key: 'profile',
        label: t('profile'),
        href: '/profile',
        icon: <Person24Regular />,
      },
      { key: 'chat', label: t('chat'), href: '/chat', icon: <Chat24Regular /> },
      { key: 'bots', label: t('bots'), href: '/bots', icon: <Bot24Regular /> },
    ];

  return (
    <aside
      className={mergeClasses(
        styles.container,
        drawerType === 'inline' && !isOpen && styles.collapsed,
        className,
      )}
      data-sidebar
      tabIndex={-1}
      aria-hidden={drawerType === 'overlay' ? !isOpen : false}
      style={
        drawerType === 'overlay'
          ? {
            width: 0,
            borderRight: 'none',
            background: 'transparent',
            overflow: 'visible',
          }
          : undefined
      }
    >
      <Drawer
        open={isOpen}
        type={drawerType}
        size="small"
        style={drawerType === 'inline' ? { width: '240px' } : undefined}
        onOpenChange={(_, data) => {
          if (!data.open) close();
        }}
      >
        <DrawerBody>
          <div
            className={mergeClasses(
              styles.scrollArea,
              drawerType === 'overlay' && styles.mobileTopPad,
            )}
          >
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
            <Accordion multiple collapsible>
              <AccordionItem value="extra">
                <AccordionHeader>{t('extra')}</AccordionHeader>
                <AccordionPanel>
                  <List>
                    <ListItem>
                      <ToggleButton
                        appearance="subtle"
                        size="large"
                        className={styles.toggleButton}
                        checked={isActive('/privacy')}
                        onClick={() => {
                          router.push('/privacy', { locale });
                        }}
                      >
                        {tSafe('privacy', 'Privacy')}
                      </ToggleButton>
                    </ListItem>
                    <ListItem>
                      <ToggleButton
                        appearance="subtle"
                        size="large"
                        className={styles.toggleButton}
                        checked={isActive('/terms-of-service')}
                        onClick={() => {
                          router.push('/terms-of-service', { locale });
                        }}
                      >
                        {tSafe('terms', 'Terms of Service')}
                      </ToggleButton>
                    </ListItem>
                  </List>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            <div className={styles.footer}></div>
          </div>
        </DrawerBody>
      </Drawer>
    </aside>
  );
}
