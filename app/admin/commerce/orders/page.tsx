export default function OrdersPage() {
	const orders = [
		{ id: '#12345', customer: 'Ahmet Yılmaz', total: '₺156.50', status: 'Hazırlanıyor', date: '2024-01-15' },
		{ id: '#12346', customer: 'Fatma Kaya', total: '₺89.90', status: 'Kargoda', date: '2024-01-15' },
		{ id: '#12347', customer: 'Mehmet Demir', total: '₺234.75', status: 'Teslim Edildi', date: '2024-01-14' },
		{ id: '#12348', customer: 'Ayşe Şahin', total: '₺67.25', status: 'İptal Edildi', date: '2024-01-14' },
		{ id: '#12349', customer: 'Ali Özkan', total: '₺445.80', status: 'Beklemede', date: '2024-01-13' },
	];

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
					<div className="text-2xl font-bold text-blue-600">1,247</div>
					<div className="text-sm text-gray-600">Toplam Sipariş</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-yellow-600">89</div>
					<div className="text-sm text-gray-600">Hazırlanıyor</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-green-600">1,098</div>
					<div className="text-sm text-gray-600">Tamamlandı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-2xl font-bold text-red-600">15</div>
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

			{/* Orders Table */}
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

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<div className="text-sm text-gray-700">
					<span className="font-medium">1</span> - <span className="font-medium">5</span> of{' '}
					<span className="font-medium">1,247</span> sonuç gösteriliyor
				</div>
				<div className="flex space-x-2">
					<button className="px-3 py-2 border rounded-lg hover:bg-gray-50">Önceki</button>
					<button className="px-3 py-2 bg-indigo-600 text-white rounded-lg">1</button>
					<button className="px-3 py-2 border rounded-lg hover:bg-gray-50">2</button>
					<button className="px-3 py-2 border rounded-lg hover:bg-gray-50">3</button>
					<button className="px-3 py-2 border rounded-lg hover:bg-gray-50">Sonraki</button>
				</div>
			</div>
		</div>
	)
}
