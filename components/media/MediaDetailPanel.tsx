'use client';

import { MediaAsset } from '@/app/admin/media/page';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Save, Image as ImageIcon, ExternalLink, MapPin } from 'lucide-react';
import Image from 'next/image';

interface MediaDetailPanelProps {
  asset: MediaAsset;
  onClose: () => void;
  onUpdate: () => void;
}

export function MediaDetailPanel({ asset, onClose, onUpdate }: MediaDetailPanelProps) {
  const [alt, setAlt] = useState(asset.alt || '');
  const [title, setTitle] = useState(asset.title || '');
  const [saving, setSaving] = useState(false);

  async function handleSaveAlt() {
    setSaving(true);
    try {
      const response = await fetch(`/api/media/assets/${asset.id}/alt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt, title })
      });

      if (response.ok) {
        alert('Alt metin güncellendi');
        onUpdate();
      } else {
        alert('Güncelleme başarısız');
      }
    } catch (error) {
      console.error('Error updating alt:', error);
      alert('Hata oluştu');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(newStatus: 'ACTIVE' | 'DEPRECATED' | 'MISSING') {
    try {
      const response = await fetch(`/api/media/assets/${asset.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        alert('Durum güncellendi');
        onUpdate();
      } else {
        alert('Güncelleme başarısız');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Hata oluştu');
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Detaylar</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-4">
        {/* Preview */}
        <div className="mb-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
            {asset.status === 'MISSING' ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Görsel bulunamadı</p>
                </div>
              </div>
            ) : asset.format === 'svg' ? (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-16 w-16 text-gray-400" />
              </div>
            ) : (
              <Image
                src={asset.url}
                alt={asset.alt || asset.filename}
                fill
                className="object-contain"
                unoptimized
              />
            )}
          </div>
          {asset.dominantColor && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <span>Dominant Color:</span>
              <div
                className="h-4 w-4 rounded border border-gray-300"
                style={{ backgroundColor: asset.dominantColor }}
              />
              <span>{asset.dominantColor}</span>
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="mb-6 space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Dosya:</span>
            <p className="text-gray-600 dark:text-gray-400 break-all">{asset.filename}</p>
          </div>
          
          {asset.width && asset.height && (
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Boyut:</span>
              <p className="text-gray-600 dark:text-gray-400">
                {asset.width} × {asset.height} px
              </p>
            </div>
          )}
          
          {asset.sizeBytes && (
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Dosya Boyutu:</span>
              <p className="text-gray-600 dark:text-gray-400">
                {formatBytes(asset.sizeBytes)}
              </p>
            </div>
          )}
          
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Depolama:</span>
            <Badge variant="secondary" className="ml-2">
              {asset.storage}
            </Badge>
          </div>
          
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Durum:</span>
            <div className="mt-2 flex gap-2">
              {(['ACTIVE', 'DEPRECATED', 'MISSING'] as const).map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={asset.status === status ? 'default' : 'outline'}
                  onClick={() => handleStatusChange(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">URL:</span>
            <a
              href={asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline dark:text-blue-400"
            >
              {asset.url}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Alt Text Editor */}
        <div className="mb-6">
          <Label htmlFor="alt">Alt Metin</Label>
          <Textarea
            id="alt"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Görselin açıklaması..."
            className="mt-1"
            rows={3}
          />
          
          <Label htmlFor="title" className="mt-3">Başlık (Title)</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Görselin başlığı..."
            className="mt-1"
          />
          
          <Button
            onClick={handleSaveAlt}
            disabled={saving}
            className="mt-3 w-full"
            size="sm"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>

        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Etiketler:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {asset.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Usage Map */}
        <div>
          <div className="mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Kullanım Haritası ({asset.usedIn.length})
            </span>
          </div>
          
          {asset.usedIn.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bu görsel hiçbir yerde kullanılmıyor
            </p>
          ) : (
            <div className="space-y-2">
              {asset.usedIn.map((usage, index) => (
                <div
                  key={index}
                  className="rounded border border-gray-200 bg-gray-50 p-2 text-xs dark:border-gray-600 dark:bg-gray-700"
                >
                  <p className="font-mono text-gray-900 dark:text-white">
                    {usage.file}:{usage.line}
                  </p>
                  {usage.contextSnippet && (
                    <p className="mt-1 truncate text-gray-600 dark:text-gray-400">
                      {usage.contextSnippet}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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

