'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button, Tooltip, makeStyles, tokens, Divider } from '@fluentui/react-components';
import { ArrowUpload24Regular, CalendarAdd24Regular } from '@fluentui/react-icons';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { showToast } from '@/hooks/useShowToast';
import SearchBoxWithResults from '@/components/search/SearchBoxWithResults';

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
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '80px',
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
});

// Removed legacy inline search types in favor of reusable SearchBoxWithResults

export default function Header() {
    const styles = useStyles();
    const pathname = usePathname();
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations('Header');

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
        showToast('info', 'Schedule meeting (mock opened)');
    };

    return (
        <header className={styles.header}>
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
                    <Button appearance="primary" icon={<ArrowUpload24Regular />} onClick={onUpload}>
                        <span className={styles.buttonText}>{t('upload')}</span>
                    </Button>
                </Tooltip>
                <Tooltip content={t('schedule')} relationship="label">
                    <Button appearance="secondary" icon={<CalendarAdd24Regular />} onClick={onSchedule}>
                        <span className={styles.buttonText}>{t('schedule')}</span>
                    </Button>
                </Tooltip>
                <Divider vertical style={{ height: 28 }} />
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
        </header>
    );
}


