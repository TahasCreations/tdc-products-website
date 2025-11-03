"use client";

import { useState } from 'react';

export default function PromotionsPage() {
	const [activeTab, setActiveTab] = useState('all');
	const [promotions, setPromotions] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Sona Erdi': return 'bg-gray-100 text-gray-800';
			case 'Duraklatıldı': return 'bg-yellow-100 text-yellow-800';
			case 'Taslak': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'Yüzde İndirim': return 'bg-purple-100 text-purple-800';
			case 'Kargo İndirimi': return 'bg-blue-100 text-blue-800';
			case 'Kategori İndirimi': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredPromotions = promotions.filter(promo => {
		if (activeTab === 'all') return true;
		if (activeTab === 'active') return promo.status === 'Aktif';
		if (activeTab === 'expired') return promo.status === 'Sona Erdi';
		if (activeTab === 'draft') return promo.status === 'Taslak';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Promosyon Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Promosyon
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Toplu İşlem
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">0</div>
					<div className="text-sm text-gray-600">Aktif Promosyon</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">₺0</div>
					<div className="text-sm text-gray-600">Toplam İndirim</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">0</div>
					<div className="text-sm text-gray-600">Kullanım Sayısı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">0%</div>
					<div className="text-sm text-gray-600">Dönüşüm Oranı</div>
				</div>
			</div>

			{/* Performance Chart */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Promosyon Performansı (Son 30 Gün)</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">Performans grafiği burada görünecek</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: promotions.length },
							{ key: 'active', label: 'Aktif', count: promotions.filter(p => p.status === 'Aktif').length },
							{ key: 'expired', label: 'Sona Erdi', count: promotions.filter(p => p.status === 'Sona Erdi').length },
							{ key: 'draft', label: 'Taslak', count: promotions.filter(p => p.status === 'Taslak').length }
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

				{/* Promotions Table */}
				<div className="overflow-x-auto">
					{filteredPromotions.length === 0 ? (
						<div className="text-center py-12 bg-gray-50">
							<div className="text-4xl mb-4">🎁</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Promosyon Yok</h3>
							<p className="text-gray-600 mb-4">İlk promosyonunuzu oluşturarak başlayın.</p>
							<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
								Yeni Promosyon Oluştur
							</button>
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Promosyon
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tip
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										İndirim
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Kod
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Kullanım
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
								{filteredPromotions.map((promo) => (
								<tr key={promo.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">{promo.name}</div>
											<div className="text-sm text-gray-500">{promo.startDate} - {promo.endDate}</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(promo.type)}`}>
											{promo.type}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
										{promo.discount}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
										{promo.code}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{promo.usageCount} / {promo.usageLimit}
										<div className="w-full bg-gray-200 rounded-full h-2 mt-1">
											<div 
												className="bg-blue-600 h-2 rounded-full" 
												style={{ width: `${(promo.usageCount / promo.usageLimit) * 100}%` }}
											></div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(promo.status)}`}>
											{promo.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Düzenle
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Kopyala
										</button>
										{promo.status === 'Aktif' && (
											<button className="text-yellow-600 hover:text-yellow-900 mr-3">
												Duraklat
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

			{/* Quick Create Templates */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">%</span>
						<h3 className="text-lg font-semibold text-purple-900">Yüzde İndirim</h3>
					</div>
					<p className="text-purple-700 mb-4">Belirli yüzde oranında indirim promosyonu oluştur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚚</span>
						<h3 className="text-lg font-semibold text-blue-900">Ücretsiz Kargo</h3>
					</div>
					<p className="text-blue-700 mb-4">Minimum tutarla ücretsiz kargo promosyonu.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-green-900">Kategori İndirimi</h3>
					</div>
					<p className="text-green-700 mb-4">Belirli kategorilerde özel indirim.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Oluştur
					</button>
				</div>
			</div>
		</div>
	)
}
