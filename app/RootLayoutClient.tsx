/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-css-tags */
/* eslint-disable @next/next/no-page-custom-font */
// app/RootLayoutClient.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { ReactQueryProvider } from '@/context/ReactQueryProvider';
import { Provider } from 'react-redux';
import store from '@/store/index';
// Fluent UI theming is handled by the FluentProvider in the providers
import '@/styles/globals.css';
import { Providers } from './providers';
import { AuthProvider } from '@/context/AuthContext';
import { WebSocketProvider } from '@/context/WebSocketContext';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { usePathname, useSearchParams } from 'next/navigation';
import { showToast, setToastController } from '@/hooks/useShowToast';
import { Toaster, useToastController } from '@fluentui/react-toast';
import { SidebarProvider } from '../context/SidebarContext';
import ClientOnlyLayout from '@/components/layout/ClientOnly';
import { AuthOverlay } from '@/components/layout/AuthOverlay';
import { useFCM } from '@/hooks/useFCM';
import { ApiTranslationProvider } from '@/components/providers/ApiTranslationProvider';

export default function RootLayoutClient({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: any;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathAfterLocale = pathname.split('/').slice(2).join('/');
  const hideHeader = pathAfterLocale.startsWith('auth');
  const isAuthRoute = pathAfterLocale.startsWith('auth');
  const [shouldShowAuthOverlay, setShouldShowAuthOverlay] = useState(false);

  // Initialize FCM for push notifications
  const {
    permission: notificationPermission,
    token: fcmToken,
    isLoading: fcmLoading,
    requestNotificationPermission,
    isSupported
  } = useFCM();

  // Log FCM support status for debugging
  useEffect(() => {
    if (!isSupported) {
      console.log('FCM notifications not supported in this browser');
    }
  }, [isSupported]);

  // Initialize FluentUI toast controller
  const toastController = useToastController();

  useEffect(() => {
    // Set the toast controller for the hook to use
    setToastController(toastController);
  }, [toastController]);

  useEffect(() => {
    // Check if access_token exists in localStorage
    // If no token, show auth overlay
    const accessToken = window.localStorage.getItem('access_token');

    if (!accessToken && !isAuthRoute) {
      setShouldShowAuthOverlay(true);
    } else {
      setShouldShowAuthOverlay(false);
    }
  }, [pathname, isAuthRoute]);

  useEffect(() => {
    const toastKey = searchParams.get('toast');
    if (toastKey) {
      // Manual key-value for translation
      const locale = pathname.split('/')[1];
      const toastMessages: Record<string, Record<string, string>> = {
        vi: {
          require_login: 'Vui lòng đăng nhập để tiếp tục',
          already_logged_in: 'Bạn đã đăng nhập rồi!',
        },
        en: {
          require_login: 'Please login to continue',
          already_logged_in: 'You already logged in',
        },
      };
      let message = toastKey;
      if (toastMessages[locale] && toastMessages[locale][toastKey]) {
        message = toastMessages[locale][toastKey];
      }
      showToast('info', message);
      // Remove 'toast' from URL without reloading
      const params = new URLSearchParams(window.location.search);
      params.delete('toast');
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, pathname]);

  return (
    <>
      <ClientOnlyLayout>
        <Providers>
          <Toaster position="top-end" />
          <Provider store={store}>
            <ReactQueryProvider>
              <NextIntlClientProvider
                locale={locale}
                messages={messages}
                timeZone="Asia/Bangkok"
              >
                <ApiTranslationProvider>
                  <AuthProvider>
                    <WebSocketProvider>
                      <SidebarProvider>
                        <AuthOverlay locale={locale} shouldShow={shouldShowAuthOverlay} />
                      <div
                        style={{
                          display: 'flex',
                          height: '100vh',
                          flexDirection: 'column',
                          overflow: 'hidden',
                        }}
                      >
                        {!hideHeader && <Header
                          notificationPermission={notificationPermission}
                          fcmToken={fcmToken}
                          fcmLoading={fcmLoading}
                          requestNotificationPermission={requestNotificationPermission}
                        />}
                        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                          {!hideHeader && <Sidebar />}
                          <main
                            style={{ flex: 1, overflow: 'auto', minHeight: 0 }}
                          >
                            {children}
                          </main>
                        </div>
                      </div>
                      </SidebarProvider>
                    </WebSocketProvider>
                  </AuthProvider>
                </ApiTranslationProvider>
              </NextIntlClientProvider>
            </ReactQueryProvider>
          </Provider>
        </Providers>
      </ClientOnlyLayout>
    </>
  );
}
