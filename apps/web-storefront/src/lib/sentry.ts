import * as Sentry from '@sentry/nextjs';
import { env } from '@tdc/config';

// Initialize Sentry for Next.js
export const initSentry = () => {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    profilesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/api\.tdcmarket\.com/,
          /^https:\/\/.*\.vercel\.app/,
        ],
      }),
      new Sentry.Replay({
        // Capture 10% of all sessions for replay
        sessionSampleRate: 0.1,
        // Capture 100% of sessions with an error
        errorSampleRate: 1.0,
      }),
    ],
    beforeSend(event) {
      // Filter out certain errors
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'ChunkLoadError') {
          return null; // Ignore chunk load errors
        }
        if (error?.type === 'ResizeObserver loop limit exceeded') {
          return null; // Ignore ResizeObserver errors
        }
      }
      return event;
    },
  });
};

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

// API call monitoring
export const traceApiCall = async <T>(
  apiName: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  return Sentry.startSpan(
    { name: apiName, op: 'http.client' },
    async () => {
      try {
        return await apiCall();
      } catch (error) {
        Sentry.captureException(error as Error, {
          tags: { api: apiName },
        });
        throw error;
      }
    }
  );
};

// Component error boundary
export const withErrorBoundary = (Component: React.ComponentType<any>) => {
  return Sentry.withErrorBoundary(Component, {
    fallback: ({ error, resetError }) => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            We're sorry, but something went wrong. Please try again.
          </p>
          <button
            onClick={resetError}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    ),
  });
};

