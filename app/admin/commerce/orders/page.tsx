"use client";

import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';

interface Order {
	id: string;
	customer: string;
	total: string;
	status: string;
	date: string;
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/orders');
			if (response.ok) {
				const data = await response.json();
				setOrders(data.orders || []);
			}
		} catch (error) {
			console.error('Siparişler yüklenirken hata:', error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Hazırlanıyor': return 'bg-yellow-100 text-yellow-800';
			case 'Kargoda': return 'bg-blue-100 text-blue-800';
			case 'Teslim Edildi': return 'bg-green-100 text-green-800';
			case 'İptal Edildi': return 'bg-red-100 text-red-800';
			case 'Beklemede': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

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
				<h1 className="text-2xl font-bold text-gray-900">Sipariş Yönetimi</h1>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
					Yeni Sipariş
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-blue-600">0</div>
					<div className="text-sm text-gray-600">Toplam Sipariş</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-yellow-600">0</div>
					<div className="text-sm text-gray-600">Hazırlanıyor</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-green-600">0</div>
					<div className="text-sm text-gray-600">Tamamlandı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-red-600">0</div>
					<div className="text-sm text-gray-600">İptal Edildi</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg border">
				<div className="flex flex-wrap gap-4">
					<input
						type="text"
						placeholder="Sipariş No veya Müşteri Ara..."
						className="flex-1 min-w-64 border rounded-lg px-3 py-2"
					/>
					<select className="border rounded-lg px-3 py-2">
						<option>Tüm Durumlar</option>
						<option>Hazırlanıyor</option>
						<option>Kargoda</option>
						<option>Teslim Edildi</option>
						<option>İptal Edildi</option>
					</select>
					<select className="border rounded-lg px-3 py-2">
						<option>Son 30 gün</option>
						<option>Son 7 gün</option>
						<option>Bugün</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Filtrele
					</button>
				</div>
			</div>

			{/* Orders Table or Empty State */}
			{orders.length === 0 ? (
				<div className="bg-white rounded-lg border p-12 text-center">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Package className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Henüz Sipariş Yok
					</h3>
					<p className="text-gray-600 text-sm max-w-md mx-auto">
						İlk sipariş geldiğinde burada görünecek
					</p>
				</div>
			) : (
				<div className="bg-white rounded-lg border overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Sipariş No
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Müşteri
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tutar
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Durum
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tarih
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										İşlemler
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{orders.map((order) => (
									<tr key={order.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{order.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{order.customer}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
											{order.total}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
												{order.status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{order.date}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button className="text-indigo-600 hover:text-indigo-900 mr-3">
												Görüntüle
											</button>
											<button className="text-green-600 hover:text-green-900 mr-3">
												Düzenle
											</button>
											<button className="text-red-600 hover:text-red-900">
												İptal Et
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	)
}
