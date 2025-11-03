"use client";

import { useState } from 'react';

export default function JournalsPage() {
	const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

	const [journalEntries, setJournalEntries] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Onaylandı': return 'bg-green-100 text-green-800';
			case 'Beklemede': return 'bg-yellow-100 text-yellow-800';
			case 'Reddedildi': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Yevmiye Defteri</h1>
				<div className="flex space-x-2">
					<select 
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="2024-01">Ocak 2024</option>
						<option value="2023-12">Aralık 2023</option>
						<option value="2023-11">Kasım 2023</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Yeni Kayıt
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">0</div>
					<div className="text-sm text-gray-600">Toplam Kayıt</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">₺0</div>
					<div className="text-sm text-gray-600">Toplam Borç</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">₺0</div>
					<div className="text-sm text-gray-600">Toplam Alacak</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">₺0</div>
					<div className="text-sm text-gray-600">Fark</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg border">
				<div className="flex flex-wrap gap-4">
					<input
						type="text"
						placeholder="Kayıt No veya Açıklama Ara..."
						className="flex-1 min-w-64 border rounded-lg px-3 py-2"
					/>
					<select className="border rounded-lg px-3 py-2">
						<option>Tüm Durumlar</option>
						<option>Onaylandı</option>
						<option>Beklemede</option>
						<option>Reddedildi</option>
					</select>
					<input
						type="date"
						className="border rounded-lg px-3 py-2"
					/>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Filtrele
					</button>
				</div>
			</div>

			{/* Journal Entries Table */}
			<div className="bg-white rounded-lg border overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kayıt No
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tarih
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Açıklama
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Referans
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Borç
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Alacak
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
							{journalEntries.length === 0 ? (
								<tr>
									<td colSpan={8} className="px-6 py-12 text-center">
										<div className="text-6xl mb-4">📒</div>
										<p className="text-gray-500 text-lg mb-2">Henüz Yevmiye Kaydı Yok</p>
										<p className="text-gray-400 text-sm">Muhasebe kayıtlarınız burada görünecek</p>
									</td>
								</tr>
							) : (
								journalEntries.map((entry) => (
									<tr key={entry.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{entry.id}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{entry.date}
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{entry.description}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
											{entry.reference}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
											{entry.debit}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
											{entry.credit}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
												{entry.status}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button className="text-indigo-600 hover:text-indigo-900 mr-3">
												Görüntüle
											</button>
											<button className="text-green-600 hover:text-green-900 mr-3">
												Düzenle
											</button>
											<button className="text-red-600 hover:text-red-900">
												Sil
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Entry Form */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Hızlı Kayıt</h3>
				<div className="grid md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
						<input
							type="text"
							placeholder="İşlem açıklaması..."
							className="w-full border rounded-lg px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Tutar</label>
						<input
							type="number"
							placeholder="0.00"
							className="w-full border rounded-lg px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Borç Hesabı</label>
						<select className="w-full border rounded-lg px-3 py-2">
							<option>Hesap seçin...</option>
							<option>100.01 - Kasa</option>
							<option>100.02 - Banka</option>
							<option>120.01 - Müşteriler</option>
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Alacak Hesabı</label>
						<select className="w-full border rounded-lg px-3 py-2">
							<option>Hesap seçin...</option>
							<option>600.01 - Satış Gelirleri</option>
							<option>200.01 - Satıcılar</option>
							<option>770.01 - Diğer Gelirler</option>
						</select>
					</div>
				</div>
				<div className="mt-4 flex justify-end">
					<button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
						Kaydet
					</button>
				</div>
			</div>
		</div>
	)
}
