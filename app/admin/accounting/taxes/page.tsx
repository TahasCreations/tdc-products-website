"use client";

import { useState } from 'react';

export default function TaxesPage() {
	const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

	const taxReturns = [
		{
			id: 'KDV-2024-01',
			period: 'Ocak 2024',
			type: 'KDV Beyannamesi',
			dueDate: '2024-02-26',
			status: 'Hazırlandı',
			taxAmount: '₺12,450.00',
			penalty: '₺0.00'
		},
		{
			id: 'GV-2023-12',
			period: 'Aralık 2023',
			type: 'Gelir Vergisi',
			dueDate: '2024-01-25',
			status: 'Verildi',
			taxAmount: '₺8,900.00',
			penalty: '₺0.00'
		},
		{
			id: 'KDV-2023-12',
			period: 'Aralık 2023',
			type: 'KDV Beyannamesi',
			dueDate: '2024-01-26',
			status: 'Gecikti',
			taxAmount: '₺15,670.00',
			penalty: '₺450.00'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Hazırlandı': return 'bg-blue-100 text-blue-800';
			case 'Verildi': return 'bg-green-100 text-green-800';
			case 'Gecikti': return 'bg-red-100 text-red-800';
			case 'Taslak': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Vergi Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Beyanname
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						AI Asistanı
					</button>
				</div>
			</div>

			{/* Tax Summary */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">₺36,120</div>
					<div className="text-sm text-gray-600">Bu Yıl KDV</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">₺18,900</div>
					<div className="text-sm text-gray-600">Gelir Vergisi</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">₺450</div>
					<div className="text-sm text-gray-600">Gecikme Cezası</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">₺55,470</div>
					<div className="text-sm text-gray-600">Toplam Vergi</div>
				</div>
			</div>

			{/* Tax Calendar */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Vergi Takvimi</h3>
				<div className="grid md:grid-cols-4 gap-4">
					<div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
						<div className="font-semibold text-yellow-800 mb-2">Bu Hafta</div>
						<div className="text-sm text-yellow-700">KDV Beyannamesi</div>
						<div className="text-sm text-yellow-600">Son: 26 Şubat</div>
					</div>
					<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
						<div className="font-semibold text-blue-800 mb-2">Gelecek Hafta</div>
						<div className="text-sm text-blue-700">Muhtasar Beyanname</div>
						<div className="text-sm text-blue-600">Son: 26 Şubat</div>
					</div>
					<div className="p-4 bg-green-50 rounded-lg border border-green-200">
						<div className="font-semibold text-green-800 mb-2">Bu Ay</div>
						<div className="text-sm text-green-700">Gelir Vergisi</div>
						<div className="text-sm text-green-600">Son: 25 Mart</div>
					</div>
					<div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
						<div className="font-semibold text-purple-800 mb-2">Gelecek Ay</div>
						<div className="text-sm text-purple-700">Kurumlar Vergisi</div>
						<div className="text-sm text-purple-600">Son: 30 Nisan</div>
					</div>
				</div>
			</div>

			{/* Tax Returns Table */}
			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Vergi Beyannameleri</h3>
						<select 
							value={selectedPeriod}
							onChange={(e) => setSelectedPeriod(e.target.value)}
							className="border rounded-lg px-3 py-2"
						>
							<option value="2024-01">Ocak 2024</option>
							<option value="2023-12">Aralık 2023</option>
							<option value="2023-11">Kasım 2023</option>
						</select>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Beyanname
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Dönem
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Son Tarih
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Vergi Tutarı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Ceza
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
							{taxReturns.map((tax) => (
								<tr key={tax.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="font-medium text-gray-900">{tax.type}</div>
										<div className="text-sm text-gray-500">{tax.id}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{tax.period}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{tax.dueDate}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
										{tax.taxAmount}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
										{tax.penalty}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tax.status)}`}>
											{tax.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Görüntüle
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											İndir
										</button>
										<button className="text-blue-600 hover:text-blue-900">
											Gönder
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
						<span className="text-2xl mr-3">📋</span>
						<h3 className="text-lg font-semibold text-blue-900">KDV Beyannamesi</h3>
					</div>
					<p className="text-blue-700 mb-4">Aylık KDV beyannamesi hazırla.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Hazırla
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💰</span>
						<h3 className="text-lg font-semibold text-green-900">Gelir Vergisi</h3>
					</div>
					<p className="text-green-700 mb-4">Gelir vergisi hesapla ve beyan et.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Hesapla
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-purple-900">AI Vergi Asistanı</h3>
					</div>
					<p className="text-purple-700 mb-4">AI ile vergi optimizasyonu.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-orange-900">Vergi Raporu</h3>
					</div>
					<p className="text-orange-700 mb-4">Detaylı vergi analizi raporu.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Oluştur
					</button>
				</div>
			</div>
		</div>
	)
}
