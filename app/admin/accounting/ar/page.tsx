"use client";

import { useState } from 'react';

export default function AccountsReceivablePage() {
	const [receivables, setReceivables] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Vadeli': return 'bg-blue-100 text-blue-800';
			case 'Gecikmiş': return 'bg-red-100 text-red-800';
			case 'Tahsil Edildi': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getOverdueColor = (days: number) => {
		if (days === 0) return 'text-blue-600';
		if (days <= 30) return 'text-yellow-600';
		return 'text-red-600';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Müşteri Alacakları</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Tahsilat Kaydet
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor Al
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">₺0</div>
					<div className="text-sm text-gray-600">Toplam Alacak</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">₺0</div>
					<div className="text-sm text-gray-600">Vadeli Alacaklar</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">₺0</div>
					<div className="text-sm text-gray-600">Gecikmiş Alacaklar</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">0</div>
					<div className="text-sm text-gray-600">Ortalama Vade (gün)</div>
				</div>
			</div>

			{/* Aging Analysis */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Yaşlandırma Analizi</h3>
				<div className="grid md:grid-cols-5 gap-4">
					<div className="text-center p-4 bg-green-50 rounded-lg">
						<div className="text-2xl font-bold text-green-600">₺0</div>
						<div className="text-sm text-green-700">0-30 Gün</div>
					</div>
					<div className="text-center p-4 bg-yellow-50 rounded-lg">
						<div className="text-2xl font-bold text-yellow-600">₺0</div>
						<div className="text-sm text-yellow-700">31-60 Gün</div>
					</div>
					<div className="text-center p-4 bg-orange-50 rounded-lg">
						<div className="text-2xl font-bold text-orange-600">₺0</div>
						<div className="text-sm text-orange-700">61-90 Gün</div>
					</div>
					<div className="text-center p-4 bg-red-50 rounded-lg">
						<div className="text-2xl font-bold text-red-600">₺0</div>
						<div className="text-sm text-red-700">90+ Gün</div>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<div className="text-2xl font-bold text-gray-600">₺0</div>
						<div className="text-sm text-gray-700">Toplam</div>
					</div>
				</div>
			</div>

			{/* Receivables Table */}
			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Alacak Listesi</h3>
						<div className="flex space-x-2">
							<input
								type="text"
								placeholder="Müşteri ara..."
								className="border rounded-lg px-3 py-2"
							/>
							<select className="border rounded-lg px-3 py-2">
								<option>Tüm Durumlar</option>
								<option>Vadeli</option>
								<option>Gecikmiş</option>
							</select>
						</div>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Müşteri
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
									Gecikme
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
							{receivables.length === 0 ? (
								<tr>
									<td colSpan={7} className="px-6 py-12 text-center">
										<div className="text-6xl mb-4">💰</div>
										<p className="text-gray-500 text-lg mb-2">Henüz Alacak Kaydı Yok</p>
										<p className="text-gray-400 text-sm">Müşteri alacaklarınız burada görünecek</p>
									</td>
								</tr>
							) : (
								receivables.map((item) => (
									<tr key={item.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="font-medium text-gray-900">{item.customer}</div>
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
											<span className={`text-sm font-semibold ${getOverdueColor(item.daysOverdue)}`}>
												{item.daysOverdue === 0 ? 'Vadeli' : `${item.daysOverdue} gün`}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
												{item.status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button className="text-green-600 hover:text-green-900 mr-3">
												Tahsil Et
											</button>
											<button className="text-indigo-600 hover:text-indigo-900 mr-3">
												Detay
											</button>
											<button className="text-yellow-600 hover:text-yellow-900">
												Hatırlatma
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Collection Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💰</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Tahsilat</h3>
					</div>
					<p className="text-green-700 mb-4">Birden fazla alacağı aynı anda tahsil edin.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📧</span>
						<h3 className="text-lg font-semibold text-blue-900">Hatırlatma Gönder</h3>
					</div>
					<p className="text-blue-700 mb-4">Gecikmiş alacaklar için otomatik hatırlatma.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Gönder
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Alacak Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı alacak analizi ve raporları.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>
			</div>
		</div>
	)
}
