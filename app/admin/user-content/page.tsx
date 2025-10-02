"use client";

import { useState } from 'react';

export default function UserContentPage() {
	const [activeTab, setActiveTab] = useState('overview');

	const contentStats = {
		totalContent: 2847,
		blogPosts: 892,
		productReviews: 1245,
		comments: 567,
		mediaUploads: 143,
		activeContributors: 234,
		monthlyGrowth: 18.5
	};

	const recentContent = [
		{
			id: 'UC001',
			type: 'blog_post',
			title: 'E-ticaret Pazarlama Stratejileri',
			author: 'Ahmet Yılmaz',
			authorEmail: 'ahmet@example.com',
			createdAt: '2024-01-15 14:30',
			status: 'published',
			views: 1250,
			likes: 89,
			comments: 23
		},
		{
			id: 'UC002',
			type: 'product_review',
			title: 'Kablosuz Kulaklık İncelemesi',
			author: 'Ayşe Demir',
			authorEmail: 'ayse@example.com',
			createdAt: '2024-01-15 12:15',
			status: 'published',
			views: 567,
			likes: 45,
			comments: 12
		},
		{
			id: 'UC003',
			type: 'comment',
			title: 'Ürün hakkında yorum',
			author: 'Mehmet Can',
			authorEmail: 'mehmet@example.com',
			createdAt: '2024-01-15 10:45',
			status: 'pending',
			views: 0,
			likes: 0,
			comments: 0
		},
		{
			id: 'UC004',
			type: 'media_upload',
			title: 'Ürün kullanım videosu',
			author: 'Fatma Özkan',
			authorEmail: 'fatma@example.com',
			createdAt: '2024-01-14 16:20',
			status: 'published',
			views: 2340,
			likes: 156,
			comments: 34
		}
	];

	const topContributors = [
		{
			name: 'Ahmet Yılmaz',
			email: 'ahmet@example.com',
			contentCount: 45,
			totalViews: 125000,
			avgRating: 4.8,
			joinDate: '2023-06-15',
			badge: 'Expert Contributor'
		},
		{
			name: 'Ayşe Demir',
			email: 'ayse@example.com',
			contentCount: 38,
			totalViews: 89000,
			avgRating: 4.6,
			joinDate: '2023-08-20',
			badge: 'Top Reviewer'
		},
		{
			name: 'Mehmet Can',
			email: 'mehmet@example.com',
			contentCount: 29,
			totalViews: 67000,
			avgRating: 4.4,
			joinDate: '2023-09-10',
			badge: 'Active Writer'
		}
	];

	const campaigns = [
		{
			id: 'CAM001',
			name: 'Yaz Koleksiyonu İnceleme Kampanyası',
			description: 'Yaz ürünleri için kullanıcı inceleme kampanyası',
			startDate: '2024-01-01',
			endDate: '2024-01-31',
			status: 'active',
			participants: 156,
			submissions: 89,
			reward: '50 TL kupon'
		},
		{
			id: 'CAM002',
			name: 'Blog Yazarı Arama',
			description: 'E-ticaret konularında blog yazarları arıyoruz',
			startDate: '2024-01-10',
			endDate: '2024-02-10',
			status: 'active',
			participants: 78,
			submissions: 34,
			reward: '200 TL ödeme'
		},
		{
			id: 'CAM003',
			name: 'Video İçerik Yarışması',
			description: 'Ürün tanıtım videoları için yarışma',
			startDate: '2023-12-15',
			endDate: '2024-01-15',
			status: 'completed',
			participants: 234,
			submissions: 67,
			reward: '500 TL ödül'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'published': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			case 'draft': return 'bg-gray-100 text-gray-800';
			case 'active': return 'bg-green-100 text-green-800';
			case 'completed': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'published': return 'Yayınlandı';
			case 'pending': return 'Beklemede';
			case 'rejected': return 'Reddedildi';
			case 'draft': return 'Taslak';
			case 'active': return 'Aktif';
			case 'completed': return 'Tamamlandı';
			default: return status;
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'blog_post': return '📝';
			case 'product_review': return '⭐';
			case 'comment': return '💬';
			case 'media_upload': return '🎥';
			default: return '📄';
		}
	};

	const getTypeText = (type: string) => {
		switch (type) {
			case 'blog_post': return 'Blog Yazısı';
			case 'product_review': return 'Ürün İncelemesi';
			case 'comment': return 'Yorum';
			case 'media_upload': return 'Medya';
			default: return type;
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Kullanıcı Üretimi İçerikler</h1>
					<p className="text-gray-600">UGC yönetimi, katkıcı analizi ve içerik kampanyaları</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Kampanya
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						İçerik Analizi
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-7 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{contentStats.totalContent.toLocaleString()}</div>
					<div className="text-sm text-blue-600">Toplam İçerik</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{contentStats.blogPosts}</div>
					<div className="text-sm text-green-600">Blog Yazısı</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{contentStats.productReviews.toLocaleString()}</div>
					<div className="text-sm text-yellow-600">Ürün İncelemesi</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{contentStats.comments}</div>
					<div className="text-sm text-purple-600">Yorum</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{contentStats.mediaUploads}</div>
					<div className="text-sm text-red-600">Medya</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{contentStats.activeContributors}</div>
					<div className="text-sm text-orange-600">Aktif Katkıcı</div>
				</div>
				<div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
					<div className="text-2xl font-bold text-emerald-700">+{contentStats.monthlyGrowth}%</div>
					<div className="text-sm text-emerald-600">Aylık Büyüme</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'content', label: 'Son İçerikler', icon: '📝' },
							{ key: 'contributors', label: 'Katkıcılar', icon: '👥' },
							{ key: 'campaigns', label: 'Kampanyalar', icon: '🎯' }
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
							<h3 className="text-lg font-semibold text-gray-900">İçerik Dağılımı ve Trendler</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">İçerik Türleri Dağılımı</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">🥧 İçerik türleri grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Aylık İçerik Üretimi</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Aylık üretim grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
									<h4 className="font-semibold text-blue-900 mb-3">En Popüler İçerik Türü</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">⭐</span>
										<div>
											<p className="text-blue-800 font-medium">Ürün İncelemeleri</p>
											<p className="text-blue-600 text-sm">{contentStats.productReviews} içerik</p>
										</div>
									</div>
								</div>

								<div className="bg-green-50 p-6 rounded-lg border border-green-200">
									<h4 className="font-semibold text-green-900 mb-3">En Aktif Kategori</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">📱</span>
										<div>
											<p className="text-green-800 font-medium">Teknoloji</p>
											<p className="text-green-600 text-sm">456 içerik</p>
										</div>
									</div>
								</div>

								<div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
									<h4 className="font-semibold text-purple-900 mb-3">Ortalama Etkileşim</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">👍</span>
										<div>
											<p className="text-purple-800 font-medium">89 beğeni</p>
											<p className="text-purple-600 text-sm">İçerik başına</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'content' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Son Kullanıcı İçerikleri</h3>
								<div className="flex space-x-2">
									<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
										<option value="">Tüm Türler</option>
										<option value="blog_post">Blog Yazıları</option>
										<option value="product_review">Ürün İncelemeleri</option>
										<option value="comment">Yorumlar</option>
										<option value="media_upload">Medya</option>
									</select>
									<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
										<option value="">Tüm Durumlar</option>
										<option value="published">Yayınlandı</option>
										<option value="pending">Beklemede</option>
										<option value="rejected">Reddedildi</option>
									</select>
								</div>
							</div>

							<div className="space-y-4">
								{recentContent.map((content) => (
									<div key={content.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getTypeIcon(content.type)}</span>
													<h4 className="font-semibold text-gray-900">{content.title}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(content.status)}`}>
														{getStatusText(content.status)}
													</span>
													<span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
														{getTypeText(content.type)}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<span><strong>Yazar:</strong> {content.author} ({content.authorEmail})</span>
													<span className="ml-4"><strong>Tarih:</strong> {content.createdAt}</span>
												</div>
												<div className="flex items-center space-x-6 text-sm text-gray-500">
													<span className="flex items-center">
														<span className="mr-1">👁️</span>
														{content.views.toLocaleString()} görüntüleme
													</span>
													<span className="flex items-center">
														<span className="mr-1">👍</span>
														{content.likes} beğeni
													</span>
													<span className="flex items-center">
														<span className="mr-1">💬</span>
														{content.comments} yorum
													</span>
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Düzenle
											</button>
											{content.status === 'pending' && (
												<>
													<button className="text-green-600 hover:text-green-900 text-sm">
														Onayla
													</button>
													<button className="text-red-600 hover:text-red-900 text-sm">
														Reddet
													</button>
												</>
											)}
											{content.status === 'published' && (
												<button className="text-yellow-600 hover:text-yellow-900 text-sm">
													Gizle
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'contributors' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">En Aktif Katkıcılar</h3>
							
							<div className="space-y-4">
								{topContributors.map((contributor, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center">
												<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
													<span className="text-indigo-600 font-bold text-lg">
														{contributor.name.split(' ').map(n => n[0]).join('')}
													</span>
												</div>
												<div className="ml-4">
													<h4 className="font-semibold text-gray-900">{contributor.name}</h4>
													<p className="text-gray-600">{contributor.email}</p>
													<span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
														{contributor.badge}
													</span>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm text-gray-500">Katılım: {contributor.joinDate}</p>
											</div>
										</div>

										<div className="grid md:grid-cols-4 gap-4 mb-4">
											<div className="text-center bg-blue-50 p-3 rounded">
												<div className="text-xl font-bold text-blue-600">{contributor.contentCount}</div>
												<div className="text-sm text-blue-600">İçerik</div>
											</div>
											<div className="text-center bg-green-50 p-3 rounded">
												<div className="text-xl font-bold text-green-600">{contributor.totalViews.toLocaleString()}</div>
												<div className="text-sm text-green-600">Görüntüleme</div>
											</div>
											<div className="text-center bg-yellow-50 p-3 rounded">
												<div className="text-xl font-bold text-yellow-600">{contributor.avgRating}</div>
												<div className="text-sm text-yellow-600">Ortalama Puan</div>
											</div>
											<div className="text-center bg-purple-50 p-3 rounded">
												<div className="text-xl font-bold text-purple-600">
													{Math.round(contributor.totalViews / contributor.contentCount).toLocaleString()}
												</div>
												<div className="text-sm text-purple-600">Ort. Görüntüleme</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Profil
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												İçerikleri
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Mesaj Gönder
											</button>
											<button className="text-purple-600 hover:text-purple-900 text-sm">
												Rozet Ver
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'campaigns' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">İçerik Kampanyaları</h3>
								<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
									Yeni Kampanya Oluştur
								</button>
							</div>

							<div className="space-y-4">
								{campaigns.map((campaign) => (
									<div key={campaign.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<h4 className="font-semibold text-gray-900">{campaign.name}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
														{getStatusText(campaign.status)}
													</span>
												</div>
												<p className="text-gray-600 mb-3">{campaign.description}</p>
												<div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
													<div>
														<p><strong>Başlangıç:</strong> {campaign.startDate}</p>
														<p><strong>Bitiş:</strong> {campaign.endDate}</p>
													</div>
													<div>
														<p><strong>Katılımcı:</strong> {campaign.participants}</p>
														<p><strong>Gönderim:</strong> {campaign.submissions}</p>
													</div>
												</div>
											</div>
										</div>

										<div className="bg-green-50 p-3 rounded border border-green-200 mb-4">
											<p className="text-green-800 font-medium">🎁 Ödül: {campaign.reward}</p>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Gönderimler
											</button>
											{campaign.status === 'active' && (
												<>
													<button className="text-green-600 hover:text-green-900 text-sm">
														Düzenle
													</button>
													<button className="text-yellow-600 hover:text-yellow-900 text-sm">
														Duraklat
													</button>
												</>
											)}
											{campaign.status === 'completed' && (
												<button className="text-purple-600 hover:text-purple-900 text-sm">
													Sonuçlar
												</button>
											)}
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
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-blue-900">İçerik Teşviki</h3>
					</div>
					<p className="text-blue-700 mb-4">Kaliteli içerik üreticilerini ödüllendir.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Ödül Programı
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-green-900">İçerik Analizi</h3>
					</div>
					<p className="text-green-700 mb-4">Detaylı UGC performans analizi.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Analiz Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-purple-900">AI Önerileri</h3>
					</div>
					<p className="text-purple-700 mb-4">İçerik stratejisi için AI önerileri.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Önerileri Gör
					</button>
				</div>
			</div>
		</div>
	);
}
