// File Management API
// Based on backend endpoints from app/api/endpoints/file.py

import type {
  FileFilter,
  FileMoveRequest,
  FileQueryParams,
  FileResponse,
  FileUploadData,
  FileWithMeeting,
  FileWithProject,
} from 'types/file.type';
import axiosInstance from './axiosInstance';
import {
  ApiWrapper,
  FormDataBuilder,
  QueryBuilder,
  UuidValidator,
} from './utilities';

/**
 * Upload a file
 */
export const uploadFile = async (
  fileData: FileUploadData,
): Promise<FileResponse> => {
  const formData = FormDataBuilder.buildWithFile(fileData.file);

  // Backend expects project_id/meeting_id as query params (not form fields)
  const queryString = QueryBuilder.build({
    project_id: fileData.project_id,
    meeting_id: fileData.meeting_id,
  });

  return ApiWrapper.execute(() =>
    axiosInstance.post(`/files/upload${queryString}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  );
};

/**
 * Get all files with filtering and pagination
 */
export const getFiles = async (
  filters?: FileFilter,
  params?: FileQueryParams,
): Promise<{ data: FileResponse[]; pagination: any }> => {
  const queryParams = {
    ...filters,
    ...params,
  };

  const queryString = QueryBuilder.build(queryParams);

  return ApiWrapper.executePaginated(() =>
    axiosInstance.get(`/files${queryString}`),
  );
};

/**
 * Get a specific file by ID
 */
export const getFile = async (fileId: string): Promise<FileResponse> => {
  UuidValidator.validate(fileId, 'File ID');

  return ApiWrapper.execute(() => axiosInstance.get(`/files/${fileId}`));
};

/**
 * Download a file by ID
 */
export const downloadFile = async (fileId: string): Promise<Blob> => {
  UuidValidator.validate(fileId, 'File ID');

  const response = await axiosInstance.get(`/files/${fileId}?download=true`, {
    responseType: 'blob',
  });

  return response.data;
};

/**
 * Update a file
 */
export const updateFile = async (
  fileId: string,
  updates: { filename?: string; file_type?: string },
): Promise<FileResponse> => {
  UuidValidator.validate(fileId, 'File ID');

  return ApiWrapper.execute(() =>
    axiosInstance.put(`/files/${fileId}`, updates),
  );
};

/**
 * Delete a file
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  UuidValidator.validate(fileId, 'File ID');

  return ApiWrapper.executeVoid(() => axiosInstance.delete(`/files/${fileId}`));
};

/**
 * Get files for a specific project
 */
export const getProjectFiles = async (
  projectId: string,
  params?: FileQueryParams,
): Promise<{ data: FileWithProject[]; pagination: any }> => {
  UuidValidator.validate(projectId, 'Project ID');

  const queryParams = {
    ...params,
  };

  const queryString = QueryBuilder.build(queryParams);

  return ApiWrapper.executePaginated(() =>
    axiosInstance.get(`/projects/${projectId}/files${queryString}`),
  );
};

/**
 * Get files for a specific meeting
 */
export const getMeetingFiles = async (
  meetingId: string,
  params?: FileQueryParams,
): Promise<{ data: FileWithMeeting[]; pagination: any }> => {
  UuidValidator.validate(meetingId, 'Meeting ID');

  const queryParams = {
    ...params,
  };

  const queryString = QueryBuilder.build(queryParams);

  return ApiWrapper.executePaginated(() =>
    axiosInstance.get(`/meetings/${meetingId}/files${queryString}`),
  );
};

/**
 * Move a file to a project or meeting
 */
export const moveFile = async (
  fileId: string,
  moveRequest: FileMoveRequest,
): Promise<FileResponse> => {
  UuidValidator.validate(fileId, 'File ID');

  return ApiWrapper.execute(() =>
    axiosInstance.post(`/files/${fileId}/move`, moveRequest),
  );
};
