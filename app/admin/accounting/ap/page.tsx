export default function AccountsPayablePage() {
	const payables = [
		{
			id: 'BRC-2024-001',
			supplier: 'ABC Tedarik Ltd.',
			invoiceNo: 'FAT-2024-0789',
			amount: '₺15,450.00',
			dueDate: '2024-02-20',
			daysOverdue: 0,
			status: 'Vadeli'
		},
		{
			id: 'BRC-2024-002',
			supplier: 'XYZ Malzeme A.Ş.',
			invoiceNo: 'FAT-2024-0756',
			amount: '₺8,900.00',
			dueDate: '2024-01-25',
			daysOverdue: 20,
			status: 'Gecikmiş'
		},
		{
			id: 'BRC-2024-003',
			supplier: 'Kargo Express',
			invoiceNo: 'FAT-2024-0723',
			amount: '₺2,340.00',
			dueDate: '2024-02-10',
			daysOverdue: 0,
			status: 'Vadeli'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Vadeli': return 'bg-blue-100 text-blue-800';
			case 'Gecikmiş': return 'bg-red-100 text-red-800';
			case 'Ödendi': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Tedarikçi Borçları</h1>
				<div className="flex space-x-2">
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Ödeme Yap
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor Al
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">₺67,890</div>
					<div className="text-sm text-gray-600">Toplam Borç</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">₺45,550</div>
					<div className="text-sm text-gray-600">Vadeli Borçlar</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">₺22,340</div>
					<div className="text-sm text-gray-600">Gecikmiş Borçlar</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">12</div>
					<div className="text-sm text-gray-600">Ortalama Vade (gün)</div>
				</div>
			</div>

			{/* Payment Schedule */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Ödeme Takvimi</h3>
				<div className="grid md:grid-cols-4 gap-4">
					<div className="text-center p-4 bg-blue-50 rounded-lg">
						<div className="text-2xl font-bold text-blue-600">₺28,900</div>
						<div className="text-sm text-blue-700">Bu Hafta</div>
					</div>
					<div className="text-center p-4 bg-yellow-50 rounded-lg">
						<div className="text-2xl font-bold text-yellow-600">₺35,200</div>
						<div className="text-sm text-yellow-700">Gelecek Hafta</div>
					</div>
					<div className="text-center p-4 bg-green-50 rounded-lg">
						<div className="text-2xl font-bold text-green-600">₺18,450</div>
						<div className="text-sm text-green-700">Bu Ay</div>
					</div>
					<div className="text-center p-4 bg-red-50 rounded-lg">
						<div className="text-2xl font-bold text-red-600">₺22,340</div>
						<div className="text-sm text-red-700">Gecikmiş</div>
					</div>
				</div>
			</div>

			{/* Payables Table */}
			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tedarikçi
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Fatura No
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tutar
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Vade Tarihi
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
							{payables.map((item) => (
								<tr key={item.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="font-medium text-gray-900">{item.supplier}</div>
										<div className="text-sm text-gray-500">{item.id}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{item.invoiceNo}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
										{item.amount}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{item.dueDate}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
											{item.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-red-600 hover:text-red-900 mr-3">
											Öde
										</button>
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Detay
										</button>
										<button className="text-green-600 hover:text-green-900">
											Planla
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
				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💳</span>
						<h3 className="text-lg font-semibold text-red-900">Toplu Ödeme</h3>
					</div>
					<p className="text-red-700 mb-4">Birden fazla borcu aynı anda ödeyin.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📅</span>
						<h3 className="text-lg font-semibold text-blue-900">Ödeme Planı</h3>
					</div>
					<p className="text-blue-700 mb-4">Otomatik ödeme planları oluşturun.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Planla
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Borç Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı borç analizi ve raporları.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>
			</div>
		</div>
	)
}
