import React, { useState, useEffect } from 'react';

interface SEOSettingsPageProps {
  tenantId: string;
  storeId: string;
}

export default function SEOSettingsPage({ tenantId, storeId }: SEOSettingsPageProps) {
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [formData, setFormData] = useState({
    // General SEO
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [] as string[],
    canonicalDomain: '',
    
    // Analytics
    ga4MeasurementId: '',
    metaPixelId: '',
    googleTagManager: '',
    hotjarId: '',
    mixpanelToken: '',
    
    // Sitemap & Robots
    sitemapUrl: '',
    robotsTxt: '',
    
    // Custom scripts
    customHeadScripts: '',
    customBodyScripts: ''
  });

  const [newKeyword, setNewKeyword] = useState('');

  useEffect(() => {
    loadStoreData();
  }, [tenantId, storeId]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/stores/${storeId}?tenantId=${tenantId}`);
      const data = await response.json();
      
      if (data) {
        setStore(data);
        setFormData({
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          metaKeywords: data.metaKeywords || [],
          canonicalDomain: data.canonicalDomain || '',
          ga4MeasurementId: data.ga4MeasurementId || '',
          metaPixelId: data.metaPixelId || '',
          googleTagManager: data.googleTagManager || '',
          hotjarId: data.hotjarId || '',
          mixpanelToken: data.mixpanelToken || '',
          sitemapUrl: data.sitemapUrl || '',
          robotsTxt: data.robotsTxt || '',
          customHeadScripts: data.customHeadScripts || '',
          customBodyScripts: data.customBodyScripts || ''
        });
      }
    } catch (error) {
      console.error('Error loading store data:', error);
      setError('Failed to load store data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.metaKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stores/${storeId}/seo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          ...formData
        }),
      });

      if (response.ok) {
        setSuccess('SEO settings saved successfully!');
        await loadStoreData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save SEO settings');
      }
    } catch (error) {
      setError('Failed to save SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const generateSitemap = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seo/sitemap/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          storeId
        }),
      });

      if (response.ok) {
        setSuccess('Sitemap generated successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate sitemap');
      }
    } catch (error) {
      setError('Failed to generate sitemap');
    } finally {
      setLoading(false);
    }
  };

  const generateRobotsTxt = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seo/robots/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          storeId
        }),
      });

      if (response.ok) {
        setSuccess('Robots.txt generated successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate robots.txt');
      }
    } catch (error) {
      setError('Failed to generate robots.txt');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your store's SEO, analytics, and search engine optimization
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

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'general', name: 'General SEO' },
              { id: 'analytics', name: 'Analytics' },
              { id: 'sitemap', name: 'Sitemap & Robots' },
              { id: 'scripts', name: 'Custom Scripts' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {/* General SEO Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">General SEO Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meta title"
                    maxLength={60}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.metaTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meta description"
                    maxLength={160}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {formData.metaDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter keyword"
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <button
                      onClick={addKeyword}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.metaKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Canonical Domain
                  </label>
                  <input
                    type="text"
                    value={formData.canonicalDomain}
                    onChange={(e) => handleInputChange('canonicalDomain', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., mystore.com"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Primary domain for canonical URLs
                  </p>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Analytics Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Analytics 4 Measurement ID
                    </label>
                    <input
                      type="text"
                      value={formData.ga4MeasurementId}
                      onChange={(e) => handleInputChange('ga4MeasurementId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Pixel ID
                    </label>
                    <input
                      type="text"
                      value={formData.metaPixelId}
                      onChange={(e) => handleInputChange('metaPixelId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123456789012345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Google Tag Manager ID
                    </label>
                    <input
                      type="text"
                      value={formData.googleTagManager}
                      onChange={(e) => handleInputChange('googleTagManager', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="GTM-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hotjar ID
                    </label>
                    <input
                      type="text"
                      value={formData.hotjarId}
                      onChange={(e) => handleInputChange('hotjarId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1234567"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mixpanel Token
                    </label>
                    <input
                      type="text"
                      value={formData.mixpanelToken}
                      onChange={(e) => handleInputChange('mixpanelToken', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Mixpanel project token"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sitemap & Robots Tab */}
            {activeTab === 'sitemap' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Sitemap & Robots.txt</h3>
                
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={generateSitemap}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Generate Sitemap
                  </button>
                  <button
                    onClick={generateRobotsTxt}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Generate Robots.txt
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Sitemap URL
                  </label>
                  <input
                    type="text"
                    value={formData.sitemapUrl}
                    onChange={(e) => handleInputChange('sitemapUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/sitemap.xml"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Robots.txt Content
                  </label>
                  <textarea
                    value={formData.robotsTxt}
                    onChange={(e) => handleInputChange('robotsTxt', e.target.value)}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/&#10;Sitemap: https://example.com/sitemap.xml"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Custom robots.txt content (optional)
                  </p>
                </div>
              </div>
            )}

            {/* Custom Scripts Tab */}
            {activeTab === 'scripts' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Custom Scripts</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Head Scripts
                  </label>
                  <textarea
                    value={formData.customHeadScripts}
                    onChange={(e) => handleInputChange('customHeadScripts', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="<!-- Custom scripts for <head> section -->&#10;<script>...</script>"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Custom scripts to be injected into the &lt;head&gt; section
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Body Scripts
                  </label>
                  <textarea
                    value={formData.customBodyScripts}
                    onChange={(e) => handleInputChange('customBodyScripts', e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="<!-- Custom scripts for <body> section -->&#10;<script>...</script>"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Custom scripts to be injected into the &lt;body&gt; section
                  </p>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

