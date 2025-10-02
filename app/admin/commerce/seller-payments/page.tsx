"use client";

import { useState } from 'react';

export default function SellerPaymentsPage() {
	const [activeTab, setActiveTab] = useState('payments');
	const [selectedPeriod, setSelectedPeriod] = useState('2024-01');

	const payments = [
		{
			id: 'PAY-001',
			sellerId: 'SEL-001',
			sellerName: 'Anime Store Turkey',
			period: '2024-01',
			totalSales: 156780,
			commission: 15678,
			commissionRate: 10,
			tax: 2351,
			netPayment: 138751,
			status: 'Ödendi',
			paymentDate: '2024-02-05',
			paymentMethod: 'Banka Transferi',
			bankAccount: 'TR12 0001 0000 0000 0000 000001'
		},
		{
			id: 'PAY-002',
			sellerId: 'SEL-002',
			sellerName: 'Vintage Collections',
			period: '2024-01',
			totalSales: 89450,
			commission: 8945,
			commissionRate: 10,
			tax: 1342,
			netPayment: 79163,
			status: 'Beklemede',
			paymentDate: null,
			paymentMethod: 'Banka Transferi',
			bankAccount: 'TR12 0001 0000 0000 0000 000002'
		},
		{
			id: 'PAY-003',
			sellerId: 'SEL-003',
			sellerName: 'Tech Gadgets Pro',
			period: '2024-01',
			totalSales: 234560,
			commission: 23456,
			commissionRate: 10,
			tax: 3518,
			netPayment: 207586,
			status: 'İşlemde',
			paymentDate: null,
			paymentMethod: 'EFT',
			bankAccount: 'TR12 0001 0000 0000 0000 000003'
		}
	];

	const commissionRules = [
		{
			id: 'CR-001',
			category: 'Anime & Koleksiyon',
			minSales: 0,
			maxSales: 50000,
			rate: 12,
			status: 'Aktif'
		},
		{
			id: 'CR-002',
			category: 'Anime & Koleksiyon',
			minSales: 50001,
			maxSales: 100000,
			rate: 10,
			status: 'Aktif'
		},
		{
			id: 'CR-003',
			category: 'Elektronik',
			minSales: 0,
			maxSales: 100000,
			rate: 8,
			status: 'Aktif'
		},
		{
			id: 'CR-004',
			category: 'Moda & Aksesuar',
			minSales: 0,
			maxSales: null,
			rate: 15,
			status: 'Aktif'
		}
	];

	const paymentHistory = [
		{
			id: 'PH-001',
			date: '2024-01-05',
			amount: 425680,
			sellersCount: 25,
			status: 'Tamamlandı'
		},
		{
			id: 'PH-002',
			date: '2024-02-05',
			amount: 389450,
			sellersCount: 28,
			status: 'Tamamlandı'
		},
		{
			id: 'PH-003',
			date: '2024-03-05',
			amount: 467320,
			sellersCount: 31,
			status: 'İşlemde'
		}
	];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Ödendi': return 'bg-green-100 text-green-800';
			case 'İşlemde': return 'bg-blue-100 text-blue-800';
			case 'Beklemede': return 'bg-yellow-100 text-yellow-800';
			case 'İptal': return 'bg-red-100 text-red-800';
			case 'Tamamlandı': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const calculateTotalStats = () => {
		const total = payments.reduce((acc, payment) => ({
			totalSales: acc.totalSales + payment.totalSales,
			totalCommission: acc.totalCommission + payment.commission,
			totalTax: acc.totalTax + payment.tax,
			totalNetPayment: acc.totalNetPayment + payment.netPayment
		}), { totalSales: 0, totalCommission: 0, totalTax: 0, totalNetPayment: 0 });

		return total;
	};

	const stats = calculateTotalStats();

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Satıcı Ödeme Yönetimi</h1>
				<div className="flex space-x-2">
					<select 
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="2024-01">Ocak 2024</option>
						<option value="2024-02">Şubat 2024</option>
						<option value="2024-03">Mart 2024</option>
					</select>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Ödeme
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">
						{formatCurrency(stats.totalSales)}
					</div>
					<div className="text-sm text-gray-600">Toplam Satış</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">
						{formatCurrency(stats.totalCommission)}
					</div>
					<div className="text-sm text-gray-600">Toplam Komisyon</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">
						{formatCurrency(stats.totalTax)}
					</div>
					<div className="text-sm text-gray-600">Toplam Vergi</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">
						{formatCurrency(stats.totalNetPayment)}
					</div>
					<div className="text-sm text-gray-600">Net Ödeme</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'payments', label: 'Ödemeler', count: payments.length },
							{ key: 'commission', label: 'Komisyon Kuralları', count: commissionRules.length },
							{ key: 'history', label: 'Ödeme Geçmişi', count: paymentHistory.length }
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

				<div className="p-6">
					{activeTab === 'payments' && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Satıcı Ödemeleri</h3>
								<div className="flex space-x-2">
									<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
										Ödeme Hesapla
									</button>
									<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
										Seçilenleri Öde
									</button>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left">
												<input type="checkbox" className="rounded" />
											</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Satıcı</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dönem</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Satış Tutarı</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Komisyon</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Vergi</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Net Ödeme</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{payments.map((payment) => (
											<tr key={payment.id} className="hover:bg-gray-50">
												<td className="px-4 py-3">
													<input type="checkbox" className="rounded" />
												</td>
												<td className="px-4 py-3">
													<div>
														<div className="font-medium text-gray-900">{payment.sellerName}</div>
														<div className="text-sm text-gray-500">{payment.sellerId}</div>
													</div>
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">{payment.period}</td>
												<td className="px-4 py-3 text-sm font-medium text-gray-900">
													{formatCurrency(payment.totalSales)}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{formatCurrency(payment.commission)}
													<div className="text-xs text-gray-500">(%{payment.commissionRate})</div>
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{formatCurrency(payment.tax)}
												</td>
												<td className="px-4 py-3 text-sm font-medium text-green-600">
													{formatCurrency(payment.netPayment)}
												</td>
												<td className="px-4 py-3">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
														{payment.status}
													</span>
												</td>
												<td className="px-4 py-3 text-sm">
													<div className="flex space-x-2">
														{payment.status === 'Beklemede' && (
															<button className="text-green-600 hover:text-green-900">Öde</button>
														)}
														<button className="text-indigo-600 hover:text-indigo-900">Detay</button>
														<button className="text-blue-600 hover:text-blue-900">Hesap</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'commission' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Komisyon Kuralları</h3>
								<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
									Yeni Kural Ekle
								</button>
							</div>

							<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
								<h4 className="font-semibold text-blue-900 mb-2">Komisyon Sistemi</h4>
								<p className="text-blue-700 text-sm">
									Komisyon oranları kategori ve satış miktarına göre belirlenir. 
									Daha yüksek satış hacmine sahip satıcılar daha düşük komisyon oranlarından yararlanır.
								</p>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kategori</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Min Satış</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Max Satış</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Komisyon Oranı</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{commissionRules.map((rule) => (
											<tr key={rule.id} className="hover:bg-gray-50">
												<td className="px-4 py-3 text-sm font-medium text-gray-900">{rule.category}</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{formatCurrency(rule.minSales)}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{rule.maxSales ? formatCurrency(rule.maxSales) : 'Sınırsız'}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													<span className="font-semibold text-purple-600">%{rule.rate}</span>
												</td>
												<td className="px-4 py-3">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rule.status)}`}>
														{rule.status}
													</span>
												</td>
												<td className="px-4 py-3 text-sm">
													<div className="flex space-x-2">
														<button className="text-indigo-600 hover:text-indigo-900">Düzenle</button>
														<button className="text-red-600 hover:text-red-900">Sil</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'history' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Ödeme Geçmişi</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Aylık Ödeme Trend</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Ödeme trend grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Son Ödemeler</h4>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											{paymentHistory.map((history) => (
												<div key={history.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
													<div>
														<div className="font-medium text-gray-900">{history.date}</div>
														<div className="text-sm text-gray-600">{history.sellersCount} satıcı</div>
													</div>
													<div className="text-right">
														<div className="font-semibold text-gray-900">{formatCurrency(history.amount)}</div>
														<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(history.status)}`}>
															{history.status}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Payment Processing */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Ödeme İşleme</h3>
				<div className="grid md:grid-cols-3 gap-6">
					<div className="border rounded-lg p-4">
						<h4 className="font-semibold text-gray-900 mb-3">Otomatik Ödeme</h4>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Aylık Otomatik Ödeme</span>
								<label className="relative inline-flex items-center cursor-pointer">
									<input type="checkbox" className="sr-only peer" />
									<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
								</label>
							</div>
							<div>
								<label className="block text-sm text-gray-600 mb-1">Ödeme Günü</label>
								<select className="w-full border rounded px-3 py-2">
									<option>Her ayın 5'i</option>
									<option>Her ayın 15'i</option>
									<option>Her ayın son günü</option>
								</select>
							</div>
						</div>
					</div>

					<div className="border rounded-lg p-4">
						<h4 className="font-semibold text-gray-900 mb-3">Minimum Ödeme</h4>
						<div className="space-y-3">
							<div>
								<label className="block text-sm text-gray-600 mb-1">Minimum Tutar (₺)</label>
								<input
									type="number"
									className="w-full border rounded px-3 py-2"
									placeholder="100"
								/>
							</div>
							<div className="text-sm text-gray-500">
								Bu tutarın altındaki ödemeler bir sonraki döneme aktarılır.
							</div>
						</div>
					</div>

					<div className="border rounded-lg p-4">
						<h4 className="font-semibold text-gray-900 mb-3">Vergi Oranları</h4>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Stopaj Oranı</span>
								<span className="font-semibold">%15</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-gray-600">KDV Oranı</span>
								<span className="font-semibold">%20</span>
							</div>
							<button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
								Oranları Düzenle
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💰</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Ödeme</h3>
					</div>
					<p className="text-green-700 mb-4">Bekleyen tüm ödemeleri toplu olarak gerçekleştir.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Ödemeleri İşle
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Ödeme Raporu</h3>
					</div>
					<p className="text-blue-700 mb-4">Detaylı ödeme analizi ve raporları.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Rapor Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-purple-900">Komisyon Ayarları</h3>
					</div>
					<p className="text-purple-700 mb-4">Komisyon kurallarını yönet ve optimize et.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Ayarları Düzenle
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🏦</span>
						<h3 className="text-lg font-semibold text-orange-900">Banka Entegrasyonu</h3>
					</div>
					<p className="text-orange-700 mb-4">Otomatik banka transferi ayarları.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Entegrasyonlar
					</button>
				</div>
			</div>
		</div>
	);
}
