'use client';

import { MediaFiltersType } from '@/app/admin/media/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface MediaFiltersProps {
  filters: MediaFiltersType;
  onFiltersChange: (filters: MediaFiltersType) => void;
  onReset: () => void;
}

export function MediaFilters({ filters, onFiltersChange, onReset }: MediaFiltersProps) {
  function handleChange(key: keyof MediaFiltersType, value: any) {
    onFiltersChange({ ...filters, [key]: value });
  }

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Ara
          </Label>
          <Input
            id="search"
            type="text"
            placeholder="Dosya adı, URL, alt-metin..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Format */}
        <div>
          <Label htmlFor="format" className="text-sm font-medium">
            Format
          </Label>
          <Select
            value={filters.format || 'all'}
            onValueChange={(value) => handleChange('format', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Tüm formatlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm formatlar</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
              <SelectItem value="jpeg">JPEG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="gif">GIF</SelectItem>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
              <SelectItem value="avif">AVIF</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div>
          <Label htmlFor="status" className="text-sm font-medium">
            Durum
          </Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(value) => handleChange('status', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Tüm durumlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm durumlar</SelectItem>
              <SelectItem value="ACTIVE">Aktif</SelectItem>
              <SelectItem value="DEPRECATED">Kullanımdan Kaldırıldı</SelectItem>
              <SelectItem value="MISSING">Kayıp</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Storage */}
        <div>
          <Label htmlFor="storage" className="text-sm font-medium">
            Depolama
          </Label>
          <Select
            value={filters.storage || 'all'}
            onValueChange={(value) => handleChange('storage', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Tüm kaynaklar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm kaynaklar</SelectItem>
              <SelectItem value="LOCAL">Yerel (public/)</SelectItem>
              <SelectItem value="GCS">Google Cloud Storage</SelectItem>
              <SelectItem value="REMOTE">Harici URL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Has Alt */}
        <div>
          <Label htmlFor="hasAlt" className="text-sm font-medium">
            Alt Metin
          </Label>
          <Select
            value={
              filters.hasAlt === undefined ? 'all' :
              filters.hasAlt ? 'yes' : 'no'
            }
            onValueChange={(value) => 
              handleChange('hasAlt', value === 'all' ? undefined : value === 'yes')
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Tümü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="yes">Var</SelectItem>
              <SelectItem value="no">Yok</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Min Size */}
        <div>
          <Label htmlFor="minSize" className="text-sm font-medium">
            Min. Boyut (KB)
          </Label>
          <Input
            id="minSize"
            type="number"
            placeholder="0"
            value={filters.minSize ? filters.minSize / 1024 : ''}
            onChange={(e) => handleChange('minSize', e.target.value ? parseInt(e.target.value, 10) * 1024 : undefined)}
            className="mt-1"
          />
        </div>

        {/* Max Size */}
        <div>
          <Label htmlFor="maxSize" className="text-sm font-medium">
            Max. Boyut (KB)
          </Label>
          <Input
            id="maxSize"
            type="number"
            placeholder="∞"
            value={filters.maxSize ? filters.maxSize / 1024 : ''}
            onChange={(e) => handleChange('maxSize', e.target.value ? parseInt(e.target.value, 10) * 1024 : undefined)}
            className="mt-1"
          />
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Filtreleri Temizle
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

