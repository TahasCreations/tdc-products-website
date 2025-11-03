"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function BlogControlPage() {
	const [activeTab, setActiveTab] = useState('all');
	const [blogPosts, setBlogPosts] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Yayında': return 'bg-green-100 text-green-800';
			case 'Taslak': return 'bg-gray-100 text-gray-800';
			case 'İncelemede': return 'bg-yellow-100 text-yellow-800';
			case 'Programlandı': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'Koleksiyon': return 'bg-purple-100 text-purple-800';
			case 'Rehber': return 'bg-blue-100 text-blue-800';
			case 'Trend': return 'bg-pink-100 text-pink-800';
			case 'Haber': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredPosts = blogPosts.filter(post => {
		if (activeTab === 'all') return true;
		if (activeTab === 'published') return post.status === 'Yayında';
		if (activeTab === 'draft') return post.status === 'Taslak';
		if (activeTab === 'review') return post.status === 'İncelemede';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Blog Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Yazı
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Kategori Yönet
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">0</div>
					<div className="text-sm text-gray-600">Toplam Yazı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">0</div>
					<div className="text-sm text-gray-600">Yayında</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">0</div>
					<div className="text-sm text-gray-600">İncelemede</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">0</div>
					<div className="text-sm text-gray-600">Toplam Görüntülenme</div>
				</div>
			</div>

			{/* Blog Analytics */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Blog Performansı (Son 30 Gün)</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">Blog performans grafiği burada görünecek</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: blogPosts.length },
							{ key: 'published', label: 'Yayında', count: blogPosts.filter(p => p.status === 'Yayında').length },
							{ key: 'draft', label: 'Taslak', count: blogPosts.filter(p => p.status === 'Taslak').length },
							{ key: 'review', label: 'İncelemede', count: blogPosts.filter(p => p.status === 'İncelemede').length }
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

				{/* Blog Posts Table */}
				<div className="overflow-x-auto">
					{filteredPosts.length === 0 ? (
						<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
							<div className="text-4xl mb-4">📝</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Blog Yazısı Yok</h3>
							<p className="text-gray-600 mb-4">İlk blog yazınızı oluşturarak başlayın.</p>
							<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
								İlk Yazıyı Oluştur
							</button>
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Yazı
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Yazar
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Kategori
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Durum
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Performans
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tarih
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										İşlemler
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredPosts.map((post) => (
								<tr key={post.id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div className="flex items-center">
											{post.featured && (
												<span className="text-yellow-500 mr-2">⭐</span>
											)}
											<div>
												<div className="text-sm font-medium text-gray-900">
													{post.title}
												</div>
												<div className="text-sm text-gray-500">{post.id}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{post.author}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
											{post.category}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
											{post.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div className="flex space-x-4">
											<span>👁️ {post.views}</span>
											<span>💬 {post.comments}</span>
											<span>❤️ {post.likes}</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{post.publishDate || 'Henüz yayınlanmadı'}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Düzenle
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Görüntüle
										</button>
										{post.status === 'Taslak' && (
											<button className="text-blue-600 hover:text-blue-900 mr-3">
												Yayınla
											</button>
										)}
										<button className="text-red-600 hover:text-red-900">
											Sil
										</button>
									</td>
								</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">✍️</span>
						<h3 className="text-lg font-semibold text-green-900">Yeni Yazı</h3>
					</div>
					<p className="text-green-700 mb-4">Blog yazısı oluştur ve yayınla.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📂</span>
						<h3 className="text-lg font-semibold text-blue-900">Kategori Yönet</h3>
					</div>
					<p className="text-blue-700 mb-4">Blog kategorilerini düzenle.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Yönet
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Blog Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı blog performans raporu.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-orange-900">Blog Ayarları</h3>
					</div>
					<p className="text-orange-700 mb-4">Blog genel ayarlarını düzenle.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Ayarla
					</button>
				</div>
			</div>
		</div>
	)
}
