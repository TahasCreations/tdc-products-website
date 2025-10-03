"use client";

import { useState } from 'react';

export default function BlogModerationPage() {
	const [activeTab, setActiveTab] = useState('pending');
	const [selectedCategory, setSelectedCategory] = useState('all');

	const moderationStats = {
		totalPosts: 1456,
		pendingReview: 23,
		published: 1289,
		rejected: 144,
		scheduledPosts: 12,
		draftPosts: 67,
		avgReviewTime: '1.8 saat',
		approvalRate: '88.5%'
	};

	const pendingPosts = [
		{
			id: 'BP001',
			title: 'E-ticaret Pazarlama Stratejileri 2024',
			author: 'Ahmet Yılmaz',
			authorEmail: 'ahmet@example.com',
			category: 'Pazarlama',
			tags: ['e-ticaret', 'pazarlama', 'strateji', 'dijital'],
			submittedAt: '2024-01-15 14:30',
			wordCount: 1250,
			readingTime: '5 dk',
			status: 'pending_review',
			priority: 'normal',
			seoScore: 85,
			contentQuality: 'good',
			plagiarismCheck: 'passed',
			excerpt: 'E-ticaret dünyasında başarılı olmak için 2024 yılında uygulamanız gereken en etkili pazarlama stratejilerini keşfedin...'
		},
		{
			id: 'BP002',
			title: 'Yapay Zeka ile Müşteri Deneyimi Geliştirme',
			author: 'Ayşe Demir',
			authorEmail: 'ayse@example.com',
			category: 'Teknoloji',
			tags: ['yapay-zeka', 'müşteri-deneyimi', 'AI', 'chatbot'],
			submittedAt: '2024-01-15 12:15',
			wordCount: 980,
			readingTime: '4 dk',
			status: 'pending_review',
			priority: 'high',
			seoScore: 92,
			contentQuality: 'excellent',
			plagiarismCheck: 'passed',
			excerpt: 'Yapay zeka teknolojilerini kullanarak müşteri deneyimini nasıl geliştirebileceğinizi öğrenin...'
		},
		{
			id: 'BP003',
			title: 'Sosyal Medya Pazarlama Trendleri',
			author: 'Mehmet Can',
			authorEmail: 'mehmet@example.com',
			category: 'Sosyal Medya',
			tags: ['sosyal-medya', 'instagram', 'tiktok', 'pazarlama'],
			submittedAt: '2024-01-15 10:45',
			wordCount: 750,
			readingTime: '3 dk',
			status: 'needs_revision',
			priority: 'normal',
			seoScore: 68,
			contentQuality: 'fair',
			plagiarismCheck: 'warning',
			excerpt: 'Bu yıl sosyal medya pazarlamasında öne çıkan trendler ve uygulama önerileri...',
			revisionNotes: 'SEO optimizasyonu gerekli, bazı bölümler daha detaylandırılmalı'
		}
	];

	const publishedPosts = [
		{
			id: 'BP101',
			title: 'Mobil E-ticaret Optimizasyonu',
			author: 'Fatma Özkan',
			category: 'E-ticaret',
			publishedAt: '2024-01-14 16:20',
			views: 2340,
			likes: 156,
			comments: 34,
			shares: 89,
			avgRating: 4.7,
			status: 'published'
		},
		{
			id: 'BP102',
			title: 'İçerik Pazarlama Stratejileri',
			author: 'Ali Kaya',
			category: 'Pazarlama',
			publishedAt: '2024-01-13 14:15',
			views: 1890,
			likes: 123,
			comments: 28,
			shares: 67,
			avgRating: 4.5,
			status: 'published'
		}
	];

	const rejectedPosts = [
		{
			id: 'BP201',
			title: 'Kalitesiz İçerik Örneği',
			author: 'Test User',
			category: 'Diğer',
			rejectedAt: '2024-01-12 11:30',
			rejectionReason: 'İçerik kalitesi yetersiz, kaynak belirtilmemiş',
			moderator: 'moderator1@tdcmarket.com',
			status: 'rejected'
		}
	];

	const categories = [
		{ value: 'all', label: 'Tüm Kategoriler', count: 1456 },
		{ value: 'pazarlama', label: 'Pazarlama', count: 345 },
		{ value: 'teknoloji', label: 'Teknoloji', count: 289 },
		{ value: 'e-ticaret', label: 'E-ticaret', count: 234 },
		{ value: 'sosyal-medya', label: 'Sosyal Medya', count: 156 },
		{ value: 'seo', label: 'SEO', count: 123 },
		{ value: 'diğer', label: 'Diğer', count: 309 }
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending_review': return 'bg-yellow-100 text-yellow-800';
			case 'needs_revision': return 'bg-orange-100 text-orange-800';
			case 'published': return 'bg-green-100 text-green-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			case 'scheduled': return 'bg-blue-100 text-blue-800';
			case 'draft': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending_review': return 'İnceleme Bekliyor';
			case 'needs_revision': return 'Revizyon Gerekli';
			case 'published': return 'Yayınlandı';
			case 'rejected': return 'Reddedildi';
			case 'scheduled': return 'Zamanlandı';
			case 'draft': return 'Taslak';
			default: return status;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'normal': return 'bg-blue-100 text-blue-800';
			case 'low': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high': return 'Yüksek';
			case 'normal': return 'Normal';
			case 'low': return 'Düşük';
			default: return priority;
		}
	};

	const getQualityColor = (quality: string) => {
		switch (quality) {
			case 'excellent': return 'text-green-600';
			case 'good': return 'text-blue-600';
			case 'fair': return 'text-yellow-600';
			case 'poor': return 'text-red-600';
			default: return 'text-gray-600';
		}
	};

	const getQualityText = (quality: string) => {
		switch (quality) {
			case 'excellent': return 'Mükemmel';
			case 'good': return 'İyi';
			case 'fair': return 'Orta';
			case 'poor': return 'Zayıf';
			default: return quality;
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Blog Moderasyonu</h1>
					<p className="text-gray-600">Blog yazılarının incelenmesi, onaylanması ve yönetimi</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={selectedCategory} 
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
					>
						{categories.map(cat => (
							<option key={cat.value} value={cat.value}>
								{cat.label} ({cat.count})
							</option>
						))}
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Toplu İşlemler
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-8 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{moderationStats.totalPosts.toLocaleString()}</div>
					<div className="text-sm text-blue-600">Toplam Yazı</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{moderationStats.pendingReview}</div>
					<div className="text-sm text-yellow-600">İnceleme Bekliyor</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{moderationStats.published.toLocaleString()}</div>
					<div className="text-sm text-green-600">Yayınlandı</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{moderationStats.rejected}</div>
					<div className="text-sm text-red-600">Reddedildi</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{moderationStats.scheduledPosts}</div>
					<div className="text-sm text-purple-600">Zamanlandı</div>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-2xl font-bold text-gray-700">{moderationStats.draftPosts}</div>
					<div className="text-sm text-gray-600">Taslak</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{moderationStats.avgReviewTime}</div>
					<div className="text-sm text-orange-600">Ort. İnceleme</div>
				</div>
				<div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
					<div className="text-2xl font-bold text-emerald-700">{moderationStats.approvalRate}</div>
					<div className="text-sm text-emerald-600">Onay Oranı</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'pending', label: 'İnceleme Bekliyor', icon: '⏳', count: moderationStats.pendingReview },
							{ key: 'published', label: 'Yayınlanan', icon: '✅', count: moderationStats.published },
							{ key: 'rejected', label: 'Reddedilen', icon: '❌', count: moderationStats.rejected },
							{ key: 'scheduled', label: 'Zamanlanmış', icon: '📅', count: moderationStats.scheduledPosts }
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
								<span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
									{tab.count}
								</span>
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'pending' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">İnceleme Bekleyen Yazılar</h3>
								<div className="flex space-x-2">
									<button className="text-green-600 hover:text-green-800 text-sm">
										Tümünü Onayla
									</button>
									<button className="text-red-600 hover:text-red-800 text-sm">
										Toplu Reddet
									</button>
								</div>
							</div>

							<div className="space-y-6">
								{pendingPosts.map((post) => (
									<div key={post.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<h4 className="font-semibold text-gray-900 text-lg">{post.title}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
														{getStatusText(post.status)}
													</span>
													<span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(post.priority)}`}>
														{getPriorityText(post.priority)}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<span><strong>Yazar:</strong> {post.author} ({post.authorEmail})</span>
													<span className="ml-4"><strong>Kategori:</strong> {post.category}</span>
													<span className="ml-4"><strong>Gönderim:</strong> {post.submittedAt}</span>
												</div>
												<p className="text-gray-700 mb-4">{post.excerpt}</p>
												
												<div className="grid md:grid-cols-2 gap-4 mb-4">
													<div className="space-y-2">
														<div className="flex justify-between text-sm">
															<span>Kelime Sayısı:</span>
															<span className="font-medium">{post.wordCount}</span>
														</div>
														<div className="flex justify-between text-sm">
															<span>Okuma Süresi:</span>
															<span className="font-medium">{post.readingTime}</span>
														</div>
														<div className="flex justify-between text-sm">
															<span>SEO Skoru:</span>
															<span className={`font-medium ${post.seoScore >= 80 ? 'text-green-600' : post.seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
																{post.seoScore}/100
															</span>
														</div>
													</div>
													<div className="space-y-2">
														<div className="flex justify-between text-sm">
															<span>İçerik Kalitesi:</span>
															<span className={`font-medium ${getQualityColor(post.contentQuality)}`}>
																{getQualityText(post.contentQuality)}
															</span>
														</div>
														<div className="flex justify-between text-sm">
															<span>Plagiarism Check:</span>
															<span className={`font-medium ${post.plagiarismCheck === 'passed' ? 'text-green-600' : 'text-yellow-600'}`}>
																{post.plagiarismCheck === 'passed' ? '✅ Temiz' : '⚠️ Uyarı'}
															</span>
														</div>
													</div>
												</div>

												<div className="flex flex-wrap gap-2 mb-4">
													{post.tags.map((tag, index) => (
														<span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
															#{tag}
														</span>
													))}
												</div>

												{post.revisionNotes && (
													<div className="bg-orange-50 p-3 rounded border border-orange-200 mb-4">
														<p className="text-orange-800 text-sm">
															<strong>Revizyon Notları:</strong> {post.revisionNotes}
														</p>
													</div>
												)}
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Önizle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Düzenle
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Onayla & Yayınla
											</button>
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Revizyon İste
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm">
												Reddet
											</button>
											<button className="text-purple-600 hover:text-purple-900 text-sm">
												Zamanla
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'published' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Yayınlanan Yazılar</h3>
							
							<div className="space-y-4">
								{publishedPosts.map((post) => (
									<div key={post.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<h4 className="font-semibold text-gray-900 text-lg">{post.title}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
														{getStatusText(post.status)}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<span><strong>Yazar:</strong> {post.author}</span>
													<span className="ml-4"><strong>Kategori:</strong> {post.category}</span>
													<span className="ml-4"><strong>Yayın:</strong> {post.publishedAt}</span>
												</div>
											</div>
										</div>

										<div className="grid md:grid-cols-5 gap-4 mb-4">
											<div className="text-center bg-blue-50 p-3 rounded">
												<div className="text-xl font-bold text-blue-600">{post.views.toLocaleString()}</div>
												<div className="text-sm text-blue-600">Görüntüleme</div>
											</div>
											<div className="text-center bg-green-50 p-3 rounded">
												<div className="text-xl font-bold text-green-600">{post.likes}</div>
												<div className="text-sm text-green-600">Beğeni</div>
											</div>
											<div className="text-center bg-yellow-50 p-3 rounded">
												<div className="text-xl font-bold text-yellow-600">{post.comments}</div>
												<div className="text-sm text-yellow-600">Yorum</div>
											</div>
											<div className="text-center bg-purple-50 p-3 rounded">
												<div className="text-xl font-bold text-purple-600">{post.shares}</div>
												<div className="text-sm text-purple-600">Paylaşım</div>
											</div>
											<div className="text-center bg-orange-50 p-3 rounded">
												<div className="text-xl font-bold text-orange-600">{post.avgRating}</div>
												<div className="text-sm text-orange-600">Ortalama Puan</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Görüntüle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Düzenle
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Analitik
											</button>
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Gizle
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm">
												Kaldır
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'rejected' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Reddedilen Yazılar</h3>
							
							<div className="space-y-4">
								{rejectedPosts.map((post) => (
									<div key={post.id} className="border rounded-lg p-6 bg-red-50">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<h4 className="font-semibold text-gray-900 text-lg">{post.title}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
														{getStatusText(post.status)}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<span><strong>Yazar:</strong> {post.author}</span>
													<span className="ml-4"><strong>Kategori:</strong> {post.category}</span>
													<span className="ml-4"><strong>Ret Tarihi:</strong> {post.rejectedAt}</span>
													<span className="ml-4"><strong>Moderatör:</strong> {post.moderator}</span>
												</div>
												<div className="bg-red-100 p-3 rounded border border-red-200">
													<p className="text-red-800 text-sm">
														<strong>Ret Nedeni:</strong> {post.rejectionReason}
													</p>
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Görüntüle
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Yeniden Değerlendir
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Yazara Mesaj
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm">
												Kalıcı Sil
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'scheduled' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Zamanlanmış Yazılar</h3>
							<div className="text-center py-12">
								<p className="text-gray-500">Henüz zamanlanmış yazı bulunmuyor.</p>
								<button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
									Yazı Zamanla
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⏳</span>
						<h3 className="text-lg font-semibold text-yellow-900">Hızlı İnceleme</h3>
					</div>
					<p className="text-yellow-700 mb-4">Bekleyen yazıları hızlıca incele ve onayla.</p>
					<button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
						İncelemeye Başla
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">İçerik Analizi</h3>
					</div>
					<p className="text-blue-700 mb-4">Blog performansı ve kalite analizi.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Görüntüle
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-green-900">AI Yardımcısı</h3>
					</div>
					<p className="text-green-700 mb-4">Otomatik moderasyon ve öneriler.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						AI Önerileri
					</button>
				</div>
			</div>
		</div>
	);
}
