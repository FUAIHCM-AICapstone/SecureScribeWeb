import { useToastController, Toast, ToastTitle, ToastBody } from '@fluentui/react-toast';
import { Spinner } from '@fluentui/react-components';
import * as React from 'react';

// Global toast controller instance for loading toasts
let loadingToastController: ReturnType<typeof useToastController> | null = null;

// Track current loading toast ID and reference
let currentLoadingToastId: string | null = null;
let loadingToastShown: boolean = false;

// Function to set the loading toast controller (call this in your app root)
export const setLoadingToastController = (controller: ReturnType<typeof useToastController>) => {
  loadingToastController = controller;
};

const showLoadingToast = (message: string) => {
  if (!loadingToastController) {
    console.warn('[showLoadingToast] Loading toast controller not initialized. Call setLoadingToastController first.');
    return null;
  }

  // Dismiss existing loading toast if any
  if (loadingToastShown && currentLoadingToastId) {
    loadingToastController.dismissToast(currentLoadingToastId);
    loadingToastShown = false;
  }

  // Detect language from path: /vi/... or /en/...
  let lang: 'vi' | 'en' = 'en';
  if (typeof window !== 'undefined') {
    const pathLocale = window.location.pathname.split('/')[1];
    if (pathLocale === 'vi' || pathLocale === 'en') {
      lang = pathLocale as 'vi' | 'en';
    }
  }

  const titles: Record<'vi' | 'en', string> = {
    vi: 'Đang tải',
    en: 'Loading',
  };

  const toastTitle = titles[lang];

  console.log('[showLoadingToast]', { message, lang, title: toastTitle });

  // Create loading toast content with Spinner using React.createElement
  const toastContent = React.createElement(
    Toast,
    null,
    React.createElement(ToastTitle, null, toastTitle),
    React.createElement(
      ToastBody,
      null,
      React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
        React.createElement(Spinner, { size: 'extra-small' }),
        React.createElement('span', null, message)
      )
    )
  );

  // Dispatch the loading toast without timeout (stays until dismissed)
  loadingToastController.dispatchToast(toastContent, {
    intent: 'info',
    timeout: -1, // No auto-dismiss for loading toasts
  });

  // Note: FluentUI's dispatchToast returns void in some versions
  // We generate our own ID for tracking purposes only
  const toastId = `loading-toast-${Date.now()}`;
  currentLoadingToastId = toastId;
  loadingToastShown = true;
  return toastId;
};

const hideLoadingToast = () => {
  if (!loadingToastController) {
    console.warn('[hideLoadingToast] Loading toast controller not initialized.');
    return;
  }

  if (loadingToastShown && currentLoadingToastId) {
    loadingToastController.dismissToast(currentLoadingToastId);
    loadingToastShown = false;
    currentLoadingToastId = null;
    console.log('[hideLoadingToast] Loading toast dismissed');
  }
};

export {
  showLoadingToast,
  hideLoadingToast,
};
