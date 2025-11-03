"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function ShippingPage() {
	const [activeTab, setActiveTab] = useState('all');
	const [shipments, setShipments] = useState<Array<{
		id: string;
		orderNo: string;
		customer: string;
		carrier: string;
		trackingNo: string;
		status: string;
		origin: string;
		destination: string;
		estimatedDelivery: string;
		cost: string;
	}>>([]);

	// Demo veriler kaldırıldı - gerçek veriler veritabanından gelecek

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Hazırlanıyor': return 'bg-yellow-100 text-yellow-800';
			case 'Kargoda': return 'bg-blue-100 text-blue-800';
			case 'Teslim Edildi': return 'bg-green-100 text-green-800';
			case 'İade': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

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
					<div className="text-lg font-semibold text-blue-600">{shipments.length}</div>
					<div className="text-sm text-gray-600">Toplam Kargo</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">{shipments.filter(s => s.status === 'Hazırlanıyor').length}</div>
					<div className="text-sm text-gray-600">Hazırlanıyor</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{shipments.filter(s => s.status === 'Kargoda').length}</div>
					<div className="text-sm text-gray-600">Kargoda</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">{shipments.filter(s => s.status === 'Teslim Edildi').length}</div>
					<div className="text-sm text-gray-600">Teslim Edildi</div>
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

				{/* Shipments Table or Empty State */}
				{filteredShipments.length === 0 ? (
					<div className="p-12 text-center">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-4xl">📦</span>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Kargo Yok</h3>
						<p className="text-gray-600 text-sm">
							Kargolar burada görünecek
						</p>
					</div>
				) : (
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
				)}
			</div>
		</div>
	)
}
