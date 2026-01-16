import { useToastController, Toast, ToastTitle, ToastBody, ToastTrigger } from '@fluentui/react-toast';
import { Button } from '@/lib/components';
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
  playSound?: boolean;
}

// Function to play loud notification sound using Web Audio API
const playLoudNotificationSound = (power = 1.3) => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

  const createOsc = (type: OscillatorType, freq: number) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  };

  const gain = ctx.createGain();
  gain.connect(ctx.destination);

  const distort = ctx.createWaveShaper();
  const curve = new Float32Array(44100);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / curve.length) * 2 - 1;
    curve[i] = x < 0 ? -(Math.pow(Math.abs(x), 0.4)) : Math.pow(x, 0.4);
  }
  distort.curve = curve;
  distort.connect(gain);

  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -40;
  compressor.ratio.value = 15;
  compressor.attack.value = 0.001;
  compressor.release.value = 0.12;
  compressor.connect(distort);

  // High-tech pluck click
  (() => {
    const o = createOsc("triangle", 2200);
    const g = ctx.createGain();
    o.connect(g);
    g.connect(compressor);

    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.8 * power, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    o.start(now);
    o.stop(now + 0.08);
  })();

  // Sweep chirp
  (() => {
    const o = createOsc("sawtooth", 900);
    const g = ctx.createGain();
    o.connect(g);
    g.connect(compressor);

    const now = ctx.currentTime + 0.03;
    o.frequency.setValueAtTime(900, now);
    o.frequency.exponentialRampToValueAtTime(2400, now + 0.22);

    g.gain.setValueAtTime(0.55 * power, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    o.start(now);
    o.stop(now + 0.22);
  })();

  // Sub punch
  (() => {
    const o = createOsc("sine", 120);
    const g = ctx.createGain();
    o.connect(g);
    g.connect(compressor);

    const now = ctx.currentTime + 0.05;
    o.frequency.setValueAtTime(160, now);
    o.frequency.exponentialRampToValueAtTime(70, now + 0.18);

    g.gain.setValueAtTime(0.9 * power, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    o.start(now);
    o.stop(now + 0.18);
  })();
};

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
    onAutoClose,
    playSound = false
  } = options;

  console.log('[showToast]', { type, message, description, duration, action, playSound });

  // Play sound if requested
  if (playSound) {
    try {
      playLoudNotificationSound();
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

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

const showNotificationToast = (message: string, options?: Omit<ToastOptions, 'duration' | 'playSound'> & { duration?: number }) => {
  return showToast('info', message, { playSound: true, ...options });
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
  showNotificationToast,
  showPromiseToast,
  dismissToast,
  dismissAllToasts,
  type ToastType,
  type ToastAction,
  type ToastOptions,
};
