// Global type definitions for the application

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    PerformanceObserver?: typeof PerformanceObserver;
  }
  
  interface PerformanceObserver {
    observe: (entry: PerformanceObserverInit) => void;
    disconnect: () => void;
  }
  
  interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
    lastInputTime: DOMHighResTimeStamp;
  }
}

// Next.js specific types
declare module 'next' {
  interface NextPageProps {
    params?: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
}

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Common interface for pagination
interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// Common interface for sorting
interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common interface for filtering
interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export {};
