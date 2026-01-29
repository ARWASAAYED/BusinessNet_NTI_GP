import { useState, useCallback } from 'react';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UseMediaUploadReturn {
  uploadFile: (file: File) => Promise<string>;
  uploadFiles: (files: File[]) => Promise<string[]>;
  progress: UploadProgress | null;
  isUploading: boolean;
  error: string | null;
}

export const useMediaUpload = (): UseMediaUploadReturn => {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Simulate upload progress
      // In a real implementation, you would use XMLHttpRequest or fetch with progress tracking
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress({
          loaded: (file.size * i) / 100,
          total: file.size,
          percentage: i,
        });
      }

      // In a real implementation, you would upload to your server or cloud storage
      // const response = await api.post('/upload', formData);
      // return response.data.url;

      // For now, return a mock URL
      const mockUrl = URL.createObjectURL(file);
      return mockUrl;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, []);

  const uploadFiles = useCallback(async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      const url = await uploadFile(file);
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
