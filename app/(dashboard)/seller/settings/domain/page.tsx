"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function DomainSettingsPage() {
  const [hostname, setHostname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostname.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/domains/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: hostname.trim() })
      });
      
      if (response.ok) {
        setMessage('Domain talebi başarıyla oluşturuldu! DNS ayarlarını yapın ve admin onayını bekleyin.');
        setHostname('');
      } else {
        setMessage('Hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      setMessage('Hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Özel Domain Ayarları</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">Yeni Domain Ekle</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="hostname" className="block text-sm font-medium text-gray-700 mb-2">
              Domain Adı
            </label>
            <input
              type="text"
              id="hostname"
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              placeholder="örnek: rsdecors.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !hostname.trim()}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Domain Talebi Oluştur'}
          </button>
        </form>
        
        {message && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Domain Hakkı Uyarısı */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">Domain Hakkı</h3>
          <p className="text-sm text-yellow-700 mb-2">
            Yıllık plana geçerek 1 yıllık alan adını dâhil edebilirsin.
          </p>
          <Link
            href="/seller/settings/domain-subscriptions"
            className="text-sm text-yellow-800 underline hover:text-yellow-900"
          >
            Domain aboneliklerini görüntüle →
          </Link>
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">DNS Ayarları</h3>
        <p className="text-sm text-yellow-700">
          Domain talebi oluşturduktan sonra, DNS ayarlarınızda CNAME kaydı ekleyin:
        </p>
        <div className="mt-2 p-2 bg-white rounded border font-mono text-sm">
          <div>Type: CNAME</div>
          <div>Name: @ (veya www)</div>
          <div>Value: tdc-products-website.vercel.app</div>
        </div>
        <p className="text-sm text-yellow-700 mt-2">
          DNS ayarları yapıldıktan sonra admin onayı ile domain aktif hale gelecektir.
        </p>
      </div>
    </div>
  );
}
