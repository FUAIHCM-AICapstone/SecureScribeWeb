import { toast } from 'sonner';

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

const showToast = (
  type: ToastType,
  message: string,
  options: ToastOptions = {}
) => {
  const {
    duration = 4000,
    action,
    description,
    id,
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

  // Enhanced toast options for Sonner
  const toastOptions = {
    duration,
    id,
    action: action ? {
      label: action.label,
      onClick: action.onClick,
    } : undefined,
    onDismiss,
    onAutoClose,
  };

  switch (type) {
    case 'success':
      return toast.success(toastTitle, {
        ...toastOptions,
        description: fullDescription,
      });
    case 'error':
      return toast.error(toastTitle, {
        ...toastOptions,
        description: fullDescription,
      });
    case 'warning':
      return toast.warning(toastTitle, {
        ...toastOptions,
        description: fullDescription,
      });
    case 'info':
      return toast.info(toastTitle, {
        ...toastOptions,
        description: fullDescription,
      });
    default:
      return toast(toastTitle, {
        ...toastOptions,
        description: fullDescription,
      });
  }
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

  return toast.promise(promise, {
    loading: messages.loading,
    success: (data) => {
      const successMessage = typeof messages.success === 'function' ? messages.success(data) : messages.success;
      showSuccessToast(successMessage, successOptions);
      return successMessage;
    },
    error: (error) => {
      const errorMessage = typeof messages.error === 'function' ? messages.error(error) : messages.error;
      showErrorToast(errorMessage, errorOptions);
      return errorMessage;
    },
  });
};

// Dismiss specific toast
const dismissToast = (toastId?: string | number) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

// Dismiss all toasts
const dismissAllToasts = () => {
  toast.dismiss();
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
