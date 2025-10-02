"use client";

import { useState } from 'react';

export default function RiskPage() {
	const [activeTab, setActiveTab] = useState('overview');

	const riskAlerts = [
		{
			id: 'RISK001',
			type: 'fraud',
			severity: 'high',
			title: 'Şüpheli İşlem Tespit Edildi',
			description: 'Kullanıcı #12345 kısa sürede çok sayıda yüksek tutarlı sipariş verdi.',
			timestamp: '2024-01-15 14:30',
			status: 'active'
		},
		{
			id: 'RISK002',
			type: 'payment',
			severity: 'medium',
			title: 'Ödeme Başarısızlık Oranı Yüksek',
			description: 'Son 24 saatte ödeme başarısızlık oranı %15 arttı.',
			timestamp: '2024-01-15 12:15',
			status: 'investigating'
		},
		{
			id: 'RISK003',
			type: 'account',
			severity: 'low',
			title: 'Çoklu Hesap Şüphesi',
			description: 'Aynı IP adresinden 5 farklı hesap oluşturuldu.',
			timestamp: '2024-01-15 10:45',
			status: 'resolved'
		}
	];

	const riskMetrics = {
		fraudScore: 2.3,
		riskTransactions: 12,
		blockedUsers: 8,
		falsePositives: 3
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'high': return 'bg-red-100 text-red-800 border-red-200';
			case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-red-100 text-red-800';
			case 'investigating': return 'bg-yellow-100 text-yellow-800';
			case 'resolved': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'investigating': return 'İnceleniyor';
			case 'resolved': return 'Çözüldü';
			default: return status;
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Risk Analizi & Fraud Tespiti</h1>
					<p className="text-gray-600">Gerçek zamanlı risk izleme ve dolandırıcılık tespiti</p>
				</div>
				<div className="flex items-center space-x-2">
					<span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
					<span className="text-sm text-green-600 font-medium">Risk Motoru Aktif</span>
				</div>
			</div>

			{/* Risk Metrics */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{riskMetrics.fraudScore}%</div>
					<div className="text-sm text-red-600">Fraud Skoru</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{riskMetrics.riskTransactions}</div>
					<div className="text-sm text-yellow-600">Riskli İşlem</div>
				</div>
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{riskMetrics.blockedUsers}</div>
					<div className="text-sm text-blue-600">Engellenen Kullanıcı</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{riskMetrics.falsePositives}</div>
					<div className="text-sm text-green-600">Yanlış Pozitif</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'alerts', label: 'Risk Uyarıları', icon: '🚨' },
							{ key: 'rules', label: 'Risk Kuralları', icon: '⚙️' },
							{ key: 'reports', label: 'Raporlar', icon: '📋' }
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
							<h3 className="text-lg font-semibold text-gray-900">Risk Durumu Özeti</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Risk Trend Grafiği</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Risk trend grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Fraud Türleri Dağılımı</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">🥧 Fraud türleri grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-4">
								<h4 className="font-semibold text-gray-900 mb-3">Son Risk Uyarıları</h4>
								<div className="space-y-3">
									{riskAlerts.slice(0, 3).map((alert) => (
										<div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<h5 className="font-semibold text-gray-900">{alert.title}</h5>
													<p className="text-gray-700 text-sm mt-1">{alert.description}</p>
													<p className="text-gray-500 text-xs mt-2">{alert.timestamp}</p>
												</div>
												<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
													{getStatusText(alert.status)}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					)}

					{activeTab === 'alerts' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Tüm Risk Uyarıları</h3>
								<div className="flex space-x-2">
									<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
										<option value="">Tüm Seviyeler</option>
										<option value="high">Yüksek</option>
										<option value="medium">Orta</option>
										<option value="low">Düşük</option>
									</select>
									<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
										<option value="">Tüm Durumlar</option>
										<option value="active">Aktif</option>
										<option value="investigating">İnceleniyor</option>
										<option value="resolved">Çözüldü</option>
									</select>
								</div>
							</div>

							<div className="space-y-4">
								{riskAlerts.map((alert) => (
									<div key={alert.id} className={`border rounded-lg p-6 ${getSeverityColor(alert.severity)}`}>
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-lg mr-2">
														{alert.type === 'fraud' ? '🚨' : alert.type === 'payment' ? '💳' : '👤'}
													</span>
													<h4 className="font-semibold text-gray-900">{alert.title}</h4>
													<span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
														alert.severity === 'high' ? 'bg-red-200 text-red-800' :
														alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
														'bg-blue-200 text-blue-800'
													}`}>
														{alert.severity === 'high' ? 'Yüksek' : alert.severity === 'medium' ? 'Orta' : 'Düşük'}
													</span>
												</div>
												<p className="text-gray-700 mb-3">{alert.description}</p>
												<p className="text-gray-500 text-sm">ID: {alert.id} • {alert.timestamp}</p>
											</div>
											<div className="flex flex-col items-end space-y-2">
												<span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(alert.status)}`}>
													{getStatusText(alert.status)}
												</span>
												<div className="flex space-x-2">
													<button className="text-indigo-600 hover:text-indigo-900 text-sm">
														İncele
													</button>
													<button className="text-green-600 hover:text-green-900 text-sm">
														Çöz
													</button>
													<button className="text-red-600 hover:text-red-900 text-sm">
														Engelle
													</button>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'rules' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Risk Kuralları Yönetimi</h3>
							<div className="text-center text-gray-500">
								<p>Risk kuralları ve eşik değerleri ayarları burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'reports' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Risk Raporları</h3>
							<div className="text-center text-gray-500">
								<p>Detaylı risk analiz raporları burada görünecek...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🛡️</span>
						<h3 className="text-lg font-semibold text-red-900">Acil Müdahale</h3>
					</div>
					<p className="text-red-700 mb-4">Yüksek riskli işlemleri hemen durdur.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Acil Durdur
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-blue-900">Detaylı Analiz</h3>
					</div>
					<p className="text-blue-700 mb-4">Kapsamlı risk analizi başlat.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-green-900">Kural Optimizasyonu</h3>
					</div>
					<p className="text-green-700 mb-4">AI ile risk kurallarını optimize et.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Optimize Et
					</button>
				</div>
			</div>
		</div>
	);
}
