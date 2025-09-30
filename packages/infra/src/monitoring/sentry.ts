import * as Sentry from '@sentry/node';
import { env } from '@tdc/config';

// Initialize Sentry
export const initSentry = () => {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app: undefined, router: undefined }),
      new Sentry.Integrations.OnUncaughtException({
        onFatalError: (err) => {
          console.error('Fatal error:', err);
          process.exit(1);
        },
      }),
      new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
    ],
    beforeSend(event) {
      // Filter out certain errors in development
      if (env.NODE_ENV === 'development') {
        // Don't send 404 errors in development
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.type === 'NotFoundError') {
            return null;
          }
        }
      }
      return event;
    },
  });
};

// Sentry request handler for Express
export const sentryRequestHandler = Sentry.requestHandler();

// Sentry tracing handler for Express
export const sentryTracingHandler = Sentry.tracingHandler();

// Sentry error handler for Express
export const sentryErrorHandler = Sentry.errorHandler();

// Capture exception
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional', context);
    }
    Sentry.captureException(error);
  });
};

// Capture message
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      scope.setContext('additional', context);
    }
    Sentry.captureMessage(message, level);
  });
};

// Set user context
export const setUserContext = (user: { id: string; email: string; role: string; tenantId: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
  });
};

// Set tag
export const setTag = (key: string, value: string) => {
  Sentry.setTag(key, value);
};

// Set context
export const setContext = (key: string, context: Record<string, any>) => {
  Sentry.setContext(key, context);
};

// Add breadcrumb
export const addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
  Sentry.addBreadcrumb(breadcrumb);
};

// Performance monitoring
export const startTransaction = (name: string, op: string) => {
  return Sentry.startTransaction({ name, op });
};

// Database query monitoring
export const traceDatabaseQuery = async <T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> => {
  return Sentry.startSpan(
    { name: queryName, op: 'db.query' },
    async () => {
      try {
        return await queryFn();
      } catch (error) {
        Sentry.captureException(error as Error, {
          tags: { query: queryName },
        });
        throw error;
      }
    }
  );
};

// HTTP request monitoring
export const traceHttpRequest = async <T>(
  requestName: string,
  requestFn: () => Promise<T>
): Promise<T> => {
  return Sentry.startSpan(
    { name: requestName, op: 'http.client' },
    async () => {
      try {
        return await requestFn();
      } catch (error) {
        Sentry.captureException(error as Error, {
          tags: { request: requestName },
        });
        throw error;
      }
    }
  );
};

// File operation monitoring
export const traceFileOperation = async <T>(
  operationName: string,
  operationFn: () => Promise<T>
): Promise<T> => {
  return Sentry.startSpan(
    { name: operationName, op: 'file.operation' },
    async () => {
      try {
        return await operationFn();
      } catch (error) {
        Sentry.captureException(error as Error, {
          tags: { operation: operationName },
        });
        throw error;
      }
    }
  );
};

// Queue job monitoring
export const traceQueueJob = async <T>(
  jobName: string,
  jobFn: () => Promise<T>
): Promise<T> => {
  return Sentry.startSpan(
    { name: jobName, op: 'queue.job' },
    async () => {
      try {
        return await jobFn();
      } catch (error) {
        Sentry.captureException(error as Error, {
          tags: { job: jobName },
        });
        throw error;
      }
    }
  );
};

// Custom error classes for better error tracking
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
  }
}

// Error handler middleware
export const errorHandler = (error: Error, req: any, res: any, next: any) => {
  // Log error
  console.error('Error:', error);

  // Capture error in Sentry
  Sentry.captureException(error, {
    tags: {
      endpoint: req.path,
      method: req.method,
    },
    user: {
      id: req.user?.id,
      email: req.user?.email,
    },
  });

  // Send error response
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Generic error response
  return res.status(500).json({
    success: false,
    error: env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    timestamp: new Date().toISOString(),
  });
};

