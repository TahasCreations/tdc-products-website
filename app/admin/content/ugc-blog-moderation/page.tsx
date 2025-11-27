"use client";


// Client components are dynamic by default
import { useState, Suspense } from 'react';

export default function UGCBlogModerationPage() {
	const [activeTab, setActiveTab] = useState('pending');

	const [pendingPosts] = useState<any[]>([]);

	const [moderationQueue] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'approved': return 'bg-green-100 text-green-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			case 'flagged': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getAIScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-600';
		if (score >= 60) return 'text-yellow-600';
		return 'text-red-600';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">UGC Blog Moderasyonu</h1>
					<p className="text-gray-600">Kullanıcı içeriklerini yönetin ve moderasyon yapın</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Onayla
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Ayarlar
					</button>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid md:grid-cols-5 gap-4">
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">0</div>
					<div className="text-sm text-yellow-600">Bekleyen İçerik</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">0</div>
					<div className="text-sm text-green-600">Onaylandı</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">0</div>
					<div className="text-sm text-red-600">Reddedildi</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">0</div>
					<div className="text-sm text-orange-600">Bayraklandı</div>
				</div>
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">0%</div>
					<div className="text-sm text-blue-600">AI Doğruluk</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'pending', label: 'Bekleyen İçerikler', icon: '⏳', count: 0 },
							{ key: 'flagged', label: 'Bayraklandı', icon: '🚩', count: 0 },
							{ key: 'approved', label: 'Onaylandı', icon: '✅', count: 0 },
							{ key: 'rejected', label: 'Reddedildi', icon: '❌', count: 0 }
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
								<span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">{tab.count}</span>
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'pending' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Moderasyon Bekleyen İçerikler</h3>

							{pendingPosts.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">⏳</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Bekleyen İçerik Yok</h3>
									<p className="text-gray-600">Moderasyon bekleyen içerikler burada görünecek.</p>
								</div>
							) : (
								<div className="space-y-4">
									{pendingPosts.map((post) => (
									<div key={post.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{post.title}</h4>
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
														{post.status === 'pending' ? 'Bekliyor' : 
														 post.status === 'flagged' ? 'Bayraklandı' : post.status}
													</span>
													<div className={`text-sm font-medium ${getAIScoreColor(post.aiScore)}`}>
														AI Skor: {post.aiScore}%
													</div>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<strong>Yazar:</strong> {post.author} • 
													<strong> Gönderilme:</strong> {post.submittedAt}
												</div>
												<p className="text-gray-700 mb-3">{post.content}</p>
												<div className="flex flex-wrap gap-1 mb-3">
													{post.tags.map((tag, index) => (
														<span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
															#{tag}
														</span>
													))}
												</div>
												{post.flaggedTerms.length > 0 && (
													<div className="flex flex-wrap gap-1">
														{post.flaggedTerms.map((term, index) => (
															<span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
																⚠️ {term}
															</span>
														))}
													</div>
												)}
											</div>
										</div>
										<div className="flex space-x-3">
											<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
												Onayla
											</button>
											<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
												Reddet
											</button>
											<button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
												Düzenle
											</button>
											<button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
												Detay
											</button>
										</div>
									</div>
								))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'flagged' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Bayraklanmış İçerikler</h3>
							<div className="text-center text-gray-500">
								<p>Bayraklanmış içerikler burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'approved' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Onaylanmış İçerikler</h3>
							<div className="text-center text-gray-500">
								<p>Onaylanmış içerikler burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'rejected' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Reddedilmiş İçerikler</h3>
							<div className="text-center text-gray-500">
								<p>Reddedilmiş içerikler burada görünecek...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-yellow-900">AI Moderasyon</h3>
					</div>
					<p className="text-yellow-700 mb-4">Otomatik moderasyon ayarlarını yapılandırın.</p>
					<button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
						Ayarla
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Moderasyon Raporu</h3>
					</div>
					<p className="text-blue-700 mb-4">Detaylı moderasyon istatistikleri.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Rapor Al
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔧</span>
						<h3 className="text-lg font-semibold text-green-900">Filtre Kuralları</h3>
					</div>
					<p className="text-green-700 mb-4">İçerik filtreleme kurallarını yönetin.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yönet
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">👥</span>
						<h3 className="text-lg font-semibold text-purple-900">Moderatör Ekibi</h3>
					</div>
					<p className="text-purple-700 mb-4">Moderatör ekibini ve yetkileri yönetin.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Yönet
					</button>
				</div>
			</div>
		</div>
	);
}
