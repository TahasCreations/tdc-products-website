"use client";

import { useState } from 'react';

export default function SettlementsPage() {
	const [activeTab, setActiveTab] = useState('pending');
	const [searchTerm, setSearchTerm] = useState('');

	const settlements = [
		{
			id: 'SET001',
			seller: 'Satıcı A',
			amount: 15420.50,
			commission: 1542.05,
			netAmount: 13878.45,
			period: '2024-01',
			status: 'pending',
			dueDate: '2024-02-15',
			orders: 45
		},
		{
			id: 'SET002',
			seller: 'Satıcı B',
			amount: 8750.00,
			commission: 875.00,
			netAmount: 7875.00,
			period: '2024-01',
			status: 'paid',
			dueDate: '2024-02-15',
			orders: 28
		},
		{
			id: 'SET003',
			seller: 'Satıcı C',
			amount: 22100.75,
			commission: 2210.08,
			netAmount: 19890.67,
			period: '2024-01',
			status: 'processing',
			dueDate: '2024-02-15',
			orders: 67
		}
	];

	const filteredSettlements = settlements.filter(settlement => {
		const matchesSearch = settlement.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
							  settlement.id.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesTab = activeTab === 'all' || settlement.status === activeTab;
		return matchesSearch && matchesTab;
	});

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'processing': return 'bg-blue-100 text-blue-800';
			case 'paid': return 'bg-green-100 text-green-800';
			case 'failed': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending': return 'Beklemede';
			case 'processing': return 'İşleniyor';
			case 'paid': return 'Ödendi';
			case 'failed': return 'Başarısız';
			default: return status;
		}
	};

	const totalStats = {
		totalAmount: settlements.reduce((sum, s) => sum + s.amount, 0),
		totalCommission: settlements.reduce((sum, s) => sum + s.commission, 0),
		totalNet: settlements.reduce((sum, s) => sum + s.netAmount, 0),
		pendingCount: settlements.filter(s => s.status === 'pending').length
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Satıcı Ödemeleri</h1>
					<p className="text-gray-600">Satıcı komisyonları ve ödeme yönetimi</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Ödeme
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{formatCurrency(totalStats.totalAmount)}</div>
					<div className="text-sm text-blue-600">Toplam Satış</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{formatCurrency(totalStats.totalCommission)}</div>
					<div className="text-sm text-red-600">Toplam Komisyon</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{formatCurrency(totalStats.totalNet)}</div>
					<div className="text-sm text-green-600">Net Ödeme</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{totalStats.pendingCount}</div>
					<div className="text-sm text-yellow-600">Bekleyen Ödeme</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white p-4 rounded-lg border flex flex-col md:flex-row gap-4 items-center">
				<div className="flex-1">
					<input
						type="text"
						placeholder="Satıcı ara..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					/>
				</div>
				<div className="flex space-x-2">
					<select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
						<option value="">Tüm Dönemler</option>
						<option value="2024-01">Ocak 2024</option>
						<option value="2023-12">Aralık 2023</option>
						<option value="2023-11">Kasım 2023</option>
					</select>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'pending', label: 'Bekleyen', count: settlements.filter(s => s.status === 'pending').length },
							{ key: 'processing', label: 'İşleniyor', count: settlements.filter(s => s.status === 'processing').length },
							{ key: 'paid', label: 'Ödenen', count: settlements.filter(s => s.status === 'paid').length },
							{ key: 'all', label: 'Tümü', count: settlements.length }
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
									activeTab === tab.key
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								<span>{tab.label}</span>
								<span className={`px-2 py-1 text-xs rounded-full ${
									activeTab === tab.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
								}`}>
									{tab.count}
								</span>
							</button>
						))}
					</nav>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Ödeme ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Satıcı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Dönem
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Sipariş Sayısı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Brüt Tutar
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Komisyon
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Net Tutar
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Vade Tarihi
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Durum
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredSettlements.map((settlement) => (
								<tr key={settlement.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{settlement.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{settlement.seller}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{settlement.period}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{settlement.orders}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{formatCurrency(settlement.amount)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
										-{formatCurrency(settlement.commission)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
										{formatCurrency(settlement.netAmount)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{settlement.dueDate}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(settlement.status)}`}>
											{getStatusText(settlement.status)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										{settlement.status === 'pending' && (
											<button className="text-green-600 hover:text-green-900 mr-3">
												Öde
											</button>
										)}
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Detaylar
										</button>
										<button className="text-blue-600 hover:text-blue-900">
											Fatura
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Payment Methods */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🏦</span>
						<h3 className="text-lg font-semibold text-green-900">Banka Havalesi</h3>
					</div>
					<p className="text-green-700 mb-4">Geleneksel banka havalesi ile ödeme.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Havale Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💳</span>
						<h3 className="text-lg font-semibold text-blue-900">Dijital Cüzdan</h3>
					</div>
					<p className="text-blue-700 mb-4">PayPal, Stripe gibi dijital ödemeler.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Dijital Ödeme
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-purple-900">Otomatik Ödeme</h3>
					</div>
					<p className="text-purple-700 mb-4">Periyodik otomatik ödeme kurulumu.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Otomasyon Kur
					</button>
				</div>
			</div>
		</div>
	);
}
