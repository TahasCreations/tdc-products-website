"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function MarketingAnalyticsPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedPeriod, setSelectedPeriod] = useState('30d');

	const marketingMetrics = {
		totalSpend: 0,
		totalRevenue: 0,
		roas: 0,
		cac: 0,
		ltv: 0,
		conversionRate: 0,
		impressions: 0,
		clicks: 0,
		ctr: 0,
		cpc: 0
	};

	const channels: any[] = [];

	const campaigns: any[] = [];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'paused': return 'bg-yellow-100 text-yellow-800';
			case 'completed': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'paused': return 'Duraklatıldı';
			case 'completed': return 'Tamamlandı';
			default: return status;
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Pazarlama Metrikleri</h1>
					<p className="text-gray-600">Kapsamlı pazarlama performans analizi ve ROI takibi</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="7d">Son 7 Gün</option>
						<option value="30d">Son 30 Gün</option>
						<option value="90d">Son 90 Gün</option>
						<option value="1y">Son 1 Yıl</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid md:grid-cols-5 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{formatCurrency(marketingMetrics.totalSpend)}</div>
					<div className="text-sm text-blue-600">Toplam Harcama</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{formatCurrency(marketingMetrics.totalRevenue)}</div>
					<div className="text-sm text-green-600">Toplam Gelir</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{marketingMetrics.roas.toFixed(2)}x</div>
					<div className="text-sm text-purple-600">ROAS</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{formatCurrency(marketingMetrics.cac)}</div>
					<div className="text-sm text-orange-600">CAC</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{formatCurrency(marketingMetrics.ltv)}</div>
					<div className="text-sm text-red-600">LTV</div>
				</div>
			</div>

			{/* Secondary Metrics */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-xl font-bold text-gray-700">{marketingMetrics.impressions.toLocaleString()}</div>
					<div className="text-sm text-gray-600">Gösterim</div>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-xl font-bold text-gray-700">{marketingMetrics.clicks.toLocaleString()}</div>
					<div className="text-sm text-gray-600">Tıklama</div>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-xl font-bold text-gray-700">{marketingMetrics.ctr}%</div>
					<div className="text-sm text-gray-600">CTR</div>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-xl font-bold text-gray-700">{formatCurrency(marketingMetrics.cpc)}</div>
					<div className="text-sm text-gray-600">CPC</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'channels', label: 'Kanallar', icon: '📢' },
							{ key: 'campaigns', label: 'Kampanyalar', icon: '🎯' },
							{ key: 'attribution', label: 'Attribution', icon: '🔗' },
							{ key: 'cohort', label: 'Cohort Analizi', icon: '👥' }
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
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Gelir Trendi</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Gelir trend grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">ROAS Performansı</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 ROAS performans grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-4">
								<h4 className="font-semibold text-gray-900 mb-3">Kanal Performansı</h4>
								<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
									<p className="text-gray-500">🥧 Kanal dağılım grafiği burada görünecek</p>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'channels' && (
						<div className="space-y-6">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Kanal
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Harcama
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Gelir
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												ROAS
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Dönüşümler
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												CPC
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Durum
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												İşlemler
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{channels.map((channel, index) => (
											<tr key={index} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{channel.name}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{formatCurrency(channel.spend)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
													{formatCurrency(channel.revenue)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
													{channel.roas.toFixed(2)}x
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{channel.conversions}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{formatCurrency(channel.cpc)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(channel.status)}`}>
														{getStatusText(channel.status)}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button className="text-indigo-600 hover:text-indigo-900 mr-3">
														Detaylar
													</button>
													<button className="text-blue-600 hover:text-blue-900">
														Optimize Et
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'campaigns' && (
						<div className="space-y-6">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Kampanya
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Kanal
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Harcama
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Gelir
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												ROAS
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Gösterim
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Tıklama
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Dönüşüm
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Durum
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												İşlemler
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{campaigns.map((campaign) => (
											<tr key={campaign.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="text-sm font-medium text-gray-900">{campaign.name}</div>
														<div className="text-sm text-gray-500">{campaign.id}</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{campaign.channel}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{formatCurrency(campaign.spend)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
													{formatCurrency(campaign.revenue)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
													{campaign.roas.toFixed(2)}x
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{campaign.impressions.toLocaleString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{campaign.clicks.toLocaleString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{campaign.conversions}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
														{getStatusText(campaign.status)}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button className="text-indigo-600 hover:text-indigo-900 mr-3">
														Düzenle
													</button>
													<button className="text-blue-600 hover:text-blue-900">
														Rapor
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'attribution' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Attribution Modelleme</h3>
							<div className="text-center text-gray-500">
								<p>Multi-touch attribution analizi burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'cohort' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Cohort Analizi</h3>
							<div className="text-center text-gray-500">
								<p>Müşteri cohort analizi ve retention metrikleri burada görünecek...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-blue-900">Kampanya Optimizasyonu</h3>
					</div>
					<p className="text-blue-700 mb-4">AI ile kampanya performansını optimize et.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Optimize Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-green-900">Custom Dashboard</h3>
					</div>
					<p className="text-green-700 mb-4">Özel pazarlama dashboard oluştur.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Dashboard Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-purple-900">Otomatik Raporlama</h3>
					</div>
					<p className="text-purple-700 mb-4">Periyodik pazarlama raporları kur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Otomasyon Kur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-orange-900">Detaylı Analiz</h3>
					</div>
					<p className="text-orange-700 mb-4">Kapsamlı pazarlama analizi başlat.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Analiz Başlat
					</button>
				</div>
			</div>
		</div>
	);
}
