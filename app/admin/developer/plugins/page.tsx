"use client";

import { useState } from 'react';

export default function PluginsPage() {
	const [activeTab, setActiveTab] = useState('installed');

	const plugins = [
		{
			id: 'PLG-001',
			name: 'Advanced Analytics',
			description: 'Gelişmiş analitik ve raporlama özellikleri',
			version: '2.1.4',
			author: 'TDC Team',
			category: 'Analytics',
			status: 'Aktif',
			lastUpdated: '2024-01-15',
			downloads: 1247,
			rating: 4.8,
			size: '2.4 MB'
		},
		{
			id: 'PLG-002',
			name: 'SEO Optimizer',
			description: 'Otomatik SEO optimizasyonu ve meta tag yönetimi',
			version: '1.8.2',
			author: 'SEO Pro',
			category: 'SEO',
			status: 'Aktif',
			lastUpdated: '2024-01-10',
			downloads: 892,
			rating: 4.6,
			size: '1.8 MB'
		},
		{
			id: 'PLG-003',
			name: 'Social Media Integration',
			description: 'Sosyal medya platformları ile entegrasyon',
			version: '3.0.1',
			author: 'Social Connect',
			category: 'Social',
			status: 'Pasif',
			lastUpdated: '2024-01-05',
			downloads: 654,
			rating: 4.2,
			size: '3.1 MB'
		}
	];

	const availablePlugins = [
		{
			id: 'PLG-NEW-001',
			name: 'AI Content Generator',
			description: 'Yapay zeka ile otomatik içerik üretimi',
			version: '1.0.0',
			author: 'AI Solutions',
			category: 'AI',
			price: '₺299/ay',
			rating: 4.9,
			downloads: 2341
		},
		{
			id: 'PLG-NEW-002',
			name: 'Multi-Currency Support',
			description: 'Çoklu para birimi desteği ve döviz kurları',
			version: '2.5.0',
			author: 'Currency Pro',
			category: 'Commerce',
			price: 'Ücretsiz',
			rating: 4.7,
			downloads: 1876
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Pasif': return 'bg-gray-100 text-gray-800';
			case 'Güncelleme Gerekli': return 'bg-yellow-100 text-yellow-800';
			case 'Hata': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'Analytics': return 'bg-blue-100 text-blue-800';
			case 'SEO': return 'bg-green-100 text-green-800';
			case 'Social': return 'bg-purple-100 text-purple-800';
			case 'AI': return 'bg-pink-100 text-pink-800';
			case 'Commerce': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
				★
			</span>
		));
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Plugin Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Plugin Yükle
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Plugin Geliştir
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{plugins.length}</div>
					<div className="text-sm text-gray-600">Yüklü Plugin</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">{plugins.filter(p => p.status === 'Aktif').length}</div>
					<div className="text-sm text-gray-600">Aktif Plugin</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">2</div>
					<div className="text-sm text-gray-600">Güncelleme Mevcut</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">7.3 MB</div>
					<div className="text-sm text-gray-600">Toplam Boyut</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'installed', label: 'Yüklü Pluginler', count: plugins.length },
							{ key: 'available', label: 'Mevcut Pluginler', count: availablePlugins.length },
							{ key: 'updates', label: 'Güncellemeler', count: 2 }
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
					{activeTab === 'installed' && (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{plugins.map((plugin) => (
								<div key={plugin.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 mb-1">{plugin.name}</h3>
											<p className="text-sm text-gray-600 mb-2">{plugin.description}</p>
											<div className="flex items-center space-x-2 mb-2">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(plugin.category)}`}>
													{plugin.category}
												</span>
												<span className="text-xs text-gray-500">v{plugin.version}</span>
											</div>
										</div>
									</div>
									
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center space-x-1">
											{renderStars(plugin.rating)}
											<span className="text-sm text-gray-600 ml-1">({plugin.rating})</span>
										</div>
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plugin.status)}`}>
											{plugin.status}
										</span>
									</div>

									<div className="text-xs text-gray-500 mb-4">
										<div>Yazar: {plugin.author}</div>
										<div>Boyut: {plugin.size}</div>
										<div>Son Güncelleme: {plugin.lastUpdated}</div>
									</div>

									<div className="flex space-x-2">
										{plugin.status === 'Aktif' ? (
											<button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 text-sm">
												Devre Dışı Bırak
											</button>
										) : (
											<button className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-sm">
												Etkinleştir
											</button>
										)}
										<button className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 text-sm">
											Ayarlar
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					{activeTab === 'available' && (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{availablePlugins.map((plugin) => (
								<div key={plugin.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 mb-1">{plugin.name}</h3>
											<p className="text-sm text-gray-600 mb-2">{plugin.description}</p>
											<div className="flex items-center space-x-2 mb-2">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(plugin.category)}`}>
													{plugin.category}
												</span>
												<span className="text-xs text-gray-500">v{plugin.version}</span>
											</div>
										</div>
									</div>
									
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center space-x-1">
											{renderStars(plugin.rating)}
											<span className="text-sm text-gray-600 ml-1">({plugin.rating})</span>
										</div>
										<span className="text-sm font-semibold text-green-600">{plugin.price}</span>
									</div>

									<div className="text-xs text-gray-500 mb-4">
										<div>Yazar: {plugin.author}</div>
										<div>İndirme: {plugin.downloads.toLocaleString()}</div>
									</div>

									<div className="flex space-x-2">
										<button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-sm">
											Yükle
										</button>
										<button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 text-sm">
											Önizle
										</button>
									</div>
								</div>
							))}
						</div>
					)}

					{activeTab === 'updates' && (
						<div className="space-y-4">
							<div className="border rounded-lg p-6">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900 mb-1">Advanced Analytics</h3>
										<p className="text-sm text-gray-600 mb-2">v2.1.4 → v2.2.0 güncelleme mevcut</p>
										<div className="text-xs text-gray-500">
											• Yeni dashboard widget'ları<br/>
											• Performans iyileştirmeleri<br/>
											• Bug düzeltmeleri
										</div>
									</div>
									<div className="flex space-x-2">
										<button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
											Güncelle
										</button>
										<button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 text-sm">
											Detaylar
										</button>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-6">
								<div className="flex items-center justify-between">
									<div className="flex-1">
										<h3 className="text-lg font-semibold text-gray-900 mb-1">SEO Optimizer</h3>
										<p className="text-sm text-gray-600 mb-2">v1.8.2 → v1.9.0 güncelleme mevcut</p>
										<div className="text-xs text-gray-500">
											• Yeni SEO analiz araçları<br/>
											• Google Core Web Vitals desteği<br/>
											• Schema markup iyileştirmeleri
										</div>
									</div>
									<div className="flex space-x-2">
										<button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
											Güncelle
										</button>
										<button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 text-sm">
											Detaylar
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Plugin Development */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Plugin Geliştirme</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-semibold text-gray-900 mb-2">Yeni Plugin Oluştur</h4>
						<p className="text-gray-600 text-sm mb-4">
							Kendi plugin'inizi geliştirmek için geliştirme araçlarımızı kullanın.
						</p>
						<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
							Plugin Oluştur
						</button>
					</div>
					<div>
						<h4 className="font-semibold text-gray-900 mb-2">Geliştirici Dokümantasyonu</h4>
						<p className="text-gray-600 text-sm mb-4">
							Plugin API'si ve geliştirme rehberlerine erişin.
						</p>
						<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
							Dokümantasyon
						</button>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📦</span>
						<h3 className="text-lg font-semibold text-blue-900">Plugin Yükle</h3>
					</div>
					<p className="text-blue-700 mb-4">Yeni plugin yükle veya ZIP dosyasından içe aktar.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Yükle
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔄</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Güncelleme</h3>
					</div>
					<p className="text-green-700 mb-4">Tüm plugin'leri tek seferde güncelle.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Güncelle
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-purple-900">Plugin Ayarları</h3>
					</div>
					<p className="text-purple-700 mb-4">Genel plugin ayarlarını yönet.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Ayarlar
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🛠️</span>
						<h3 className="text-lg font-semibold text-orange-900">Geliştir</h3>
					</div>
					<p className="text-orange-700 mb-4">Kendi plugin'inizi oluşturun.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Başla
					</button>
				</div>
			</div>
		</div>
	)
}
