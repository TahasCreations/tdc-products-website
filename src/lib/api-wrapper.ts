import { AppErrorHandler, ApiResponse, ErrorCodes } from './error-handler';

// API wrapper with error handling
export class ApiWrapper {
  static async request<T,>(
    url: string,
    options: RequestInit = {},
    context?: string
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle HTTP errors
        if (response.status === 401) {
          return AppErrorHandler.createApiErrorResponse(
            ErrorCodes.AUTH_UNAUTHORIZED,
            'Oturum süresi dolmuş, lütfen tekrar giriş yapın'
          );
        }

        if (response.status === 403) {
          return AppErrorHandler.createApiErrorResponse(
            ErrorCodes.AUTH_FORBIDDEN,
            'Bu işlem için yetkiniz bulunmuyor'
          );
        }

        if (response.status === 404) {
          return AppErrorHandler.createApiErrorResponse(
            ErrorCodes.RESOURCE_NOT_FOUND,
            'Kaynak bulunamadı'
          );
        }

        if (response.status === 429) {
          return AppErrorHandler.createApiErrorResponse(
            ErrorCodes.RATE_LIMIT_EXCEEDED,
            'Çok fazla istek gönderildi, lütfen bekleyin'
          );
        }

        if (response.status >= 500) {
          return AppErrorHandler.createApiErrorResponse(
            ErrorCodes.INTERNAL_SERVER_ERROR,
            'Sunucu hatası, lütfen daha sonra tekrar deneyin'
          );
        }

        // Handle API error response
        if (data.error) {
          return AppErrorHandler.createApiErrorResponse(
            data.code || ErrorCodes.INTERNAL_SERVER_ERROR,
            data.error,
            data.details
          );
        }

        return AppErrorHandler.createApiErrorResponse(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      // Success response
      return AppErrorHandler.createApiSuccessResponse(data.data || data);

    } catch (error) {
      AppErrorHandler.logError(error as Error, context);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return AppErrorHandler.createApiErrorResponse(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Bağlantı hatası, internet bağlantınızı kontrol edin'
        );
      }

      return AppErrorHandler.createApiErrorResponse(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        'Beklenmeyen bir hata oluştu'
      );
    }
  }

  static async get<T,>(
    url: string,
    context?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' }, context);
  }

  static async post<T,>(
    url: string,
    data?: any,
    context?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      url,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      context
    );
  }

  static async put<T,>(
    url: string,
    data?: any,
    context?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      url,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      context
    );
  }

  static async delete<T,>(
    url: string,
    context?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' }, context);
  }
}

// React hook for API calls
export const useApi = () => {
  const callApi = async <T,>(
    operation: () => Promise<ApiResponse<T>>,
    context?: string
  ): Promise<ApiResponse<T>> => {
    try {
      return await operation();
    } catch (error) {
      AppErrorHandler.logError(error as Error, context);
      return AppErrorHandler.createApiErrorResponse(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        'Beklenmeyen bir hata oluştu'
      );
    }
  };

  return { callApi };
};
