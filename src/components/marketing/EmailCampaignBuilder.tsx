'use client';

import { useState } from 'react';
import { 
  EnvelopeIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'promotion' | 'abandoned_cart' | 'order_confirmation' | 'newsletter';
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  createdAt: string;
  sentCount: number;
  openRate: number;
  clickRate: number;
}

interface EmailCampaignBuilderProps {
  onSave: (campaign: any) => void;
  onSend: (campaign: any) => void;
}

export default function EmailCampaignBuilder({ onSave, onSend }: EmailCampaignBuilderProps) {
  const [campaign, setCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'promotion' as const,
    recipientType: 'all' as const,
    recipientSegment: '',
    scheduledDate: '',
    template: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const templates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Hoş Geldin E-postası',
      subject: 'TDC Products\'a Hoş Geldiniz!',
      content: 'Merhaba {{name}}, TDC Products ailesine hoş geldiniz!',
      type: 'welcome',
      status: 'draft',
      createdAt: '2024-01-15',
      sentCount: 0,
      openRate: 0,
      clickRate: 0
    },
    {
      id: '2',
      name: 'Sepet Terk E-postası',
      subject: 'Sepetinizdeki ürünler sizi bekliyor!',
      content: 'Merhaba {{name}}, sepetinizdeki ürünleri tamamlamayı unutmayın!',
      type: 'abandoned_cart',
      status: 'draft',
      createdAt: '2024-01-15',
      sentCount: 0,
      openRate: 0,
      clickRate: 0
    },
    {
      id: '3',
      name: 'Özel İndirim',
      subject: 'Sadece sizin için %20 indirim!',
      content: 'Merhaba {{name}}, özel indirim fırsatınız hazır!',
      type: 'promotion',
      status: 'draft',
      createdAt: '2024-01-15',
      sentCount: 0,
      openRate: 0,
      clickRate: 0
    }
  ];

  const recipientTypes = [
    { value: 'all', label: 'Tüm Müşteriler', count: 1250 },
    { value: 'new', label: 'Yeni Müşteriler', count: 45 },
    { value: 'vip', label: 'VIP Müşteriler', count: 89 },
    { value: 'inactive', label: 'Pasif Müşteriler', count: 234 },
    { value: 'segment', label: 'Özel Segment', count: 0 }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(campaign);
      // Toast notification göster
      console.log('Kampanya kaydedildi');
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(campaign);
      // Toast notification göster
      console.log('Kampanya gönderildi');
    } catch (error) {
      console.error('Gönderme hatası:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTemplateSelect = (template: EmailTemplate) => {
    setCampaign(prev => ({
      ...prev,
      subject: template.subject,
      content: template.content,
      type: template.type,
      template: template.id
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <EnvelopeIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">E-posta Kampanya Oluşturucu</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <EyeIcon className="w-4 h-4" />
            <span>Önizleme</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Taraf - Form */}
        <div className="space-y-6">
          {/* Kampanya Bilgileri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kampanya Adı *
            </label>
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => setCampaign(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Kampanya adını girin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta Konusu *
            </label>
            <input
              type="text"
              value={campaign.subject}
              onChange={(e) => setCampaign(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="E-posta konusunu girin"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kampanya Türü
            </label>
            <select
              value={campaign.type}
              onChange={(e) => setCampaign(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="welcome">Hoş Geldin</option>
              <option value="promotion">Promosyon</option>
              <option value="abandoned_cart">Sepet Terk</option>
              <option value="order_confirmation">Sipariş Onayı</option>
              <option value="newsletter">Bülten</option>
            </select>
          </div>

          {/* Alıcı Seçimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alıcı Grubu
            </label>
            <div className="space-y-2">
              {recipientTypes.map((type) => (
                <label key={type.value} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="recipientType"
                      value={type.value}
                      checked={campaign.recipientType === type.value}
                      onChange={(e) => setCampaign(prev => ({ ...prev, recipientType: e.target.value as any }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">{type.label}</span>
                      <p className="text-sm text-gray-500">{type.count} kişi</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Zamanlama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gönderim Zamanı
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="schedule"
                  value="now"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Hemen gönder</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="schedule"
                  value="scheduled"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>Zamanlanmış gönderim</span>
              </label>
              {campaign.scheduledDate && (
                <input
                  type="datetime-local"
                  value={campaign.scheduledDate}
                  onChange={(e) => setCampaign(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}
            </div>
          </div>
        </div>

        {/* Sağ Taraf - İçerik ve Şablonlar */}
        <div className="space-y-6">
          {/* E-posta İçeriği */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              E-posta İçeriği *
            </label>
            <textarea
              value={campaign.content}
              onChange={(e) => setCampaign(prev => ({ ...prev, content: e.target.value }))}
              placeholder="E-posta içeriğini girin..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Değişkenler: {{name}}, {{email}}, {{order_total}}
            </p>
          </div>

          {/* Şablonlar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hazır Şablonlar
            </label>
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.subject}</p>
                    </div>
                    <PencilIcon className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Önizleme */}
      {showPreview && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Önizleme</h4>
          <div className="bg-white p-4 rounded border">
            <div className="border-b pb-2 mb-4">
              <strong>Konu:</strong> {campaign.subject || 'E-posta konusu'}
            </div>
            <div className="whitespace-pre-wrap">
              {campaign.content || 'E-posta içeriği burada görünecek...'}
            </div>
          </div>
        </div>
      )}

      {/* Aksiyon Butonları */}
      <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
        <button
          onClick={handleSave}
          disabled={isSaving || !campaign.name || !campaign.subject || !campaign.content}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        <button
          onClick={handleSend}
          disabled={isSending || !campaign.name || !campaign.subject || !campaign.content}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSending ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </div>
    </div>
  );
}
