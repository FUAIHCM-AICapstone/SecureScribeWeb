import { useToastController, Toast, ToastTitle, ToastBody, ToastTrigger } from '@fluentui/react-toast';
import { Button } from '@fluentui/react-components';
import React from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface ToastOptions {
  duration?: number;
  action?: ToastAction;
  description?: string;
  id?: string | number;
  onDismiss?: () => void;
  onAutoClose?: () => void;
}

// Global toast controller instance
let toastController: ReturnType<typeof useToastController> | null = null;

// Function to set the toast controller (call this in your app root)
export const setToastController = (controller: ReturnType<typeof useToastController>) => {
  toastController = controller;
};

const showToast = (
  type: ToastType,
  message: string,
  options: ToastOptions = {}
) => {
  if (!toastController) {
    return null;
  }

  const {
    duration = 4000,
    action,
    description,
    onDismiss,
    onAutoClose
  } = options;

  console.log('[showToast]', { type, message, description, duration, action });

  // Detect language from path: /vi/... or /en/...
  let lang: 'vi' | 'en' = 'en';
  if (typeof window !== 'undefined') {
    const pathLocale = window.location.pathname.split('/')[1];
    if (pathLocale === 'vi' || pathLocale === 'en') {
      lang = pathLocale as 'vi' | 'en';
    }
  }

  const titles: Record<'vi' | 'en', Record<ToastType, string>> = {
    vi: {
      success: 'Thành công',
      error: 'Lỗi',
      warning: 'Cảnh báo',
      info: 'Thông báo',
    },
    en: {
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
    },
  };

  const toastTitle = titles[lang][type];
  const fullDescription = description || message;

  // Map toast types to FluentUI intent
  const intentMap: Record<ToastType, 'success' | 'error' | 'warning' | 'info'> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  // Create toast content using React.createElement
  const toastContent = React.createElement(
    Toast,
    null,
    React.createElement(ToastTitle, null, toastTitle),
    React.createElement(ToastBody, null, fullDescription),
    action && React.createElement(
      ToastTrigger,
      null,
      React.createElement(
        Button,
        {
          appearance: action.variant === 'destructive' ? 'primary' : 'secondary',
          onClick: action.onClick
        },
        action.label
      )
    )
  );

  // Dispatch the toast
  const toastId = toastController.dispatchToast(toastContent, {
    intent: intentMap[type],
    timeout: duration,
    onStatusChange: (status) => {
      if (status === 'dismissed' && onDismiss) {
        onDismiss();
      }
      if (status === 'unmounted' && onAutoClose) {
        onAutoClose();
      }
    },
  });

  return toastId;
};

// Convenience methods for common toast patterns
const showSuccessToast = (message: string, options?: Omit<ToastOptions, 'duration'> & { duration?: number }) => {
  return showToast('success', message, options);
};

const showErrorToast = (message: string, options?: Omit<ToastOptions, 'duration'> & { duration?: number }) => {
  return showToast('error', message, { duration: 5000, ...options });
};

const showWarningToast = (message: string, options?: Omit<ToastOptions, 'duration'> & { duration?: number }) => {
  return showToast('warning', message, { duration: 4500, ...options });
};

const showInfoToast = (message: string, options?: Omit<ToastOptions, 'duration'> & { duration?: number }) => {
  return showToast('info', message, options);
};

// Promise-based toast helper
const showPromiseToast = <T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  },
  options?: {
    successOptions?: ToastOptions;
    errorOptions?: ToastOptions;
  }
) => {
  const { successOptions, errorOptions } = options || {};

  // Show loading toast
  const loadingToastId = showToast('info', messages.loading);

  return promise
    .then((data) => {
      // Dismiss loading toast
      if (loadingToastId && toastController) {
        toastController.dismissToast(loadingToastId);
      }
      // Show success toast
      const successMessage = typeof messages.success === 'function' ? messages.success(data) : messages.success;
      showToast('success', successMessage, successOptions);
      return data;
    })
    .catch((error) => {
      // Dismiss loading toast
      if (loadingToastId && toastController) {
        toastController.dismissToast(loadingToastId);
      }
      // Show error toast
      const errorMessage = typeof messages.error === 'function' ? messages.error(error) : messages.error;
      showToast('error', errorMessage, errorOptions);
      throw error;
    });
};

// Dismiss specific toast
const dismissToast = (toastId?: string | number) => {
  if (toastController && toastId) {
    toastController.dismissToast(toastId.toString());
  } else if (toastController) {
    toastController.dismissAllToasts();
  }
};

// Dismiss all toasts
const dismissAllToasts = () => {
  if (toastController) {
    toastController.dismissAllToasts();
  }
};

export {
  showToast,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showPromiseToast,
  dismissToast,
  dismissAllToasts,
  type ToastType,
  type ToastAction,
  type ToastOptions,
};
