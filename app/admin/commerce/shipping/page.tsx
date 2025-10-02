"use client";

import { useState } from 'react';

export default function ShippingPage() {
	const [activeTab, setActiveTab] = useState('all');

	const shipments = [
		{
			id: 'KRG-2024-001',
			orderNo: '#12345',
			customer: 'Ahmet Yılmaz',
			carrier: 'Aras Kargo',
			trackingNo: 'AR123456789TR',
			status: 'Kargoda',
			origin: 'İstanbul',
			destination: 'Ankara',
			estimatedDelivery: '2024-01-17',
			cost: '₺15.50'
		},
		{
			id: 'KRG-2024-002',
			orderNo: '#12346',
			customer: 'Fatma Kaya',
			carrier: 'Yurtiçi Kargo',
			trackingNo: 'YK987654321TR',
			status: 'Teslim Edildi',
			origin: 'İstanbul',
			destination: 'İzmir',
			estimatedDelivery: '2024-01-15',
			cost: '₺12.00'
		},
		{
			id: 'KRG-2024-003',
			orderNo: '#12347',
			customer: 'Mehmet Demir',
			carrier: 'MNG Kargo',
			trackingNo: 'MNG456789123TR',
			status: 'Hazırlanıyor',
			origin: 'İstanbul',
			destination: 'Bursa',
			estimatedDelivery: '2024-01-18',
			cost: '₺18.75'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Hazırlanıyor': return 'bg-yellow-100 text-yellow-800';
			case 'Kargoda': return 'bg-blue-100 text-blue-800';
			case 'Teslim Edildi': return 'bg-green-100 text-green-800';
			case 'İade': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const carriers = [
		{ name: 'Aras Kargo', rate: '₺12-18', delivery: '1-2 gün', rating: 4.5 },
		{ name: 'Yurtiçi Kargo', rate: '₺10-15', delivery: '1-3 gün', rating: 4.2 },
		{ name: 'MNG Kargo', rate: '₺15-22', delivery: '1-2 gün', rating: 4.3 },
		{ name: 'PTT Kargo', rate: '₺8-12', delivery: '2-4 gün', rating: 3.9 }
	];

	const filteredShipments = shipments.filter(shipment => {
		if (activeTab === 'all') return true;
		if (activeTab === 'preparing') return shipment.status === 'Hazırlanıyor';
		if (activeTab === 'shipped') return shipment.status === 'Kargoda';
		if (activeTab === 'delivered') return shipment.status === 'Teslim Edildi';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Kargo Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Kargo
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Kargo Etiketi
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">156</div>
					<div className="text-sm text-gray-600">Toplam Kargo</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">23</div>
					<div className="text-sm text-gray-600">Hazırlanıyor</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">89</div>
					<div className="text-sm text-gray-600">Kargoda</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">44</div>
					<div className="text-sm text-gray-600">Teslim Edildi</div>
				</div>
			</div>

			{/* Carrier Performance */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Kargo Firması Performansı</h3>
				<div className="grid md:grid-cols-4 gap-4">
					{carriers.map((carrier, i) => (
						<div key={i} className="p-4 border rounded-lg">
							<div className="font-semibold text-gray-900 mb-2">{carrier.name}</div>
							<div className="text-sm text-gray-600 mb-1">Fiyat: {carrier.rate}</div>
							<div className="text-sm text-gray-600 mb-1">Teslimat: {carrier.delivery}</div>
							<div className="flex items-center">
								<span className="text-yellow-500">★</span>
								<span className="text-sm text-gray-600 ml-1">{carrier.rating}</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: shipments.length },
							{ key: 'preparing', label: 'Hazırlanıyor', count: shipments.filter(s => s.status === 'Hazırlanıyor').length },
							{ key: 'shipped', label: 'Kargoda', count: shipments.filter(s => s.status === 'Kargoda').length },
							{ key: 'delivered', label: 'Teslim Edildi', count: shipments.filter(s => s.status === 'Teslim Edildi').length }
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

				{/* Shipments Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kargo No
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Sipariş
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Müşteri
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kargo Firması
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Takip No
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Durum
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tahmini Teslimat
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredShipments.map((shipment) => (
								<tr key={shipment.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{shipment.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{shipment.orderNo}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{shipment.customer}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{shipment.carrier}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
										{shipment.trackingNo}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
											{shipment.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{shipment.estimatedDelivery}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Takip
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Etiket
										</button>
										<button className="text-blue-600 hover:text-blue-900">
											Detay
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
						<h3 className="text-lg font-semibold text-blue-900">Toplu Kargo</h3>
					</div>
					<p className="text-blue-700 mb-4">Birden fazla siparişi kargoya ver.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🏷️</span>
						<h3 className="text-lg font-semibold text-green-900">Etiket Yazdır</h3>
					</div>
					<p className="text-green-700 mb-4">Kargo etiketlerini toplu yazdır.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yazdır
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Kargo Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı kargo analizi.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-orange-900">Kargo Ayarları</h3>
					</div>
					<p className="text-orange-700 mb-4">Kargo kuralları ve fiyatları.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Ayarla
					</button>
				</div>
			</div>
		</div>
	)
}
