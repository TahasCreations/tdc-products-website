"use client";


// Client components are dynamic by default
import { useState, Suspense } from 'react';

export default function AdsPage() {
	const [activeTab, setActiveTab] = useState('all');

	const ads = [
		{
			id: 'AD-001',
			name: 'Yeni Yıl Kampanyası',
			platform: 'Google Ads',
			type: 'Arama',
			budget: '₺500/gün',
			spent: '₺12,450',
			impressions: 45680,
			clicks: 1234,
			ctr: '2.7%',
			cpc: '₺10.08',
			conversions: 89,
			status: 'Aktif'
		},
		{
			id: 'AD-002',
			name: 'Figür Koleksiyonu',
			platform: 'Facebook',
			type: 'Display',
			budget: '₺300/gün',
			spent: '₺8,900',
			impressions: 78900,
			clicks: 890,
			ctr: '1.1%',
			cpc: '₺10.00',
			conversions: 45,
			status: 'Aktif'
		},
		{
			id: 'AD-003',
			name: 'Retargeting Kampanyası',
			platform: 'Instagram',
			type: 'Video',
			budget: '₺200/gün',
			spent: '₺5,600',
			impressions: 34500,
			clicks: 567,
			ctr: '1.6%',
			cpc: '₺9.88',
			conversions: 23,
			status: 'Duraklatıldı'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Duraklatıldı': return 'bg-yellow-100 text-yellow-800';
			case 'Tamamlandı': return 'bg-blue-100 text-blue-800';
			case 'Reddedildi': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPlatformColor = (platform: string) => {
		switch (platform) {
			case 'Google Ads': return 'bg-blue-100 text-blue-800';
			case 'Facebook': return 'bg-blue-100 text-blue-800';
			case 'Instagram': return 'bg-pink-100 text-pink-800';
			case 'YouTube': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredAds = ads.filter(ad => {
		if (activeTab === 'all') return true;
		if (activeTab === 'active') return ad.status === 'Aktif';
		if (activeTab === 'paused') return ad.status === 'Duraklatıldı';
		if (activeTab === 'completed') return ad.status === 'Tamamlandı';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Reklam Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Reklam
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Toplu İşlem
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">₺26,950</div>
					<div className="text-sm text-gray-600">Toplam Harcama</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">159,080</div>
					<div className="text-sm text-gray-600">Toplam Gösterim</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">2,691</div>
					<div className="text-sm text-gray-600">Toplam Tıklama</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">157</div>
					<div className="text-sm text-gray-600">Dönüşüm</div>
				</div>
			</div>

			{/* Performance Chart */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Reklam Performansı (Son 30 Gün)</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">Performans grafiği burada görünecek</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: ads.length },
							{ key: 'active', label: 'Aktif', count: ads.filter(a => a.status === 'Aktif').length },
							{ key: 'paused', label: 'Duraklatıldı', count: ads.filter(a => a.status === 'Duraklatıldı').length },
							{ key: 'completed', label: 'Tamamlandı', count: ads.filter(a => a.status === 'Tamamlandı').length }
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

				{/* Ads Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Reklam
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Platform
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Bütçe
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Harcama
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									CTR
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									CPC
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Dönüşüm
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Durum
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredAds.map((ad) => (
								<tr key={ad.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">{ad.name}</div>
											<div className="text-sm text-gray-500">{ad.type}</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlatformColor(ad.platform)}`}>
											{ad.platform}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{ad.budget}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
										{ad.spent}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{ad.ctr}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{ad.cpc}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
										{ad.conversions}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ad.status)}`}>
											{ad.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Düzenle
										</button>
										{ad.status === 'Aktif' ? (
											<button className="text-yellow-600 hover:text-yellow-900 mr-3">
												Duraklat
											</button>
										) : (
											<button className="text-green-600 hover:text-green-900 mr-3">
												Başlat
											</button>
										)}
										<button className="text-blue-600 hover:text-blue-900">
											Rapor
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Create Templates */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-blue-900">Arama Reklamı</h3>
					</div>
					<p className="text-blue-700 mb-4">Google Ads arama kampanyası oluştur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📱</span>
						<h3 className="text-lg font-semibold text-purple-900">Sosyal Medya</h3>
					</div>
					<p className="text-purple-700 mb-4">Facebook/Instagram reklamı oluştur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📺</span>
						<h3 className="text-lg font-semibold text-red-900">Video Reklamı</h3>
					</div>
					<p className="text-red-700 mb-4">YouTube video kampanyası oluştur.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-green-900">Retargeting</h3>
					</div>
					<p className="text-green-700 mb-4">Yeniden hedefleme kampanyası oluştur.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Oluştur
					</button>
				</div>
			</div>
		</div>
	)
}
