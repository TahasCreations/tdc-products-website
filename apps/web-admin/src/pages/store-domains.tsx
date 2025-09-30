import React, { useState, useEffect } from 'react';
import { StoreDomainOutput, StoreOutput, DomainVerificationResult } from '@tdc/domain';

interface StoreDomainsPageProps {
  tenantId: string;
}

export default function StoreDomainsPage({ tenantId }: StoreDomainsPageProps) {
  const [stores, setStores] = useState<StoreOutput[]>([]);
  const [domains, setDomains] = useState<StoreDomainOutput[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [newDomain, setNewDomain] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [vercelProjectId, setVercelProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load stores and domains
  useEffect(() => {
    loadStores();
    loadDomains();
  }, [tenantId]);

  const loadStores = async () => {
    try {
      const response = await fetch(`/api/store-domains/stores?tenantId=${tenantId}`);
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const loadDomains = async () => {
    try {
      const response = await fetch(`/api/store-domains/domains?tenantId=${tenantId}`);
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Error loading domains:', error);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore || !newDomain) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/store-domains/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          storeId: selectedStore,
          domain: newDomain,
          isPrimary,
          vercelProjectId: vercelProjectId || undefined,
        }),
      });

      if (response.ok) {
        setSuccess('Domain added successfully!');
        setNewDomain('');
        setIsPrimary(false);
        setVercelProjectId('');
        loadDomains();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add domain');
      }
    } catch (error) {
      setError('Failed to add domain');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    setVerifying(domainId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/store-domains/domains/${domainId}/verify?tenantId=${tenantId}`, {
        method: 'POST',
      });

      const result: DomainVerificationResult = await response.json();
      
      if (result.success) {
        setSuccess('Domain verified successfully!');
        loadDomains();
      } else {
        setError(result.message || 'Domain verification failed');
      }
    } catch (error) {
      setError('Failed to verify domain');
    } finally {
      setVerifying(null);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;

    try {
      const response = await fetch(`/api/store-domains/domains/${domainId}?tenantId=${tenantId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Domain deleted successfully!');
        loadDomains();
      } else {
        setError('Failed to delete domain');
      }
    } catch (error) {
      setError('Failed to delete domain');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'VERIFYING':
        return 'bg-blue-100 text-blue-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800';
      case 'EXPIRED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : 'Unknown Store';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Store Domains</h1>
          <p className="mt-2 text-gray-600">
            Manage custom domains for your stores and verify domain ownership.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Add Domain Form */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Add New Domain
            </h3>
            <form onSubmit={handleAddDomain} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="store" className="block text-sm font-medium text-gray-700">
                    Store
                  </label>
                  <select
                    id="store"
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a store</option>
                    {stores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name} ({store.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                    Domain
                  </label>
                  <input
                    type="text"
                    id="domain"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="example.com"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vercelProjectId" className="block text-sm font-medium text-gray-700">
                    Vercel Project ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="vercelProjectId"
                    value={vercelProjectId}
                    onChange={(e) => setVercelProjectId(e.target.value)}
                    placeholder="prj_xxxxxxxxxxxxxxxx"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrimary"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
                    Primary domain
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Domain'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Domains List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Domain List
            </h3>
            
            {domains.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No domains</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new domain.</p>
              </div>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Domain
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Store
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SSL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {domains.map((domain) => (
                      <tr key={domain.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {domain.domain}
                            </div>
                            {domain.isPrimary && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Primary
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getStoreName(domain.storeId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                            {domain.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {domain.sslEnabled ? (
                            <span className="text-green-600">✓ Enabled</span>
                          ) : (
                            <span className="text-gray-400">✗ Disabled</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {domain.status !== 'VERIFIED' && (
                              <button
                                onClick={() => handleVerifyDomain(domain.id)}
                                disabled={verifying === domain.id}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                              >
                                {verifying === domain.id ? 'Verifying...' : 'Verify'}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteDomain(domain.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

