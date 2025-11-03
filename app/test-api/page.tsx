'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function TestAPIPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testAPI = async (name: string, url: string, method: string = 'GET', body?: any) => {
    setLoading(name);
    try {
      const response = await fetch(url, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
      
      const data = await response.text();
      setResults(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          statusText: response.statusText,
          data: data.substring(0, 200) + (data.length > 200 ? '...' : ''),
          success: response.ok
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        }
      }));
    }
    setLoading(null);
  };

  const tests = [
    {
      name: 'reCAPTCHA Verify',
      url: '/api/security/recaptcha/verify',
      method: 'POST',
      body: { token: 'test-token', action: 'test' }
    },
    {
      name: 'Web Risk Check',
      url: '/api/security/link-check',
      method: 'POST',
      body: { url: 'https://malware-test.com' }
    },
    {
      name: 'Semantic Search',
      url: '/api/search/semantic',
      method: 'POST',
      body: { q: 'test search', k: 5 }
    },
    {
      name: 'Product Recommendations',
      url: '/api/reco?productId=test123&limit=3',
      method: 'GET'
    },
    {
      name: 'Push Register',
      url: '/api/push/register',
      method: 'POST',
      body: { token: 'test-fcm-token' }
    },
    {
      name: 'Analytics Export',
      url: '/api/jobs/export-analytics',
      method: 'POST'
    },
    {
      name: 'Embeddings Rebuild',
      url: '/api/jobs/embeddings/rebuild',
      method: 'POST'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Dashboard</h1>
        
        <div className="grid gap-4">
          {tests.map((test) => (
            <div key={test.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                <button
                  onClick={() => testAPI(test.name, test.url, test.method, test.body)}
                  disabled={loading === test.name}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading === test.name ? 'Testing...' : 'Test'}
                </button>
              </div>
              
              {results[test.name] && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      results[test.name].success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {results[test.name].success ? 'SUCCESS' : 'ERROR'}
                    </span>
                    {results[test.name].status && (
                      <span className="ml-2 text-sm text-gray-600">
                        {results[test.name].status} {results[test.name].statusText}
                      </span>
                    )}
                  </div>
                  
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {results[test.name].error || results[test.name].data}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
