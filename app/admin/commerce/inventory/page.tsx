"use client";

import { useState } from 'react';

export default function InventoryPage() {
	const [activeTab, setActiveTab] = useState('all');

	const inventory = [
		{
			id: 'PRD-001',
			name: 'Anime Figür - Naruto',
			sku: 'ANM-NAR-001',
			category: 'Figür & Koleksiyon',
			stock: 45,
			reserved: 8,
			available: 37,
			reorderLevel: 10,
			cost: '₺89.50',
			price: '₺149.90',
			status: 'Stokta'
		},
		{
			id: 'PRD-002',
			name: 'El Yapımı Seramik Vazo',
			sku: 'SRM-VAZ-002',
			category: 'Ev & Yaşam',
			stock: 3,
			reserved: 2,
			available: 1,
			reorderLevel: 5,
			cost: '₺125.00',
			price: '₺249.90',
			status: 'Düşük Stok'
		},
		{
			id: 'PRD-003',
			name: 'Vintage Poster Seti',
			sku: 'PST-VNT-003',
			category: 'Sanat & Hobi',
			stock: 0,
			reserved: 0,
			available: 0,
			reorderLevel: 15,
			cost: '₺45.00',
			price: '₺89.90',
			status: 'Tükendi'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Stokta': return 'bg-green-100 text-green-800';
			case 'Düşük Stok': return 'bg-yellow-100 text-yellow-800';
			case 'Tükendi': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredInventory = inventory.filter(item => {
		if (activeTab === 'all') return true;
		if (activeTab === 'in-stock') return item.status === 'Stokta';
		if (activeTab === 'low-stock') return item.status === 'Düşük Stok';
		if (activeTab === 'out-of-stock') return item.status === 'Tükendi';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Envanter Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Stok Girişi
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Yeni Ürün
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">1,247</div>
					<div className="text-sm text-gray-600">Toplam Ürün</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">₺456,780</div>
					<div className="text-sm text-gray-600">Stok Değeri</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">23</div>
					<div className="text-sm text-gray-600">Düşük Stok</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">8</div>
					<div className="text-sm text-gray-600">Tükenen</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">156</div>
					<div className="text-sm text-gray-600">Rezerve</div>
				</div>
			</div>

			{/* Stock Alerts */}
			<div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
				<div className="flex items-center">
					<span className="text-2xl mr-3">⚠️</span>
					<div>
						<h3 className="font-semibold text-yellow-900">Stok Uyarıları</h3>
						<p className="text-yellow-700 text-sm">23 ürün minimum stok seviyesinin altında, 8 ürün tükendi.</p>
					</div>
					<button className="ml-auto bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
						Sipariş Ver
					</button>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: inventory.length },
							{ key: 'in-stock', label: 'Stokta', count: inventory.filter(i => i.status === 'Stokta').length },
							{ key: 'low-stock', label: 'Düşük Stok', count: inventory.filter(i => i.status === 'Düşük Stok').length },
							{ key: 'out-of-stock', label: 'Tükendi', count: inventory.filter(i => i.status === 'Tükendi').length }
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

				{/* Inventory Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Ürün
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									SKU
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kategori
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Stok
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Rezerve
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Mevcut
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
							{filteredInventory.map((item) => (
								<tr key={item.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">{item.name}</div>
											<div className="text-sm text-gray-500">{item.id}</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{item.sku}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{item.category}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
										{item.stock}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
										{item.reserved}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
										{item.available}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
											{item.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Düzenle
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Stok Gir
										</button>
										<button className="text-blue-600 hover:text-blue-900">
											Hareket
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📦</span>
						<h3 className="text-lg font-semibold text-blue-900">Stok Girişi</h3>
					</div>
					<p className="text-blue-700 mb-4">Yeni stok girişi kaydet.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-green-900">Stok Sayımı</h3>
					</div>
					<p className="text-green-700 mb-4">Fiziki stok sayımı başlat.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-purple-900">Stok Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı stok analizi.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔄</span>
						<h3 className="text-lg font-semibold text-orange-900">Otomatik Sipariş</h3>
					</div>
					<p className="text-orange-700 mb-4">Minimum stok kuralları.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Ayarla
					</button>
				</div>
			</div>
		</div>
	)
}
