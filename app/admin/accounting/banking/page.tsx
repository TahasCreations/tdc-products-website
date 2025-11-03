"use client";

import { useState } from 'react';

export default function BankingPage() {
	const [selectedAccount, setSelectedAccount] = useState('all');

	const [bankAccounts, setBankAccounts] = useState<any[]>([]);
	const [transactions, setTransactions] = useState<any[]>([]);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Banka & Nakit Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Para Transferi
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Mutabakat
					</button>
				</div>
			</div>

			{/* Bank Accounts Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{bankAccounts.length === 0 ? (
					<div className="col-span-3 text-center py-12 bg-white rounded-xl border">
						<div className="text-6xl mb-4">🏦</div>
						<p className="text-gray-500 text-lg mb-2">Henüz Banka Hesabı Yok</p>
						<p className="text-gray-400 text-sm">Banka hesaplarınızı ekleyin</p>
					</div>
				) : (
					bankAccounts.map((account) => (
						<div key={account.id} className="bg-white p-6 rounded-xl shadow-sm border">
							<div className="flex items-center justify-between mb-4">
								<h3 className="font-semibold text-gray-900">{account.name}</h3>
								<span className={`px-2 py-1 text-xs rounded-full ${
									account.type === 'Vadeli' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
								}`}>
									{account.type}
								</span>
							</div>
							<div className="text-2xl font-bold text-gray-900 mb-2">{account.balance}</div>
							<div className="text-sm text-gray-500 mb-4">{account.id}</div>
							<div className="flex space-x-2">
								<button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 text-sm">
									İşlemler
								</button>
								<button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm">
									Detay
								</button>
							</div>
						</div>
					))
				)}
			</div>

			{/* Cash Flow Summary */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Nakit Akış Özeti (Bu Ay)</h3>
				<div className="grid md:grid-cols-4 gap-4">
					<div className="text-center p-4 bg-green-50 rounded-lg">
						<div className="text-2xl font-bold text-green-600">₺0</div>
						<div className="text-sm text-green-700">Gelen Ödemeler</div>
					</div>
					<div className="text-center p-4 bg-red-50 rounded-lg">
						<div className="text-2xl font-bold text-red-600">₺0</div>
						<div className="text-sm text-red-700">Giden Ödemeler</div>
					</div>
					<div className="text-center p-4 bg-blue-50 rounded-lg">
						<div className="text-2xl font-bold text-blue-600">₺0</div>
						<div className="text-sm text-blue-700">Net Nakit Akış</div>
					</div>
					<div className="text-center p-4 bg-purple-50 rounded-lg">
						<div className="text-2xl font-bold text-purple-600">₺0</div>
						<div className="text-sm text-purple-700">Toplam Bakiye</div>
					</div>
				</div>
			</div>

			{/* Recent Transactions */}
			<div className="bg-white rounded-xl shadow-sm border">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Son İşlemler</h3>
						<div className="flex space-x-2">
							<select 
								value={selectedAccount}
								onChange={(e) => setSelectedAccount(e.target.value)}
								className="border rounded-lg px-3 py-2"
							>
								<option value="all">Tüm Hesaplar</option>
								<option value="TR123456789">İş Bankası - TL</option>
								<option value="TR987654321">Garanti BBVA - USD</option>
								<option value="TR456789123">Yapı Kredi - Vadeli</option>
							</select>
							<input
								type="date"
								className="border rounded-lg px-3 py-2"
							/>
						</div>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tarih
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Açıklama
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tip
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tutar
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Bakiye
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{transactions.length === 0 ? (
								<tr>
									<td colSpan={6} className="px-6 py-12 text-center">
										<div className="text-6xl mb-4">💸</div>
										<p className="text-gray-500 text-lg mb-2">Henüz İşlem Yok</p>
										<p className="text-gray-400 text-sm">Banka işlemleriniz burada görünecek</p>
									</td>
								</tr>
							) : (
								transactions.map((txn) => (
									<tr key={txn.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
											{txn.date}
										</td>
										<td className="px-6 py-4 text-sm text-gray-900">
											{txn.description}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
												{txn.type}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
											<span className={txn.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
												{txn.amount}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{txn.balance}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
											<button className="text-indigo-600 hover:text-indigo-900 mr-3">
												Detay
											</button>
											<button className="text-green-600 hover:text-green-900">
												Yazdır
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💸</span>
						<h3 className="text-lg font-semibold text-green-900">Para Transferi</h3>
					</div>
					<p className="text-green-700 mb-4">Hesaplar arası transfer yapın.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Transfer
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔄</span>
						<h3 className="text-lg font-semibold text-blue-900">Mutabakat</h3>
					</div>
					<p className="text-blue-700 mb-4">Banka mutabakatı yapın.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Nakit Akış</h3>
					</div>
					<p className="text-purple-700 mb-4">Nakit akış raporları.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-orange-900">Yatırım</h3>
					</div>
					<p className="text-orange-700 mb-4">Yatırım fırsatları.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Keşfet
					</button>
				</div>
			</div>
		</div>
	)
}
