// File Utilities for SecureScribe
// Helper functions for file handling, validation, and display

import {
  Document24Regular,
  Image24Regular,
  DocumentPdf24Regular,
  DocumentTable24Regular,
  SlideText24Regular,
  Archive24Regular,
  Code24Regular,
  Video24Regular,
  MusicNote224Regular,
} from '@fluentui/react-icons';

// File type constants
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

export const ALLOWED_FILE_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Spreadsheets
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // Presentations
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Text
  'text/plain',
  'text/csv',
];

export const ALLOWED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.txt',
  '.csv',
];

/**
 * Format file size from bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  if (bytes === 1) return '1 Byte';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file icon based on MIME type
 */
export function getFileIcon(mimeType: string) {
  if (!mimeType) return Document24Regular;

  const type = mimeType.toLowerCase();

  // Images
  if (type.startsWith('image/')) {
    return Image24Regular;
  }

  // PDFs
  if (type === 'application/pdf') {
    return DocumentPdf24Regular;
  }

  // Spreadsheets
  if (
    type === 'application/vnd.ms-excel' ||
    type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'text/csv'
  ) {
    return DocumentTable24Regular;
  }

  // Presentations
  if (
    type === 'application/vnd.ms-powerpoint' ||
    type ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return SlideText24Regular;
  }

  // Archives
  if (
    type === 'application/zip' ||
    type === 'application/x-rar-compressed' ||
    type === 'application/x-7z-compressed'
  ) {
    return Archive24Regular;
  }

  // Code files
  if (
    type === 'text/javascript' ||
    type === 'application/json' ||
    type === 'text/html' ||
    type === 'text/css' ||
    type.includes('xml')
  ) {
    return Code24Regular;
  }

  // Videos
  if (type.startsWith('video/')) {
    return Video24Regular;
  }

  // Audio
  if (type.startsWith('audio/')) {
    return MusicNote224Regular;
  }

  // Default
  return Document24Regular;
}

/**
 * Get file type category from MIME type
 */
export function getFileTypeFromMime(mimeType: string): string {
  if (!mimeType) return 'other';

  const type = mimeType.toLowerCase();

  if (type.startsWith('image/')) return 'image';
  if (type === 'application/pdf') return 'pdf';
  if (
    type === 'application/vnd.ms-excel' ||
    type ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    type === 'text/csv'
  )
    return 'spreadsheet';
  if (
    type === 'application/vnd.ms-powerpoint' ||
    type ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  )
    return 'presentation';
  if (
    type === 'application/msword' ||
    type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    type === 'text/plain'
  )
    return 'document';

  return 'other';
}

/**
 * Check if file is an image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType?.toLowerCase().startsWith('image/') || false;
}

/**
 * Check if file is a PDF
 */
export function isPdfFile(mimeType: string): boolean {
  return mimeType?.toLowerCase() === 'application/pdf' || false;
}

/**
 * Check if file preview is supported
 */
export function isPreviewSupported(mimeType: string): boolean {
  return isImageFile(mimeType) || isPdfFile(mimeType);
}

/**
 * Validate file type
 */
export function validateFileType(file: File): boolean {
  if (!file) return false;

  // Check MIME type
  if (ALLOWED_FILE_TYPES.includes(file.type)) {
    return true;
  }

  // Fallback: Check file extension
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  return ALLOWED_FILE_EXTENSIONS.includes(extension);
}

/**
 * Validate file size
 */
export function validateFileSize(
  file: File,
  maxSize: number = MAX_FILE_SIZE,
): boolean {
  if (!file) return false;
  return file.size <= maxSize;
}

/**
 * Validate file (both type and size)
 */
export function validateFile(
  file: File,
  maxSize: number = MAX_FILE_SIZE,
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!validateFileType(file)) {
    return {
      valid: false,
      error: 'File type not supported. Please upload a document or image file.',
    };
  }

  if (!validateFileSize(file, maxSize)) {
    return {
      valid: false,
      error: `File size exceeds ${formatFileSize(maxSize)}. Please select a smaller file.`,
    };
  }

  return { valid: true };
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Get filename without extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  if (!filename) return '';
  const parts = filename.split('.');
  if (parts.length === 1) return filename;
  return parts.slice(0, -1).join('.');
}

/**
 * Truncate filename for display
 */
export function truncateFilename(
  filename: string,
  maxLength: number = 30,
): string {
  if (!filename || filename.length <= maxLength) return filename;

  const extension = getFileExtension(filename);
  const nameWithoutExt = getFileNameWithoutExtension(filename);

  const availableLength = maxLength - extension.length - 4; // -4 for "..." and "."

  if (availableLength < 5) {
    return `${filename.substring(0, maxLength - 3)}...`;
  }

  return `${nameWithoutExt.substring(0, availableLength)}...${extension ? `.${extension}` : ''}`;
}

/**
 * Get color for file type badge
 */
export function getFileTypeBadgeColor(
  mimeType: string,
): 'informative' | 'success' | 'warning' | 'danger' | 'important' {
  const type = getFileTypeFromMime(mimeType);

  switch (type) {
    case 'image':
      return 'success';
    case 'pdf':
      return 'danger';
    case 'document':
      return 'informative';
    case 'spreadsheet':
      return 'success';
    case 'presentation':
      return 'warning';
    default:
      return 'important';
  }
}
