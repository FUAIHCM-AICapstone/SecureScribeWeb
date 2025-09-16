'use client';
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, MenuItemRadio, MenuList, MenuPopover, MenuTrigger, MenuButton, Tooltip } from '@fluentui/react-components';

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

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (language: (typeof languages)[0]) => {
    const normalizedPath = pathname.replace(/^\/(en|vi)/, '') || '/';
    router.push(normalizedPath, { locale: language.code });
  };

  return (
    <Menu
      checkedValues={{ language: [currentLanguage.code] }}
      onCheckedValueChange={(
        _event: unknown,
        data: { name: string; checkedItems: string[] }
      ) => {
        if (data.name === 'language' && data.checkedItems[0]) {
          const selectedCode = data.checkedItems[0];
          const selected = languages.find((l) => l.code === selectedCode);
          if (selected) {
            handleLanguageChange(selected);
          }
        }
      }}
    >
      <Tooltip content={t('selectLanguage', { current: currentLanguage.name })} relationship="label">
        <MenuTrigger disableButtonEnhancement>
          <MenuButton
            appearance="secondary"
            size="large"
            aria-label={t('selectLanguage', { current: currentLanguage.name })}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Image
                src={currentLanguage.flagSrc}
                alt={currentLanguage.flagAlt}
                width={24}
                height={24}
                className="rounded-sm"
                priority
              />
              <span className="uppercase">{currentLanguage.code}</span>
            </span>
          </MenuButton>
        </MenuTrigger>
      </Tooltip>
      <MenuPopover>
        <MenuList>
          {languages.map((language) => (
            <MenuItemRadio key={language.code} name="language" value={language.code}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Image
                  src={language.flagSrc}
                  alt={language.flagAlt}
                  width={24}
                  height={24}
                  className="rounded-sm"
                  priority
                />
                <span>{language.name}</span>
              </span>
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default LanguageSwitcher;
