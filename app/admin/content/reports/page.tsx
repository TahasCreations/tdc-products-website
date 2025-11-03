"use client";

import { useState } from 'react';

export default function ContentReportsPage() {
	const [selectedReport, setSelectedReport] = useState('overview');
	const [dateRange, setDateRange] = useState('30d');

	const reportTypes = [
		{
			id: 'overview',
			name: 'Genel Bakış',
			description: 'İçerik performansının genel özeti',
			icon: '📊'
		},
		{
			id: 'blog',
			name: 'Blog Performansı',
			description: 'Blog yazılarının detaylı analizi',
			icon: '📝'
		},
		{
			id: 'user-content',
			name: 'Kullanıcı İçeriği',
			description: 'İncelemeler ve yorumların analizi',
			icon: '👥'
		},
		{
			id: 'seo',
			name: 'SEO Performansı',
			description: 'İçeriklerin SEO başarısı',
			icon: '🔍'
		}
	];

	const contentMetrics = {
		overview: {
			totalContent: 0,
			publishedContent: 0,
			draftContent: 0,
			totalViews: 0,
			totalEngagement: 0,
			avgReadTime: '0:00'
		},
		blog: {
			totalPosts: 0,
			publishedPosts: 0,
			draftPosts: 0,
			totalViews: 0,
			avgViews: 0,
			topPost: '-'
		},
		userContent: {
			totalReviews: 0,
			approvedReviews: 0,
			pendingReviews: 0,
			avgRating: 0,
			totalComments: 0,
			moderationRate: '0%'
		},
		seo: {
			indexedPages: 0,
			avgPosition: 0,
			organicTraffic: 0,
			clickThroughRate: '0%',
			topKeywords: 0,
			featuredSnippets: 0
		}
	};

	const [topContent] = useState<any[]>([]);

	const renderOverviewReport = () => (
		<div className="space-y-6">
			{/* Key Metrics */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-blue-900">Toplam İçerik</h3>
						<span className="text-2xl">📄</span>
					</div>
					<div className="text-3xl font-bold text-blue-600 mb-2">
						{contentMetrics.overview.totalContent.toLocaleString()}
					</div>
					<div className="text-sm text-blue-700">
						{contentMetrics.overview.publishedContent} yayında, {contentMetrics.overview.draftContent} taslak
					</div>
				</div>

				<div className="bg-green-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-green-900">Toplam Görüntülenme</h3>
						<span className="text-2xl">👁️</span>
					</div>
					<div className="text-3xl font-bold text-green-600 mb-2">
						{contentMetrics.overview.totalViews.toLocaleString()}
					</div>
					<div className="text-sm text-green-700">
						Son 30 günde %0 artış
					</div>
				</div>

				<div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-purple-900">Etkileşim</h3>
						<span className="text-2xl">💬</span>
					</div>
					<div className="text-3xl font-bold text-purple-600 mb-2">
						{contentMetrics.overview.totalEngagement.toLocaleString()}
					</div>
					<div className="text-sm text-purple-700">
						Ortalama okuma süresi: {contentMetrics.overview.avgReadTime}
					</div>
				</div>
			</div>

			{/* Content Performance Chart */}
			<div className="bg-white p-6 rounded-xl border">
				<h3 className="text-lg font-semibold mb-4">İçerik Performansı Trendi</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">İçerik performans grafiği burada görünecek</p>
				</div>
			</div>

			{/* Top Performing Content */}
			<div className="bg-white p-6 rounded-xl border">
				<h3 className="text-lg font-semibold mb-4">En Başarılı İçerikler</h3>
				{topContent.length === 0 ? (
					<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
						<div className="text-4xl mb-4">📊</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz İçerik Yok</h3>
						<p className="text-gray-600">İçerik performans verileri burada görünecek.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">İçerik</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tip</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Görüntülenme</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Etkileşim</th>
									<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tarih</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{topContent.map((content, i) => (
									<tr key={i} className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm font-medium text-gray-900">
											{content.title}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
												{content.type}
											</span>
										</td>
										<td className="px-4 py-3 text-sm text-gray-900">
											{content.views.toLocaleString()}
										</td>
										<td className="px-4 py-3 text-sm text-gray-900">
											{content.engagement}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											{content.date}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);

	const renderBlogReport = () => (
		<div className="space-y-6">
			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-xl border">
					<h3 className="text-lg font-semibold mb-4">Blog İstatistikleri</h3>
					<div className="space-y-4">
						<div className="flex justify-between">
							<span className="text-gray-600">Toplam Yazı:</span>
							<span className="font-semibold">{contentMetrics.blog.totalPosts}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Yayında:</span>
							<span className="font-semibold text-green-600">{contentMetrics.blog.publishedPosts}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Taslak:</span>
							<span className="font-semibold text-yellow-600">{contentMetrics.blog.draftPosts}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Ortalama Görüntülenme:</span>
							<span className="font-semibold">{contentMetrics.blog.avgViews}</span>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl border">
					<h3 className="text-lg font-semibold mb-4">En Popüler Yazı</h3>
					<div className="text-center p-6 bg-blue-50 rounded-lg">
						<div className="text-2xl mb-2">🏆</div>
						<div className="font-semibold text-gray-900 mb-2">
							{contentMetrics.blog.topPost}
						</div>
						<div className="text-blue-600 font-semibold">
							{contentMetrics.blog.totalViews.toLocaleString()} görüntülenme
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderUserContentReport = () => (
		<div className="space-y-6">
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-xl border">
					<h3 className="text-lg font-semibold mb-4">İncelemeler</h3>
					<div className="text-3xl font-bold text-blue-600 mb-2">
						{contentMetrics.userContent.totalReviews}
					</div>
					<div className="text-sm text-gray-600">
						{contentMetrics.userContent.approvedReviews} onaylı
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl border">
					<h3 className="text-lg font-semibold mb-4">Ortalama Puan</h3>
					<div className="text-3xl font-bold text-green-600 mb-2">
						{contentMetrics.userContent.avgRating}
					</div>
					<div className="flex text-yellow-400">
						{'★'.repeat(Math.floor(contentMetrics.userContent.avgRating))}
						{'☆'.repeat(5 - Math.floor(contentMetrics.userContent.avgRating))}
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl border">
					<h3 className="text-lg font-semibold mb-4">Moderasyon</h3>
					<div className="text-3xl font-bold text-purple-600 mb-2">
						{contentMetrics.userContent.moderationRate}
					</div>
					<div className="text-sm text-gray-600">
						Onay oranı
					</div>
				</div>
			</div>
		</div>
	);

	const renderSEOReport = () => (
		<div className="space-y-6">
			<div className="grid md:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-xl border">
					<h3 className="text-lg font-semibold mb-4">SEO Metrikleri</h3>
					<div className="space-y-4">
						<div className="flex justify-between">
							<span className="text-gray-600">İndekslenen Sayfa:</span>
							<span className="font-semibold">{contentMetrics.seo.indexedPages}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Ortalama Sıralama:</span>
							<span className="font-semibold">{contentMetrics.seo.avgPosition}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Organik Trafik:</span>
							<span className="font-semibold text-green-600">{contentMetrics.seo.organicTraffic.toLocaleString()}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">CTR:</span>
							<span className="font-semibold">{contentMetrics.seo.clickThroughRate}</span>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl border">
					<h3 className="text-lg font-semibold mb-4">Anahtar Kelime Performansı</h3>
					<div className="text-center p-6 bg-green-50 rounded-lg">
						<div className="text-2xl mb-2">🎯</div>
						<div className="font-semibold text-gray-900 mb-2">
							{contentMetrics.seo.topKeywords} Top 10 Anahtar Kelime
						</div>
						<div className="text-green-600 font-semibold">
							{contentMetrics.seo.featuredSnippets} Featured Snippet
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">İçerik Raporları</h1>
				<div className="flex space-x-2">
					<select 
						value={dateRange}
						onChange={(e) => setDateRange(e.target.value)}
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

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Report Types Sidebar */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm border">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold">Rapor Türleri</h3>
						</div>
						<div className="p-6 space-y-2">
							{reportTypes.map((report) => (
								<button
									key={report.id}
									onClick={() => setSelectedReport(report.id)}
									className={`w-full text-left p-4 rounded-lg transition-all ${
										selectedReport === report.id
											? 'bg-indigo-50 border-2 border-indigo-200'
											: 'border-2 border-transparent hover:bg-gray-50'
									}`}
								>
									<div className="flex items-center space-x-3">
										<span className="text-2xl">{report.icon}</span>
										<div>
											<div className="font-semibold text-gray-900">{report.name}</div>
											<div className="text-sm text-gray-600">{report.description}</div>
										</div>
									</div>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Report Content */}
				<div className="lg:col-span-3">
					<div className="bg-white rounded-xl shadow-sm border">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold">
								{reportTypes.find(r => r.id === selectedReport)?.name} Raporu
							</h3>
						</div>
						<div className="p-6">
							{selectedReport === 'overview' && renderOverviewReport()}
							{selectedReport === 'blog' && renderBlogReport()}
							{selectedReport === 'user-content' && renderUserContentReport()}
							{selectedReport === 'seo' && renderSEOReport()}
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Özel Rapor</h3>
					</div>
					<p className="text-blue-700 mb-4">Özelleştirilmiş rapor oluştur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📧</span>
						<h3 className="text-lg font-semibold text-green-900">Otomatik Rapor</h3>
					</div>
					<p className="text-green-700 mb-4">Periyodik rapor gönderimi ayarla.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Ayarla
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-purple-900">Trend Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">İçerik trendlerini analiz et.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-orange-900">Hedef Takibi</h3>
					</div>
					<p className="text-orange-700 mb-4">İçerik hedeflerini takip et.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Takip Et
					</button>
				</div>
			</div>
		</div>
	)
}
