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
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Checkbox 
} from '@/components/ui/checkbox';
import { 
  Upload, 
  Camera, 
  Image as ImageIcon,
  Check,
  X,
  Eye,
  Trash2,
  AlertTriangle,
  Shield,
  Heart,
  MessageCircle,
  Star,
  Calendar,
  User,
  Clock
} from 'lucide-react';

import { UGC, UGCSchema, mediaLibrary } from '@/lib/media/mediaLibrary';

interface UGCGalleryProps {
  productId?: string;
  userId?: string;
  onUGCSubmit?: (ugc: UGC) => void;
  onUGCApprove?: (ugcId: string) => void;
  onUGCModerate?: (ugcId: string, status: UGC['status'], notes?: string) => void;
  showModerationTools?: boolean;
  maxUploads?: number;
  disabled?: boolean;
}

export function UGCGallery({
  productId,
  userId,
  onUGCSubmit,
  onUGCApprove,
  onUGCModerate,
  showModerationTools = false,
  maxUploads = 5,
  disabled = false
}: UGCGalleryProps) {
  const [ugcItems, setUgcItems] = useState<UGC[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [consent, setConsent] = useState({
    marketingUse: false,
    socialMedia: false,
    productPromotion: true
  });

  // UGC öğelerini yükle
  const loadUGCItems = async () => {
    try {
      setLoading(true);
      // Gerçek uygulamada API çağrısı yapılacak
      const mockUGC: UGC[] = [
        {
          id: '1',
          userId: 'user1',
          mediaItemId: 'media1',
          productId: productId,
          status: 'approved',
          consent: {
            marketingUse: true,
            socialMedia: false,
            productPromotion: true
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: 'user2',
          mediaItemId: 'media2',
          productId: productId,
          status: 'pending',
          consent: {
            marketingUse: false,
            socialMedia: true,
            productPromotion: true
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setUgcItems(mockUGC);
    } catch (error) {
      console.error('Failed to load UGC items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUGCItems();
  }, [productId]);

  // Dosya yükleme
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || !userId) return;

    for (const file of acceptedFiles) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const ugcItem = await mediaLibrary.uploadUGC(
          file,
          userId,
          productId,
          consent
        );
        
        setUgcItems(prev => [ugcItem, ...prev]);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        onUGCSubmit?.(ugcItem);
        
        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
        }, 2000);
      } catch (error) {
        console.error('UGC upload failed:', error);
        setUploadProgress(prev => ({ ...prev, [file.name]: -1 }));
      }
    }
    
    setUploadDialogOpen(false);
  }, [disabled, userId, productId, consent, onUGCSubmit]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'video/*': ['.mp4', '.webm']
    },
    multiple: true,
    maxFiles: maxUploads
  });

  // UGC moderasyon
  const handleModerate = async (ugcId: string, status: UGC['status'], notes?: string) => {
    try {
      const updatedUGC = await mediaLibrary.moderateUGC(ugcId, status, notes);
      setUgcItems(prev => prev.map(ugc => 
        ugc.id === ugcId ? updatedUGC : ugc
      ));
      onUGCModerate?.(ugcId, status, notes);
    } catch (error) {
      console.error('Failed to moderate UGC:', error);
    }
  };

  // UGC silme
  const handleDelete = async (ugcId: string) => {
    try {
      setUgcItems(prev => prev.filter(ugc => ugc.id !== ugcId));
    } catch (error) {
      console.error('Failed to delete UGC:', error);
    }
  };

  // Filtrelenmiş UGC öğeleri
  const approvedItems = ugcItems.filter(ugc => ugc.status === 'approved');
  const pendingItems = ugcItems.filter(ugc => ugc.status === 'pending');
  const rejectedItems = ugcItems.filter(ugc => ugc.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Müşteri İçerikleri
              </CardTitle>
              <CardDescription>
                Müşterilerinizin paylaştığı görseller ve videolar
              </CardDescription>
            </div>
            
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={disabled || !userId}>
                  <Upload className="w-4 h-4 mr-2" />
                  İçerik Paylaş
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>İçerik Paylaş</DialogTitle>
                  <DialogDescription>
                    Ürününüzle ilgili görsellerinizi paylaşın
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Upload Area */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragActive 
                        ? 'border-[#CBA135] bg-[#CBA135]/5' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      {isDragActive 
                        ? 'Dosyaları buraya bırakın...' 
                        : 'Görselleri sürükleyin veya tıklayın'
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      JPEG, PNG, WebP, MP4, WebM desteklenir
                    </p>
                  </div>

                  {/* Consent Form */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Kullanım İzni</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="productPromotion"
                          checked={consent.productPromotion}
                          onCheckedChange={(checked) => 
                            setConsent(prev => ({ ...prev, productPromotion: !!checked }))
                          }
                        />
                        <label htmlFor="productPromotion" className="text-sm">
                          Ürün tanıtımında kullanılmasına izin veriyorum
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="marketingUse"
                          checked={consent.marketingUse}
                          onCheckedChange={(checked) => 
                            setConsent(prev => ({ ...prev, marketingUse: !!checked }))
                          }
                        />
                        <label htmlFor="marketingUse" className="text-sm">
                          Pazarlama materyallerinde kullanılmasına izin veriyorum
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="socialMedia"
                          checked={consent.socialMedia}
                          onCheckedChange={(checked) => 
                            setConsent(prev => ({ ...prev, socialMedia: !!checked }))
                          }
                        />
                        <label htmlFor="socialMedia" className="text-sm">
                          Sosyal medyada paylaşılmasına izin veriyorum
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <div className="space-y-2">
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
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{approvedItems.length}</div>
                <div className="text-sm text-gray-600">Onaylanan</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{pendingItems.length}</div>
                <div className="text-sm text-gray-600">Bekleyen</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{rejectedItems.length}</div>
                <div className="text-sm text-gray-600">Reddedilen</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UGC Galeri */}
      <Card>
        <CardHeader>
          <CardTitle>Müşteri Görselleri</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : approvedItems.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz içerik yok</h3>
              <p className="text-gray-500 mb-4">
                Müşterileriniz bu ürünle ilgili görsellerini paylaştığında burada görünecek.
              </p>
              <Button onClick={() => setUploadDialogOpen(true)} disabled={disabled}>
                <Camera className="w-4 h-4 mr-2" />
                İlk İçeriği Paylaş
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <AnimatePresence>
                {approvedItems.map((ugc, index) => (
                  <motion.div
                    key={ugc.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <img
                      src="/placeholder-image.jpg" // Gerçek uygulamada mediaItem URL'si
                      alt="Müşteri içeriği"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="secondary">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge variant="default" className="text-xs">
                        Onaylı
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Moderation Tools */}
      {showModerationTools && (pendingItems.length > 0 || rejectedItems.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Moderasyon Araçları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kullanıcı</TableHead>
                  <TableHead>İçerik</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pendingItems, ...rejectedItems].map((ugc) => (
                  <TableRow key={ugc.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Kullanıcı {ugc.userId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src="/placeholder-image.jpg"
                          alt="UGC"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          ugc.status === 'approved' ? 'default' :
                          ugc.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {ugc.status === 'approved' ? 'Onaylı' :
                         ugc.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(ugc.createdAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleModerate(ugc.id, 'approved')}
                          disabled={disabled}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleModerate(ugc.id, 'rejected')}
                          disabled={disabled}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(ugc.id)}
                          disabled={disabled}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// UGC kart bileşeni
function UGCCard({ ugc, onModerate, onDelete, disabled }: {
  ugc: UGC;
  onModerate: (id: string, status: UGC['status']) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-gray-200">
        <img
          src="/placeholder-image.jpg"
          alt="UGC"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Kullanıcı {ugc.userId}</span>
          </div>
          <Badge 
            variant={
              ugc.status === 'approved' ? 'default' :
              ugc.status === 'pending' ? 'secondary' : 'destructive'
            }
            className="text-xs"
          >
            {ugc.status === 'approved' ? 'Onaylı' :
             ugc.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(ugc.createdAt).toLocaleDateString('tr-TR')}</span>
          </div>
          
          {ugc.status === 'pending' && (
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onModerate(ugc.id, 'approved')}
                disabled={disabled}
                className="p-1"
              >
                <Check className="w-3 h-3 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onModerate(ugc.id, 'rejected')}
                disabled={disabled}
                className="p-1"
              >
                <X className="w-3 h-3 text-red-600" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Özel hook - UGC için
export function useUGC(productId?: string) {
  const [ugcItems, setUgcItems] = useState<UGC[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUGC = async () => {
    setLoading(true);
    try {
      // Gerçek uygulamada API çağrısı
      setUgcItems([]);
    } catch (error) {
      console.error('Failed to load UGC:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadUGC = async (file: File, userId: string, consent: UGC['consent']) => {
    try {
      const ugc = await mediaLibrary.uploadUGC(file, userId, productId, consent);
      setUgcItems(prev => [ugc, ...prev]);
      return ugc;
    } catch (error) {
      console.error('Failed to upload UGC:', error);
      throw error;
    }
  };

  const moderateUGC = async (ugcId: string, status: UGC['status'], notes?: string) => {
    try {
      const updatedUGC = await mediaLibrary.moderateUGC(ugcId, status, notes);
      setUgcItems(prev => prev.map(ugc => 
        ugc.id === ugcId ? updatedUGC : ugc
      ));
      return updatedUGC;
    } catch (error) {
      console.error('Failed to moderate UGC:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadUGC();
  }, [productId]);

  return {
    ugcItems,
    loading,
    uploadUGC,
    moderateUGC,
    refetch: loadUGC
  };
}
