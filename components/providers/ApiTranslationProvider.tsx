/**
 * API Translation Provider Component
 * Initializes API utilities with i18n translation support
 * 
 * Usage:
 * Wrap your app with this provider in your root layout or _app.tsx
 * 
 * @example
 * ```tsx
 * import { ApiTranslationProvider } from '@/components/providers/ApiTranslationProvider';
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <NextIntlClientProvider>
 *           <ApiTranslationProvider>
 *             {children}
 *           </ApiTranslationProvider>
 *         </NextIntlClientProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */

'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { initializeApiTranslator } from '@/lib/api-translator';

interface ApiTranslationProviderProps {
    children: React.ReactNode;
}

export function ApiTranslationProvider({ children }: ApiTranslationProviderProps) {
    const t = useTranslations();

    useEffect(() => {
        // Initialize translator with current locale
        initializeApiTranslator((key: string, defaultValue?: string) => {
            try {
                // Try to get translation
                return t(key);
            } catch (error) {
                console.log(`Translation key not found: ${key}`, error);
                return defaultValue || key;
            }
        });
    }, [t]);

    // This is a transparent provider - just initializes and returns children
    return <>{children}</>;
}
