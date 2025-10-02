"use client";

import { useState } from 'react';

export default function AssetsPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [filterCategory, setFilterCategory] = useState('all');

	const assets = [
		{
			id: 'AST001',
			name: 'Ofis Mobilyaları',
			category: 'furniture',
			purchaseDate: '2022-01-15',
			cost: 50000,
			depreciation: 10000,
			currentValue: 40000,
			status: 'active'
		},
		{
			id: 'AST002',
			name: 'Bilgisayar Ekipmanları',
			category: 'electronics',
			purchaseDate: '2022-03-01',
			cost: 30000,
			depreciation: 12000,
			currentValue: 18000,
			status: 'active'
		},
		{
			id: 'AST003',
			name: 'Depo Raf Sistemi',
			category: 'furniture',
			purchaseDate: '2021-06-20',
			cost: 25000,
			depreciation: 15000,
			currentValue: 10000,
			status: 'active'
		}
	];

	const categories = [
		{ value: 'all', label: 'Tüm Kategoriler' },
		{ value: 'furniture', label: 'Mobilya' },
		{ value: 'electronics', label: 'Elektronik' },
		{ value: 'vehicles', label: 'Araçlar' },
		{ value: 'software', label: 'Yazılım' }
	];

	const filteredAssets = assets.filter(asset => {
		const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
							  asset.id.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = filterCategory === 'all' || asset.category === filterCategory;
		return matchesSearch && matchesCategory;
	});

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Sabit Kıymetler</h1>
					<p className="text-gray-600">Duran varlık yönetimi ve amortisman takibi</p>
				</div>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
					Yeni Kıymet Ekle
				</button>
			</div>

			{/* Summary Cards */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{formatCurrency(105000)}</div>
					<div className="text-sm text-blue-600">Toplam Maliyet</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{formatCurrency(68000)}</div>
					<div className="text-sm text-green-600">Mevcut Değer</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{formatCurrency(37000)}</div>
					<div className="text-sm text-red-600">Toplam Amortisman</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">3</div>
					<div className="text-sm text-purple-600">Aktif Kıymet</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg border flex flex-col md:flex-row gap-4">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Kıymet ara..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>
				<div>
					<select
						value={filterCategory}
						onChange={(e) => setFilterCategory(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						{categories.map(category => (
							<option key={category.value} value={category.value}>
								{category.label}
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Assets Table */}
			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kıymet Kodu
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kıymet Adı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kategori
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Alım Tarihi
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Maliyet
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Amortisman
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Mevcut Değer
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Durum
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredAssets.map((asset) => (
								<tr key={asset.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{asset.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{asset.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{categories.find(c => c.value === asset.category)?.label || asset.category}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{asset.purchaseDate}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{formatCurrency(asset.cost)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
										{formatCurrency(asset.depreciation)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
										{formatCurrency(asset.currentValue)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											asset.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
										}`}>
											{asset.status === 'active' ? 'Aktif' : 'Pasif'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Düzenle
										</button>
										<button className="text-red-600 hover:text-red-900">
											Sil
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Amortisman Raporu</h3>
					</div>
					<p className="text-blue-700 mb-4">Detaylı amortisman hesaplama raporu oluşturun.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Rapor Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📋</span>
						<h3 className="text-lg font-semibold text-green-900">Envanter Sayımı</h3>
					</div>
					<p className="text-green-700 mb-4">Fiziksel envanter sayımı başlatın.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Sayım Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-purple-900">Otomatik Amortisman</h3>
					</div>
					<p className="text-purple-700 mb-4">Aylık amortisman hesaplama otomasyonu.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Otomasyon Kur
					</button>
				</div>
			</div>
		</div>
	);
}
