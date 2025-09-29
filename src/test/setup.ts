/**
 * Test Setup
 * Global test configuration and mocks
 */

import React from 'react';

// Mock vitest if not available
const vi = {
  mock: () => {},
  fn: () => () => {},
  clearAllMocks: () => {}
};

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}));

// Mock Next.js image
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    return React.createElement('img', { src, alt, ...props });
  }
}));

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => Promise.resolve({ data: [], error: null })),
      delete: vi.fn(() => Promise.resolve({ data: [], error: null }))
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signIn: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null }))
    }
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true, data: [] }),
    text: () => Promise.resolve(''),
    status: 200,
    statusText: 'OK'
  })
) as any;

// Mock console methods in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  vi.clearAllMocks();
  
  // Suppress console errors and warnings in tests unless explicitly needed
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
export const createMockContext = () => ({
  app: {
    version: '1.0.0',
    environment: 'test' as const,
    baseUrl: 'http://localhost:3000'
  },
  services: {
    storage: {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn()
    },
    api: {
      request: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    },
    events: {
      emit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      once: vi.fn()
    },
    logger: {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    },
    config: {
      get: vi.fn(),
      set: vi.fn(),
      has: vi.fn(),
      reset: vi.fn()
    }
  },
  hooks: {
    useConfig: vi.fn(),
    useService: vi.fn(),
    emit: vi.fn(),
    subscribe: vi.fn()
  }
});

export const createMockPlugin = (overrides: any = {}) => ({
  meta: {
    name: 'test-plugin',
    version: '1.0.0',
    description: 'Test plugin',
    category: 'utility',
    supportedPlatforms: ['web']
  },
  validateConfig: vi.fn(() => ({ valid: true })),
  init: vi.fn(),
  ...overrides
});
