import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        /^https:\/\/api\.tdcmarket\.com/,
        /^https:\/\/.*\.vercel\.app/,
      ],
    }),
    new Sentry.Replay({
      sessionSampleRate: 0.1,
      errorSampleRate: 1.0,
    }),
  ],
  beforeSend(event) {
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'ChunkLoadError') {
        return null;
      }
      if (error?.type === 'ResizeObserver loop limit exceeded') {
        return null;
      }
    }
    return event;
  },
});

