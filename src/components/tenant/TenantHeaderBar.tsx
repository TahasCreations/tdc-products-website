'use client';

import { useEffect, useState } from 'react';
import { resolveTenant } from '../../lib/tenant';

interface TenantData {
  sellerId: string;
  domain: string;
  theme: {
    logoUrl?: string;
    primaryColor?: string;
    headerLayout?: string;
  };
}

export default function TenantHeaderBar() {
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTenant = async () => {
      try {
        const tenantData = await resolveTenant();
        setTenant(tenantData);
      } catch (error) {
        console.error('Error resolving tenant:', error);
      } finally {
        setLoading(false);
      }
    };

    checkTenant();
  }, []);

  if (loading || !tenant) {
    return null;
  }

  return (
    <div 
      className="w-full py-2 px-4 text-white text-sm"
      style={{ backgroundColor: tenant.theme.primaryColor || '#6366f1' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {tenant.theme.logoUrl && (
            <img 
              src={tenant.theme.logoUrl} 
              alt="Store Logo" 
              className="w-6 h-6 rounded"
            />
          )}
          <span className="font-semibold">
            {tenant.domain}
          </span>
        </div>
        <div className="text-xs opacity-75">
          Mağaza
        </div>
      </div>
    </div>
  );
}