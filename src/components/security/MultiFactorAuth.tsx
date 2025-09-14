'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  ShieldCheckIcon, 
  QrCodeIcon, 
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface MFAMethod {
  id: string;
  type: 'totp' | 'sms' | 'email' | 'backup_codes';
  name: string;
  description: string;
  isEnabled: boolean;
  isVerified: boolean;
  icon: React.ComponentType<any>;
  color: string;
}

interface MFASettings {
  methods: MFAMethod[];
  backupCodes: string[];
  isMFARequired: boolean;
  isMFAEnabled: boolean;
}

export default function MultiFactorAuth() {
  const [settings, setSettings] = useState<MFASettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMFASettings();
  }, []);

  const fetchMFASettings = async () => {
    try {
      const response = await fetch('/api/security/mfa/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('MFA settings fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMFA = async (methodType: string) => {
    try {
      setError('');
      setSuccess('');
      setIsVerifying(true);

      const response = await fetch('/api/security/mfa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: methodType }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (methodType === 'totp') {
          setQrCode(data.qrCode);
          setSecretKey(data.secretKey);
        }
        
        setActiveMethod(methodType);
        setSuccess(`${methodType.toUpperCase()} MFA etkinleştirildi. Doğrulama kodunu girin.`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'MFA etkinleştirme hatası');
      }
    } catch (error) {
      setError('MFA etkinleştirme sırasında hata oluştu');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setError('Doğrulama kodunu girin');
      return;
    }

    try {
      setError('');
      setIsVerifying(true);

      const response = await fetch('/api/security/mfa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          method: activeMethod,
          code: verificationCode.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('MFA başarıyla doğrulandı ve etkinleştirildi!');
        setVerificationCode('');
        setActiveMethod(null);
        setQrCode('');
        setSecretKey('');
        
        if (data.backupCodes) {
          setShowBackupCodes(true);
        }
        
        await fetchMFASettings();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Doğrulama kodu hatalı');
      }
    } catch (error) {
      setError('Doğrulama sırasında hata oluştu');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisableMFA = async (methodType: string) => {
    if (!confirm('Bu MFA yöntemini devre dışı bırakmak istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setError('');
      setIsVerifying(true);

      const response = await fetch('/api/security/mfa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: methodType }),
      });

      if (response.ok) {
        setSuccess('MFA yöntemi başarıyla devre dışı bırakıldı');
        await fetchMFASettings();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'MFA devre dışı bırakma hatası');
      }
    } catch (error) {
      setError('MFA devre dışı bırakma sırasında hata oluştu');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    try {
      setError('');
      setIsVerifying(true);

      const response = await fetch('/api/security/mfa/backup-codes/regenerate', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => prev ? { ...prev, backupCodes: data.backupCodes } : null);
        setShowBackupCodes(true);
        setSuccess('Yedek kodlar yeniden oluşturuldu');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Yedek kod oluşturma hatası');
      }
    } catch (error) {
      setError('Yedek kod oluşturma sırasında hata oluştu');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Panoya kopyalandı');
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <ShieldCheckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            MFA Ayarları Yüklenemedi
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Güvenlik ayarları şu anda mevcut değil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Çok Faktörlü Kimlik Doğrulama
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Hesabınızı ek güvenlik katmanları ile koruyun
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            settings.isMFAEnabled ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {settings.isMFAEnabled ? 'Etkin' : 'Devre Dışı'}
          </span>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <XCircleIcon className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
        </div>
      )}

      {/* MFA Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.methods.map((method) => {
          const IconComponent = method.icon;
          return (
            <div
              key={method.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${method.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {method.isEnabled ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Etkin
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                      Devre Dışı
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                {method.isEnabled ? (
                  <button
                    onClick={() => handleDisableMFA(method.type)}
                    disabled={isVerifying}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Devre Dışı Bırak
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnableMFA(method.type)}
                    disabled={isVerifying}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Etkinleştir
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTP Setup */}
      {activeMethod === 'totp' && qrCode && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Authenticator Uygulaması Kurulumu
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">
                1. QR Kodu Tarayın
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Google Authenticator, Authy veya benzeri bir uygulama ile QR kodu tarayın.
              </p>
              <div className="bg-white p-4 rounded-lg border border-gray-200 inline-block">
                <Image src={qrCode} alt="QR Code" width={192} height={192} className="w-48 h-48" />
              </div>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">
                2. Manuel Anahtar (Opsiyonel)
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                QR kod çalışmazsa bu anahtarı manuel olarak girebilirsiniz.
              </p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                  {secretKey}
                </code>
                <button
                  onClick={() => copyToClipboard(secretKey)}
                  className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Kopyala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Code Input */}
      {activeMethod && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Doğrulama Kodu
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {activeMethod === 'totp' && 'Authenticator uygulamanızdan 6 haneli kodu girin.'}
            {activeMethod === 'sms' && 'Telefonunuza gönderilen SMS kodunu girin.'}
            {activeMethod === 'email' && 'E-posta adresinize gönderilen kodu girin.'}
          </p>
          
          <div className="flex items-center space-x-4">
            <input
              ref={codeInputRef}
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Doğrulama kodu"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={6}
            />
            <button
              onClick={handleVerifyCode}
              disabled={isVerifying || !verificationCode.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isVerifying ? 'Doğrulanıyor...' : 'Doğrula'}
            </button>
          </div>
        </div>
      )}

      {/* Backup Codes */}
      {showBackupCodes && settings.backupCodes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Yedek Kodlar
            </h3>
            <button
              onClick={() => setShowBackupCodes(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Önemli: Bu kodları güvenli bir yerde saklayın
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                  Bu kodlar sadece bir kez gösterilir. MFA cihazınıza erişiminiz olmadığında kullanabilirsiniz.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {settings.backupCodes.map((code, index) => (
              <div
                key={index}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-center"
              >
                {code}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => copyToClipboard(settings.backupCodes.join('\n'))}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Tümünü Kopyala
            </button>
            <button
              onClick={handleRegenerateBackupCodes}
              disabled={isVerifying}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              Yeniden Oluştur
            </button>
          </div>
        </div>
      )}

      {/* Security Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Güvenlik Bilgileri
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• MFA, hesabınızı ek güvenlik katmanları ile korur</li>
          <li>• Yedek kodları güvenli bir yerde saklayın</li>
          <li>• MFA cihazınızı kaybederseniz yedek kodları kullanın</li>
          <li>• Şüpheli aktivite durumunda hemen bildirin</li>
        </ul>
      </div>
    </div>
  );
}
