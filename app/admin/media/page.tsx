'use client';

import { useState, useEffect } from 'react';
import { MediaAssetList } from '@/components/media/MediaAssetList';
import { MediaFilters } from '@/components/media/MediaFilters';
import { MediaDetailPanel } from '@/components/media/MediaDetailPanel';
import { BulkActions } from '@/components/media/BulkActions';
import { Button } from '@/components/ui/button';
import { RefreshCw, Upload } from 'lucide-react';

export interface MediaAsset {
  id: string;
  url: string;
  storage: 'LOCAL' | 'GCS' | 'REMOTE';
  filename: string;
  width: number | null;
  height: number | null;
  format: string | null;
  sizeBytes: number | null;
  dominantColor: string | null;
  alt: string | null;
  title: string | null;
  tags: string[];
  status: 'ACTIVE' | 'DEPRECATED' | 'MISSING';
  usedIn: Array<{
    file: string;
    line: number;
    component?: string;
    contextSnippet?: string;
  }>;
  lastIndexedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFiltersType {
  format?: string;
  status?: 'ACTIVE' | 'DEPRECATED' | 'MISSING';
  storage?: 'LOCAL' | 'GCS' | 'REMOTE';
  hasAlt?: boolean;
  tag?: string;
  minSize?: number;
  maxSize?: number;
  search?: string;
}

export default function MediaManagementPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MediaFiltersType>({});
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reindexing, setReindexing] = useState(false);

  useEffect(() => {
    fetchAssets();
  }, [filters, page]);

  async function fetchAssets() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
        )
      });

      const response = await fetch(`/api/media/assets?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAssets(data.data);
        setTotalPages(data.pagination.totalPages);
      } else {
        console.error('Failed to fetch assets');
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReindex() {
    setReindexing(true);
    try {
      const response = await fetch('/api/media/reindex', {
        method: 'POST'
      });
      
      if (response.ok) {
        alert('Reindexing started! This may take a few minutes. The page will refresh automatically.');
        
        // Refresh after 30 seconds
        setTimeout(() => {
          fetchAssets();
          setReindexing(false);
        }, 30000);
      } else {
        alert('Failed to start reindexing');
        setReindexing(false);
      }
    } catch (error) {
      console.error('Error triggering reindex:', error);
      alert('Error triggering reindex');
      setReindexing(false);
    }
  }

  function handleAssetSelect(assetId: string, selected: boolean) {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(assetId);
      } else {
        newSet.delete(assetId);
      }
      return newSet;
    });
  }

  function handleSelectAll(selected: boolean) {
    if (selected) {
      setSelectedAssets(new Set(assets.map(a => a.id)));
    } else {
      setSelectedAssets(new Set());
    }
  }

  async function handleBulkAction(action: string, data: any) {
    try {
      const response = await fetch('/api/media/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetIds: Array.from(selectedAssets),
          action,
          data
        })
      });

      if (response.ok) {
        alert('Bulk action completed successfully');
        setSelectedAssets(new Set());
        fetchAssets();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Error performing bulk action');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Görsel Yönetimi
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Tüm görselleri tek yerden yönetin, optimize edin ve izleyin
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleReindex}
                disabled={reindexing}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${reindexing ? 'animate-spin' : ''}`} />
                {reindexing ? 'İndeksleniyor...' : 'Yeniden İndeksle'}
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <MediaFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => {
              setFilters({});
              setPage(1);
            }}
          />
        </div>

        {/* Bulk Actions */}
        {selectedAssets.size > 0 && (
          <div className="mb-4">
            <BulkActions
              selectedCount={selectedAssets.size}
              onAction={handleBulkAction}
              onClearSelection={() => setSelectedAssets(new Set())}
            />
          </div>
        )}

        {/* Asset List */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MediaAssetList
              assets={assets}
              loading={loading}
              selectedAssets={selectedAssets}
              onAssetClick={setSelectedAsset}
              onAssetSelect={handleAssetSelect}
              onSelectAll={handleSelectAll}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedAsset ? (
              <MediaDetailPanel
                asset={selectedAsset}
                onClose={() => setSelectedAsset(null)}
                onUpdate={fetchAssets}
              />
            ) : (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Detayları görüntülemek için bir görsel seçin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

