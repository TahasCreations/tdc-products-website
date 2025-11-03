"use client";

import { useState } from 'react';

export default function MarketingMetricsPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedPeriod, setSelectedPeriod] = useState('30d');

	const metrics = {
		reach: 0,
		impressions: 0,
		clicks: 0,
		ctr: 0,
		cpc: 0,
		conversions: 0,
		conversionRate: 0,
		roas: 0,
		revenue: 0
	};

	const [channels, setChannels] = useState<any[]>([]);
	const [campaigns, setCampaigns] = useState<any[]>([]);

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
			case 'draft': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPerformanceColor = (value: number, benchmark: number) => {
		if (value >= benchmark * 1.2) return 'text-green-600';
		if (value >= benchmark * 0.8) return 'text-yellow-600';
		return 'text-red-600';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Marketing Metrikleri</h1>
					<p className="text-gray-600">Kapsamlı pazarlama performans analizi</p>
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

			{/* Key Metrics Overview */}
			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{metrics.reach.toLocaleString()}</div>
					<div className="text-sm text-gray-600">Erişim</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">{metrics.impressions.toLocaleString()}</div>
					<div className="text-sm text-gray-600">Gösterim</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-indigo-600">{metrics.clicks.toLocaleString()}</div>
					<div className="text-sm text-gray-600">Tıklama</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">%{metrics.ctr}</div>
					<div className="text-sm text-gray-600">CTR</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">{formatCurrency(metrics.cpc)}</div>
					<div className="text-sm text-gray-600">CPC</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">{metrics.roas}x</div>
					<div className="text-sm text-gray-600">ROAS</div>
				</div>
			</div>

			{/* Tabs */}
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
							{/* Performance Charts */}
							<div className="grid lg:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-semibold text-gray-900">Marketing Funnel</h3>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Gösterimler</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-3">
														<div className="bg-blue-600 h-3 rounded-full" style={{ width: '100%' }}></div>
													</div>
													<span className="text-sm font-medium">{metrics.impressions.toLocaleString()}</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Tıklamalar</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-3">
														<div className="bg-indigo-600 h-3 rounded-full" style={{ width: '17%' }}></div>
													</div>
													<span className="text-sm font-medium">{metrics.clicks.toLocaleString()}</span>
												</div>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Dönüşümler</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-3">
														<div className="bg-green-600 h-3 rounded-full" style={{ width: '6%' }}></div>
													</div>
													<span className="text-sm font-medium">{metrics.conversions.toLocaleString()}</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-semibold text-gray-900">Kanal Performansı</h3>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Kanal performans grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							{/* Key Insights */}
							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
								<h3 className="font-semibold text-blue-900 mb-4">📊 Önemli İçgörüler</h3>
								<div className="grid md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<span className="w-2 h-2 bg-green-500 rounded-full"></span>
											<span className="text-blue-800 text-sm">Email marketing en yüksek ROAS'a sahip (13.87x)</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
											<span className="text-blue-800 text-sm">Google Ads tıklama oranı sektör ortalamasının üstünde</span>
										</div>
									</div>
									<div className="space-y-2">
										<div className="flex items-center space-x-2">
											<span className="w-2 h-2 bg-blue-500 rounded-full"></span>
											<span className="text-blue-800 text-sm">Sosyal medya engagement oranı %23 arttı</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="w-2 h-2 bg-purple-500 rounded-full"></span>
											<span className="text-blue-800 text-sm">Mobil dönüşüm oranı desktop'tan %15 yüksek</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'channels' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Pazarlama Kanalları Performansı</h3>

							{channels.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">📢</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Kanal Verisi Yok</h3>
									<p className="text-gray-600 mb-4">Pazarlama kanallarınızı ekleyerek performans takibine başlayın.</p>
									<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
										Kanal Ekle
									</button>
								</div>
							) : (
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kanal</th>
												<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Harcama</th>
												<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tıklama</th>
												<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">CPC</th>
												<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dönüşüm</th>
												<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Gelir</th>
												<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ROAS</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-gray-200">
											{channels.map((channel, index) => (
												<tr key={index} className="hover:bg-gray-50">
													<td className="px-4 py-3 font-medium text-gray-900">{channel.name}</td>
													<td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(channel.spend)}</td>
													<td className="px-4 py-3 text-sm text-gray-900">{channel.clicks.toLocaleString()}</td>
													<td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(channel.cpc)}</td>
													<td className="px-4 py-3 text-sm text-gray-900">{channel.conversions}</td>
													<td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(channel.revenue)}</td>
													<td className="px-4 py-3 text-sm">
														<span className={`font-medium ${getPerformanceColor(channel.roas, 2.0)}`}>
															{channel.roas}x
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Kanal Gelir Dağılımı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🥧 Gelir dağılım grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Kanal Trend Analizi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Trend analiz grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'campaigns' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Kampanya Performansı</h3>
								<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
									Yeni Kampanya
								</button>
							</div>

							{campaigns.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">🎯</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Kampanya Yok</h3>
									<p className="text-gray-600 mb-4">İlk kampanyanızı oluşturarak başlayın.</p>
									<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
										Kampanya Oluştur
									</button>
								</div>
							) : (
								<div className="space-y-4">
									{campaigns.map((campaign) => (
									<div key={campaign.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{campaign.name}</h4>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
														{campaign.status === 'active' ? 'Aktif' : 
														 campaign.status === 'paused' ? 'Duraklatıldı' : campaign.status}
													</span>
												</div>
												<div className="text-sm text-gray-600">
													Bütçe: {formatCurrency(campaign.budget)} • 
													Harcanan: {formatCurrency(campaign.spent)} • 
													Kalan: {formatCurrency(campaign.budget - campaign.spent)}
												</div>
											</div>
											<div className="text-right">
												<div className={`text-lg font-semibold ${getPerformanceColor(campaign.roas, 2.0)}`}>
													{campaign.roas}x ROAS
												</div>
												<div className="text-sm text-gray-500">Gelir: {formatCurrency(campaign.revenue)}</div>
											</div>
										</div>

										<div className="grid md:grid-cols-6 gap-4 mb-4">
											<div className="text-center">
												<div className="text-lg font-semibold text-blue-600">{campaign.impressions.toLocaleString()}</div>
												<div className="text-xs text-gray-600">Gösterim</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-indigo-600">{campaign.clicks.toLocaleString()}</div>
												<div className="text-xs text-gray-600">Tıklama</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-green-600">%{campaign.ctr}</div>
												<div className="text-xs text-gray-600">CTR</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-orange-600">{formatCurrency(campaign.cpc)}</div>
												<div className="text-xs text-gray-600">CPC</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-purple-600">{campaign.conversions}</div>
												<div className="text-xs text-gray-600">Dönüşüm</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-red-600">%{(campaign.conversions / campaign.clicks * 100).toFixed(2)}</div>
												<div className="text-xs text-gray-600">Dönüşüm Oranı</div>
											</div>
										</div>

										<div className="flex space-x-3">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Düzenle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
												Analiz
											</button>
											{campaign.status === 'active' ? (
												<button className="text-yellow-600 hover:text-yellow-900 text-sm font-medium">
													Duraklat
												</button>
											) : (
												<button className="text-green-600 hover:text-green-900 text-sm font-medium">
													Başlat
												</button>
											)}
											<button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
												Kopyala
											</button>
										</div>
									</div>
								))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'attribution' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Attribution Modelleri</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">İlk Tıklama Attribution</h4>
									</div>
									<div className="p-4">
										<div className="space-y-3">
											<div className="flex justify-between">
												<span>Google Ads</span>
												<span className="font-medium">45%</span>
											</div>
											<div className="flex justify-between">
												<span>Facebook Ads</span>
												<span className="font-medium">28%</span>
											</div>
											<div className="flex justify-between">
												<span>Organik Arama</span>
												<span className="font-medium">18%</span>
											</div>
											<div className="flex justify-between">
												<span>Direkt</span>
												<span className="font-medium">9%</span>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Son Tıklama Attribution</h4>
									</div>
									<div className="p-4">
										<div className="space-y-3">
											<div className="flex justify-between">
												<span>Direkt</span>
												<span className="font-medium">38%</span>
											</div>
											<div className="flex justify-between">
												<span>Google Ads</span>
												<span className="font-medium">32%</span>
											</div>
											<div className="flex justify-between">
												<span>Email</span>
												<span className="font-medium">19%</span>
											</div>
											<div className="flex justify-between">
												<span>Facebook Ads</span>
												<span className="font-medium">11%</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Müşteri Yolculuğu Analizi</h4>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">🛤️ Müşteri yolculuğu haritası burada görünecek</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'cohort' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Cohort Analizi</h3>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Müşteri Tutma Oranları</h4>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 Cohort analizi tablosu burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Yaşam Boyu Değer Trendi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 LTV trend grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Kanal Bazlı Cohort</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🎯 Kanal cohort analizi burada görünecek</p>
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
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Custom Dashboard</h3>
					</div>
					<p className="text-blue-700 mb-4">Özel metrik dashboard'u oluştur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Dashboard Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-green-900">Otomatik Raporlama</h3>
					</div>
					<p className="text-green-700 mb-4">Periyodik otomatik rapor kurulum.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Rapor Kurulumu
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-purple-900">Goal Tracking</h3>
					</div>
					<p className="text-purple-700 mb-4">Marketing hedefleri takip sistemi.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Hedef Belirle
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-orange-900">AI İçgörüler</h3>
					</div>
					<p className="text-orange-700 mb-4">Yapay zeka destekli analiz ve öneriler.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						AI Analizi
					</button>
				</div>
			</div>
		</div>
	);
}
