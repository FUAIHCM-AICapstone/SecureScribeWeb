import { format } from 'date-fns';

/**
 * Utility functions for Meeting Detail page
 */

export const formatDateTime = (dateString: string | null, t: (key: string) => string): string => {
  if (!dateString) return t('noDescription');
  try {
    return format(new Date(dateString), 'PPpp');
  } catch {
    return t('invalidDate');
  }
};

export const formatDuration = (durationSeconds: number): string => {
  return `${Math.floor(durationSeconds / 60)}m ${Math.floor(durationSeconds % 60)}s`;
};

export const getAudioFileName = (fileUrl: string | undefined): string => {
  return fileUrl?.split('/').pop() || 'Audio File';
};

export const validateAudioFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['audio/mpeg', 'audio/wav', 'audio/webm', 'audio/mp4'];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid audio file (MP3, WAV, WEBM, M4A)',
    };
  }
  
  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  return (bytes / 1024 / 1024).toFixed(2);
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};
