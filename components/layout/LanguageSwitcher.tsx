'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components';

// Assumes public directory contains /vietnam.png and /united-kingdom.png

const languages = [
  {
    code: 'en',
    name: 'English',
    flagSrc: '/images/icons/united-kingdom.png',
    flagAlt: 'United Kingdom Flag',
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
    flagSrc: '/images/icons/vietnam.png',
    flagAlt: 'Vietnam Flag',
  },
];

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');

  const [open, setOpen] = useState(false);

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (language: (typeof languages)[0]) => {
    setOpen(false);
    const normalizedPath = pathname.replace(/^\/(en|vi)/, '') || '/';
    router.push(normalizedPath, { locale: language.code });
  };

  return (
    <Menu open={open} onOpenChange={(_, data) => setOpen(!!data.open)}>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="secondary"
          aria-label={t('selectLanguage', { current: currentLanguage.name })}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Image
              src={currentLanguage.flagSrc}
              alt={currentLanguage.flagAlt}
              width={20}
              height={20}
              className="rounded-sm"
              priority
            />
            <span className="uppercase">{currentLanguage.code}</span>
          </span>
        </Button>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          {languages.map((language) => (
            <MenuItem key={language.code} onClick={() => handleLanguageChange(language)}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Image
                  src={language.flagSrc}
                  alt={language.flagAlt}
                  width={20}
                  height={20}
                  className="rounded-sm"
                  priority
                />
                <span>{language.name}</span>
              </span>
            </MenuItem>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default LanguageSwitcher;
