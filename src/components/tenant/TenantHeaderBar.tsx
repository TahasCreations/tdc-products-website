import { resolveTenant } from '@/src/lib/tenant';

export default async function TenantHeaderBar() {
  const tenant = await resolveTenant();
  
  if (!tenant) return null;
  
  const { domain, theme } = tenant;
  
  return (
    <div 
      className="py-3 px-4 border-b"
      style={{ 
        backgroundColor: theme?.primaryColor ? `${theme.primaryColor}15` : '#f8fafc',
        borderColor: theme?.primaryColor ? `${theme.primaryColor}30` : '#e2e8f0'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Sol: Logo + Mağaza Adı */}
        <div className="flex items-center space-x-3">
          {theme?.logoUrl && (
            <img
              src={theme.logoUrl}
              alt={`${domain.seller.storeName} Logo`}
              className="h-8 w-8 object-contain"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {domain.seller.storeName}
            </h2>
            <p className="text-sm text-gray-600">
              {domain.seller.description || 'Kaliteli ürünler, güvenilir hizmet'}
            </p>
          </div>
        </div>
        
        {/* Sağ: Domain */}
        <div className="text-sm text-gray-500">
          <span className="font-mono">{domain.hostname}</span>
        </div>
      </div>
    </div>
  );
}
