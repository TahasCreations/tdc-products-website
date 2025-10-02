"use client";

import { useState } from 'react';

export default function ContentReportsPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedPeriod, setSelectedPeriod] = useState('30d');

	const reportStats = {
		totalContent: 12847,
		publishedToday: 34,
		avgEngagement: 87.3,
		topPerformer: 'Anime Figür Rehberi',
		contentViews: 2890000,
		socialShares: 15600
	};

	const contentPerformance = [
		{
			id: 1,
			title: 'En İyi Anime Figür Koleksiyonu Rehberi',
			type: 'Blog',
			author: 'content_team',
			publishDate: '2024-01-10',
			views: 25640,
			likes: 1230,
			shares: 456,
			comments: 89,
			engagementRate: 6.8,
			conversionRate: 3.2
		},
		{
			id: 2,
			title: 'Vintage Poster Yatırım Rehberi',
			type: 'Article',
			author: 'expert_writer',
			publishDate: '2024-01-12',
			views: 18970,
			likes: 890,
			shares: 234,
			comments: 56,
			engagementRate: 6.3,
			conversionRate: 4.1
		},
		{
			id: 3,
			title: 'Teknoloji Ürünleri İnceleme',
			type: 'Video',
			author: 'tech_reviewer',
			publishDate: '2024-01-14',
			views: 34500,
			likes: 2100,
			shares: 789,
			comments: 145,
			engagementRate: 8.2,
			conversionRate: 5.7
		}
	];

	const contentCategories = [
		{ category: 'Anime & Manga', posts: 234, views: 456000, avgEngagement: 8.9 },
		{ category: 'Vintage Koleksiyon', posts: 189, views: 342000, avgEngagement: 7.3 },
		{ category: 'Teknoloji', posts: 167, views: 389000, avgEngagement: 6.8 },
		{ category: 'Ev & Yaşam', posts: 145, views: 234000, avgEngagement: 5.9 },
		{ category: 'Kitap & Edebiyat', posts: 123, views: 189000, avgEngagement: 7.1 }
	];

	const getEngagementColor = (rate: number) => {
		if (rate >= 8) return 'text-green-600';
		if (rate >= 6) return 'text-yellow-600';
		return 'text-red-600';
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'Blog': return 'bg-blue-100 text-blue-800';
			case 'Article': return 'bg-green-100 text-green-800';
			case 'Video': return 'bg-red-100 text-red-800';
			case 'Image': return 'bg-purple-100 text-purple-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">İçerik Raporları</h1>
					<p className="text-gray-600">Detaylı içerik performans analizi ve istatistikler</p>
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
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Rapor İndir
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Dashboard Oluştur
					</button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid md:grid-cols-6 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{reportStats.totalContent.toLocaleString()}</div>
					<div className="text-sm text-blue-600">Toplam İçerik</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{reportStats.publishedToday}</div>
					<div className="text-sm text-green-600">Bugün Yayınlanan</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{reportStats.avgEngagement}%</div>
					<div className="text-sm text-purple-600">Ort. Etkileşim</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{(reportStats.contentViews / 1000000).toFixed(1)}M</div>
					<div className="text-sm text-orange-600">Toplam Görüntüleme</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{(reportStats.socialShares / 1000).toFixed(1)}K</div>
					<div className="text-sm text-red-600">Sosyal Paylaşım</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">🏆</div>
					<div className="text-sm text-yellow-600">En Popüler</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'performance', label: 'Performans', icon: '📈' },
							{ key: 'categories', label: 'Kategoriler', icon: '📂' },
							{ key: 'engagement', label: 'Etkileşim', icon: '💬' },
							{ key: 'seo', label: 'SEO Analizi', icon: '🔍' }
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
							<h3 className="text-lg font-semibold text-gray-900">İçerik Performans Özeti</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">İçerik Türü Dağılımı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🥧 İçerik türü dağılım grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Günlük Görüntüleme Trendi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Günlük görüntüleme trend grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
									<h4 className="font-semibold text-blue-900 mb-4">📊 Performans Özetleri</h4>
									<div className="space-y-3 text-sm text-blue-800">
										<div>• En popüler kategori: Anime & Manga</div>
										<div>• En yüksek etkileşim: Video içerikler</div>
										<div>• Peak saatler: 20:00-22:00</div>
										<div>• Mobil okuma oranı: %68</div>
									</div>
								</div>

								<div className="bg-green-50 border border-green-200 rounded-lg p-6">
									<h4 className="font-semibold text-green-900 mb-4">📈 Büyüme İstatistikleri</h4>
									<div className="space-y-3 text-sm text-green-800">
										<div>• Aylık büyüme: +23.4%</div>
										<div>• Yeni okuyucu artışı: +15.7%</div>
										<div>• Sosyal paylaşım artışı: +31.2%</div>
										<div>• Dönüşüm oranı: +8.9%</div>
									</div>
								</div>

								<div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
									<h4 className="font-semibold text-purple-900 mb-4">🎯 Hedef Analizi</h4>
									<div className="space-y-3 text-sm text-purple-800">
										<div>• Aylık hedef: %87 tamamlandı</div>
										<div>• Engagement hedefi: %112 aşıldı</div>
										<div>• Yeni içerik hedefi: %95 tamamlandı</div>
										<div>• Kalite skoru: 8.7/10</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'performance' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">En Performanslı İçerikler</h3>

							<div className="bg-white border rounded-lg overflow-hidden">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">İçerik</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tür</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Görüntüleme</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Etkileşim</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Paylaşım</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Dönüşüm</th>
											<th className="px-6 py-3 text-right text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{contentPerformance.map((content) => (
											<tr key={content.id} className="hover:bg-gray-50">
												<td className="px-6 py-4">
													<div>
														<div className="font-medium text-gray-900">{content.title}</div>
														<div className="text-sm text-gray-500">
															{content.author} • {content.publishDate}
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(content.type)}`}>
														{content.type}
													</span>
												</td>
												<td className="px-6 py-4 text-sm text-gray-900">{content.views.toLocaleString()}</td>
												<td className="px-6 py-4">
													<div className="text-sm text-gray-900">{content.likes + content.comments}</div>
													<div className={`text-xs font-medium ${getEngagementColor(content.engagementRate)}`}>
														%{content.engagementRate}
													</div>
												</td>
												<td className="px-6 py-4 text-sm text-gray-900">{content.shares}</td>
												<td className="px-6 py-4">
													<span className="text-sm font-medium text-green-600">%{content.conversionRate}</span>
												</td>
												<td className="px-6 py-4 text-right">
													<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
														Detay
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'categories' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Kategori Performans Analizi</h3>

							<div className="space-y-4">
								{contentCategories.map((category, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-center justify-between mb-4">
											<h4 className="font-semibold text-gray-900">{category.category}</h4>
											<div className={`font-medium ${getEngagementColor(category.avgEngagement)}`}>
												%{category.avgEngagement} etkileşim
											</div>
										</div>

										<div className="grid md:grid-cols-3 gap-4">
											<div className="text-center">
												<div className="text-lg font-semibold text-blue-600">{category.posts}</div>
												<div className="text-xs text-gray-600">İçerik Sayısı</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-green-600">{(category.views / 1000).toFixed(0)}K</div>
												<div className="text-xs text-gray-600">Toplam Görüntüleme</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-purple-600">{Math.round(category.views / category.posts)}</div>
												<div className="text-xs text-gray-600">İçerik Başına Ortalama</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'engagement' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Etkileşim Analizi</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Etkileşim Türleri</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📊 Etkileşim türü dağılım grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Saatlik Etkileşim Dağılımı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🕐 Saatlik etkileşim grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-4 gap-6">
								<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
									<h4 className="font-semibold text-blue-900 mb-2">Beğeniler</h4>
									<div className="text-2xl font-bold text-blue-700">45.2K</div>
									<div className="text-sm text-blue-600">Son 30 gün</div>
								</div>
								<div className="bg-green-50 p-6 rounded-lg border border-green-200">
									<h4 className="font-semibold text-green-900 mb-2">Yorumlar</h4>
									<div className="text-2xl font-bold text-green-700">12.8K</div>
									<div className="text-sm text-green-600">Son 30 gün</div>
								</div>
								<div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
									<h4 className="font-semibold text-purple-900 mb-2">Paylaşımlar</h4>
									<div className="text-2xl font-bold text-purple-700">8.9K</div>
									<div className="text-sm text-purple-600">Son 30 gün</div>
								</div>
								<div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
									<h4 className="font-semibold text-orange-900 mb-2">Kaydetmeler</h4>
									<div className="text-2xl font-bold text-orange-700">6.1K</div>
									<div className="text-sm text-orange-600">Son 30 gün</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'seo' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">SEO Performans Analizi</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Organik Trafik</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Organik trafik trend grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Anahtar Kelime Performansı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🔍 Anahtar kelime performans tablosu burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-4 gap-6">
								<div className="bg-green-50 p-6 rounded-lg border border-green-200">
									<h4 className="font-semibold text-green-900 mb-2">Organik CTR</h4>
									<div className="text-2xl font-bold text-green-700">3.4%</div>
									<div className="text-sm text-green-600">Google'da ortalama</div>
								</div>
								<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
									<h4 className="font-semibold text-blue-900 mb-2">Sayfa Hızı</h4>
									<div className="text-2xl font-bold text-blue-700">94</div>
									<div className="text-sm text-blue-600">PageSpeed skoru</div>
								</div>
								<div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
									<h4 className="font-semibold text-purple-900 mb-2">Core Web Vitals</h4>
									<div className="text-2xl font-bold text-purple-700">98%</div>
									<div className="text-sm text-purple-600">İyi sayfa oranı</div>
								</div>
								<div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
									<h4 className="font-semibold text-orange-900 mb-2">Backlink</h4>
									<div className="text-2xl font-bold text-orange-700">1.2K</div>
									<div className="text-sm text-orange-600">Kaliteli geri bağlantı</div>
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
					<p className="text-blue-700 mb-4">Kişiselleştirilmiş rapor dashboard'u oluşturun.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Dashboard Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-green-900">Trend Analizi</h3>
					</div>
					<p className="text-green-700 mb-4">İçerik trendlerini analiz edin ve öngörü alın.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Trend Analizi
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-purple-900">Otomatik Rapor</h3>
					</div>
					<p className="text-purple-700 mb-4">Periyodik otomatik raporlama ayarları.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Otomasyon Kur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-orange-900">Hedef Takibi</h3>
					</div>
					<p className="text-orange-700 mb-4">İçerik KPI'larını takip edin ve hedefler belirleyin.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Hedef Belirle
					</button>
				</div>
			</div>
		</div>
	);
}
