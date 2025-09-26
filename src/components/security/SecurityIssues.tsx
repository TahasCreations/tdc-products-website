'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface SecurityIssue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'vulnerability' | 'threat' | 'compliance' | 'configuration';
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  affectedSystems: string[];
  cveId?: string;
  cvssScore?: number;
  discoveredAt: string;
  lastUpdated: string;
  assignedTo?: string;
  remediation?: string;
  impact: string;
  likelihood: 'very_high' | 'high' | 'medium' | 'low' | 'very_low';
}

interface SecurityIssuesStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
}

export default function SecurityIssues() {
  const [issues, setIssues] = useState<SecurityIssue[]>([]);
  const [stats, setStats] = useState<SecurityIssuesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<SecurityIssue | null>(null);

  const fetchSecurityIssues = useCallback(async () => {
    try {
      setLoading(true);
      
      // Paralel olarak tehditler ve güvenlik açıklarını çek
      const [threatsRes, vulnerabilitiesRes] = await Promise.all([
        fetch(`/api/security/threats?severity=${selectedSeverity}&status=${selectedStatus}`),
        fetch(`/api/security/vulnerabilities?severity=${selectedSeverity}&status=${selectedStatus}`)
      ]);

      let allIssues: SecurityIssue[] = [];

      // Tehditleri işle
      if (threatsRes.ok) {
        const threatsData = await threatsRes.json();
        if (threatsData.success) {
          const threatIssues = threatsData.data.map((threat: any) => ({
            id: `threat-${threat.id}`,
            title: threat.title,
            description: threat.description,
            severity: threat.severity,
            category: 'threat' as const,
            status: threat.status === 'blocked' ? 'resolved' : 'open',
            priority: threat.severity === 'critical' ? 'urgent' : 
                     threat.severity === 'high' ? 'high' : 
                     threat.severity === 'medium' ? 'medium' : 'low',
            affectedSystems: ['Web Application', 'Database'],
            discoveredAt: threat.createdAt,
            lastUpdated: threat.resolvedAt || threat.createdAt,
            assignedTo: threat.resolvedBy,
            impact: `Attack from ${threat.sourceIp} using ${threat.attackType}`,
            likelihood: threat.severity === 'critical' ? 'very_high' : 
                       threat.severity === 'high' ? 'high' : 'medium'
          }));
          allIssues = [...allIssues, ...threatIssues];
        }
      }

      // Güvenlik açıklarını işle
      if (vulnerabilitiesRes.ok) {
        const vulnData = await vulnerabilitiesRes.json();
        if (vulnData.success) {
          const vulnIssues = vulnData.data.map((vuln: any) => ({
            id: `vuln-${vuln.id}`,
            title: vuln.title,
            description: vuln.description,
            severity: vuln.severity,
            category: 'vulnerability' as const,
            status: vuln.status === 'resolved' ? 'resolved' : 
                   vuln.status === 'in_progress' ? 'in_progress' : 'open',
            priority: vuln.severity === 'critical' ? 'urgent' : 
                     vuln.severity === 'high' ? 'high' : 
                     vuln.severity === 'medium' ? 'medium' : 'low',
            affectedSystems: vuln.affectedSystems || ['Web Application'],
            cveId: vuln.cveId,
            cvssScore: vuln.cvssScore,
            discoveredAt: vuln.createdAt,
            lastUpdated: vuln.patchedAt || vuln.createdAt,
            remediation: vuln.remediation,
            impact: `CVSS Score: ${vuln.cvssScore || 'N/A'}`,
            likelihood: vuln.cvssScore > 7 ? 'very_high' : 
                       vuln.cvssScore > 5 ? 'high' : 'medium'
          }));
          allIssues = [...allIssues, ...vulnIssues];
        }
      }

      // Filtrele
      let filteredIssues = allIssues;
      
      if (selectedSeverity !== 'all') {
        filteredIssues = filteredIssues.filter(issue => issue.severity === selectedSeverity);
      }
      
      if (selectedCategory !== 'all') {
        filteredIssues = filteredIssues.filter(issue => issue.category === selectedCategory);
      }
      
      if (selectedStatus !== 'all') {
        filteredIssues = filteredIssues.filter(issue => issue.status === selectedStatus);
      }
      
      if (searchTerm) {
        filteredIssues = filteredIssues.filter(issue => 
          issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.cveId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setIssues(filteredIssues);

      // İstatistikleri hesapla
      const newStats: SecurityIssuesStats = {
        total: allIssues.length,
        critical: allIssues.filter(i => i.severity === 'critical').length,
        high: allIssues.filter(i => i.severity === 'high').length,
        medium: allIssues.filter(i => i.severity === 'medium').length,
        low: allIssues.filter(i => i.severity === 'low').length,
        open: allIssues.filter(i => i.status === 'open').length,
        inProgress: allIssues.filter(i => i.status === 'in_progress').length,
        resolved: allIssues.filter(i => i.status === 'resolved').length,
        urgent: allIssues.filter(i => i.priority === 'urgent').length
      };
      
      setStats(newStats);

    } catch (error) {
      console.error('Security issues fetch error:', error);
      
      // Fallback: Mock data
      const mockIssues: SecurityIssue[] = [
        {
          id: '1',
          title: 'Critical SQL Injection Vulnerability',
          description: 'Application is vulnerable to SQL injection attacks through user input fields. This could lead to data breach and unauthorized access.',
          severity: 'critical',
          category: 'vulnerability',
          status: 'open',
          priority: 'urgent',
          affectedSystems: ['Web Application', 'Database'],
          cveId: 'CVE-2024-0001',
          cvssScore: 9.8,
          discoveredAt: '2024-01-20T10:00:00Z',
          lastUpdated: '2024-01-20T10:00:00Z',
          remediation: 'Implement parameterized queries and input validation',
          impact: 'Complete system compromise possible',
          likelihood: 'very_high'
        },
        {
          id: '2',
          title: 'Active Brute Force Attack',
          description: 'Multiple failed login attempts detected from suspicious IP address. Attack is currently ongoing.',
          severity: 'high',
          category: 'threat',
          status: 'open',
          priority: 'high',
          affectedSystems: ['Authentication System'],
          discoveredAt: '2024-01-20T09:15:00Z',
          lastUpdated: '2024-01-20T09:15:00Z',
          impact: 'Potential account compromise',
          likelihood: 'high'
        },
        {
          id: '3',
          title: 'Missing Security Headers',
          description: 'Important security headers (HSTS, CSP, X-Frame-Options) are not implemented.',
          severity: 'medium',
          category: 'configuration',
          status: 'open',
          priority: 'medium',
          affectedSystems: ['Web Server'],
          discoveredAt: '2024-01-19T14:30:00Z',
          lastUpdated: '2024-01-19T14:30:00Z',
          remediation: 'Add security headers to web server configuration',
          impact: 'Increased risk of XSS and clickjacking attacks',
          likelihood: 'medium'
        }
      ];
      
      setIssues(mockIssues);
      
      setStats({
        total: 3,
        critical: 1,
        high: 1,
        medium: 1,
        low: 0,
        open: 3,
        inProgress: 0,
        resolved: 0,
        urgent: 1
      });
    } finally {
      setLoading(false);
    }
  }, [selectedSeverity, selectedCategory, selectedStatus, searchTerm]);

  useEffect(() => {
    fetchSecurityIssues();
  }, [fetchSecurityIssues]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_positive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircleIcon className="w-5 h-5" />;
      case 'high': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'medium': return <ShieldExclamationIcon className="w-5 h-5" />;
      case 'low': return <EyeIcon className="w-5 h-5" />;
      default: return <EyeIcon className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Güvenlik Sorunları
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kritik hatalar ve güvenlik açıklarını yönetin
          </p>
        </div>
        <button
          onClick={fetchSecurityIssues}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>Yenile</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Sorun</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kritik</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Açık</p>
                <p className="text-2xl font-bold text-orange-600">{stats.open}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Acil</p>
                <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Severity
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">Tümü</option>
              <option value="critical">Kritik</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">Tümü</option>
              <option value="vulnerability">Güvenlik Açığı</option>
              <option value="threat">Tehdit</option>
              <option value="compliance">Uyumluluk</option>
              <option value="configuration">Konfigürasyon</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Durum
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="all">Tümü</option>
              <option value="open">Açık</option>
              <option value="in_progress">İşlemde</option>
              <option value="resolved">Çözüldü</option>
              <option value="false_positive">Yanlış Pozitif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ara
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="CVE ID, başlık veya açıklama..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {issues.length === 0 ? (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Güvenlik sorunu bulunamadı
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Seçilen filtreler için herhangi bir güvenlik sorunu bulunmuyor.
            </p>
          </div>
        ) : (
          issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedIssue(issue)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                        {getSeverityIcon(issue.severity)}
                        <span className="capitalize">{issue.severity}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority === 'urgent' ? 'Acil' : 
                         issue.priority === 'high' ? 'Yüksek' : 
                         issue.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status === 'open' ? 'Açık' : 
                         issue.status === 'in_progress' ? 'İşlemde' : 
                         issue.status === 'resolved' ? 'Çözüldü' : 'Yanlış Pozitif'}
                      </div>
                      {issue.cveId && (
                        <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                          {issue.cveId}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {issue.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {issue.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{new Date(issue.discoveredAt).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Etkilenen Sistemler: {issue.affectedSystems.join(', ')}</span>
                      </div>
                      {issue.cvssScore && (
                        <div className="flex items-center space-x-1">
                          <span>CVSS: {issue.cvssScore}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedIssue.title}
                </h3>
                <button
                  onClick={() => setSelectedIssue(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Temel Bilgiler
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Severity:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedIssue.severity)}`}>
                          {selectedIssue.severity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Kategori:</span>
                        <span className="text-gray-900 dark:text-gray-100 capitalize">{selectedIssue.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Durum:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedIssue.status)}`}>
                          {selectedIssue.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Öncelik:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedIssue.priority)}`}>
                          {selectedIssue.priority}
                        </span>
                      </div>
                      {selectedIssue.cveId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">CVE ID:</span>
                          <span className="text-gray-900 dark:text-gray-100">{selectedIssue.cveId}</span>
                        </div>
                      )}
                      {selectedIssue.cvssScore && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">CVSS Score:</span>
                          <span className="text-gray-900 dark:text-gray-100">{selectedIssue.cvssScore}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Etkilenen Sistemler
                    </h4>
                    <div className="space-y-2">
                      {selectedIssue.affectedSystems.map((system, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-900 dark:text-gray-100">{system}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Açıklama
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedIssue.description}
                  </p>
                </div>
                
                {selectedIssue.remediation && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Çözüm Önerisi
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedIssue.remediation}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Etki Analizi
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Etki:</span>
                      <p className="text-gray-900 dark:text-gray-100">{selectedIssue.impact}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Olasılık:</span>
                      <p className="text-gray-900 dark:text-gray-100 capitalize">{selectedIssue.likelihood}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedIssue(null)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Kapat
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Düzenle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
