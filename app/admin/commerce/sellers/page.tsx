"use client";

import { useState } from 'react';

export default function SellersPage() {
	const [activeTab, setActiveTab] = useState('all');

	const sellers = [
		{
			id: 'SELL-001',
			name: 'Ahmet Yılmaz',
			company: 'Yılmaz Elektronik',
			email: 'ahmet@yilmazelektronik.com',
			phone: '+90 532 123 4567',
			status: 'Aktif',
			joinDate: '2023-05-15',
			totalSales: '₺45,680',
			commission: '₺3,254',
			products: 23,
			rating: 4.8
		},
		{
			id: 'SELL-002',
			name: 'Fatma Kaya',
			company: 'Kaya Tasarım',
			email: 'fatma@kayatasarim.com',
			phone: '+90 533 987 6543',
			status: 'Beklemede',
			joinDate: '2024-01-10',
			totalSales: '₺12,340',
			commission: '₺864',
			products: 8,
			rating: 4.5
		},
		{
			id: 'SELL-003',
			name: 'Mehmet Demir',
			company: 'Demir Hobi',
			email: 'mehmet@demirhobi.com',
			phone: '+90 534 555 7890',
			status: 'Askıda',
			joinDate: '2023-11-20',
			totalSales: '₺78,920',
			commission: '₺5,524',
			products: 45,
			rating: 4.2
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Beklemede': return 'bg-yellow-100 text-yellow-800';
			case 'Askıda': return 'bg-red-100 text-red-800';
			case 'Pasif': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredSellers = sellers.filter(seller => {
		if (activeTab === 'all') return true;
		if (activeTab === 'active') return seller.status === 'Aktif';
		if (activeTab === 'pending') return seller.status === 'Beklemede';
		if (activeTab === 'suspended') return seller.status === 'Askıda';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Satıcı Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Satıcı
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Toplu İşlem
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">156</div>
					<div className="text-sm text-gray-600">Toplam Satıcı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">134</div>
					<div className="text-sm text-gray-600">Aktif Satıcı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">12</div>
					<div className="text-sm text-gray-600">Onay Bekleyen</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">₺1.2M</div>
					<div className="text-sm text-gray-600">Toplam Satış</div>
				</div>
			</div>

			{/* Performance Chart */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Satıcı Performansı (Son 30 Gün)</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">Performans grafiği burada görünecek</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: sellers.length },
							{ key: 'active', label: 'Aktif', count: sellers.filter(s => s.status === 'Aktif').length },
							{ key: 'pending', label: 'Beklemede', count: sellers.filter(s => s.status === 'Beklemede').length },
							{ key: 'suspended', label: 'Askıda', count: sellers.filter(s => s.status === 'Askıda').length }
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

				{/* Sellers Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Satıcı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İletişim
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Performans
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Satışlar
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
							{filteredSellers.map((seller) => (
								<tr key={seller.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
												<span className="text-indigo-600 font-semibold">
													{seller.name.split(' ').map(n => n[0]).join('')}
												</span>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-gray-900">{seller.name}</div>
												<div className="text-sm text-gray-500">{seller.company}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div>{seller.email}</div>
										<div className="text-gray-500">{seller.phone}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div className="flex items-center">
											<span className="text-yellow-500">★</span>
											<span className="ml-1">{seller.rating}</span>
										</div>
										<div className="text-gray-500">{seller.products} ürün</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div className="font-semibold">{seller.totalSales}</div>
										<div className="text-gray-500">Komisyon: {seller.commission}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(seller.status)}`}>
											{seller.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Görüntüle
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Onayla
										</button>
										<button className="text-red-600 hover:text-red-900">
											Askıya Al
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
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">👤</span>
						<h3 className="text-lg font-semibold text-green-900">Satıcı Onayı</h3>
					</div>
					<p className="text-green-700 mb-4">Bekleyen satıcı başvurularını onayla.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Onayla
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💰</span>
						<h3 className="text-lg font-semibold text-blue-900">Komisyon Ödemesi</h3>
					</div>
					<p className="text-blue-700 mb-4">Satıcı komisyonlarını öde.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Öde
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Performans Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Satıcı performans analizi.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📧</span>
						<h3 className="text-lg font-semibold text-orange-900">Toplu Mesaj</h3>
					</div>
					<p className="text-orange-700 mb-4">Satıcılara toplu bildirim gönder.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Gönder
					</button>
				</div>
			</div>
		</div>
	)
}
