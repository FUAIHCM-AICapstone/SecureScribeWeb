/**
 * Date formatting utility using native Intl.DateTimeFormat
 * Replaces date-fns to reduce bundle size (~45-50 kB savings)
 */

export function formatDate(date: string | Date, format: 'short' | 'long' | 'datetime' = 'short', locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const optionsMap: Record<'short' | 'long' | 'datetime', Intl.DateTimeFormatOptions> = {
    short: { year: '2-digit', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    datetime: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  };
  
  const options = optionsMap[format] || optionsMap.short;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

export function formatDateTime(date: string | Date, locale: string = 'en-US'): string {
  return formatDate(date, 'datetime', locale);
}

export function formatStartTime(date: string | Date, locale: string = 'en-US'): string {
  return formatDate(date, 'long', locale);
}

/**
 * Helper functions to replace date-fns
 */
export function isPast(date: Date): boolean {
  return date < new Date();
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}
