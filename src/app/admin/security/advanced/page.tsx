'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  LockClosedIcon,
  KeyIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChartBarIcon,
  BellIcon,
  GlobeAltIcon,
  ServerIcon,
  CpuChipIcon,
  FireIcon,
  BugAntIcon,
  ShieldExclamationIcon,
  UserIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAmericasIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'system_change' | 'threat_detected';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user: string;
  ip: string;
  location: string;
  device: string;
  browser: string;
  timestamp: string;
  status: 'resolved' | 'investigating' | 'pending' | 'false_positive';
  riskScore: number;
  tags: string[];
}

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  category: 'authentication' | 'authorization' | 'data_protection' | 'network' | 'compliance';
  isActive: boolean;
  rules: SecurityRule[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface SecurityRule {
  id: string;
  name: string;
  condition: string;
  action: 'allow' | 'deny' | 'alert' | 'block' | 'log';
  priority: number;
  isEnabled: boolean;
}

interface ComplianceCheck {
  id: string;
  standard: 'GDPR' | 'KVKK' | 'ISO27001' | 'SOC2' | 'PCI-DSS';
  name: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'warning' | 'not_applicable';
  lastChecked: string;
  nextCheck: string;
  issues: ComplianceIssue[];
  score: number;
}

interface ComplianceIssue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  dueDate: string;
  assignedTo: string;
}

interface ThreatIntelligence {
  id: string;
  type: 'malware' | 'phishing' | 'ddos' | 'brute_force' | 'sql_injection' | 'xss';
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  indicators: string[];
  firstSeen: string;
  lastSeen: string;
  affectedSystems: string[];
  mitigation: string[];
}

