"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function SecurityMonitoringPage() {
	const [activeTab, setActiveTab] = useState('overview');

	const securityMetrics = {
		totalThreats: 0,
		blockedAttacks: 0,
		failedLogins: 0,
		suspiciousActivities: 0,
		systemUptime: 0,
		securityScore: 0
	};

	const threats: any[] = [];

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'critical': return 'bg-red-100 text-red-800';
			case 'high': return 'bg-orange-100 text-orange-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'blocked': return 'bg-red-100 text-red-800';
			case 'monitoring': return 'bg-yellow-100 text-yellow-800';
			case 'resolved': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Güvenlik İzleme</h1>
					<p className="text-gray-600">Sistem güvenliği ve tehdit analizi</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Güvenlik Taraması
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor Oluştur
					</button>
				</div>
			</div>

			{/* Security Metrics */}
			<div className="grid md:grid-cols-6 gap-4">
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{securityMetrics.totalThreats}</div>
					<div className="text-sm text-red-600">Toplam Tehdit</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{securityMetrics.blockedAttacks}</div>
					<div className="text-sm text-orange-600">Engellenen Saldırı</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{securityMetrics.failedLogins}</div>
					<div className="text-sm text-yellow-600">Başarısız Giriş</div>
				</div>
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{securityMetrics.suspiciousActivities}</div>
					<div className="text-sm text-blue-600">Şüpheli Aktivite</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{securityMetrics.systemUptime}%</div>
					<div className="text-sm text-green-600">Sistem Uptime</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{securityMetrics.securityScore}</div>
					<div className="text-sm text-purple-600">Güvenlik Skoru</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '🛡️' },
							{ key: 'threats', label: 'Tehdit Analizi', icon: '⚠️' },
							{ key: 'firewall', label: 'Firewall', icon: '🔥' },
							{ key: 'access', label: 'Erişim Kontrolü', icon: '🔐' },
							{ key: 'compliance', label: 'Uyumluluk', icon: '📋' }
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
							<h3 className="text-lg font-semibold text-gray-900">Güvenlik Durumu</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Tehdit Haritası</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🗺️ Gerçek zamanlı tehdit haritası burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Güvenlik Trendleri</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Güvenlik trend analizi burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-green-50 border border-green-200 rounded-lg p-6">
									<h4 className="font-semibold text-green-900 mb-4">🛡️ Güçlü Alanlar</h4>
									<div className="space-y-2 text-sm text-green-800">
										<div>• SSL/TLS şifrelemesi aktif</div>
										<div>• Two-factor authentication</div>
										<div>• Düzenli güvenlik güncellemeleri</div>
										<div>• Gelişmiş firewall koruması</div>
									</div>
								</div>

								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
									<h4 className="font-semibold text-yellow-900 mb-4">⚠️ İyileştirme Alanları</h4>
									<div className="space-y-2 text-sm text-yellow-800">
										<div>• Parola politikası güçlendirmesi</div>
										<div>• Session timeout ayarları</div>
										<div>• API rate limiting</div>
										<div>• Backup encryption</div>
									</div>
								</div>

								<div className="bg-red-50 border border-red-200 rounded-lg p-6">
									<h4 className="font-semibold text-red-900 mb-4">🚨 Kritik Alanlar</h4>
									<div className="space-y-2 text-sm text-red-800">
										<div>• Eski TLS versiyonları</div>
										<div>• Privilege escalation riski</div>
										<div>• Log analysis eksiklikleri</div>
										<div>• DDoS protection</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'threats' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Aktif Tehditler</h3>

							{threats.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl mb-4">🛡️</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Tehdit Yok</h3>
									<p className="text-gray-600">Güvenlik tehditleri tespit edildiğinde burada görünecek</p>
								</div>
							) : (
								<div className="space-y-4">
									{threats.map((threat) => (
									<div key={threat.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{threat.type}</h4>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(threat.severity)}`}>
														{threat.severity === 'critical' ? 'Kritik' : 
														 threat.severity === 'high' ? 'Yüksek' : 
														 threat.severity === 'medium' ? 'Orta' : 'Düşük'}
													</span>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(threat.status)}`}>
														{threat.status === 'blocked' ? 'Engellendi' : 
														 threat.status === 'monitoring' ? 'İzleniyor' : 'Çözüldü'}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-2">
													<strong>Kaynak:</strong> {threat.source} | 
													<strong> Hedef:</strong> {threat.target} | 
													<strong> Deneme:</strong> {threat.attempts}x
												</div>
												<div className="text-sm text-gray-500">
													{threat.timestamp}
												</div>
											</div>
										</div>
									</div>
									))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'firewall' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Firewall Yönetimi</h3>
							<div className="text-center text-gray-500">
								<p>Firewall konfigürasyon arayüzü geliştiriliyor...</p>
							</div>
						</div>
					)}

					{activeTab === 'access' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Erişim Kontrolü</h3>
							<div className="text-center text-gray-500">
								<p>Erişim kontrol paneli geliştiriliyor...</p>
							</div>
						</div>
					)}

					{activeTab === 'compliance' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Uyumluluk Kontrolleri</h3>
							<div className="text-center text-gray-500">
								<p>Uyumluluk raporlama sistemi geliştiriliyor...</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
