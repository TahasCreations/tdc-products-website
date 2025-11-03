"use client";

import { useState } from 'react';

export default function ReturnsPage() {
	const [activeTab, setActiveTab] = useState('all');
	const [returns, setReturns] = useState<Array<{
		id: string;
		orderNo: string;
		customer: string;
		product: string;
		reason: string;
		requestDate: string;
		status: string;
		refundAmount: string;
		images: number;
	}>>([]);

	// Demo veriler kaldırıldı - gerçek veriler veritabanından gelecek

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
					<div className="text-lg font-semibold text-blue-600">{returns.length}</div>
					<div className="text-sm text-gray-600">Toplam İade</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">{returns.filter(r => r.status === 'İnceleniyor').length}</div>
					<div className="text-sm text-gray-600">İnceleniyor</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">{returns.filter(r => r.status === 'Onaylandı').length}</div>
					<div className="text-sm text-gray-600">Onaylandı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">₺0</div>
					<div className="text-sm text-gray-600">İade Tutarı</div>
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

				{/* Returns Table or Empty State */}
				{filteredReturns.length === 0 ? (
					<div className="p-12 text-center">
						<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-4xl">↩️</span>
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Henüz İade Yok
						</h3>
						<p className="text-gray-600 text-sm">
							İade talepleri burada görünecek
						</p>
					</div>
				) : (
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
				)}
			</div>
		</div>
	)
}
