import React, { useState, useEffect } from 'react';
import { PageStatus, CampaignType } from '@tdc/domain';

interface StorePagesPageProps {
  tenantId: string;
  storeId: string;
}

export default function StorePagesPage({ tenantId, storeId }: StorePagesPageProps) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    isCampaign: '',
    campaignType: '',
    search: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);

  useEffect(() => {
    loadPages();
  }, [tenantId, storeId, filters]);

  const loadPages = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        tenantId,
        storeId,
        ...(filters.status && { status: filters.status }),
        ...(filters.isCampaign && { isCampaign: filters.isCampaign }),
        ...(filters.campaignType && { campaignType: filters.campaignType }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`/api/store-pages/pages?${queryParams}`);
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error loading pages:', error);
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (pageData: any) => {
    try {
      const response = await fetch('/api/store-pages/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...pageData,
          tenantId,
          storeId
        }),
      });

      if (response.ok) {
        setSuccess('Page created successfully!');
        setShowCreateModal(false);
        loadPages();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create page');
      }
    } catch (error) {
      setError('Failed to create page');
    }
  };

  const handleUpdatePage = async (id: string, pageData: any) => {
    try {
      const response = await fetch(`/api/store-pages/pages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });

      if (response.ok) {
        setSuccess('Page updated successfully!');
        setEditingPage(null);
        loadPages();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update page');
      }
    } catch (error) {
      setError('Failed to update page');
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/store-pages/pages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Page deleted successfully!');
        loadPages();
      } else {
        setError('Failed to delete page');
      }
    } catch (error) {
      setError('Failed to delete page');
    }
  };

  const handlePublishPage = async (id: string) => {
    try {
      const response = await fetch(`/api/store-pages/pages/${id}/publish`, {
        method: 'POST',
      });

      if (response.ok) {
        setSuccess('Page published successfully!');
        loadPages();
      } else {
        setError('Failed to publish page');
      }
    } catch (error) {
      setError('Failed to publish page');
    }
  };

  const handleUnpublishPage = async (id: string) => {
    try {
      const response = await fetch(`/api/store-pages/pages/${id}/unpublish`, {
        method: 'POST',
      });

      if (response.ok) {
        setSuccess('Page unpublished successfully!');
        loadPages();
      } else {
        setError('Failed to unpublish page');
      }
    } catch (error) {
      setError('Failed to unpublish page');
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedPages.length === 0) return;

    try {
      const response = await fetch(`/api/store-pages/pages/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          pageIds: selectedPages
        }),
      });

      if (response.ok) {
        setSuccess(`Bulk ${action} completed successfully!`);
        setSelectedPages([]);
        loadPages();
      } else {
        setError(`Failed to ${action} pages`);
      }
    } catch (error) {
      setError(`Failed to ${action} pages`);
    }
  };

  const getStatusColor = (status: PageStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'UNPUBLISHED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignTypeColor = (type: CampaignType) => {
    switch (type) {
      case 'SALE':
        return 'bg-red-100 text-red-800';
      case 'PROMOTION':
        return 'bg-blue-100 text-blue-800';
      case 'EVENT':
        return 'bg-purple-100 text-purple-800';
      case 'SEASONAL':
        return 'bg-orange-100 text-orange-800';
      case 'FLASH':
        return 'bg-pink-100 text-pink-800';
      case 'CLEARANCE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isPageActive = (page: any) => {
    const now = new Date();
    return page.isPublished && 
           (!page.startAt || page.startAt <= now) && 
           (!page.endAt || page.endAt >= now);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Pages</h1>
              <p className="mt-2 text-gray-600">
                Manage your store's custom pages and campaigns
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Page
              </button>
            </div>
          </div>
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="UNPUBLISHED">Unpublished</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.isCampaign}
                  onChange={(e) => setFilters({ ...filters, isCampaign: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="true">Campaign Pages</option>
                  <option value="false">Regular Pages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                <select
                  value={filters.campaignType}
                  onChange={(e) => setFilters({ ...filters, campaignType: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">All Campaigns</option>
                  <option value="SALE">Sale</option>
                  <option value="PROMOTION">Promotion</option>
                  <option value="EVENT">Event</option>
                  <option value="SEASONAL">Seasonal</option>
                  <option value="FLASH">Flash Sale</option>
                  <option value="CLEARANCE">Clearance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search pages..."
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPages.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedPages.length} page(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkAction('publish')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleBulkAction('unpublish')}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Unpublish
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedPages([])}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pages List */}
        <div className="bg-white shadow rounded-lg">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading pages...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pages</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new page.</p>
            </div>
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedPages.length === pages.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPages(pages.map(p => p.id));
                          } else {
                            setSelectedPages([]);
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pages.map((page) => (
                    <tr key={page.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedPages.includes(page.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPages([...selectedPages, page.id]);
                            } else {
                              setSelectedPages(selectedPages.filter(id => id !== page.id));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{page.title}</div>
                          <div className="text-sm text-gray-500">{page.path}</div>
                          {page.isCampaign && (
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCampaignTypeColor(page.campaignType)}`}>
                                {page.campaignType}
                              </span>
                              {page.discountCode && (
                                <span className="text-xs text-gray-500">Code: {page.discountCode}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                            {page.status}
                          </span>
                          {isPageActive(page) && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {page.isCampaign ? 'Campaign' : 'Regular'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {page.viewCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.startAt && (
                          <div>Start: {new Date(page.startAt).toLocaleDateString()}</div>
                        )}
                        {page.endAt && (
                          <div>End: {new Date(page.endAt).toLocaleDateString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingPage(page)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          {page.isPublished ? (
                            <button
                              onClick={() => handleUnpublishPage(page.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublishPage(page.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePage(page.id)}
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

      {/* Create/Edit Modal */}
      {(showCreateModal || editingPage) && (
        <PageModal
          page={editingPage}
          onClose={() => {
            setShowCreateModal(false);
            setEditingPage(null);
          }}
          onSave={editingPage ? handleUpdatePage : handleCreatePage}
        />
      )}
    </div>
  );
}

// Page Modal Component
function PageModal({ page, onClose, onSave }: {
  page?: any;
  onClose: () => void;
  onSave: (id: string, data: any) => void;
}) {
  const [formData, setFormData] = useState({
    path: page?.path || '',
    title: page?.title || '',
    description: page?.description || '',
    metaTitle: page?.metaTitle || '',
    metaDescription: page?.metaDescription || '',
    ogImage: page?.ogImage || '',
    isCampaign: page?.isCampaign || false,
    campaignType: page?.campaignType || '',
    discountCode: page?.discountCode || '',
    priority: page?.priority || 0,
    startAt: page?.startAt ? new Date(page.startAt).toISOString().slice(0, 16) : '',
    endAt: page?.endAt ? new Date(page.endAt).toISOString().slice(0, 16) : '',
    cacheTtl: page?.cacheTtl || 3600
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      startAt: formData.startAt ? new Date(formData.startAt) : undefined,
      endAt: formData.endAt ? new Date(formData.endAt) : undefined,
      priority: parseInt(formData.priority.toString()),
      cacheTtl: parseInt(formData.cacheTtl.toString())
    };
    
    onSave(page?.id || 'new', submitData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {page ? 'Edit Page' : 'Create Page'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Path</label>
                <input
                  type="text"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="/campaigns/black-friday"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Page Title"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Page description"
                rows={3}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="SEO Title"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                <input
                  type="text"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="SEO Description"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
              <input
                type="url"
                value={formData.ogImage}
                onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                placeholder="https://example.com/og-image.jpg"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isCampaign}
                onChange={(e) => setFormData({ ...formData, isCampaign: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                This is a campaign page
              </label>
            </div>

            {formData.isCampaign && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                  <select
                    value={formData.campaignType}
                    onChange={(e) => setFormData({ ...formData, campaignType: e.target.value })}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="SALE">Sale</option>
                    <option value="PROMOTION">Promotion</option>
                    <option value="EVENT">Event</option>
                    <option value="SEASONAL">Seasonal</option>
                    <option value="FLASH">Flash Sale</option>
                    <option value="CLEARANCE">Clearance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code</label>
                  <input
                    type="text"
                    value={formData.discountCode}
                    onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                    placeholder="SAVE20"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="datetime-local"
                  value={formData.startAt}
                  onChange={(e) => setFormData({ ...formData, startAt: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="datetime-local"
                  value={formData.endAt}
                  onChange={(e) => setFormData({ ...formData, endAt: e.target.value })}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cache TTL (seconds)</label>
              <input
                type="number"
                value={formData.cacheTtl}
                onChange={(e) => setFormData({ ...formData, cacheTtl: parseInt(e.target.value) || 3600 })}
                min="0"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {page ? 'Update Page' : 'Create Page'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

