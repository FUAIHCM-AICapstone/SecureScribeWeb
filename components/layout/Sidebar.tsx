// components/layout/Sidebar.tsx
'use client';

import { Accordion } from '@/components/ui';
import { useSidebar } from '@/context/SidebarContext';
import { Button } from '@fluentui/react-components';
import {
  Clock24Regular,
  Home24Regular,
  People24Regular,
  Settings24Regular,
  ShoppingBag24Regular,
} from '@fluentui/react-icons';
import { useTranslations } from 'next-intl';

export default function Sidebar() {
  const t = useTranslations('Sidebar');
  const { selectedId, setSelectedId } = useSidebar();

  // Logout handler

  return (
    <aside
      className="h-screen w-60 min-w-[200px] max-w-[320px] flex-shrink-0 bg-neutral-100 text-neutral-900 shadow-lg p-0 flex flex-col sticky top-0 overflow-y-auto"
      aria-label={t('sidebarAriaLabel')}
    >
      <div className="h-full flex flex-col relative">
        {/* Navigation (Accordion grouped) */}
        <nav className="flex flex-col gap-4 p-3 flex-1">
          <Accordion
            items={[
              {
                id: 'main',
                header: <span>{t('home')}</span>,
                content: (
                  <div className="flex flex-col gap-2">
                    <Button
                      appearance="transparent"
                      className={`flex items-center gap-3 w-full justify-start ${selectedId === 'home'
                        ? 'text-blue-600 font-semibold'
                        : 'text-neutral-700 hover:text-neutral-900'
                        }`}
                      onClick={() => setSelectedId('home')}
                      icon={<Home24Regular />}
                    >
                      {t('home')}
                    </Button>
                    <Button
                      appearance="transparent"
                      className={`flex items-center gap-3 w-full justify-start ${selectedId === 'meeting'
                        ? 'text-blue-600 font-semibold'
                        : 'text-neutral-700 hover:text-neutral-900'
                        }`}
                      onClick={() => setSelectedId('meeting')}
                      icon={<People24Regular />}
                    >
                      {t('meeting')}
                    </Button>
                  </div>
                ),
              },
              {
                id: 'manage',
                header: <span>{t('setting')}</span>,
                content: (
                  <div className="flex flex-col gap-2">
                    <Button
                      appearance="transparent"
                      className={`flex items-center gap-3 w-full justify-start ${selectedId === 'setting'
                        ? 'text-blue-600 font-semibold'
                        : 'text-neutral-700 hover:text-neutral-900'
                        }`}
                      onClick={() => setSelectedId('setting')}
                      icon={<Settings24Regular />}
                    >
                      {t('setting')}
                    </Button>
                    <Button
                      appearance="transparent"
                      className={`flex items-center gap-3 w-full justify-start ${selectedId === 'store'
                        ? 'text-blue-600 font-semibold'
                        : 'text-neutral-700 hover:text-neutral-900'
                        }`}
                      onClick={() => setSelectedId('store')}
                      icon={<ShoppingBag24Regular />}
                    >
                      {t('store')}
                    </Button>
                  </div>
                ),
              },
              {
                id: 'history',
                header: <span>History</span>,
                content: (
                  <div className="flex flex-col gap-2">
                    <Button
                      appearance="transparent"
                      className={`flex items-center gap-3 w-full justify-start ${selectedId === 'history'
                        ? 'text-blue-600 font-semibold'
                        : 'text-neutral-700 hover:text-neutral-900'
                        }`}
                      onClick={() => setSelectedId('history')}
                      icon={<Clock24Regular />}
                    >
                      History
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </nav>
      </div>
    </aside>
  );
}
