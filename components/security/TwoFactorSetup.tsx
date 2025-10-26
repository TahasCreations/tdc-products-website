"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Smartphone,
  Mail,
  CheckCircle,
  X,
  Copy,
  Download
} from 'lucide-react';

export const TwoFactorSetup: React.FC = () => {
  const [method, setMethod] = useState<'app' | 'sms' | 'email'>('app');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleGenerate = async () => {
    // Generate 2FA secret
    // const result = await TwoFactorAuth.generateSecret('user@example.com');
    // setQrCode(result.qrCode);
    // setSecret(result.secret);
    
    // Mock for demo
    setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    setSecret('JBSWY3DPEHPK3PXP');
  };

  const handleVerify = () => {
    // Verify code
    // const isValid = TwoFactorAuth.verify(verificationCode, secret);
    // setIsVerified(isValid);
    
    // Mock for demo
    setIsVerified(true);
    setBackupCodes(['ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345']);
  };

  const handleDownloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-600">Güvenliğinizi artırın</p>
        </div>
      </div>

      {/* Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Doğrulama Yöntemi
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'app', label: 'Authenticator App', icon: Smartphone },
            { key: 'sms', label: 'SMS', icon: Smartphone },
            { key: 'email', label: 'Email', icon: Mail },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMethod(key as any)}
              className={`p-4 border-2 rounded-xl transition-all flex flex-col items-center gap-2 ${
                method === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`w-6 h-6 ${method === key ? 'text-blue-600' : 'text-gray-600'}`} />
              <span className={`text-sm font-medium ${method === key ? 'text-blue-600' : 'text-gray-700'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Setup Steps */}
      {method === 'app' && (
        <div className="space-y-4">
          {!secret && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleGenerate}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Authenticator App Oluştur
            </motion.button>
          )}

          {secret && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* QR Code */}
              <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-xl">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Bu QR kodu Google Authenticator veya benzeri bir uygulamayla tarayın
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                    <code className="text-sm font-mono text-gray-900">{secret}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(secret)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Verification */}
              {!isVerified && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Doğrulama Kodu
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleVerify}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Doğrula ve Aktif Et
                  </button>
                </div>
              )}

              {/* Backup Codes */}
              {isVerified && backupCodes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">2FA Başarıyla Aktif Edildi!</span>
                  </div>
                  <p className="text-sm text-green-800 mb-3">
                    Bu yedek kodları güvenli bir yerde saklayın. Telefonunuzu kaybederseniz bu kodları kullanabilirsiniz.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {backupCodes.map((code, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 bg-white border border-green-200 rounded-lg text-center font-mono text-sm"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleDownloadBackupCodes}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Yedek Kodları İndir
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* SMS Method */}
      {method === 'sms' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            SMS doğrulama yakında gelecek. Şimdilik Authenticator App kullanın.
          </p>
        </div>
      )}

      {/* Email Method */}
      {method === 'email' && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            Email doğrulama yakında gelecek. Şimdilik Authenticator App kullanın.
          </p>
        </div>
      )}
    </div>
  );
};

