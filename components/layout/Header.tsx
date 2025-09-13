'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@fluentui/react-components';

const NAV_ITEMS = [
  { label: 'home', href: '#hero' },
  { label: 'features', href: '#features' },
  { label: 'techStack', href: '#stack' },
  { label: 'testimonials', href: '#testimonials' },
  { label: 'userGuide', href: '/guide/welcome' },
];


const Header = () => {
  const t = useTranslations('Header.navigation');
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLandingPage =
    pathname === '/' || /^\/[a-z]{2}(-[A-Z]{2})?$/.test(pathname);

  const handleStartNow = () => {
    router.push('/auth');
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-50 bg-[var(--colorNeutralBackground1)] shadow font-[var(--font-family-base)]">
        <div className="mx-auto flex items-center justify-between px-4 py-3">
          <Link
            href={isLandingPage ? '/dashboard' : '/'}
            className="flex items-center gap-2"
          >
            <Image
              src="/images/logos/logo2.png"
              alt="Logo"
              width={1000}
              height={1000}
              className="h-10 w-10 object-contain rounded-lg"
            />
            <span className="hidden md:block text-2xl font-bold text-[var(--colorNeutralForeground1)] font-sofia">
              SecureScribe
            </span>
          </Link>
          <div className="w-[30%] md:w-[50%] justify-start">
            <nav className="hidden md:flex gap-8">
              {isLandingPage &&
                NAV_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-[var(--colorNeutralForeground3)] hover:text-[var(--colorBrandForeground1)] font-medium transition"
                  >
                    {t(item.label)}
                  </Link>
                ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {isLandingPage && (
              <Button
                appearance="primary"
                onClick={handleStartNow}
                className="hidden md:inline-block"
              >
                {t('startNow')}
              </Button>
            )}
            <button
              className="md:hidden p-2 rounded hover:bg-[var(--colorNeutralBackground2)]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle Navigation"
            >
              <svg
                className="w-6 h-6 text-[var(--colorNeutralForeground1)]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden bg-[var(--colorNeutralBackground1)] px-4 pb-4">
            <ul className="flex flex-col gap-4">
              {isLandingPage &&
                NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block text-[var(--colorNeutralForeground3)] hover:text-[var(--colorBrandForeground1)] font-medium py-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(item.label)}
                    </Link>
                  </li>
                ))}
              {isLandingPage && (
                <li>
                  <Button
                    appearance="primary"
                    onClick={() => {
                      setMobileOpen(false);
                      handleStartNow();
                    }}
                    className="w-full"
                  >
                    {t('startNow')}
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
