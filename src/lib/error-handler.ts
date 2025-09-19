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