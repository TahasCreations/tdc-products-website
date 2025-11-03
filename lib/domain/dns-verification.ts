/**
 * DNS Verification Utilities
 * Custom domain DNS ayarlarını doğrulama
 */

export interface DNSRecord {
  type: 'A' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  ttl?: number;
}

export interface DomainVerificationResult {
  success: boolean;
  records: {
    cname?: {
      configured: boolean;
      expected: string;
      actual?: string;
    };
    txt?: {
      configured: boolean;
      expected: string;
      actual?: string;
    };
  };
  message: string;
}

/**
 * Generate DNS records for custom domain
 */
export function generateDNSRecords(hostname: string, targetDomain: string): DNSRecord[] {
  return [
    {
      type: 'CNAME',
      name: hostname,
      value: targetDomain,
      ttl: 3600
    },
    {
      type: 'TXT',
      name: `_tdc-verification.${hostname}`,
      value: `tdc-site-verification=${generateVerificationToken(hostname)}`,
      ttl: 3600
    }
  ];
}

/**
 * Generate verification token for domain
 */
export function generateVerificationToken(hostname: string): string {
  const secret = process.env.DOMAIN_VERIFICATION_SECRET || 'tdc-market-secret';
  const data = `${hostname}-${secret}`;
  
  // Simple hash (in production, use crypto.createHash)
  return Buffer.from(data).toString('base64').substring(0, 32);
}

/**
 * Verify DNS configuration (server-side)
 * In production, use DNS lookup libraries like 'dns' or external services
 */
export async function verifyDNSConfiguration(
  hostname: string,
  expectedTarget: string
): Promise<DomainVerificationResult> {
  try {
    // Mock verification - in production, perform actual DNS lookup
    // const dns = require('dns').promises;
    // const records = await dns.resolveCname(hostname);
    
    // For now, simulate verification
    const isConfigured = Math.random() > 0.3; // Mock: 70% başarı
    
    if (isConfigured) {
      return {
        success: true,
        records: {
          cname: {
            configured: true,
            expected: expectedTarget,
            actual: expectedTarget
          },
          txt: {
            configured: true,
            expected: generateVerificationToken(hostname),
            actual: generateVerificationToken(hostname)
          }
        },
        message: 'DNS ayarları doğrulandı! Domain aktif edildi.'
      };
    } else {
      return {
        success: false,
        records: {
          cname: {
            configured: false,
            expected: expectedTarget,
            actual: undefined
          }
        },
        message: 'DNS ayarları henüz yapılmamış. Lütfen CNAME kaydını ekleyin ve 24-48 saat bekleyin.'
      };
    }
  } catch (error) {
    console.error('DNS verification error:', error);
    return {
      success: false,
      records: {},
      message: 'DNS doğrulama sırasında hata oluştu.'
    };
  }
}

/**
 * Get DNS propagation status
 */
export function getDNSPropagationTime(): string {
  return '24-48 saat';
}

/**
 * Common DNS providers and their setup guides
 */
export const DNS_PROVIDERS = [
  {
    name: 'Cloudflare',
    icon: '☁️',
    setupGuide: 'https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/',
    steps: [
      'Cloudflare Dashboard\'a giriş yapın',
      'DNS bölümüne gidin',
      'Add Record butonuna tıklayın',
      'Type: CNAME seçin',
      'Name ve Value alanlarını doldurun',
      'Save butonuna tıklayın'
    ]
  },
  {
    name: 'GoDaddy',
    icon: '🌐',
    setupGuide: 'https://www.godaddy.com/help/add-a-cname-record-19236',
    steps: [
      'GoDaddy hesabınıza giriş yapın',
      'DNS Management\'a gidin',
      'CNAME kaydı ekleyin',
      'Host ve Points to alanlarını doldurun',
      'Kaydedin'
    ]
  },
  {
    name: 'Namecheap',
    icon: '💰',
    setupGuide: 'https://www.namecheap.com/support/knowledgebase/article.aspx/9646/2237/how-to-create-a-cname-record-for-your-domain/',
    steps: [
      'Namecheap hesabınıza giriş yapın',
      'Domain List\'e gidin',
      'Manage butonuna tıklayın',
      'Advanced DNS sekmesine gidin',
      'Add New Record ile CNAME ekleyin'
    ]
  },
  {
    name: 'Other (Diğer)',
    icon: '🔧',
    setupGuide: null,
    steps: [
      'Domain sağlayıcınızın DNS paneline gidin',
      'CNAME record ekleyin',
      'Host/Name: domain adınız',
      'Value/Points to: hedef domain',
      'TTL: 3600 (veya Auto)',
      'Kaydedin ve 24-48 saat bekleyin'
    ]
  }
];

