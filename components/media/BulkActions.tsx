'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Edit, Tags, CheckCircle, Sparkles } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: string, data: any) => Promise<void>;
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, onAction, onClearSelection }: BulkActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'alt' | 'tags' | 'status' | 'optimize' | null>(null);
  
  // Form states
  const [altText, setAltText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tagAction, setTagAction] = useState<'add' | 'remove'>('add');
  const [status, setStatus] = useState<'ACTIVE' | 'DEPRECATED' | 'MISSING'>('ACTIVE');
  const [optimizeFormat, setOptimizeFormat] = useState<'webp' | 'avif'>('webp');
  const [optimizeQuality, setOptimizeQuality] = useState(80);

  function openDialog(type: typeof dialogType) {
    setDialogType(type);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setDialogType(null);
    // Reset form
    setAltText('');
    setTitleText('');
    setTagsInput('');
    setTagAction('add');
    setStatus('ACTIVE');
  }

  async function handleSubmit() {
    if (!dialogType) return;

    let actionData: any = {};

    switch (dialogType) {
      case 'alt':
        actionData = { alt: altText, title: titleText };
        await onAction('updateAlt', actionData);
        break;
      case 'tags':
        const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
        actionData = { tags };
        await onAction(tagAction === 'add' ? 'addTags' : 'removeTags', actionData);
        break;
      case 'status':
        actionData = { status };
        await onAction('updateStatus', actionData);
        break;
      case 'optimize':
        actionData = { format: optimizeFormat, quality: optimizeQuality };
        await onAction('optimize', actionData);
        break;
    }

    closeDialog();
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {selectedCount} görsel seçildi
          </span>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openDialog('alt')}
            >
              <Edit className="mr-2 h-4 w-4" />
              Alt Metin
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => openDialog('tags')}
            >
              <Tags className="mr-2 h-4 w-4" />
              Etiketler
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => openDialog('status')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Durum
            </Button>
            
            {process.env.NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION === 'true' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openDialog('optimize')}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Optimize Et
              </Button>
            )}
          </div>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
        >
          <X className="mr-2 h-4 w-4" />
          Seçimi Temizle
        </Button>
      </div>

      {/* Dialogs */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'alt' && 'Alt Metin Güncelle'}
              {dialogType === 'tags' && 'Etiket İşlemleri'}
              {dialogType === 'status' && 'Durum Güncelle'}
              {dialogType === 'optimize' && 'Görselleri Optimize Et'}
            </DialogTitle>
            <DialogDescription>
              {selectedCount} görsel için toplu işlem yapılacak
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {dialogType === 'alt' && (
              <>
                <div>
                  <Label htmlFor="bulkAlt">Alt Metin</Label>
                  <Textarea
                    id="bulkAlt"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Tüm seçili görseller için alt metin..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="bulkTitle">Başlık (Opsiyonel)</Label>
                  <Input
                    id="bulkTitle"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    placeholder="Başlık..."
                  />
                </div>
              </>
            )}

            {dialogType === 'tags' && (
              <>
                <div>
                  <Label htmlFor="tagAction">İşlem</Label>
                  <Select
                    value={tagAction}
                    onValueChange={(value: 'add' | 'remove') => setTagAction(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Etiket Ekle</SelectItem>
                      <SelectItem value="remove">Etiket Kaldır</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tagsInput">Etiketler (virgülle ayırın)</Label>
                  <Input
                    id="tagsInput"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="ürün, banner, hero"
                  />
                </div>
              </>
            )}

            {dialogType === 'status' && (
              <div>
                <Label htmlFor="statusSelect">Yeni Durum</Label>
                <Select
                  value={status}
                  onValueChange={(value: any) => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Aktif</SelectItem>
                    <SelectItem value="DEPRECATED">Kullanımdan Kaldırıldı</SelectItem>
                    <SelectItem value="MISSING">Kayıp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {dialogType === 'optimize' && (
              <>
                <div>
                  <Label htmlFor="optimizeFormat">Format</Label>
                  <Select
                    value={optimizeFormat}
                    onValueChange={(value: 'webp' | 'avif') => setOptimizeFormat(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webp">WebP</SelectItem>
                      <SelectItem value="avif">AVIF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="optimizeQuality">Kalite: {optimizeQuality}%</Label>
                  <input
                    id="optimizeQuality"
                    type="range"
                    min="1"
                    max="100"
                    value={optimizeQuality}
                    onChange={(e) => setOptimizeQuality(parseInt(e.target.value, 10))}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              İptal
            </Button>
            <Button onClick={handleSubmit}>
              Uygula
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

