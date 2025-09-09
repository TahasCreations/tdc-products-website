// Error handling utilities and types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  userId?: string;
  path?: string;
  userAgent?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Error codes enum
export enum ErrorCodes {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',
  
  // Validation errors
  VALIDATION_REQUIRED = 'VALIDATION_REQUIRED',
  VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',
  VALIDATION_TOO_LONG = 'VALIDATION_TOO_LONG',
  VALIDATION_TOO_SHORT = 'VALIDATION_TOO_SHORT',
  
  // Database errors
  DB_CONNECTION_ERROR = 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR = 'DB_QUERY_ERROR',
  DB_CONSTRAINT_ERROR = 'DB_CONSTRAINT_ERROR',
  DB_NOT_FOUND = 'DB_NOT_FOUND',
  
  // File upload errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  FILE_INVALID_TYPE = 'FILE_INVALID_TYPE',
  FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR',
  
  // Business logic errors
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
  PAYMENT_SERVICE_ERROR = 'PAYMENT_SERVICE_ERROR',
  
  // System errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
}

// User-friendly error messages
export const ErrorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.AUTH_INVALID_CREDENTIALS]: 'E-posta veya şifre hatalı',
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: 'Oturum süresi dolmuş, lütfen tekrar giriş yapın',
  [ErrorCodes.AUTH_UNAUTHORIZED]: 'Bu işlem için yetkiniz bulunmuyor',
  [ErrorCodes.AUTH_FORBIDDEN]: 'Bu kaynağa erişim yetkiniz yok',
  
  [ErrorCodes.VALIDATION_REQUIRED]: 'Bu alan zorunludur',
  [ErrorCodes.VALIDATION_INVALID_FORMAT]: 'Geçersiz format',
  [ErrorCodes.VALIDATION_TOO_LONG]: 'Çok uzun',
  [ErrorCodes.VALIDATION_TOO_SHORT]: 'Çok kısa',
  
  [ErrorCodes.DB_CONNECTION_ERROR]: 'Veritabanı bağlantı hatası',
  [ErrorCodes.DB_QUERY_ERROR]: 'Veritabanı sorgu hatası',
  [ErrorCodes.DB_CONSTRAINT_ERROR]: 'Veri kısıtlaması ihlali',
  [ErrorCodes.DB_NOT_FOUND]: 'Kayıt bulunamadı',
  
  [ErrorCodes.FILE_TOO_LARGE]: 'Dosya çok büyük',
  [ErrorCodes.FILE_INVALID_TYPE]: 'Geçersiz dosya türü',
  [ErrorCodes.FILE_UPLOAD_ERROR]: 'Dosya yükleme hatası',
  
  [ErrorCodes.BUSINESS_RULE_VIOLATION]: 'İş kuralı ihlali',
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'Yetersiz yetki',
  [ErrorCodes.RESOURCE_NOT_FOUND]: 'Kaynak bulunamadı',
  [ErrorCodes.RESOURCE_ALREADY_EXISTS]: 'Kaynak zaten mevcut',
  
  [ErrorCodes.EXTERNAL_SERVICE_ERROR]: 'Harici servis hatası',
  [ErrorCodes.EMAIL_SERVICE_ERROR]: 'E-posta servis hatası',
  [ErrorCodes.PAYMENT_SERVICE_ERROR]: 'Ödeme servis hatası',
  
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Sunucu hatası',
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'Çok fazla istek gönderildi',
  [ErrorCodes.MAINTENANCE_MODE]: 'Sistem bakımda',
};

// Error handler class
export class AppErrorHandler {
  static createError(
    code: ErrorCodes,
    message?: string,
    details?: any,
    userId?: string,
    path?: string
  ): AppError {
    return {
      code,
      message: message || ErrorMessages[code],
      details,
      timestamp: new Date().toISOString(),
      userId,
      path,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
    };
  }

  static createApiErrorResponse(
    code: ErrorCodes,
    message?: string,
    details?: any
  ): ErrorResponse {
    return {
      success: false,
      error: message || ErrorMessages[code],
      code,
      details,
    };
  }

  static createApiSuccessResponse<T>(
    data: T,
    message?: string
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  static logError(error: AppError | Error, context?: string): void {
    const errorData = {
      ...error,
      context,
      timestamp: new Date().toISOString(),
    };

    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorData);
    }

    // TODO: Send to external logging service (Sentry, LogRocket, etc.)
    // this.sendToLoggingService(errorData);
  }

  static handleApiError(error: any, context?: string): ErrorResponse {
    let appError: AppError;

    if (error instanceof Error) {
      // Handle known error types
      if (error.message.includes('Invalid login credentials')) {
        appError = this.createError(ErrorCodes.AUTH_INVALID_CREDENTIALS);
      } else if (error.message.includes('JWT expired')) {
        appError = this.createError(ErrorCodes.AUTH_TOKEN_EXPIRED);
      } else if (error.message.includes('permission denied')) {
        appError = this.createError(ErrorCodes.AUTH_FORBIDDEN);
      } else if (error.message.includes('not found')) {
        appError = this.createError(ErrorCodes.RESOURCE_NOT_FOUND);
      } else if (error.message.includes('already exists')) {
        appError = this.createError(ErrorCodes.RESOURCE_ALREADY_EXISTS);
      } else {
        appError = this.createError(
          ErrorCodes.INTERNAL_SERVER_ERROR,
          'Beklenmeyen bir hata oluştu'
        );
      }
    } else {
      appError = this.createError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        'Beklenmeyen bir hata oluştu'
      );
    }

    this.logError(appError, context);
    return this.createApiErrorResponse(appError.code as ErrorCodes, appError.message, appError.details);
  }

  static async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: string
  ): Promise<ApiResponse<T>> {
    try {
      const result = await operation();
      return this.createApiSuccessResponse(result);
    } catch (error) {
      return this.handleApiError(error, context);
    }
  }
}

// Retry mechanism
export class RetryHandler {
  static async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }

    throw lastError!;
  }
}

// Validation helpers
export class ValidationError extends Error {
  constructor(
    public field: string,
    public code: ErrorCodes,
    message?: string
  ) {
    super(message || ErrorMessages[code]);
    this.name = 'ValidationError';
  }
}

export const validateRequired = (value: any, fieldName: string): void => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    throw new ValidationError(fieldName, ErrorCodes.VALIDATION_REQUIRED);
  }
};

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('email', ErrorCodes.VALIDATION_INVALID_FORMAT);
  }
};

export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string
): void => {
  if (value.length < min) {
    throw new ValidationError(fieldName, ErrorCodes.VALIDATION_TOO_SHORT);
  }
  if (value.length > max) {
    throw new ValidationError(fieldName, ErrorCodes.VALIDATION_TOO_LONG);
  }
};
