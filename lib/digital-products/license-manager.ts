/**
 * Digital Product License Manager
 * STL ve diğer dijital ürünler için lisans yönetimi
 */

import crypto from 'crypto';

export type LicenseType = 'personal' | 'commercial' | 'extended';

export interface LicenseConfig {
  type: LicenseType;
  downloadLimit: number;
  expiryDays: number;
  allowCommercialUse: boolean;
  allowModification: boolean;
  allowRedistribution: boolean;
}

/**
 * License type configurations
 */
export const LICENSE_TYPES: Record<LicenseType, LicenseConfig> = {
  personal: {
    type: 'personal',
    downloadLimit: 5,
    expiryDays: 365, // 1 yıl
    allowCommercialUse: false,
    allowModification: true,
    allowRedistribution: false
  },
  commercial: {
    type: 'commercial',
    downloadLimit: 10,
    expiryDays: 365 * 3, // 3 yıl
    allowCommercialUse: true,
    allowModification: true,
    allowRedistribution: false
  },
  extended: {
    type: 'extended',
    downloadLimit: -1, // Sınırsız
    expiryDays: -1, // Sınırsız
    allowCommercialUse: true,
    allowModification: true,
    allowRedistribution: true
  }
};

/**
 * Generate unique license key
 */
export function generateLicenseKey(productId: string, userId: string): string {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(8).toString('hex');
  const data = `${productId}-${userId}-${timestamp}-${randomBytes}`;
  
  // SHA-256 hash
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  
  // Format: XXXX-XXXX-XXXX-XXXX-XXXX
  const key = hash.substring(0, 20).toUpperCase();
  return `${key.substring(0, 4)}-${key.substring(4, 8)}-${key.substring(8, 12)}-${key.substring(12, 16)}-${key.substring(16, 20)}`;
}

/**
 * Generate secure download URL with expiry
 */
export function generateSecureDownloadUrl(
  fileUrl: string,
  licenseKey: string,
  expiryHours: number = 24
): string {
  const expiresAt = Date.now() + (expiryHours * 60 * 60 * 1000);
  
  // Create signature
  const secret = process.env.DOWNLOAD_SECRET || 'tdc-download-secret';
  const signatureData = `${licenseKey}-${expiresAt}-${secret}`;
  const signature = crypto.createHash('sha256').update(signatureData).digest('hex');
  
  // Encode data
  const token = Buffer.from(JSON.stringify({
    file: fileUrl,
    license: licenseKey,
    expires: expiresAt,
    signature
  })).toString('base64');
  
  return `/api/download/${token}`;
}

/**
 * Verify download token
 */
export function verifyDownloadToken(token: string): {
  valid: boolean;
  fileUrl?: string;
  licenseKey?: string;
  error?: string;
} {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const { file, license, expires, signature } = decoded;
    
    // Check expiry
    if (Date.now() > expires) {
      return { valid: false, error: 'Download linki süresi dolmuş' };
    }
    
    // Verify signature
    const secret = process.env.DOWNLOAD_SECRET || 'tdc-download-secret';
    const expectedSignature = crypto.createHash('sha256')
      .update(`${license}-${expires}-${secret}`)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return { valid: false, error: 'Geçersiz download linki' };
    }
    
    return {
      valid: true,
      fileUrl: file,
      licenseKey: license
    };
  } catch (error) {
    return { valid: false, error: 'Hatalı token' };
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get license type display info
 */
export function getLicenseTypeInfo(type: LicenseType): {
  name: string;
  icon: string;
  description: string;
  features: string[];
  color: string;
} {
  switch (type) {
    case 'personal':
      return {
        name: 'Kişisel Kullanım',
        icon: '👤',
        description: 'Kişisel projeler için',
        features: [
          'Kişisel kullanım için',
          'Değiştirme hakkı',
          '5 download hakkı',
          '1 yıl geçerli'
        ],
        color: 'from-blue-600 to-cyan-600'
      };
    case 'commercial':
      return {
        name: 'Ticari Kullanım',
        icon: '💼',
        description: 'Ticari projeler için',
        features: [
          'Ticari kullanım hakkı',
          'Değiştirme hakkı',
          '10 download hakkı',
          '3 yıl geçerli'
        ],
        color: 'from-purple-600 to-pink-600'
      };
    case 'extended':
      return {
        name: 'Genişletilmiş Lisans',
        icon: '⭐',
        description: 'Tam hak ve yetkiler',
        features: [
          'Sınırsız ticari kullanım',
          'Yeniden dağıtım hakkı',
          'Sınırsız download',
          'Ömür boyu geçerli'
        ],
        color: 'from-amber-600 to-orange-600'
      };
  }
}

/**
 * Validate STL file (basic validation)
 */
export function validateSTLFile(fileName: string): {
  valid: boolean;
  error?: string;
} {
  const allowedExtensions = ['.stl', '.zip', '.rar', '.7z'];
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  
  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'Sadece STL veya ZIP dosyaları yüklenebilir'
    };
  }
  
  return { valid: true };
}

/**
 * Generate STL product metadata
 */
export function generateSTLMetadata(file: File): {
  fileName: string;
  fileSize: number;
  fileFormat: string;
  estimatedPrintTime?: string;
  suggestedMaterial?: string;
} {
  const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
  
  return {
    fileName: file.name,
    fileSize: file.size,
    fileFormat: extension,
    estimatedPrintTime: undefined, // STL parse edilebilir (gelecek özellik)
    suggestedMaterial: 'PLA' // Varsayılan
  };
}

