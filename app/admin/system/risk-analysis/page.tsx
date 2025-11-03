"use client";

import { useState } from 'react';

export default function RiskAnalysisPage() {
	const [activeTab, setActiveTab] = useState('dashboard');
	const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

	const riskMetrics = {
		overall: 0,
		fraud: 0,
		security: 0,
		operational: 0,
		financial: 0
	};

	const alerts: any[] = [];

	const fraudPatterns: any[] = [];

	const riskTrends: any[] = [];

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'high': return 'bg-red-100 text-red-800 border-red-200';
			case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low': return 'bg-green-100 text-green-800 border-green-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'fraud': return '🚨';
			case 'security': return '🔒';
			case 'operational': return '⚙️';
			case 'financial': return '💰';
			default: return '⚠️';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-red-100 text-red-800';
			case 'investigating': return 'bg-blue-100 text-blue-800';
			case 'resolved': return 'bg-green-100 text-green-800';
			case 'dismissed': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getRiskLevel = (score: number) => {
		if (score >= 80) return { level: 'Kritik', color: 'text-red-600' };
		if (score >= 60) return { level: 'Yüksek', color: 'text-orange-600' };
		if (score >= 40) return { level: 'Orta', color: 'text-yellow-600' };
		return { level: 'Düşük', color: 'text-green-600' };
	};

	const overallRisk = getRiskLevel(riskMetrics.overall);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Risk Analizi & Güvenlik</h1>
					<p className="text-gray-600">Gerçek zamanlı risk izleme ve güvenlik analizi</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={selectedTimeframe}
						onChange={(e) => setSelectedTimeframe(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="1d">Son 24 Saat</option>
						<option value="7d">Son 7 Gün</option>
						<option value="30d">Son 30 Gün</option>
					</select>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Acil Durum
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Risk Overview */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="bg-white p-6 rounded-lg border border-l-4 border-l-purple-500">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Genel Risk Skoru</p>
							<p className={`text-3xl font-bold ${overallRisk.color}`}>{riskMetrics.overall}</p>
							<p className={`text-sm ${overallRisk.color}`}>{overallRisk.level} Risk</p>
						</div>
						<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
							<span className="text-2xl">🎯</span>
						</div>
					</div>
				</div>

				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">{riskMetrics.fraud}</div>
					<div className="text-sm text-gray-600">Dolandırıcılık</div>
					<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
						<div className="bg-red-600 h-2 rounded-full" style={{ width: `${riskMetrics.fraud}%` }}></div>
					</div>
				</div>

				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{riskMetrics.security}</div>
					<div className="text-sm text-gray-600">Güvenlik</div>
					<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
						<div className="bg-blue-600 h-2 rounded-full" style={{ width: `${riskMetrics.security}%` }}></div>
					</div>
				</div>

				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">{riskMetrics.operational}</div>
					<div className="text-sm text-gray-600">Operasyonel</div>
					<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
						<div className="bg-orange-600 h-2 rounded-full" style={{ width: `${riskMetrics.operational}%` }}></div>
					</div>
				</div>

				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">{riskMetrics.financial}</div>
					<div className="text-sm text-gray-600">Finansal</div>
					<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
						<div className="bg-green-600 h-2 rounded-full" style={{ width: `${riskMetrics.financial}%` }}></div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'dashboard', label: 'Risk Dashboard', icon: '📊' },
							{ key: 'alerts', label: 'Aktif Uyarılar', icon: '🚨' },
							{ key: 'patterns', label: 'Dolandırıcılık Desenleri', icon: '🕵️' },
							{ key: 'monitoring', label: 'Gerçek Zamanlı İzleme', icon: '👁️' }
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
					{activeTab === 'dashboard' && (
						<div className="space-y-6">
							<div className="grid lg:grid-cols-2 gap-6">
								{/* Risk Trend Chart */}
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-semibold text-gray-900">Risk Trend Analizi</h3>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Risk trend grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								{/* Risk Distribution */}
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-semibold text-gray-900">Risk Dağılımı</h3>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Dolandırıcılık Riski</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-2">
														<div className="bg-red-500 h-2 rounded-full" style={{ width: `${riskMetrics.fraud}%` }}></div>
													</div>
													<span className="text-sm font-medium">{riskMetrics.fraud}%</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Güvenlik Riski</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-2">
														<div className="bg-blue-500 h-2 rounded-full" style={{ width: `${riskMetrics.security}%` }}></div>
													</div>
													<span className="text-sm font-medium">{riskMetrics.security}%</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Operasyonel Risk</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-2">
														<div className="bg-orange-500 h-2 rounded-full" style={{ width: `${riskMetrics.operational}%` }}></div>
													</div>
													<span className="text-sm font-medium">{riskMetrics.operational}%</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Finansal Risk</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-2">
														<div className="bg-green-500 h-2 rounded-full" style={{ width: `${riskMetrics.financial}%` }}></div>
													</div>
													<span className="text-sm font-medium">{riskMetrics.financial}%</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Recent High Risk Events */}
							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h3 className="font-semibold text-gray-900">Son Yüksek Risk Olayları</h3>
								</div>
								<div className="p-4">
									{alerts.filter(alert => alert.severity === 'high').length === 0 ? (
										<div className="text-center py-12">
											<div className="text-6xl mb-4">🎯</div>
											<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Yüksek Risk Olayı Yok</h3>
											<p className="text-gray-600">Risk olayları tespit edildiğinde burada görünecek</p>
										</div>
									) : (
										<div className="space-y-3">
											{alerts.filter(alert => alert.severity === 'high').map((alert) => (
												<div key={alert.id} className="flex items-center space-x-4 p-4 bg-red-50 border border-red-200 rounded-lg">
													<span className="text-2xl">{getTypeIcon(alert.type)}</span>
													<div className="flex-1">
														<h4 className="font-medium text-gray-900">{alert.title}</h4>
														<p className="text-sm text-gray-600">{alert.description}</p>
														<p className="text-xs text-gray-500">{alert.timestamp}</p>
													</div>
													<div className="text-right">
														<div className="text-lg font-bold text-red-600">{alert.riskScore}%</div>
														<div className="text-xs text-gray-500">Risk Skoru</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{activeTab === 'alerts' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Aktif Risk Uyarıları</h3>
								<div className="flex space-x-2">
									<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
										Tümünü Onayla
									</button>
									<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
										Kritik Uyarılar
									</button>
								</div>
							</div>

							{alerts.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl mb-4">✅</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Uyarı Yok</h3>
									<p className="text-gray-600">Risk uyarıları oluştuğunda burada görünecek</p>
								</div>
							) : (
								<div className="space-y-4">
									{alerts.map((alert) => (
										<div key={alert.id} className={`border rounded-lg p-6 ${getSeverityColor(alert.severity)}`}>
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-start space-x-4">
												<span className="text-2xl">{getTypeIcon(alert.type)}</span>
												<div className="flex-1">
													<div className="flex items-center space-x-3 mb-2">
														<h4 className="font-semibold text-gray-900">{alert.title}</h4>
														<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
															{alert.status === 'active' ? 'Aktif' : 
															 alert.status === 'investigating' ? 'İnceleniyor' : 
															 alert.status === 'resolved' ? 'Çözüldü' : 'Reddedildi'}
														</span>
													</div>
													<p className="text-gray-700 mb-3">{alert.description}</p>
													<div className="text-sm text-gray-600">
														<span>Zaman: {alert.timestamp}</span>
													</div>
													{alert.affectedOrders && (
														<div className="text-sm text-gray-600 mt-1">
															<span>Etkilenen Siparişler: {alert.affectedOrders.join(', ')}</span>
														</div>
													)}
													{alert.affectedUsers && (
														<div className="text-sm text-gray-600 mt-1">
															<span>Etkilenen Kullanıcılar: {alert.affectedUsers.join(', ')}</span>
														</div>
													)}
												</div>
											</div>
											<div className="text-right">
												<div className="text-xl font-bold text-red-600">{alert.riskScore}%</div>
												<div className="text-xs text-gray-500">Risk Skoru</div>
											</div>
										</div>
										<div className="flex space-x-3">
											<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
												İncele
											</button>
											<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
												Çözüldü
											</button>
											<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
												Reddet
											</button>
										</div>
									</div>
									))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'patterns' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Dolandırıcılık Tespit Desenleri</h3>
								<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
									Yeni Desen Ekle
								</button>
							</div>

							{fraudPatterns.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl mb-4">🕵️</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Desen Yok</h3>
									<p className="text-gray-600">Dolandırıcılık desenleri oluşturduğunuzda burada görünecek</p>
								</div>
							) : (
								<div className="grid gap-6">
									{fraudPatterns.map((pattern) => (
										<div key={pattern.id} className="bg-white border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<h4 className="font-semibold text-gray-900 mb-2">{pattern.pattern}</h4>
												<p className="text-gray-600 mb-3">{pattern.description}</p>
												<div className="flex items-center space-x-6 text-sm">
													<div className="flex items-center space-x-2">
														<span className="text-gray-500">Tespit Sıklığı:</span>
														<span className="font-medium text-blue-600">{pattern.frequency}/gün</span>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-gray-500">Doğruluk Oranı:</span>
														<span className="font-medium text-green-600">%{pattern.accuracy}</span>
													</div>
													<div className="flex items-center space-x-2">
														<span className="text-gray-500">Durum:</span>
														<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pattern.status)}`}>
															{pattern.status === 'active' ? 'Aktif' : 'Pasif'}
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className="flex space-x-3">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Düzenle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
												Test Et
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm font-medium">
												Logları Gör
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm font-medium">
												Devre Dışı
											</button>
										</div>
									</div>
									))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'monitoring' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Gerçek Zamanlı Risk İzleme</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Canlı Trafik Analizi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📡 Canlı trafik monitörü burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Şüpheli Aktiviteler</h4>
									</div>
									<div className="p-4">
										<div className="space-y-3">
											<div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
												<div className="flex items-center space-x-2">
													<span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
													<span className="text-sm">IP: 192.168.1.100</span>
												</div>
												<span className="text-sm text-yellow-700">5 başarısız giriş</span>
											</div>
											<div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
												<div className="flex items-center space-x-2">
													<span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
													<span className="text-sm">Kullanıcı: user@test.com</span>
												</div>
												<span className="text-sm text-red-700">Çoklu kart denemesi</span>
											</div>
											<div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
												<div className="flex items-center space-x-2">
													<span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
													<span className="text-sm">Sipariş: ORD-001250</span>
												</div>
												<span className="text-sm text-blue-700">Anormal tutar</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Güvenlik Metrikleri</h4>
								</div>
								<div className="p-4">
									<div className="grid md:grid-cols-4 gap-6">
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">0%</div>
											<div className="text-sm text-gray-600">Sistem Uptime</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-blue-600">0</div>
											<div className="text-sm text-gray-600">Aktif Session</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-orange-600">0</div>
											<div className="text-sm text-gray-600">Bloklu IP</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-red-600">0</div>
											<div className="text-sm text-gray-600">Şüpheli İşlem</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚨</span>
						<h3 className="text-lg font-semibold text-red-900">Acil Durum</h3>
					</div>
					<p className="text-red-700 mb-4">Sistemi acil durum moduna geçir.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Acil Durum Modu
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-blue-900">Derinlemesine Analiz</h3>
					</div>
					<p className="text-blue-700 mb-4">Kapsamlı risk analizi başlat.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🛡️</span>
						<h3 className="text-lg font-semibold text-green-900">Güvenlik Duvarı</h3>
					</div>
					<p className="text-green-700 mb-4">Güvenlik kurallarını güncelle.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Kuralları Yönet
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Risk Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı risk raporunu indir.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor İndir
					</button>
				</div>
			</div>
		</div>
	);
}
