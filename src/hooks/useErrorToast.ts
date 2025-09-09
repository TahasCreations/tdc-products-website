import { useCallback } from 'react';
import { useToast } from '@/components/Toast';
import { AppErrorHandler, ErrorCodes, ApiResponse } from '@/lib/error-handler';

export const useErrorToast = () => {
  const { addToast } = useToast();

  const showError = useCallback((
    error: string | Error | ApiResponse,
    title: string = 'Hata',
    duration: number = 5000
  ) => {
    let message: string;

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (error && typeof error === 'object' && 'error' in error) {
      message = error.error;
    } else {
      message = 'Beklenmeyen bir hata oluştu';
    }

    addToast({
      type: 'error',
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showSuccess = useCallback((
    message: string,
    title: string = 'Başarılı',
    duration: number = 3000
  ) => {
    addToast({
      type: 'success',
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showWarning = useCallback((
    message: string,
    title: string = 'Uyarı',
    duration: number = 4000
  ) => {
    addToast({
      type: 'warning',
      title,
      message,
      duration,
    });
  }, [addToast]);

  const showInfo = useCallback((
    message: string,
    title: string = 'Bilgi',
    duration: number = 4000
  ) => {
    addToast({
      type: 'info',
      title,
      message,
      duration,
    });
  }, [addToast]);

  const handleApiError = useCallback((
    response: ApiResponse,
    context?: string
  ) => {
    if (!response.success) {
      // Log error
      AppErrorHandler.logError(
        new Error(response.error),
        context
      );

      // Show user-friendly error
      showError(response.error, 'İşlem Başarısız');
    }
  }, [showError]);

  const handleAsyncOperation = useCallback(async <T,>(
    operation: () => Promise<ApiResponse<T>>,
    successMessage?: string,
    errorContext?: string
  ): Promise<T | null> => {
    try {
      const response = await operation();
      
      if (response.success) {
        if (successMessage) {
          showSuccess(successMessage);
        }
        return response.data;
      } else {
        handleApiError(response, errorContext);
        return null;
      }
    } catch (error) {
      showError(error as Error, 'Beklenmeyen Hata', 5000);
      AppErrorHandler.logError(error as Error, errorContext);
      return null;
    }
  }, [showSuccess, showError, handleApiError]);

  return {
    showError,
    showSuccess,
    showWarning,
    showInfo,
    handleApiError,
    handleAsyncOperation,
  };
};
