"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function UserGeneratedContentPage() {
	const [activeTab, setActiveTab] = useState('overview');

	const ugcStats = {
		totalContent: 0,
		pendingReview: 0,
		approved: 0,
		rejected: 0,
		userSubmissions: 0,
		avgRating: 0
	};

	const [contentTypes] = useState<any[]>([]);

	const [recentSubmissions] = useState<any[]>([]);

	const [topContributors] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'approved': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			case 'flagged': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'Ürün Yorumu': return 'bg-blue-100 text-blue-800';
			case 'Blog Yazısı': return 'bg-purple-100 text-purple-800';
			case 'Ürün Resmi': return 'bg-green-100 text-green-800';
			case 'Video Review': return 'bg-red-100 text-red-800';
			case 'Q&A': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Kullanıcı Üretimi İçerikler</h1>
					<p className="text-gray-600">UGC yönetimi ve topluluk katkıları</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Kampanya Oluştur
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Ayarlar
					</button>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid md:grid-cols-6 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{ugcStats.totalContent.toLocaleString()}</div>
					<div className="text-sm text-blue-600">Toplam İçerik</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{ugcStats.pendingReview}</div>
					<div className="text-sm text-yellow-600">İnceleme Bekliyor</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{ugcStats.approved.toLocaleString()}</div>
					<div className="text-sm text-green-600">Onaylandı</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{ugcStats.rejected}</div>
					<div className="text-sm text-red-600">Reddedildi</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{ugcStats.userSubmissions}</div>
					<div className="text-sm text-purple-600">Bu Hafta</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{ugcStats.avgRating}</div>
					<div className="text-sm text-orange-600">Ortalama Puan</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'submissions', label: 'Son Gönderimler', icon: '📝' },
							{ key: 'contributors', label: 'Top Katkıcılar', icon: '👥' },
							{ key: 'campaigns', label: 'UGC Kampanyaları', icon: '🎯' },
							{ key: 'analytics', label: 'Analitik', icon: '📈' }
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
							<h3 className="text-lg font-semibold text-gray-900">İçerik Türleri Dağılımı</h3>

							{contentTypes.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">📊</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz İçerik Yok</h3>
									<p className="text-gray-600">Kullanıcı içerikleri burada görünecek.</p>
								</div>
							) : (
								<div className="space-y-4">
									{contentTypes.map((item, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center space-x-3">
												<span className={`px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(item.type)}`}>
													{item.type}
												</span>
												<h4 className="font-semibold text-gray-900">{item.count} içerik</h4>
											</div>
											<div className="text-sm text-gray-600">
												Onay oranı: %{Math.round((item.approved / item.count) * 100)}
											</div>
										</div>

										<div className="grid md:grid-cols-4 gap-4">
											<div className="text-center">
												<div className="text-lg font-semibold text-green-600">{item.approved}</div>
												<div className="text-xs text-gray-600">Onaylandı</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-yellow-600">{item.pending}</div>
												<div className="text-xs text-gray-600">Bekliyor</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-red-600">{item.rejected}</div>
												<div className="text-xs text-gray-600">Reddedildi</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-blue-600">{item.count}</div>
												<div className="text-xs text-gray-600">Toplam</div>
											</div>
										</div>
									</div>
								))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'submissions' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Son Kullanıcı Gönderileri</h3>

							{recentSubmissions.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">📝</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Gönderi Yok</h3>
									<p className="text-gray-600">Kullanıcı gönderileri burada görünecek.</p>
								</div>
							) : (
								<div className="space-y-4">
									{recentSubmissions.map((submission) => (
									<div key={submission.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{submission.title}</h4>
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(submission.type)}`}>
														{submission.type}
													</span>
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(submission.status)}`}>
														{submission.status === 'pending' ? 'Bekliyor' : 
														 submission.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-2">
													<strong>Yazar:</strong> {submission.author} • 
													<strong> Gönderim:</strong> {submission.submittedAt}
													{submission.product && (
														<><strong> • Ürün:</strong> {submission.product}</>
													)}
												</div>
												<p className="text-gray-700 mb-3">{submission.content}</p>
												<div className="flex items-center space-x-4 text-sm text-gray-500">
													<span>👍 {submission.likes} beğeni</span>
													{submission.reports > 0 && (
														<span className="text-red-600">🚩 {submission.reports} şikayet</span>
													)}
													{submission.rating && (
														<span>⭐ {submission.rating}/5</span>
													)}
												</div>
											</div>
										</div>

										<div className="flex space-x-3">
											{submission.status === 'pending' && (
												<>
													<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
														Onayla
													</button>
													<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
														Reddet
													</button>
												</>
											)}
											<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
												Detay
											</button>
										<button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
											Kullanıcı Profili
										</button>
									</div>
								</div>
							))}
							</div>
						)}
					</div>
				)}

				{activeTab === 'contributors' && (
					<div className="space-y-6">
						<h3 className="text-lg font-semibold text-gray-900">En Aktif Katkıcılar</h3>

						{topContributors.length === 0 ? (
							<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
								<div className="text-4xl mb-4">👥</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Katkıcı Yok</h3>
								<p className="text-gray-600">En aktif katkıcılar burada görünecek.</p>
							</div>
						) : (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{topContributors.map((contributor, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-center space-x-3 mb-4">
											<div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
												{contributor.username.charAt(0).toUpperCase()}
											</div>
											<div>
												<h4 className="font-semibold text-gray-900">{contributor.username}</h4>
												<div className="text-sm text-gray-600">{contributor.totalSubmissions} katkı</div>
											</div>
										</div>

										<div className="space-y-2 mb-4">
											<div className="flex justify-between text-sm">
												<span className="text-gray-600">Onay Oranı:</span>
												<span className="font-medium text-green-600">%{contributor.approvalRate}</span>
											</div>
											<div className="flex justify-between text-sm">
												<span className="text-gray-600">Ortalama Puan:</span>
												<span className="font-medium text-blue-600">{contributor.avgRating}/5</span>
											</div>
										</div>

										<div className="space-y-1">
											{contributor.badges.map((badge, i) => (
												<span key={i} className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full mr-1">
													🏆 {badge}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{activeTab === 'campaigns' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">UGC Kampanyaları</h3>
							<div className="text-center text-gray-500">
								<p>UGC kampanya yönetimi geliştiriliyor...</p>
							</div>
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">UGC Analitikleri</h3>

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
										<h4 className="font-semibold text-gray-900">Zaman Bazlı Gönderimler</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Zaman bazlı gönderim grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-4 gap-6">
								<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
									<h4 className="font-semibold text-blue-900 mb-2">Engagement</h4>
									<div className="text-2xl font-bold text-blue-700">0%</div>
									<div className="text-sm text-blue-600">Ortalama etkileşim oranı</div>
								</div>
								<div className="bg-green-50 p-6 rounded-lg border border-green-200">
									<h4 className="font-semibold text-green-900 mb-2">Kalite Skoru</h4>
									<div className="text-2xl font-bold text-green-700">0/5</div>
									<div className="text-sm text-green-600">Ortalama içerik kalitesi</div>
								</div>
								<div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
									<h4 className="font-semibold text-purple-900 mb-2">Aktif Kullanıcı</h4>
									<div className="text-2xl font-bold text-purple-700">0</div>
									<div className="text-sm text-purple-600">Son 30 gün içinde</div>
								</div>
								<div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
									<h4 className="font-semibold text-orange-900 mb-2">Dönüşüm</h4>
									<div className="text-2xl font-bold text-orange-700">0%</div>
									<div className="text-sm text-orange-600">UGC'den satış dönüşümü</div>
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
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-blue-900">UGC Kampanyası</h3>
					</div>
					<p className="text-blue-700 mb-4">Yeni kullanıcı içerik kampanyası başlatın.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Kampanya Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🏆</span>
						<h3 className="text-lg font-semibold text-green-900">Ödül Sistemi</h3>
					</div>
					<p className="text-green-700 mb-4">Katkıcılar için ödül ve rozetler yönetin.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Ödülleri Yönet
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">İçerik Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı UGC performans raporu.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🛡️</span>
						<h3 className="text-lg font-semibold text-orange-900">Moderasyon</h3>
					</div>
					<p className="text-orange-700 mb-4">İçerik moderasyon kurallarını yönetin.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Kuralları Düzenle
					</button>
				</div>
			</div>
		</div>
	);
}
