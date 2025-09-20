// Enterprise-grade error handling system
export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  timestamp: number;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
  timestamp: string;
  statusCode?: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorInfo[] = [];
  private maxQueueSize = 100;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        stack: event.error?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        componentStack: 'Global Error Handler'
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        componentStack: 'Unhandled Promise Rejection'
      });
    });
  }

  handleError(errorInfo: Partial<ErrorInfo>) {
    const fullErrorInfo: ErrorInfo = {
      message: errorInfo.message || 'Unknown error',
      stack: errorInfo.stack,
      componentStack: errorInfo.componentStack,
      errorBoundary: errorInfo.errorBoundary,
      timestamp: errorInfo.timestamp || Date.now(),
      userAgent: errorInfo.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
      url: errorInfo.url || (typeof window !== 'undefined' ? window.location.href : ''),
      userId: errorInfo.userId,
      sessionId: errorInfo.sessionId
    };

    // Add to queue
    this.errorQueue.push(fullErrorInfo);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', fullErrorInfo);
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(fullErrorInfo);
    }
  }

  private async sendToErrorService(errorInfo: ErrorInfo) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo)
      });
    } catch (error) {
      console.error('Failed to send error to service:', error);
    }
  }

  getErrorQueue(): ErrorInfo[] {
    return [...this.errorQueue];
  }

  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  // React Error Boundary helper
  static createErrorBoundary(componentName: string) {
    return (error: Error, errorInfo: any) => {
      ErrorHandler.getInstance().handleError({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundary: componentName
      });
    };
  }

  // Static method for error handling in async functions
  static async withErrorHandling<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      ErrorHandler.getInstance().handleError({
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        componentStack: context || 'withErrorHandling'
      });
      throw error;
    }
  }

  // API response helpers
  static createApiSuccessResponse(data: any, message?: string) {
    return {
      success: true,
      data,
      message: message || 'Operation successful',
      timestamp: new Date().toISOString()
    };
  }

  static createApiErrorResponse(error: string, code?: string, statusCode: number = 400) {
    return {
      success: false,
      error,
      code: code || 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
      statusCode
    };
  }

  static logError(error: Error, context?: string) {
    ErrorHandler.getInstance().handleError({
      message: error.message,
      stack: error.stack,
      componentStack: context
    });
  }
}

// React hook for error handling
export function useErrorHandler() {
  const errorHandler = ErrorHandler.getInstance();
  
  return {
    handleError: (error: Error, context?: string) => {
      errorHandler.handleError({
        message: error.message,
        stack: error.stack,
        componentStack: context
      });
    },
    getErrors: () => errorHandler.getErrorQueue(),
    clearErrors: () => errorHandler.clearErrorQueue()
  };
}

// Export aliases for backward compatibility
export const AppErrorHandler = ErrorHandler;
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  BAD_REQUEST: 'BAD_REQUEST',
  SERVER_ERROR: 'SERVER_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  UNPROCESSABLE_ENTITY: 'UNPROCESSABLE_ENTITY'
};

// Validation functions
export function validateRequired(value: any, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throw new Error(`${fieldName} is required`);
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
}

export function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  if (!/(?=.*[a-z])/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/(?=.*\d)/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
}