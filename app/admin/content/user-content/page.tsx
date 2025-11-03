"use client";

import { useState } from 'react';

export default function UserContentPage() {
	const [activeTab, setActiveTab] = useState('reviews');

	const [userReviews] = useState<any[]>([]);

	const [userComments] = useState<any[]>([]);

	const [userPhotos] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Onaylandı': return 'bg-green-100 text-green-800';
			case 'İncelemede': return 'bg-yellow-100 text-yellow-800';
			case 'Reddedildi': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
				★
			</span>
		));
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Kullanıcı İçerik Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Onay
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Moderasyon Kuralları
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{userReviews.length + userComments.length + userPhotos.length}</div>
					<div className="text-sm text-gray-600">Toplam İçerik</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">
						{[...userReviews, ...userComments, ...userPhotos].filter(item => item.status === 'İncelemede').length}
					</div>
					<div className="text-sm text-gray-600">İncelemede</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">
						{[...userReviews, ...userComments, ...userPhotos].filter(item => item.status === 'Onaylandı').length}
					</div>
					<div className="text-sm text-gray-600">Onaylandı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">0</div>
					<div className="text-sm text-gray-600">Şikayet Edildi</div>
				</div>
			</div>

			{/* Content Moderation Stats */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Moderasyon İstatistikleri (Son 30 Gün)</h3>
				<div className="grid md:grid-cols-4 gap-4">
					<div className="text-center p-4 bg-blue-50 rounded-lg">
						<div className="text-2xl font-bold text-blue-600">0</div>
						<div className="text-sm text-blue-700">Yeni İnceleme</div>
					</div>
					<div className="text-center p-4 bg-green-50 rounded-lg">
						<div className="text-2xl font-bold text-green-600">0</div>
						<div className="text-sm text-green-700">Yeni Yorum</div>
					</div>
					<div className="text-center p-4 bg-purple-50 rounded-lg">
						<div className="text-2xl font-bold text-purple-600">0</div>
						<div className="text-sm text-purple-700">Yeni Fotoğraf</div>
					</div>
					<div className="text-center p-4 bg-orange-50 rounded-lg">
						<div className="text-2xl font-bold text-orange-600">0%</div>
						<div className="text-sm text-orange-700">Onay Oranı</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'reviews', label: 'Ürün İncelemeleri', count: userReviews.length },
							{ key: 'comments', label: 'Blog Yorumları', count: userComments.length },
							{ key: 'photos', label: 'Kullanıcı Fotoğrafları', count: userPhotos.length }
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`py-4 px-1 border-b-2 font-medium text-sm ${
									activeTab === tab.key
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								{tab.label} ({tab.count})
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'reviews' && (
						userReviews.length === 0 ? (
							<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
								<div className="text-4xl mb-4">⭐</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz İnceleme Yok</h3>
								<p className="text-gray-600">Kullanıcı incelemeleri burada görünecek.</p>
							</div>
						) : (
							<div className="space-y-4">
								{userReviews.map((review) => (
								<div key={review.id} className="border rounded-lg p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h4 className="font-semibold text-gray-900">{review.title}</h4>
												<div className="flex items-center">
													{renderStars(review.rating)}
												</div>
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
													{review.status}
												</span>
											</div>
											<div className="text-sm text-gray-600 mb-2">
												<span className="font-medium">{review.user}</span> • {review.product} • {review.date}
											</div>
											<p className="text-gray-700 mb-3">{review.content}</p>
											<div className="flex items-center space-x-4 text-sm text-gray-500">
												<span>👍 {review.helpful} faydalı</span>
												{review.reported > 0 && (
													<span className="text-red-600">🚨 {review.reported} şikayet</span>
												)}
											</div>
										</div>
									</div>
									<div className="flex space-x-2">
										{review.status === 'İncelemede' && (
											<>
												<button className="text-green-600 hover:text-green-900 text-sm font-medium">
													Onayla
												</button>
												<button className="text-red-600 hover:text-red-900 text-sm font-medium">
													Reddet
												</button>
											</>
										)}
										<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
											Düzenle
										</button>
										<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
											Yanıtla
										</button>
									</div>
								</div>
							))}
							</div>
						)
					)}

					{activeTab === 'comments' && (
						userComments.length === 0 ? (
							<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
								<div className="text-4xl mb-4">💬</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Yorum Yok</h3>
								<p className="text-gray-600">Blog yorumları burada görünecek.</p>
							</div>
						) : (
							<div className="space-y-4">
								{userComments.map((comment) => (
								<div key={comment.id} className="border rounded-lg p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h4 className="font-semibold text-gray-900">{comment.user}</h4>
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(comment.status)}`}>
													{comment.status}
												</span>
											</div>
											<div className="text-sm text-gray-600 mb-2">
												{comment.post} • {comment.date}
											</div>
											<p className="text-gray-700 mb-3">{comment.content}</p>
											<div className="text-sm text-gray-500">
												💬 {comment.replies} yanıt
											</div>
										</div>
									</div>
									<div className="flex space-x-2">
										{comment.status === 'İncelemede' && (
											<>
												<button className="text-green-600 hover:text-green-900 text-sm font-medium">
													Onayla
												</button>
												<button className="text-red-600 hover:text-red-900 text-sm font-medium">
													Reddet
												</button>
											</>
										)}
										<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
											Düzenle
										</button>
										<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
											Yanıtla
										</button>
									</div>
								</div>
							))}
							</div>
						)
					)}

					{activeTab === 'photos' && (
						userPhotos.length === 0 ? (
							<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
								<div className="text-4xl mb-4">📷</div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Fotoğraf Yok</h3>
								<p className="text-gray-600">Kullanıcı fotoğrafları burada görünecek.</p>
							</div>
						) : (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{userPhotos.map((photo) => (
								<div key={photo.id} className="border rounded-lg p-4">
									<div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
										<span className="text-gray-500">📷 Kullanıcı Fotoğrafı</span>
									</div>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<h4 className="font-semibold text-gray-900">{photo.user}</h4>
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(photo.status)}`}>
												{photo.status}
											</span>
										</div>
										<p className="text-sm text-gray-600">{photo.product}</p>
										<p className="text-gray-700">{photo.description}</p>
										<div className="flex items-center justify-between text-sm text-gray-500">
											<span>{photo.date}</span>
											<span>❤️ {photo.likes}</span>
										</div>
										<div className="flex space-x-2 pt-2">
											{photo.status === 'İncelemede' && (
												<>
													<button className="flex-1 text-green-600 hover:text-green-900 text-sm font-medium">
														Onayla
													</button>
													<button className="flex-1 text-red-600 hover:text-red-900 text-sm font-medium">
														Reddet
													</button>
												</>
											)}
										</div>
									</div>
								</div>
							))}
							</div>
						)
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">✅</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Onay</h3>
					</div>
					<p className="text-green-700 mb-4">Seçili içerikleri toplu onayla.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Onayla
					</button>
				</div>

				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚨</span>
						<h3 className="text-lg font-semibold text-red-900">Şikayet Yönetimi</h3>
					</div>
					<p className="text-red-700 mb-4">Şikayet edilen içerikleri incele.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						İncele
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-blue-900">Moderasyon Kuralları</h3>
					</div>
					<p className="text-blue-700 mb-4">Otomatik moderasyon ayarları.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Ayarla
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">İçerik Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">Kullanıcı içerik istatistikleri.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Et
					</button>
				</div>
			</div>
		</div>
	)
}
