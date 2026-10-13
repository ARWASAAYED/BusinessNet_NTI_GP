import { useState, useCallback } from 'react';
import api from '@/services/api';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseMediaUploadReturn {
  uploadFile: (file: File, folder?: string) => Promise<string>;
  uploadFiles: (files: File[], folder?: string) => Promise<string[]>;
  progress: UploadProgress | null;
  isUploading: boolean;
  error: string | null;
}

export const useMediaUpload = (): UseMediaUploadReturn => {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, folder: string = 'uploads'): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await api.post('/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || file.size;
          const loaded = progressEvent.loaded;
          const percentage = Math.round((loaded / total) * 100);
          setProgress({ loaded, total, percentage });
        },
      });

      const url: string = response.data?.data?.url || response.data?.url;
      if (!url) throw new Error('Upload succeeded but no URL was returned');
      return url;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, []);

  const uploadFiles = useCallback(async (files: File[], folder: string = 'uploads'): Promise<string[]> => {
    const urls: string[] = [];

    for (const file of files) {
      const url = await uploadFile(file, folder);
      urls.push(url);
    }

    return urls;
  }, [uploadFile]);

  return {
    uploadFile,
    uploadFiles,
    progress,
    isUploading,
    error,
  };
};
