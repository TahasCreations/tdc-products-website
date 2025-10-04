// Global type definitions for reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      render: (container: string, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
        'error-callback': () => void;
      }) => number;
      reset: (widgetId: number) => void;
      execute: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
    };
  }
}

export {};
