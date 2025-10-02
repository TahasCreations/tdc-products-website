"use client";

import { useState } from 'react';

export default function ReturnsPage() {
	const [activeTab, setActiveTab] = useState('all');

	const returns = [
		{
			id: 'RET-2024-001',
			orderNo: '#12345',
			customer: 'Ahmet Yılmaz',
			product: 'Anime Figür - Naruto',
			reason: 'Hasarlı Ürün',
			requestDate: '2024-01-15',
			status: 'İnceleniyor',
			refundAmount: '₺149.90',
			images: 3
		},
		{
			id: 'RET-2024-002',
			orderNo: '#12346',
			customer: 'Fatma Kaya',
			product: 'El Yapımı Seramik Vazo',
			reason: 'Beğenmedi',
			requestDate: '2024-01-14',
			status: 'Onaylandı',
			refundAmount: '₺249.90',
			images: 2
		},
		{
			id: 'RET-2024-003',
			orderNo: '#12347',
			customer: 'Mehmet Demir',
			product: 'Vintage Poster Seti',
			reason: 'Yanlış Ürün',
			requestDate: '2024-01-13',
			status: 'Reddedildi',
			refundAmount: '₺89.90',
			images: 1
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'İnceleniyor': return 'bg-yellow-100 text-yellow-800';
			case 'Onaylandı': return 'bg-green-100 text-green-800';
			case 'Reddedildi': return 'bg-red-100 text-red-800';
			case 'İade Edildi': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getReasonColor = (reason: string) => {
		switch (reason) {
			case 'Hasarlı Ürün': return 'bg-red-100 text-red-800';
			case 'Yanlış Ürün': return 'bg-orange-100 text-orange-800';
			case 'Beğenmedi': return 'bg-blue-100 text-blue-800';
			case 'Geç Teslimat': return 'bg-purple-100 text-purple-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredReturns = returns.filter(ret => {
		if (activeTab === 'all') return true;
		if (activeTab === 'pending') return ret.status === 'İnceleniyor';
		if (activeTab === 'approved') return ret.status === 'Onaylandı';
		if (activeTab === 'rejected') return ret.status === 'Reddedildi';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">İade Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Onay
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						İade Raporu
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">89</div>
					<div className="text-sm text-gray-600">Toplam İade</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">23</div>
					<div className="text-sm text-gray-600">İnceleniyor</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">56</div>
					<div className="text-sm text-gray-600">Onaylandı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">₺12,450</div>
					<div className="text-sm text-gray-600">İade Tutarı</div>
				</div>
			</div>

			{/* Return Reasons Chart */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">İade Sebepleri</h3>
				<div className="grid md:grid-cols-4 gap-4">
					<div className="text-center p-4 bg-red-50 rounded-lg">
						<div className="text-2xl font-bold text-red-600">34%</div>
						<div className="text-sm text-red-700">Hasarlı Ürün</div>
					</div>
					<div className="text-center p-4 bg-orange-50 rounded-lg">
						<div className="text-2xl font-bold text-orange-600">28%</div>
						<div className="text-sm text-orange-700">Yanlış Ürün</div>
					</div>
					<div className="text-center p-4 bg-blue-50 rounded-lg">
						<div className="text-2xl font-bold text-blue-600">23%</div>
						<div className="text-sm text-blue-700">Beğenmedi</div>
					</div>
					<div className="text-center p-4 bg-purple-50 rounded-lg">
						<div className="text-2xl font-bold text-purple-600">15%</div>
						<div className="text-sm text-purple-700">Geç Teslimat</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: returns.length },
							{ key: 'pending', label: 'İnceleniyor', count: returns.filter(r => r.status === 'İnceleniyor').length },
							{ key: 'approved', label: 'Onaylandı', count: returns.filter(r => r.status === 'Onaylandı').length },
							{ key: 'rejected', label: 'Reddedildi', count: returns.filter(r => r.status === 'Reddedildi').length }
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

				{/* Returns Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İade No
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Müşteri
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Ürün
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Sebep
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tarih
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tutar
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
							{filteredReturns.map((ret) => (
								<tr key={ret.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900">{ret.id}</div>
										<div className="text-sm text-gray-500">{ret.orderNo}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{ret.customer}
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										<div className="max-w-xs truncate">{ret.product}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReasonColor(ret.reason)}`}>
											{ret.reason}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{ret.requestDate}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
										{ret.refundAmount}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ret.status)}`}>
											{ret.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Detay
										</button>
										{ret.status === 'İnceleniyor' && (
											<>
												<button className="text-green-600 hover:text-green-900 mr-3">
													Onayla
												</button>
												<button className="text-red-600 hover:text-red-900">
													Reddet
												</button>
											</>
										)}
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
						<span className="text-2xl mr-3">✅</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Onay</h3>
					</div>
					<p className="text-green-700 mb-4">Bekleyen iadeleri toplu onayla.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Onayla
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💰</span>
						<h3 className="text-lg font-semibold text-blue-900">İade Ödemesi</h3>
					</div>
					<p className="text-blue-700 mb-4">Onaylanan iadeleri öde.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Öde
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">İade Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">İade trendlerini analiz et.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-orange-900">İade Politikası</h3>
					</div>
					<p className="text-orange-700 mb-4">İade kurallarını güncelle.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Düzenle
					</button>
				</div>
			</div>
		</div>
	)
}
