// TDC Market - Advanced Error Handling System
// Comprehensive error management for global marketplace

import React from 'react';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp: number;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  type: 'client' | 'server' | 'network' | 'validation' | 'business';
  severity: 'low' | 'medium' | 'high' | 'critical';
  context: ErrorContext;
  resolved: boolean;
  createdAt: number;
}

class ErrorHandler {
  private errors: ErrorReport[] = [];
  private isEnabled = true;

  // Report an error
  report(
    error: Error | string,
    type: ErrorReport['type'] = 'client',
    severity: ErrorReport['severity'] = 'medium',
    context: Partial<ErrorContext> = {}
  ): string {
    if (!this.isEnabled) return '';

    const errorId = this.generateErrorId();
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    const errorReport: ErrorReport = {
      id: errorId,
      message: errorMessage,
      stack: errorStack,
      type,
      severity,
      context: {
        timestamp: Date.now(),
        ...context
      },
      resolved: false,
      createdAt: Date.now()
    };

    this.errors.push(errorReport);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 Error [${severity.toUpperCase()}]:`, errorMessage, context);
      if (errorStack) {
        console.error('Stack trace:', errorStack);
      }
    }

    // Send to external monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorReport);
    }

    return errorId;
  }

  // Report API errors
  reportApiError(
    endpoint: string,
    method: string,
    status: number,
    error: Error | string,
    context: Partial<ErrorContext> = {}
  ): string {
    const severity = this.getSeverityFromStatus(status);
    const type = status >= 500 ? 'server' : 'network';

    return this.report(
      `API Error: ${method} ${endpoint} - ${status} - ${typeof error === 'string' ? error : error.message}`,
      type,
      severity,
      {
        ...context,
        action: `api_${method.toLowerCase()}`,
        metadata: { endpoint, method, status }
      }
    );
  }

  // Report validation errors
  reportValidationError(
    field: string,
    value: any,
    rule: string,
    context: Partial<ErrorContext> = {}
  ): string {
    return this.report(
      `Validation Error: ${field} failed validation (${rule})`,
      'validation',
      'medium',
      {
        ...context,
        action: 'validation',
        metadata: { field, value, rule }
      }
    );
  }

  // Report business logic errors
  reportBusinessError(
    operation: string,
    reason: string,
    context: Partial<ErrorContext> = {}
  ): string {
    return this.report(
      `Business Error: ${operation} - ${reason}`,
      'business',
      'high',
      {
        ...context,
        action: operation,
        metadata: { reason }
      }
    );
  }

  // Report component errors
  reportComponentError(
    component: string,
    error: Error | string,
    props?: Record<string, any>,
    context: Partial<ErrorContext> = {}
  ): string {
    return this.report(
      `Component Error: ${component} - ${typeof error === 'string' ? error : error.message}`,
      'client',
      'medium',
      {
        ...context,
        component,
        metadata: { props }
      }
    );
  }

  // Get error severity from HTTP status
  private getSeverityFromStatus(status: number): ErrorReport['severity'] {
    if (status >= 500) return 'critical';
    if (status >= 400) return 'high';
    if (status >= 300) return 'medium';
    return 'low';
  }

  // Generate unique error ID
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Send to external monitoring service
  private async sendToMonitoringService(errorReport: ErrorReport) {
    try {
      // In a real implementation, you would send to services like:
      // - Sentry
      // - LogRocket
      // - Bugsnag
      // - Custom monitoring service

      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });
    } catch (error) {
      // Fallback: log to console if monitoring service fails
      console.error('Failed to send error to monitoring service:', error);
    }
  }

  // Get error summary
  getSummary() {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const recentErrors = this.errors.filter(e => e.createdAt > last24Hours);

    const byType = recentErrors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySeverity = recentErrors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      period: 'last_24_hours',
      total: recentErrors.length,
      byType,
      bySeverity,
      critical: recentErrors.filter(e => e.severity === 'critical').length,
      unresolved: recentErrors.filter(e => !e.resolved).length
    };
  }

  // Get recent errors
  getRecentErrors(limit: number = 50) {
    return this.errors
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  // Mark error as resolved
  resolveError(errorId: string): boolean {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      return true;
    }
    return false;
  }

  // Clear resolved errors
  clearResolvedErrors() {
    this.errors = this.errors.filter(e => !e.resolved);
  }

  // Clear all errors
  clear() {
    this.errors = [];
  }

  // Enable/disable error reporting
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Export errors for analysis
  exportErrors() {
    return {
      errors: this.errors,
      summary: this.getSummary(),
      timestamp: Date.now()
    };
  }
}

// Global error handler instance
export const errorHandler = new ErrorHandler();

// Error boundary for React components
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorHandler.reportComponentError(
      this.constructor.name,
      error,
      this.props,
      {
        component: 'ErrorBoundary',
        action: 'componentDidCatch',
        metadata: errorInfo
      }
    );
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return React.createElement(FallbackComponent, { error: this.state.error! });
    }

    return this.props.children;
  }
}

// Default error fallback component
const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => 
  React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-gray-50' },
    React.createElement('div', { className: 'max-w-md w-full bg-white shadow-lg rounded-lg p-6' },
      React.createElement('h2', { className: 'text-lg font-medium text-gray-900 text-center mb-2' }, 'Bir Hata Oluştu'),
      React.createElement('p', { className: 'text-sm text-gray-600 text-center mb-4' }, 'Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.'),
      React.createElement('button', { 
        onClick: () => window.location.reload(),
        className: 'w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700'
      }, 'Sayfayı Yenile')
    )
  );

// Utility functions for common error scenarios
export const errorUtils = {
  // Handle API errors
  handleApiError: (error: any, endpoint: string, method: string = 'GET') => {
    const status = error.status || error.response?.status || 500;
    const message = error.message || error.response?.data?.message || 'API Error';
    
    return errorHandler.reportApiError(endpoint, method, status, message);
  },

  // Handle validation errors
  handleValidationError: (field: string, value: any, rule: string) => {
    return errorHandler.reportValidationError(field, value, rule);
  },

  // Handle network errors
  handleNetworkError: (error: Error, url: string) => {
    return errorHandler.report(
      `Network Error: ${error.message}`,
      'network',
      'high',
      { action: 'network_request', metadata: { url } }
    );
  },

  // Handle timeout errors
  handleTimeoutError: (operation: string, timeout: number) => {
    return errorHandler.report(
      `Timeout Error: ${operation} timed out after ${timeout}ms`,
      'network',
      'high',
      { action: 'timeout', metadata: { operation, timeout } }
    );
  }
};

export default errorHandler;
