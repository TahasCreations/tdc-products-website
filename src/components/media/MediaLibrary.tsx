'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download,
  Trash2,
  Edit,
  Eye,
  Tag,
  Plus,
  Check,
  X,
  AlertCircle,
  Image as ImageIcon,
  Video,
  FileText
} from 'lucide-react';

import { MediaItem, MediaType, VariantSize, mediaLibrary } from '@/lib/media/mediaLibrary';

interface MediaLibraryProps {
  onSelect?: (mediaItem: MediaItem) => void;
  multiSelect?: boolean;
  selectedItems?: MediaItem[];
  onSelectionChange?: (items: MediaItem[]) => void;
  filters?: {
    type?: MediaType;
    tags?: string[];
    collections?: string[];
  };
  maxItems?: number;
  disabled?: boolean;
}

export function MediaLibrary({
  onSelect,
  multiSelect = false,
  selectedItems = [],
  onSelectionChange,
  filters = {},
  maxItems,
  disabled = false
}: MediaLibraryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<MediaType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Medya öğelerini yükle
  const loadMediaItems = useCallback(async () => {
    try {
      setLoading(true);
      const { items } = await mediaLibrary.getMediaItems({
        ...filters,
        type: selectedType === 'all' ? undefined : selectedType,
        limit: 50
      });
      setMediaItems(items);
    } catch (error) {
      console.error('Failed to load media items:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedType]);

  useEffect(() => {
    loadMediaItems();
  }, [loadMediaItems]);

  // Filtrelenmiş öğeler
  const filteredItems = mediaItems.filter(item => {
    if (searchTerm && !item.originalName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.alt?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Dosya yükleme
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled) return;

    for (const file of acceptedFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const mediaItem = await mediaLibrary.uploadMedia(file, {
          tags: [],
          collections: []
        });
        
        setMediaItems(prev => [mediaItem, ...prev]);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 2000);
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
      }
    }
  }, [disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.avif'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/json': ['.json'] // Lottie
    },
    multiple: true
  });

  // Öğe seçimi
  const handleItemSelect = (item: MediaItem) => {
    if (disabled) return;

    if (multiSelect) {
      const isSelected = selectedItems.some(selected => selected.id === item.id);
      let newSelection;
      
      if (isSelected) {
        newSelection = selectedItems.filter(selected => selected.id !== item.id);
      } else {
        if (maxItems && selectedItems.length >= maxItems) {
          return; // Maksimum sayıya ulaşıldı
        }
        newSelection = [...selectedItems, item];
      }
      
      onSelectionChange?.(newSelection);
    } else {
      onSelect?.(item);
    }
  };

  // Öğe silme
  const handleDeleteItem = async (item: MediaItem) => {
    if (disabled) return;
    
    try {
      await mediaLibrary.deleteMediaItem(item.id);
      setMediaItems(prev => prev.filter(i => i.id !== item.id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header ve Kontroller */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Medya Kütüphanesi
              </CardTitle>
              <CardDescription>
                Görselleri yönetin ve organize edin
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={disabled}>
                    <Upload className="w-4 h-4 mr-2" />
                    Yükle
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Medya Yükle</DialogTitle>
                    <DialogDescription>
                      Görselleri buraya sürükleyin veya tıklayarak seçin
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragActive 
                        ? 'border-[#CBA135] bg-[#CBA135]/5' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      {isDragActive 
                        ? 'Dosyaları buraya bırakın...' 
                        : 'Dosyaları sürükleyin veya tıklayın'
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      JPEG, PNG, WebP, AVIF, MP4, WebM desteklenir
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Arama ve Filtreler */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Medya ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={disabled}
              />
            </div>
            
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as MediaType | 'all')}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="image">Görsel</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="lottie">Lottie</SelectItem>
                <SelectItem value="3d">3D</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                disabled={disabled}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                disabled={disabled}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Yükleme İlerlemesi */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2 mb-4">
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress === -1 ? 'bg-red-500' : 'bg-[#CBA135]'
                      }`}
                      style={{ width: `${Math.abs(progress)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-32 truncate">{filename}</span>
                  {progress === 100 && <Check className="w-4 h-4 text-green-500" />}
                  {progress === -1 && <X className="w-4 h-4 text-red-500" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medya Grid/List */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Medya bulunamadı</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Arama kriterlerinize uygun medya bulunamadı.' : 'Henüz medya yüklenmemiş.'}
              </p>
              <Button onClick={() => setUploadDialogOpen(true)} disabled={disabled}>
                <Upload className="w-4 h-4 mr-2" />
                Medya Yükle
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'
              : 'space-y-4'
            }>
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <MediaItemCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    isSelected={selectedItems.some(selected => selected.id === item.id)}
                    multiSelect={multiSelect}
                    onSelect={() => handleItemSelect(item)}
                    onDelete={() => handleDeleteItem(item)}
                    onView={() => setSelectedItem(item)}
                    disabled={disabled}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detay Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl">
          {selectedItem && (
            <MediaItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Medya öğe kartı
function MediaItemCard({
  item,
  viewMode,
  isSelected,
  multiSelect,
  onSelect,
  onDelete,
  onView,
  disabled,
  index
}: {
  item: MediaItem;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  multiSelect: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onView: () => void;
  disabled: boolean;
  index: number;
}) {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
          isSelected ? 'ring-2 ring-[#CBA135] bg-[#CBA135]/5' : ''
        }`}
      >
        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {item.variants.thumbnail ? (
            <img 
              src={item.variants.thumbnail.url} 
              alt={item.alt || item.originalName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{item.originalName}</h4>
          <p className="text-sm text-gray-500">
            {item.width} × {item.height} • {(item.size / 1024 / 1024).toFixed(1)} MB
          </p>
          <div className="flex items-center space-x-2 mt-1">
            {item.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
            ))}
            {item.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">+{item.tags.length - 2}</Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={onView}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} disabled={disabled}>
            <Trash2 className="w-4 h-4" />
          </Button>
          {multiSelect && (
            <Button 
              size="sm" 
              variant={isSelected ? "default" : "outline"}
              onClick={onSelect}
              disabled={disabled}
            >
              {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`relative group cursor-pointer ${
        isSelected ? 'ring-2 ring-[#CBA135]' : ''
      }`}
      onClick={onSelect}
    >
      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
        {item.variants.thumbnail ? (
          <img 
            src={item.variants.thumbnail.url} 
            alt={item.alt || item.originalName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onView(); }}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onDelete(); }} disabled={disabled}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Seçim göstergesi */}
        {multiSelect && (
          <div className="absolute top-2 right-2">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected 
                ? 'bg-[#CBA135] border-[#CBA135]' 
                : 'bg-white border-gray-300'
            }`}>
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-900 truncate">{item.originalName}</p>
        <p className="text-xs text-gray-500">{item.width} × {item.height}</p>
      </div>
    </motion.div>
  );
}

// Medya detay bileşeni
function MediaItemDetail({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>{item.originalName}</DialogTitle>
        <DialogDescription>
          {item.width} × {item.height} • {(item.size / 1024 / 1024).toFixed(1)} MB
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Görsel */}
        <div className="space-y-4">
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            {item.variants.hero ? (
              <img 
                src={item.variants.hero.url} 
                alt={item.alt || item.originalName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Varyantlar */}
          <div>
            <h4 className="font-medium mb-2">Varyantlar</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item.variants).map(([size, variant]) => (
                <div key={size} className="p-2 border rounded text-xs">
                  <div className="font-medium">{size}</div>
                  <div>{variant.width} × {variant.height}</div>
                  <div>{variant.format.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detaylar */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Alt Metin</label>
            <Input value={item.alt || ''} readOnly />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Açıklama</label>
            <Input value={item.caption || ''} readOnly />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Etiketler</label>
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Koleksiyonlar</label>
            <div className="flex flex-wrap gap-2">
              {item.collections.map(collection => (
                <Badge key={collection} variant="outline">{collection}</Badge>
              ))}
            </div>
          </div>

          {item.colorPalette && (
            <div>
              <label className="block text-sm font-medium mb-2">Renk Paleti</label>
              <div className="flex space-x-2">
                {item.colorPalette.palette.map((color, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