export default function AdvancedSecurity() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [compliance, setCompliance] = useState<ComplianceCheck[]>([]);
  const [threats, setThreats] = useState<ThreatIntelligence[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'policies' | 'compliance' | 'threats' | 'analytics' | 'settings'>('events');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Mock data
  useEffect(() => {
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'failed_login',
        severity: 'high',
        title: 'Çoklu Başarısız Giriş Denemesi',
        description: 'Aynı IP adresinden 5 dakika içinde 10 başarısız giriş denemesi tespit edildi',
        user: 'unknown@example.com',
        ip: '192.168.1.100',
        location: 'İstanbul, Türkiye',
        device: 'Windows 10',
        browser: 'Chrome 120.0',
        timestamp: '2024-01-15T14:30:00Z',
        status: 'investigating',
        riskScore: 85,
        tags: ['brute_force', 'suspicious_ip', 'high_risk']
      },
      {
        id: '2',
        type: 'suspicious_activity',
        severity: 'critical',
        title: 'Anormal Veri Erişim Paterni',
        description: 'Kullanıcı normalden 10 kat fazla veri indirdi',
        user: 'admin@example.com',
        ip: '10.0.0.50',
        location: 'Ankara, Türkiye',
        device: 'MacBook Pro',
        browser: 'Safari 17.0',
        timestamp: '2024-01-15T13:45:00Z',
        status: 'pending',
        riskScore: 95,
        tags: ['data_exfiltration', 'insider_threat', 'critical']
      },
      {
        id: '3',
        type: 'threat_detected',
        severity: 'high',
        title: 'Malware Tespit Edildi',
        description: 'Sistemde bilinen bir malware imzası tespit edildi',
        user: 'system',
        ip: '192.168.1.200',
        location: 'İzmir, Türkiye',
        device: 'Windows Server 2019',
        browser: 'N/A',
        timestamp: '2024-01-15T12:20:00Z',
        status: 'resolved',
        riskScore: 90,
        tags: ['malware', 'infected_file', 'quarantined']
      },
      {
        id: '4',
        type: 'login',
        severity: 'low',
        title: 'Başarılı Giriş',
        description: 'Kullanıcı başarıyla sisteme giriş yaptı',
        user: 'user@example.com',
        ip: '192.168.1.150',
        location: 'Bursa, Türkiye',
        device: 'iPhone 15',
        browser: 'Safari Mobile',
        timestamp: '2024-01-15T11:15:00Z',
        status: 'resolved',
        riskScore: 5,
        tags: ['normal_login', 'mobile_device']
      }
    ];

    const mockPolicies: SecurityPolicy[] = [
      {
        id: '1',
        name: 'Güçlü Şifre Politikası',
        description: 'Minimum 12 karakter, büyük/küçük harf, sayı ve özel karakter içermeli',
        category: 'authentication',
        isActive: true,
        rules: [
          {
            id: '1',
            name: 'Minimum Şifre Uzunluğu',
            condition: 'password.length >= 12',
            action: 'deny',
            priority: 1,
            isEnabled: true
          },
          {
            id: '2',
            name: 'Karmaşık Karakter Gereksinimi',
            condition: 'password.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])/)',
            action: 'deny',
            priority: 2,
            isEnabled: true
          }
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com'
      },
      {
        id: '2',
        name: 'Veri Şifreleme Politikası',
        description: 'Tüm hassas veriler AES-256 ile şifrelenmelidir',
        category: 'data_protection',
        isActive: true,
        rules: [
          {
            id: '3',
            name: 'Veritabanı Şifreleme',
            condition: 'database.encryption == true',
            action: 'allow',
            priority: 1,
            isEnabled: true
          },
          {
            id: '4',
            name: 'Dosya Şifreleme',
            condition: 'file.encryption == true',
            action: 'allow',
            priority: 2,
            isEnabled: true
          }
        ],
        createdAt: '2024-01-05T00:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'admin@example.com'
      }
    ];

    const mockCompliance: ComplianceCheck[] = [
      {
        id: '1',
        standard: 'KVKK',
        name: 'Kişisel Verilerin Korunması',
        description: 'KVKK uyumluluk kontrolü',
        status: 'compliant',
        lastChecked: '2024-01-15T10:00:00Z',
        nextCheck: '2024-02-15T10:00:00Z',
        issues: [],
        score: 95
      },
      {
        id: '2',
        standard: 'GDPR',
        name: 'Genel Veri Koruma Yönetmeliği',
        description: 'GDPR uyumluluk kontrolü',
        status: 'warning',
        lastChecked: '2024-01-15T10:00:00Z',
        nextCheck: '2024-02-15T10:00:00Z',
        issues: [
          {
            id: '1',
            title: 'Veri İşleme Amaçları Belirsiz',
            description: 'Bazı veri işleme amaçları yeterince açık değil',
            severity: 'medium',
            status: 'in_progress',
            dueDate: '2024-01-30T00:00:00Z',
            assignedTo: 'legal@example.com'
          }
        ],
        score: 78
      }
    ];

    const mockThreats: ThreatIntelligence[] = [
      {
        id: '1',
        type: 'malware',
        name: 'Trojan.Win32.Generic',
        description: 'Bilinen bir trojan türü',
        severity: 'high',
        source: 'VirusTotal',
        indicators: ['hash:abc123', 'ip:192.168.1.100', 'domain:malicious.com'],
        firstSeen: '2024-01-10T00:00:00Z',
        lastSeen: '2024-01-15T12:20:00Z',
        affectedSystems: ['web-server-01', 'database-server-01'],
        mitigation: ['Quarantine infected files', 'Update antivirus signatures', 'Scan all systems']
      },
      {
        id: '2',
        type: 'phishing',
        name: 'Fake Login Page',
        description: 'Sahte giriş sayfası tespit edildi',
        severity: 'medium',
        source: 'Internal Detection',
        indicators: ['url:fake-login.example.com', 'email:phishing@example.com'],
        firstSeen: '2024-01-14T08:00:00Z',
        lastSeen: '2024-01-15T09:30:00Z',
        affectedSystems: ['email-server-01'],
        mitigation: ['Block malicious URLs', 'Update email filters', 'User awareness training']
      }
    ];

    setEvents(mockEvents);
    setPolicies(mockPolicies);
    setCompliance(mockCompliance);
    setThreats(mockThreats);
    setLoading(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return FireIcon;
      case 'high': return ExclamationTriangleIcon;
      case 'medium': return ShieldExclamationIcon;
      case 'low': return CheckCircleIcon;
      default: return ShieldCheckIcon;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login': return UserIcon;
      case 'logout': return UserIcon;
      case 'failed_login': return XCircleIcon;
      case 'suspicious_activity': return ExclamationTriangleIcon;
      case 'data_access': return DocumentTextIcon;
      case 'system_change': return CogIcon;
      case 'threat_detected': return BugAntIcon;
      default: return ShieldCheckIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'investigating': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'false_positive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'non_compliant': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'not_applicable': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !severityFilter || event.severity === severityFilter;
    const matchesType = !typeFilter || event.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Güvenlik Sistemi</h1>
                <p className="mt-2 text-gray-600">Kapsamlı güvenlik yönetimi ve tehdit analizi</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                  <FireIcon className="w-5 h-5 mr-2" />
                  Acil Durum
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Tarama Başlat
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'events', name: 'Güvenlik Olayları', icon: ShieldCheckIcon },
                { id: 'policies', name: 'Güvenlik Politikaları', icon: DocumentTextIcon },
                { id: 'compliance', name: 'Uyumluluk', icon: CheckCircleIcon },
                { id: 'threats', name: 'Tehdit İstihbaratı', icon: BugAntIcon },
                { id: 'analytics', name: 'Analitik', icon: ChartBarIcon },
                { id: 'settings', name: 'Ayarlar', icon: CogIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Güvenlik olayı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Önem Dereceleri</option>
              <option value="critical">Kritik</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tüm Türler</option>
              <option value="login">Giriş</option>
              <option value="failed_login">Başarısız Giriş</option>
              <option value="suspicious_activity">Şüpheli Aktivite</option>
              <option value="threat_detected">Tehdit Tespiti</option>
            </select>
          </div>

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {filteredEvents.map((event) => {
                  const SeverityIcon = getSeverityIcon(event.severity);
                  const TypeIcon = getTypeIcon(event.type);
                  
                  return (
                    <div key={event.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <div className="p-2 bg-gray-100 rounded-lg mr-4">
                              <TypeIcon className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                              <SeverityIcon className="w-3 h-3 mr-1" />
                              {event.severity === 'critical' ? 'Kritik' :
                               event.severity === 'high' ? 'Yüksek' :
                               event.severity === 'medium' ? 'Orta' : 'Düşük'}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                              {event.status === 'resolved' ? 'Çözüldü' :
                               event.status === 'investigating' ? 'İnceleniyor' :
                               event.status === 'pending' ? 'Beklemede' : 'Yanlış Pozitif'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Kullanıcı</p>
                            <p className="text-sm font-medium text-gray-900">{event.user}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">IP Adresi</p>
                            <p className="text-sm font-medium text-gray-900">{event.ip}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Konum</p>
                            <p className="text-sm font-medium text-gray-900">{event.location}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Cihaz</p>
                            <p className="text-sm font-medium text-gray-900">{event.device}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {event.tags.map((tag, index) => (
                              <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Risk Skoru: {event.riskScore}</span>
                            <span>{new Date(event.timestamp).toLocaleString('tr-TR')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy) => (
                  <div key={policy.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{policy.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{policy.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            policy.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                          }`}>
                            {policy.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Kategori:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {policy.category === 'authentication' ? 'Kimlik Doğrulama' :
                             policy.category === 'authorization' ? 'Yetkilendirme' :
                             policy.category === 'data_protection' ? 'Veri Koruması' :
                             policy.category === 'network' ? 'Ağ' : 'Uyumluluk'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Kurallar:</span>
                          <span className="text-sm font-medium text-gray-900">{policy.rules.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Oluşturan:</span>
                          <span className="text-sm text-gray-900">{policy.createdBy}</span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="text-xs text-gray-500">
                          Güncellenme: {new Date(policy.updatedAt).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compliance.map((check) => (
                  <div key={check.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{check.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getComplianceColor(check.status)}`}>
                          {check.status === 'compliant' ? 'Uyumlu' :
                           check.status === 'non_compliant' ? 'Uyumsuz' :
                           check.status === 'warning' ? 'Uyarı' : 'Uygulanamaz'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Standart:</span>
                          <span className="text-sm font-medium text-gray-900">{check.standard}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Skor:</span>
                          <span className="text-sm font-medium text-gray-900">%{check.score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Son Kontrol:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(check.lastChecked).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sonraki Kontrol:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(check.nextCheck).toLocaleDateString('tr-TR')}
                          </span>
                        </div>
                      </div>

                      {check.issues.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Sorunlar:</h4>
                          <div className="space-y-2">
                            {check.issues.map((issue) => (
                              <div key={issue.id} className="text-xs text-gray-600">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  issue.severity === 'critical' ? 'text-red-600 bg-red-100' :
                                  issue.severity === 'high' ? 'text-orange-600 bg-orange-100' :
                                  issue.severity === 'medium' ? 'text-yellow-600 bg-yellow-100' :
                                  'text-green-600 bg-green-100'
                                }`}>
                                  {issue.severity === 'critical' ? 'Kritik' :
                                   issue.severity === 'high' ? 'Yüksek' :
                                   issue.severity === 'medium' ? 'Orta' : 'Düşük'}
                                </span>
                                <span className="ml-2">{issue.title}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Threats Tab */}
          {activeTab === 'threats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {threats.map((threat) => {
                  const SeverityIcon = getSeverityIcon(threat.severity);
                  
                  return (
                    <div key={threat.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start">
                            <div className="p-2 bg-red-100 rounded-lg mr-4">
                              <BugAntIcon className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{threat.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{threat.description}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(threat.severity)}`}>
                            <SeverityIcon className="w-3 h-3 mr-1" />
                            {threat.severity === 'critical' ? 'Kritik' :
                             threat.severity === 'high' ? 'Yüksek' :
                             threat.severity === 'medium' ? 'Orta' : 'Düşük'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500">Kaynak</p>
                            <p className="text-sm font-medium text-gray-900">{threat.source}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">İlk Görülme</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(threat.firstSeen).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Son Görülme</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(threat.lastSeen).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Etkilenen Sistemler</p>
                            <p className="text-sm font-medium text-gray-900">{threat.affectedSystems.length}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Göstergeler:</h4>
                            <div className="flex flex-wrap gap-1">
                              {threat.indicators.map((indicator, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                                  {indicator}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Azaltma Önlemleri:</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {threat.mitigation.map((action, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircleIcon className="w-3 h-3 text-green-500 mr-2" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Olay</p>
                      <p className="text-2xl font-semibold text-gray-900">{events.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <FireIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Kritik Olaylar</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {events.filter(e => e.severity === 'critical').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Çözülen Olaylar</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {events.filter(e => e.status === 'resolved').length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Güvenlik Skoru</p>
                      <p className="text-2xl font-semibold text-gray-900">87</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Olay Türleri</h3>
                  <div className="space-y-3">
                    {[
                      { type: 'Başarısız Giriş', count: 45, percentage: 35 },
                      { type: 'Şüpheli Aktivite', count: 30, percentage: 23 },
                      { type: 'Tehdit Tespiti', count: 25, percentage: 19 },
                      { type: 'Normal Giriş', count: 20, percentage: 15 },
                      { type: 'Sistem Değişikliği', count: 10, percentage: 8 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.type}</p>
                          <p className="text-xs text-gray-500">{item.count} olay</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">%{item.percentage}</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Uyumluluk Durumu</h3>
                  <div className="space-y-3">
                    {compliance.map((check) => (
                      <div key={check.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{check.standard}</p>
                          <p className="text-xs text-gray-500">{check.name}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getComplianceColor(check.status)}`}>
                            %{check.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Güvenlik Ayarları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Otomatik Tehdit Tespiti</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        AI destekli tehdit tespiti aktif
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gerçek Zamanlı İzleme</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        7/24 gerçek zamanlı izleme
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Otomatik Engelleme</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Şüpheli IP adreslerini otomatik engelle
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Bildirimleri</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-900">
                        Kritik olaylar için e-posta gönder
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}