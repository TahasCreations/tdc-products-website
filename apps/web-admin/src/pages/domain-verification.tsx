import React, { useState, useEffect } from 'react';
import { StoreDomainOutput, DomainVerificationResult } from '@tdc/domain';

interface DomainVerificationPageProps {
  tenantId: string;
}

export default function DomainVerificationPage({ tenantId }: DomainVerificationPageProps) {
  const [domains, setDomains] = useState<StoreDomainOutput[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<StoreDomainOutput | null>(null);
  const [verificationResult, setVerificationResult] = useState<DomainVerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadDomains();
  }, [tenantId]);

  const loadDomains = async () => {
    try {
      const response = await fetch(`/api/store-domains/domains?tenantId=${tenantId}&status=PENDING`);
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Error loading domains:', error);
    }
  };

  const handleVerifyDomain = async (domain: StoreDomainOutput) => {
    setSelectedDomain(domain);
    setLoading(true);
    setError(null);
    setSuccess(null);
    setVerificationResult(null);

    try {
      const response = await fetch(`/api/store-domains/domains/${domain.id}/verify?tenantId=${tenantId}`, {
        method: 'POST',
      });

      const result: DomainVerificationResult = await response.json();
      setVerificationResult(result);
      
      if (result.success) {
        setSuccess('Domain verified successfully!');
        loadDomains();
      } else {
        setError(result.message || 'Domain verification failed');
      }
    } catch (error) {
      setError('Failed to verify domain');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDns = async (domain: string) => {
    try {
      const response = await fetch(`/api/store-domains/domains/${domain}/dns`);
      const result = await response.json();
      
      if (result.success) {
        setSuccess('DNS records are properly configured!');
      } else {
        setError('DNS records are not properly configured. Please check the required records.');
      }
    } catch (error) {
      setError('Failed to check DNS records');
    }
  };

  const handleCheckSsl = async (domain: string) => {
    try {
      const response = await fetch(`/api/store-domains/domains/${domain}/ssl`);
      const result = await response.json();
      
      if (result.enabled) {
        setSuccess('SSL certificate is valid!');
      } else {
        setError('SSL certificate is not valid or not enabled.');
      }
    } catch (error) {
      setError('Failed to check SSL status');
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Domain Verification</h1>
          <p className="mt-2 text-gray-600">
            Verify domain ownership and configure DNS records for your custom domains.
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Domains List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Pending Verification
              </h3>
              
              {domains.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No pending domains</h3>
                  <p className="mt-1 text-sm text-gray-500">All domains are verified or there are no domains to verify.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {domains.map((domain) => (
                    <div key={domain.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{domain.domain}</h4>
                          <p className="text-sm text-gray-500">Store ID: {domain.storeId}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(domain.status)}`}>
                            {domain.status}
                          </span>
                          <button
                            onClick={() => handleVerifyDomain(domain)}
                            disabled={loading}
                            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading && selectedDomain?.id === domain.id ? 'Verifying...' : 'Verify'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Verification Details */}
          {selectedDomain && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Verification Details
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Domain: {selectedDomain.domain}</h4>
                    <p className="text-sm text-gray-500">Store ID: {selectedDomain.storeId}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCheckDns(selectedDomain.domain)}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                    >
                      Check DNS
                    </button>
                    <button
                      onClick={() => handleCheckSsl(selectedDomain.domain)}
                      className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700"
                    >
                      Check SSL
                    </button>
                  </div>

                  {verificationResult && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Verification Result</h5>
                      <div className={`p-3 rounded-md ${verificationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <p className={`text-sm ${verificationResult.success ? 'text-green-800' : 'text-red-800'}`}>
                          {verificationResult.message}
                        </p>
                      </div>

                      {verificationResult.dnsRecords && verificationResult.dnsRecords.length > 0 && (
                        <div className="mt-4">
                          <h6 className="text-sm font-medium text-gray-900 mb-2">DNS Records</h6>
                          <div className="bg-gray-50 rounded-md p-3">
                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                              {verificationResult.dnsRecords.map((record, index) => (
                                <div key={index}>
                                  {record.type} {record.name} {record.value}
                                </div>
                              ))}
                            </pre>
                          </div>
                        </div>
                      )}

                      {verificationResult.sslStatus && (
                        <div className="mt-4">
                          <h6 className="text-sm font-medium text-gray-900 mb-2">SSL Status</h6>
                          <div className="bg-gray-50 rounded-md p-3">
                            <p className="text-xs text-gray-700">
                              Enabled: {verificationResult.sslStatus.enabled ? 'Yes' : 'No'}
                            </p>
                            {verificationResult.sslStatus.certificate && (
                              <p className="text-xs text-gray-700">
                                Certificate: {verificationResult.sslStatus.certificate}
                              </p>
                            )}
                            {verificationResult.sslStatus.expiresAt && (
                              <p className="text-xs text-gray-700">
                                Expires: {new Date(verificationResult.sslStatus.expiresAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {verificationResult.vercelStatus && (
                        <div className="mt-4">
                          <h6 className="text-sm font-medium text-gray-900 mb-2">Vercel Status</h6>
                          <div className="bg-gray-50 rounded-md p-3">
                            <p className="text-xs text-gray-700">
                              Status: {verificationResult.vercelStatus.status}
                            </p>
                            {verificationResult.vercelStatus.error && (
                              <p className="text-xs text-red-700">
                                Error: {verificationResult.vercelStatus.error}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

