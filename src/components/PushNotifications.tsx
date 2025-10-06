"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Settings } from 'lucide-react';

export default function PushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Check existing subscription
    checkExistingSubscription();
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        setSubscription(sub);
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        await subscribeToPush();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID public key (should be in environment variables)
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HI80iFfUvNnwHp1Q6Qz0n5m5q7Y1f2x3v4b5n6m7q8w9e0r1t2y3u4i5o6p7';
      
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });

      setSubscription(sub);
      setIsSubscribed(true);
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  };

  const unsubscribeFromPush = async () => {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        
        // Notify server about unsubscription
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        });

        setSubscription(null);
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#CBA135] rounded-lg flex items-center justify-center">
            {isSubscribed ? (
              <Bell className="w-6 h-6 text-white" />
            ) : (
              <BellOff className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Push Bildirimleri</h3>
            <p className="text-sm text-gray-600">
              {isSubscribed ? 'Bildirimler aktif' : 'Bildirimler kapalı'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Kampanya Bildirimleri</h4>
            <p className="text-sm text-gray-600">Özel indirimler ve kampanyalar hakkında bilgilendiril</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSubscribed}
              onChange={isSubscribed ? unsubscribeFromPush : requestPermission}
              className="w-4 h-4 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135] focus:ring-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Sipariş Bildirimleri</h4>
            <p className="text-sm text-gray-600">Sipariş durumu değişiklikleri hakkında bilgilendiril</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSubscribed}
              onChange={isSubscribed ? unsubscribeFromPush : requestPermission}
              className="w-4 h-4 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135] focus:ring-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Ürün Bildirimleri</h4>
            <p className="text-sm text-gray-600">Favori ürünlerinizde fiyat düşüşleri hakkında bilgilendiril</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSubscribed}
              onChange={isSubscribed ? unsubscribeFromPush : requestPermission}
              className="w-4 h-4 text-[#CBA135] border-gray-300 rounded focus:ring-[#CBA135] focus:ring-2"
            />
          </div>
        </div>

        {permission === 'denied' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-700">
              Bildirimler tarayıcı ayarlarında engellenmiş. Bildirimleri aktifleştirmek için tarayıcı ayarlarını kontrol edin.
            </p>
          </motion.div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={isSubscribed ? unsubscribeFromPush : requestPermission}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isSubscribed
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#CBA135] text-white hover:bg-[#B8941F]'
            }`}
          >
            {isSubscribed ? (
              <>
                <BellOff className="w-4 h-4" />
                Bildirimleri Kapat
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Bildirimleri Aç
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
