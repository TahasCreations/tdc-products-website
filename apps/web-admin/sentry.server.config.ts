import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app: undefined, router: undefined }),
  ],
  beforeSend(event) {
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.type === 'NotFoundError') {
        return null;
      }
    }
    return event;
  },
});

