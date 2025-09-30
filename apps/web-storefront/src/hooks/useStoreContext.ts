import { useEffect, useState } from 'react';

export interface StoreContext {
  tenantId: string | null;
  storeId: string | null;
  storeSlug: string | null;
  storeName: string | null;
  domain: string | null;
  isCustomDomain: boolean;
  isStoreRoute: boolean;
}

export function useStoreContext(): StoreContext | null {
  const [context, setContext] = useState<StoreContext | null>(null);

  useEffect(() => {
    // Get tenant context from headers (set by middleware)
    const tenantContextHeader = document.querySelector('meta[name="x-tenant-context"]');
    
    if (tenantContextHeader) {
      try {
        const contextData = JSON.parse(tenantContextHeader.getAttribute('content') || '{}');
        setContext(contextData);
      } catch (error) {
        console.error('Error parsing tenant context:', error);
      }
    } else {
      // Fallback: try to get from window object (set by server-side rendering)
      const windowContext = (window as any).__TENANT_CONTEXT__;
      if (windowContext) {
        setContext(windowContext);
      }
    }
  }, []);

  return context;
}

export function useStoreId(): string | null {
  const context = useStoreContext();
  return context?.storeId || null;
}

export function useTenantId(): string | null {
  const context = useStoreContext();
  return context?.tenantId || null;
}

export function useIsCustomDomain(): boolean {
  const context = useStoreContext();
  return context?.isCustomDomain || false;
}

export function useIsStoreRoute(): boolean {
  const context = useStoreContext();
  return context?.isStoreRoute || false;
}

