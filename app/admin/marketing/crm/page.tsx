"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function CRMPage() {
	const [activeTab, setActiveTab] = useState('customers');
	const [searchTerm, setSearchTerm] = useState('');

	const customers: any[] = [];

	const interactions: any[] = [];

	const getSegmentColor = (segment: string) => {
		switch (segment) {
			case 'VIP': return 'bg-purple-100 text-purple-800';
			case 'Regular': return 'bg-blue-100 text-blue-800';
			case 'New': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'resolved': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'escalated': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const filteredCustomers = customers.filter(customer =>
		customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		customer.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Müşteri İlişkileri Yönetimi (CRM)</h1>
					<p className="text-gray-600">Müşteri etkileşimleri, segmentasyon ve destek yönetimi</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Etkileşim
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{customers.length}</div>
					<div className="text-sm text-blue-600">Toplam Müşteri</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{customers.filter(c => c.segment === 'VIP').length}</div>
					<div className="text-sm text-purple-600">VIP Müşteri</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{interactions.filter(i => i.status === 'resolved').length}</div>
					<div className="text-sm text-green-600">Çözülen Destek</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{interactions.filter(i => i.status === 'pending').length}</div>
					<div className="text-sm text-yellow-600">Bekleyen Destek</div>
				</div>
			</div>

			{/* Search */}
			<div className="bg-white p-4 rounded-lg border">
				<input
					type="text"
					placeholder="Müşteri ara..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
				/>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'customers', label: 'Müşteriler', icon: '👥' },
							{ key: 'interactions', label: 'Etkileşimler', icon: '💬' },
							{ key: 'segments', label: 'Segmentler', icon: '🎯' },
							{ key: 'campaigns', label: 'Kampanyalar', icon: '📧' }
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
								<span>{tab.icon}</span>
								<span>{tab.label}</span>
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'customers' && (
						<div className="space-y-6">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Müşteri
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												İletişim
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Segment
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Sipariş Sayısı
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Toplam Harcama
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Son Sipariş
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												İşlemler
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{filteredCustomers.map((customer) => (
											<tr key={customer.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
															<span className="text-indigo-600 font-medium text-sm">
																{customer.name.split(' ').map(n => n[0]).join('')}
															</span>
														</div>
														<div className="ml-4">
															<div className="text-sm font-medium text-gray-900">{customer.name}</div>
															<div className="text-sm text-gray-500">{customer.id}</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">{customer.email}</div>
													<div className="text-sm text-gray-500">{customer.phone}</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSegmentColor(customer.segment)}`}>
														{customer.segment}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{customer.totalOrders}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{formatCurrency(customer.totalSpent)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{customer.lastOrder}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button className="text-indigo-600 hover:text-indigo-900 mr-3">
														Detaylar
													</button>
													<button className="text-green-600 hover:text-green-900 mr-3">
														İletişim
													</button>
													<button className="text-blue-600 hover:text-blue-900">
														Geçmiş
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'interactions' && (
						<div className="space-y-6">
							<div className="space-y-4">
								{interactions.map((interaction) => (
									<div key={interaction.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-lg mr-2">
														{interaction.type === 'email' ? '📧' : interaction.type === 'phone' ? '📞' : '💬'}
													</span>
													<h4 className="font-semibold text-gray-900">{interaction.subject}</h4>
													<span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(interaction.priority)}`}>
														{interaction.priority === 'high' ? 'Yüksek' : interaction.priority === 'medium' ? 'Orta' : 'Düşük'}
													</span>
												</div>
												<p className="text-gray-700 mb-2">Müşteri: {interaction.customer}</p>
												<p className="text-gray-500 text-sm">{interaction.date}</p>
											</div>
											<div className="flex flex-col items-end space-y-2">
												<span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(interaction.status)}`}>
													{interaction.status === 'resolved' ? 'Çözüldü' : interaction.status === 'pending' ? 'Beklemede' : 'Yükseltildi'}
												</span>
												<div className="flex space-x-2">
													<button className="text-indigo-600 hover:text-indigo-900 text-sm">
														Yanıtla
													</button>
													<button className="text-green-600 hover:text-green-900 text-sm">
														Çöz
													</button>
													<button className="text-red-600 hover:text-red-900 text-sm">
														Yükselt
													</button>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'segments' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Müşteri Segmentleri</h3>
							<div className="grid md:grid-cols-3 gap-6">
								<div className="border rounded-lg p-6 bg-purple-50 border-purple-200">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">👑</span>
										<h4 className="text-lg font-semibold text-purple-900">VIP Müşteriler</h4>
									</div>
									<div className="space-y-2">
										<p className="text-purple-700">Toplam: {customers.filter(c => c.segment === 'VIP').length} müşteri</p>
										<p className="text-purple-700">Ortalama Harcama: ₺12,450</p>
										<p className="text-purple-700">Sadakat Oranı: %95</p>
									</div>
								</div>

								<div className="border rounded-lg p-6 bg-blue-50 border-blue-200">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">👤</span>
										<h4 className="text-lg font-semibold text-blue-900">Regular Müşteriler</h4>
									</div>
									<div className="space-y-2">
										<p className="text-blue-700">Toplam: {customers.filter(c => c.segment === 'Regular').length} müşteri</p>
										<p className="text-blue-700">Ortalama Harcama: ₺3,200</p>
										<p className="text-blue-700">Sadakat Oranı: %75</p>
									</div>
								</div>

								<div className="border rounded-lg p-6 bg-green-50 border-green-200">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">🌱</span>
										<h4 className="text-lg font-semibold text-green-900">Yeni Müşteriler</h4>
									</div>
									<div className="space-y-2">
										<p className="text-green-700">Toplam: {customers.filter(c => c.segment === 'New').length} müşteri</p>
										<p className="text-green-700">Ortalama Harcama: ₺451</p>
										<p className="text-green-700">Dönüşüm Oranı: %45</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'campaigns' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">CRM Kampanyaları</h3>
							<div className="text-center text-gray-500">
								<p>Müşteri segmentlerine özel kampanya yönetimi burada görünecek...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Müşteri Analizi</h3>
					</div>
					<p className="text-blue-700 mb-4">Detaylı müşteri davranış analizi.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📧</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu E-posta</h3>
					</div>
					<p className="text-green-700 mb-4">Segment bazlı e-posta kampanyası.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Kampanya Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-purple-900">Segmentasyon</h3>
					</div>
					<p className="text-purple-700 mb-4">Yeni müşteri segmentleri oluştur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Segment Oluştur
					</button>
				</div>
			</div>
		</div>
	);
}
