'use client';

import { MediaAsset } from '@/app/admin/media/page';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface MediaAssetListProps {
  assets: MediaAsset[];
  loading: boolean;
  selectedAssets: Set<string>;
  onAssetClick: (asset: MediaAsset) => void;
  onAssetSelect: (assetId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MediaAssetList({
  assets,
  loading,
  selectedAssets,
  onAssetClick,
  onAssetSelect,
  onSelectAll,
  page,
  totalPages,
  onPageChange
}: MediaAssetListProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Görsel bulunamadı. İndeksleme yapmayı deneyin.
        </p>
      </div>
    );
  }

  const allSelected = assets.length > 0 && assets.every(a => selectedAssets.has(a.id));

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {assets.length} görsel
          </span>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <Checkbox
              checked={selectedAssets.has(asset.id)}
              onCheckedChange={(checked) => onAssetSelect(asset.id, !!checked)}
            />

            {/* Thumbnail */}
            <button
              onClick={() => onAssetClick(asset)}
              className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded border border-gray-200 dark:border-gray-600"
            >
              {asset.status === 'MISSING' ? (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              ) : asset.format === 'svg' ? (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              ) : (
                <Image
                  src={asset.url}
                  alt={asset.alt || asset.filename}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </button>

            {/* Info */}
            <button
              onClick={() => onAssetClick(asset)}
              className="flex-1 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {asset.filename}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {asset.format && (
                      <Badge variant="secondary" className="uppercase">
                        {asset.format}
                      </Badge>
                    )}
                    {asset.width && asset.height && (
                      <span>{asset.width} × {asset.height}</span>
                    )}
                    {asset.sizeBytes && (
                      <span>{formatBytes(asset.sizeBytes)}</span>
                    )}
                    <Badge
                      variant={
                        asset.status === 'ACTIVE' ? 'default' :
                        asset.status === 'DEPRECATED' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {asset.status}
                    </Badge>
                  </div>
                  <div className="mt-1">
                    {asset.alt ? (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                        Alt: {asset.alt}
                      </p>
                    ) : (
                      <p className="text-xs text-red-500">Alt metin yok</p>
                    )}
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {asset.usedIn.length} yerde kullanılıyor
                    </p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Önceki
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sayfa {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Sonraki
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

