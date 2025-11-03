"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

interface InventoryItem {
	id: string;
	name: string;
	sku: string;
	category: string;
	stock: number;
	reserved: number;
	available: number;
	reorderLevel: number;
	cost: string;
	price: string;
	status: string;
}

export default function InventoryPage() {
	const [activeTab, setActiveTab] = useState('all');
	const [inventory, setInventory] = useState<InventoryItem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchInventory();
	}, []);

	const fetchInventory = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/inventory');
			if (response.ok) {
				const data = await response.json();
				setInventory(data.inventory || []);
			}
		} catch (error) {
			console.error('Envanter yüklenirken hata:', error);
		} finally {
			setLoading(false);
		}
	};

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

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]"></div>
			</div>
		);
	}

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
					<div className="text-lg font-semibold text-blue-600">0</div>
					<div className="text-sm text-gray-600">Toplam Ürün</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">₺0</div>
					<div className="text-sm text-gray-600">Stok Değeri</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">0</div>
					<div className="text-sm text-gray-600">Düşük Stok</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">0</div>
					<div className="text-sm text-gray-600">Tükenen</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">0</div>
					<div className="text-sm text-gray-600">Rezerve</div>
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

				{/* Inventory Table or Empty State */}
				{filteredInventory.length === 0 ? (
					<div className="p-12 text-center">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<Package className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Henüz Ürün Yok
						</h3>
						<p className="text-gray-600 text-sm max-w-md mx-auto mb-4">
							Envanter takibi için ürün ekleyin
						</p>
						<button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
							İlk Ürünü Ekle
						</button>
					</div>
				) : (
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
				)}
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
