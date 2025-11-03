'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics } from '@/lib/analytics/analytics-tracker';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize analytics
  useEffect(() => {
    analytics.init();
  }, []);

  // Track page views
  useEffect(() => {
    const url = pathname + (searchParams ? `?${searchParams.toString()}` : '');
    analytics.pageView(url);
  }, [pathname, searchParams]);

  return <>{children}</>;
}

