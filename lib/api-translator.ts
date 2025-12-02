/**
 * API Message Translator
 * Initializes API utilities with i18n translation support
 */

import { ApiErrorHandler, ResponseTransformer, MessageTranslator } from '@/services/api/utilities';

/**
 * Initialize API utilities with translator
 * Call this once when the app starts or when locale changes
 */
export function initializeApiTranslator(translateFn: (key: string, defaultValue?: string) => string): void {
    const translator: MessageTranslator = {
        translate: (key: string, fallback: string = key) => {
            try {
                return translateFn(key, fallback);
            } catch (error) {
                console.warn(`Translation key not found: ${key}`, error);
                return fallback;
            }
        }
    };

    ApiErrorHandler.setTranslator(translator);
    ResponseTransformer.setTranslator(translator);
}

/**
 * Clear translator (useful for testing or cleanup)
 */
export function clearApiTranslator(): void {
    ApiErrorHandler.setTranslator({
        translate: (key: string, fallback: string = key) => fallback
    });
    ResponseTransformer.setTranslator({
        translate: (key: string, fallback: string = key) => fallback
    });
}
