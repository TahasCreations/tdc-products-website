"use client";

import { useState } from 'react';

export default function SecurityManagementPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [alertLevel, setAlertLevel] = useState('all');

	const securityStats = {
		totalThreats: 1247,
		blockedAttacks: 1198,
		activeAlerts: 12,
		resolvedIncidents: 235,
		vulnerabilities: 8,
		securityScore: 94,
		lastScan: '2024-01-15 14:30:00',
		nextScan: '2024-01-15 20:00:00'
	};

	const securityAlerts = [
		{
			id: 'SEC001',
			type: 'brute_force',
			severity: 'high',
			title: 'Brute Force Saldırısı Tespit Edildi',
			description: 'IP adresi 192.168.1.100\'den admin hesabına yönelik 50+ başarısız giriş denemesi',
			detectedAt: '2024-01-15 16:45:23',
			source: 'Login System',
			targetIP: '192.168.1.100',
			targetUser: 'admin@tdcmarket.com',
			status: 'active',
			actionTaken: 'IP temporarily blocked',
			riskLevel: 'high',
			affectedSystems: ['Authentication Service', 'Admin Panel']
		},
		{
			id: 'SEC002',
			type: 'sql_injection',
			severity: 'critical',
			title: 'SQL Injection Denemesi',
			description: 'Ürün arama formunda SQL injection payload tespit edildi',
			detectedAt: '2024-01-15 16:30:15',
			source: 'WAF (Web Application Firewall)',
			targetIP: '203.0.113.45',
			targetUser: 'anonymous',
			status: 'blocked',
			actionTaken: 'Request blocked, IP flagged',
			riskLevel: 'critical',
			affectedSystems: ['Product Search API', 'Database']
		},
		{
			id: 'SEC003',
			type: 'malware_upload',
			severity: 'medium',
			title: 'Şüpheli Dosya Yükleme Denemesi',
			description: 'Kullanıcı profil resmi olarak .exe uzantılı dosya yükleme denemesi',
			detectedAt: '2024-01-15 15:20:45',
			source: 'File Upload Scanner',
			targetIP: '198.51.100.23',
			targetUser: 'user123@example.com',
			status: 'blocked',
			actionTaken: 'File upload rejected, user warned',
			riskLevel: 'medium',
			affectedSystems: ['File Upload Service']
		},
		{
			id: 'SEC004',
			type: 'privilege_escalation',
			severity: 'high',
			title: 'Yetki Yükseltme Denemesi',
			description: 'Normal kullanıcı admin API endpoint\'lerine erişim denemesi',
			detectedAt: '2024-01-15 14:15:30',
			source: 'API Gateway',
			targetIP: '172.16.0.50',
			targetUser: 'normaluser@example.com',
			status: 'investigating',
			actionTaken: 'Access denied, incident logged',
			riskLevel: 'high',
			affectedSystems: ['API Gateway', 'Admin Panel']
		}
	];

	const vulnerabilities = [
		{
			id: 'VUL001',
			type: 'software',
			severity: 'high',
			title: 'Outdated Node.js Version',
			description: 'Node.js sürümü güvenlik açığı içeren eski bir versiyon',
			discoveredAt: '2024-01-10 09:30:00',
			cve: 'CVE-2023-44487',
			cvssScore: 7.5,
			affectedComponent: 'Node.js Runtime',
			status: 'open',
			assignedTo: 'devops@tdcmarket.com',
			dueDate: '2024-01-20',
			solution: 'Node.js sürümünü v18.19.0 veya üstüne güncelleyin'
		},
		{
			id: 'VUL002',
			type: 'configuration',
			severity: 'medium',
			title: 'Weak SSL/TLS Configuration',
			description: 'SSL/TLS yapılandırmasında zayıf şifreleme algoritmaları kullanılıyor',
			discoveredAt: '2024-01-12 14:20:00',
			cve: null,
			cvssScore: 5.3,
			affectedComponent: 'Load Balancer',
			status: 'in_progress',
			assignedTo: 'security@tdcmarket.com',
			dueDate: '2024-01-18',
			solution: 'TLS 1.3 kullanın ve zayıf cipher suite\'leri devre dışı bırakın'
		},
		{
			id: 'VUL003',
			type: 'dependency',
			severity: 'critical',
			title: 'Critical NPM Package Vulnerability',
			description: 'lodash paketi kritik güvenlik açığı içeriyor',
			discoveredAt: '2024-01-14 11:45:00',
			cve: 'CVE-2023-45857',
			cvssScore: 9.1,
			affectedComponent: 'Frontend Dependencies',
			status: 'resolved',
			assignedTo: 'frontend@tdcmarket.com',
			dueDate: '2024-01-15',
			solution: 'lodash paketini v4.17.21 sürümüne güncelleyin'
		}
	];

	const accessLogs = [
		{
			id: 'ACC001',
			timestamp: '2024-01-15 16:45:00',
			user: 'admin@tdcmarket.com',
			action: 'LOGIN_SUCCESS',
			resource: 'Admin Panel',
			ip: '192.168.1.50',
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
			location: 'Istanbul, Turkey',
			riskScore: 'low',
			sessionDuration: '45 minutes'
		},
		{
			id: 'ACC002',
			timestamp: '2024-01-15 16:30:00',
			user: 'moderator@tdcmarket.com',
			action: 'DATA_ACCESS',
			resource: 'User Database',
			ip: '192.168.1.51',
			userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
			location: 'Ankara, Turkey',
			riskScore: 'low',
			sessionDuration: '2 hours'
		},
		{
			id: 'ACC003',
			timestamp: '2024-01-15 16:15:00',
			user: 'unknown',
			action: 'LOGIN_FAILED',
			resource: 'Admin Panel',
			ip: '203.0.113.100',
			userAgent: 'curl/7.68.0',
			location: 'Unknown',
			riskScore: 'high',
			sessionDuration: null
		}
	];

	const firewallRules = [
		{
			id: 'FW001',
			name: 'Block Malicious IPs',
			type: 'blacklist',
			source: 'Threat Intelligence',
			target: 'All Services',
			action: 'DENY',
			priority: 'high',
			status: 'active',
			createdAt: '2024-01-10 10:00:00',
			lastUpdated: '2024-01-15 14:30:00',
			hitCount: 2456,
			description: 'Bilinen kötü amaçlı IP adreslerini engelle'
		},
		{
			id: 'FW002',
			name: 'Rate Limiting API',
			type: 'rate_limit',
			source: 'API Gateway',
			target: 'API Endpoints',
			action: 'THROTTLE',
			priority: 'medium',
			status: 'active',
			createdAt: '2024-01-05 15:30:00',
			lastUpdated: '2024-01-15 12:00:00',
			hitCount: 15678,
			description: 'API isteklerini dakikada 100 ile sınırla'
		},
		{
			id: 'FW003',
			name: 'Geographic Restriction',
			type: 'geo_block',
			source: 'GeoIP Database',
			target: 'Admin Panel',
			action: 'DENY',
			priority: 'high',
			status: 'active',
			createdAt: '2024-01-01 00:00:00',
			lastUpdated: '2024-01-15 10:00:00',
			hitCount: 892,
			description: 'Admin paneline sadece Türkiye\'den erişime izin ver'
		}
	];

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'critical': return 'bg-red-100 text-red-800';
			case 'high': return 'bg-orange-100 text-orange-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getSeverityText = (severity: string) => {
		switch (severity) {
			case 'critical': return 'Kritik';
			case 'high': return 'Yüksek';
			case 'medium': return 'Orta';
			case 'low': return 'Düşük';
			default: return severity;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-red-100 text-red-800';
			case 'blocked': return 'bg-green-100 text-green-800';
			case 'investigating': return 'bg-yellow-100 text-yellow-800';
			case 'resolved': return 'bg-blue-100 text-blue-800';
			case 'open': return 'bg-red-100 text-red-800';
			case 'in_progress': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'blocked': return 'Engellendi';
			case 'investigating': return 'İnceleniyor';
			case 'resolved': return 'Çözüldü';
			case 'open': return 'Açık';
			case 'in_progress': return 'İşlemde';
			default: return status;
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'brute_force': return '🔒';
			case 'sql_injection': return '💉';
			case 'malware_upload': return '🦠';
			case 'privilege_escalation': return '⬆️';
			case 'software': return '💻';
			case 'configuration': return '⚙️';
			case 'dependency': return '📦';
			case 'blacklist': return '🚫';
			case 'rate_limit': return '⏱️';
			case 'geo_block': return '🌍';
			default: return '🔐';
		}
	};

	const getRiskColor = (risk: string) => {
		switch (risk) {
			case 'high': return 'text-red-600';
			case 'medium': return 'text-yellow-600';
			case 'low': return 'text-green-600';
			default: return 'text-gray-600';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Güvenlik Yönetimi</h1>
					<p className="text-gray-600">Sistem güvenliği, tehdit analizi ve güvenlik politikaları</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={alertLevel} 
						onChange={(e) => setAlertLevel(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
					>
						<option value="all">Tüm Uyarılar</option>
						<option value="critical">Kritik</option>
						<option value="high">Yüksek</option>
						<option value="medium">Orta</option>
						<option value="low">Düşük</option>
					</select>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Acil Durum
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Güvenlik Taraması
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-8 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{securityStats.totalThreats.toLocaleString()}</div>
					<div className="text-sm text-blue-600">Toplam Tehdit</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{securityStats.blockedAttacks.toLocaleString()}</div>
					<div className="text-sm text-green-600">Engellenen Saldırı</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{securityStats.activeAlerts}</div>
					<div className="text-sm text-red-600">Aktif Uyarı</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{securityStats.vulnerabilities}</div>
					<div className="text-sm text-yellow-600">Güvenlik Açığı</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{securityStats.resolvedIncidents}</div>
					<div className="text-sm text-purple-600">Çözülen Olay</div>
				</div>
				<div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
					<div className="text-2xl font-bold text-emerald-700">{securityStats.securityScore}</div>
					<div className="text-sm text-emerald-600">Güvenlik Skoru</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{securityStats.lastScan.split(' ')[1]}</div>
					<div className="text-sm text-orange-600">Son Tarama</div>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-2xl font-bold text-gray-700">{securityStats.nextScan.split(' ')[1]}</div>
					<div className="text-sm text-gray-600">Sonraki Tarama</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '🛡️' },
							{ key: 'alerts', label: 'Güvenlik Uyarıları', icon: '🚨' },
							{ key: 'vulnerabilities', label: 'Güvenlik Açıkları', icon: '🔍' },
							{ key: 'access', label: 'Erişim Logları', icon: '👤' },
							{ key: 'firewall', label: 'Firewall Kuralları', icon: '🔥' }
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
									activeTab === tab.key
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								<span>{tab.icon}</span>
								<span>{tab.label}</span>
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'overview' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Güvenlik Durumu ve Trendler</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Tehdit Trendi (Son 7 Gün)</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Tehdit trendi grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Saldırı Türleri Dağılımı</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">🥧 Saldırı türleri grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-red-50 p-6 rounded-lg border border-red-200">
									<h4 className="font-semibold text-red-900 mb-3">Kritik Uyarılar</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">🚨</span>
										<div>
											<p className="text-red-800 font-medium">{securityStats.activeAlerts} Aktif</p>
											<p className="text-red-600 text-sm">Hemen müdahale gerekli</p>
										</div>
									</div>
								</div>

								<div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
									<h4 className="font-semibold text-yellow-900 mb-3">Güvenlik Açıkları</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">🔍</span>
										<div>
											<p className="text-yellow-800 font-medium">{securityStats.vulnerabilities} Açık</p>
											<p className="text-yellow-600 text-sm">Düzeltme gerekli</p>
										</div>
									</div>
								</div>

								<div className="bg-green-50 p-6 rounded-lg border border-green-200">
									<h4 className="font-semibold text-green-900 mb-3">Güvenlik Skoru</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">🛡️</span>
										<div>
											<p className="text-green-800 font-medium">{securityStats.securityScore}/100</p>
											<p className="text-green-600 text-sm">Mükemmel seviye</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'alerts' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Aktif Güvenlik Uyarıları</h3>
							
							<div className="space-y-4">
								{securityAlerts.map((alert) => (
									<div key={alert.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getTypeIcon(alert.type)}</span>
													<h4 className="font-semibold text-gray-900">{alert.title}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
														{getSeverityText(alert.severity)}
													</span>
													<span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
														{getStatusText(alert.status)}
													</span>
												</div>
												<p className="text-gray-700 mb-3">{alert.description}</p>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>Tespit Zamanı:</strong> {alert.detectedAt}</p>
													<p><strong>Kaynak:</strong> {alert.source}</p>
													<p><strong>Hedef IP:</strong> {alert.targetIP}</p>
													<p><strong>Hedef Kullanıcı:</strong> {alert.targetUser}</p>
													<p><strong>Alınan Aksiyon:</strong> {alert.actionTaken}</p>
												</div>
											</div>
										</div>

										<div className="mb-4">
											<h5 className="font-medium text-gray-900 mb-2">Etkilenen Sistemler</h5>
											<div className="flex flex-wrap gap-2">
												{alert.affectedSystems.map((system, index) => (
													<span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
														{system}
													</span>
												))}
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Logları Görüntüle
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Çözüldü Olarak İşaretle
											</button>
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Kural Oluştur
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm">
												Acil Müdahale
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'vulnerabilities' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Güvenlik Açıkları</h3>
							
							<div className="space-y-4">
								{vulnerabilities.map((vuln) => (
									<div key={vuln.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getTypeIcon(vuln.type)}</span>
													<h4 className="font-semibold text-gray-900">{vuln.title}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(vuln.severity)}`}>
														{getSeverityText(vuln.severity)}
													</span>
													<span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vuln.status)}`}>
														{getStatusText(vuln.status)}
													</span>
												</div>
												<p className="text-gray-700 mb-3">{vuln.description}</p>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>Keşif Tarihi:</strong> {vuln.discoveredAt}</p>
													<p><strong>Etkilenen Bileşen:</strong> {vuln.affectedComponent}</p>
													<p><strong>Atanan Kişi:</strong> {vuln.assignedTo}</p>
													<p><strong>Son Tarih:</strong> {vuln.dueDate}</p>
													{vuln.cve && <p><strong>CVE:</strong> {vuln.cve}</p>}
													<p><strong>CVSS Skoru:</strong> {vuln.cvssScore}/10</p>
												</div>
												<div className="bg-blue-50 p-3 rounded border border-blue-200">
													<p className="text-blue-800 text-sm">
														<strong>Çözüm:</strong> {vuln.solution}
													</p>
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												CVE Detayları
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Çözüm Kılavuzu
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Çözüldü Olarak İşaretle
											</button>
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Yeniden Ata
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'access' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Erişim Logları</h3>
							
							<div className="space-y-4">
								{accessLogs.map((log) => (
									<div key={log.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<h4 className="font-semibold text-gray-900">{log.action}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
														log.riskScore === 'high' ? 'bg-red-100 text-red-800' :
														log.riskScore === 'medium' ? 'bg-yellow-100 text-yellow-800' :
														'bg-green-100 text-green-800'
													}`}>
														Risk: {log.riskScore === 'high' ? 'Yüksek' : log.riskScore === 'medium' ? 'Orta' : 'Düşük'}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>Zaman:</strong> {log.timestamp}</p>
													<p><strong>Kullanıcı:</strong> {log.user}</p>
													<p><strong>Kaynak:</strong> {log.resource}</p>
													<p><strong>IP Adresi:</strong> {log.ip}</p>
													<p><strong>Konum:</strong> {log.location}</p>
													<p><strong>User Agent:</strong> {log.userAgent}</p>
													{log.sessionDuration && <p><strong>Oturum Süresi:</strong> {log.sessionDuration}</p>}
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Kullanıcı Geçmişi
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												IP Analizi
											</button>
											{log.riskScore === 'high' && (
												<button className="text-red-600 hover:text-red-900 text-sm">
													Engelle
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'firewall' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Firewall Kuralları</h3>
								<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
									Yeni Kural Ekle
								</button>
							</div>
							
							<div className="space-y-4">
								{firewallRules.map((rule) => (
									<div key={rule.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getTypeIcon(rule.type)}</span>
													<h4 className="font-semibold text-gray-900">{rule.name}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
														rule.priority === 'high' ? 'bg-red-100 text-red-800' :
														rule.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
														'bg-green-100 text-green-800'
													}`}>
														{rule.priority === 'high' ? 'Yüksek' : rule.priority === 'medium' ? 'Orta' : 'Düşük'}
													</span>
													<span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rule.status)}`}>
														{getStatusText(rule.status)}
													</span>
												</div>
												<p className="text-gray-700 mb-3">{rule.description}</p>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>Kaynak:</strong> {rule.source}</p>
													<p><strong>Hedef:</strong> {rule.target}</p>
													<p><strong>Aksiyon:</strong> {rule.action}</p>
													<p><strong>Oluşturma:</strong> {rule.createdAt}</p>
													<p><strong>Son Güncelleme:</strong> {rule.lastUpdated}</p>
													<p><strong>Hit Sayısı:</strong> {rule.hitCount.toLocaleString()}</p>
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Düzenle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Loglar
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Test Et
											</button>
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Devre Dışı
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm">
												Sil
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚨</span>
						<h3 className="text-lg font-semibold text-red-900">Acil Müdahale</h3>
					</div>
					<p className="text-red-700 mb-4">Kritik güvenlik olaylarına hemen müdahale et.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Acil Durum Merkezi
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-blue-900">Güvenlik Taraması</h3>
					</div>
					<p className="text-blue-700 mb-4">Kapsamlı güvenlik açığı taraması başlat.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Tarama Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-green-900">Güvenlik Raporu</h3>
					</div>
					<p className="text-green-700 mb-4">Detaylı güvenlik durumu raporu oluştur.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Rapor Oluştur
					</button>
				</div>
			</div>
		</div>
	);
}