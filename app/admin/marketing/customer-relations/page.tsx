"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function CustomerRelationsPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedSegment, setSelectedSegment] = useState('all');

	const customers: any[] = [];

	const campaigns: any[] = [];

	const interactions: any[] = [];

	const segments = [
		{ id: 'all', name: 'Tüm Müşteriler', count: 0, color: 'bg-gray-100 text-gray-800' },
		{ id: 'VIP', name: 'VIP Müşteriler', count: 0, color: 'bg-purple-100 text-purple-800' },
		{ id: 'Regular', name: 'Düzenli Müşteriler', count: 0, color: 'bg-blue-100 text-blue-800' },
		{ id: 'New', name: 'Yeni Müşteriler', count: 0, color: 'bg-green-100 text-green-800' },
		{ id: 'At Risk', name: 'Risk Altındaki', count: 0, color: 'bg-red-100 text-red-800' }
	];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'inactive': return 'bg-gray-100 text-gray-800';
			case 'suspended': return 'bg-red-100 text-red-800';
			case 'resolved': return 'bg-green-100 text-green-800';
			case 'open': return 'bg-yellow-100 text-yellow-800';
			case 'completed': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getSegmentColor = (segment: string) => {
		switch (segment) {
			case 'VIP': return 'bg-purple-100 text-purple-800';
			case 'Regular': return 'bg-blue-100 text-blue-800';
			case 'New': return 'bg-green-100 text-green-800';
			case 'At Risk': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredCustomers = selectedSegment === 'all' 
		? customers 
		: customers.filter(c => c.segment === selectedSegment);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Müşteri İlişkileri Yönetimi (CRM)</h1>
					<p className="text-gray-600">Kapsamlı müşteri analizi ve ilişki yönetimi</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Kampanya
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						CRM Raporu
					</button>
				</div>
			</div>

			{/* Customer Segments */}
			<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
				{segments.map((segment) => (
					<button
						key={segment.id}
						onClick={() => setSelectedSegment(segment.id)}
						className={`p-4 rounded-lg border transition-all ${
							selectedSegment === segment.id 
								? 'border-indigo-500 bg-indigo-50' 
								: 'border-gray-200 hover:border-gray-300'
						}`}
					>
						<div className="text-lg font-semibold text-gray-900">{segment.count.toLocaleString()}</div>
						<div className="text-sm text-gray-600">{segment.name}</div>
					</button>
				))}
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'customers', label: 'Müşteriler', icon: '👥' },
							{ key: 'campaigns', label: 'Kampanyalar', icon: '📢' },
							{ key: 'interactions', label: 'Etkileşimler', icon: '💬' },
							{ key: 'analytics', label: 'Analitik', icon: '📈' }
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
					{activeTab === 'overview' && (
						<div className="space-y-6">
							{/* Key Metrics */}
							<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-blue-700">Toplam Müşteri</p>
											<p className="text-2xl font-bold text-blue-900">8,934</p>
										</div>
										<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
											<span className="text-blue-600 text-xl">👥</span>
										</div>
									</div>
								</div>

								<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-green-700">Aktif Müşteri</p>
											<p className="text-2xl font-bold text-green-900">6,789</p>
										</div>
										<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
											<span className="text-green-600 text-xl">✅</span>
										</div>
									</div>
								</div>

								<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-purple-700">Ortalama LTV</p>
											<p className="text-2xl font-bold text-purple-900">{formatCurrency(2340)}</p>
										</div>
										<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
											<span className="text-purple-600 text-xl">💰</span>
										</div>
									</div>
								</div>

								<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-orange-700">Müşteri Memnuniyeti</p>
											<p className="text-2xl font-bold text-orange-900">4.6/5</p>
										</div>
										<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
											<span className="text-orange-600 text-xl">⭐</span>
										</div>
									</div>
								</div>
							</div>

							{/* Recent Activities */}
							<div className="grid lg:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-semibold text-gray-900">Son Müşteri Aktiviteleri</h3>
									</div>
									<div className="p-4">
										<div className="space-y-3">
											<div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded">
												<span className="text-green-600">🛒</span>
												<div className="flex-1">
													<p className="text-sm font-medium">Yeni sipariş: Ahmet Y.</p>
													<p className="text-xs text-gray-500">2 dakika önce</p>
												</div>
											</div>
											<div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded">
												<span className="text-blue-600">👤</span>
												<div className="flex-1">
													<p className="text-sm font-medium">Yeni kayıt: Zeynep K.</p>
													<p className="text-xs text-gray-500">15 dakika önce</p>
												</div>
											</div>
											<div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
												<span className="text-yellow-600">💬</span>
												<div className="flex-1">
													<p className="text-sm font-medium">Destek talebi: Mehmet K.</p>
													<p className="text-xs text-gray-500">1 saat önce</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-semibold text-gray-900">Kampanya Performansı</h3>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											{campaigns.slice(0, 2).map((campaign) => (
												<div key={campaign.id} className="border-l-4 border-indigo-500 pl-4">
													<div className="font-medium text-gray-900">{campaign.name}</div>
													<div className="text-sm text-gray-600 space-y-1">
														<div className="flex justify-between">
															<span>Gönderim:</span>
															<span className="font-medium">{campaign.sent}</span>
														</div>
														<div className="flex justify-between">
															<span>Açılma Oranı:</span>
															<span className="font-medium">{Math.round(campaign.opened / campaign.sent * 100)}%</span>
														</div>
														<div className="flex justify-between">
															<span>Gelir:</span>
															<span className="font-medium text-green-600">{formatCurrency(campaign.revenue)}</span>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'customers' && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">
									Müşteri Listesi ({filteredCustomers.length})
								</h3>
								<div className="flex space-x-2">
									<input
										type="search"
										placeholder="Müşteri ara..."
										className="border rounded-lg px-3 py-2"
									/>
									<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
										Filtrele
									</button>
								</div>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Müşteri</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Segment</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sipariş</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Harcama</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">LTV</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Son Sipariş</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{filteredCustomers.map((customer) => (
											<tr key={customer.id} className="hover:bg-gray-50">
												<td className="px-4 py-3">
													<div>
														<div className="font-medium text-gray-900">{customer.name}</div>
														<div className="text-sm text-gray-500">{customer.email}</div>
														<div className="text-xs text-gray-400">{customer.phone}</div>
													</div>
												</td>
												<td className="px-4 py-3">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(customer.segment)}`}>
														{customer.segment}
													</span>
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">{customer.totalOrders}</td>
												<td className="px-4 py-3 text-sm font-medium text-gray-900">
													{formatCurrency(customer.totalSpent)}
												</td>
												<td className="px-4 py-3 text-sm font-medium text-green-600">
													{formatCurrency(customer.lifetimeValue)}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{new Date(customer.lastOrder).toLocaleDateString('tr-TR')}
												</td>
												<td className="px-4 py-3">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
														{customer.status === 'active' ? 'Aktif' : 'Pasif'}
													</span>
												</td>
												<td className="px-4 py-3 text-sm">
													<div className="flex space-x-2">
														<button className="text-indigo-600 hover:text-indigo-900">Profil</button>
														<button className="text-blue-600 hover:text-blue-900">Mesaj</button>
														<button className="text-green-600 hover:text-green-900">Siparişler</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'campaigns' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Marketing Kampanyaları</h3>
								<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
									Yeni Kampanya Oluştur
								</button>
							</div>

							<div className="space-y-4">
								{campaigns.map((campaign) => (
									<div key={campaign.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{campaign.name}</h4>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
														{campaign.status === 'active' ? 'Aktif' : 
														 campaign.status === 'completed' ? 'Tamamlandı' : 'Beklemede'}
													</span>
													<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
														{campaign.type}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<span>Hedef: {campaign.target} müşteriler</span> • 
													<span> {campaign.startDate} - {campaign.endDate}</span>
												</div>
											</div>
										</div>
										
										<div className="grid md:grid-cols-5 gap-4 mb-4">
											<div className="text-center">
												<div className="text-lg font-semibold text-blue-600">{campaign.sent}</div>
												<div className="text-xs text-gray-500">Gönderim</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-green-600">{campaign.opened}</div>
												<div className="text-xs text-gray-500">Açılma</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-purple-600">{campaign.clicked}</div>
												<div className="text-xs text-gray-500">Tıklama</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-orange-600">{campaign.converted}</div>
												<div className="text-xs text-gray-500">Dönüşüm</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-green-600">{formatCurrency(campaign.revenue)}</div>
												<div className="text-xs text-gray-500">Gelir</div>
											</div>
										</div>

										<div className="flex space-x-3">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
												Kopyala
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm font-medium">
												Analiz
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'interactions' && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Müşteri Etkileşimleri</h3>
								<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
									Yeni Etkileşim
								</button>
							</div>

							<div className="space-y-4">
								{interactions.map((interaction) => (
									<div key={interaction.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{interaction.subject}</h4>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(interaction.status)}`}>
														{interaction.status === 'resolved' ? 'Çözüldü' : 'Açık'}
													</span>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(interaction.priority)}`}>
														{interaction.priority === 'high' ? 'Yüksek' : 
														 interaction.priority === 'medium' ? 'Orta' : 'Düşük'}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-2">
													<span className="font-medium">{interaction.customerName}</span> • 
													<span> {interaction.channel}</span> • 
													<span> {interaction.assignedTo}</span>
												</div>
												<div className="text-xs text-gray-500">
													Oluşturulma: {interaction.createdAt}
													{interaction.resolvedAt && (
														<span> • Çözülme: {interaction.resolvedAt}</span>
													)}
												</div>
											</div>
										</div>
										<div className="flex space-x-3">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Detaylar
											</button>
											{interaction.status === 'open' && (
												<button className="text-green-600 hover:text-green-900 text-sm font-medium">
													Çöz
												</button>
											)}
											<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
												Yanıtla
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">CRM Analitikleri</h3>

							<div className="grid lg:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Müşteri Segmentasyonu</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📊 Segment dağılım grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Müşteri Yaşam Döngüsü</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Lifecycle analiz grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Kampanya ROI Analizi</h4>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">💰 ROI karşılaştırma grafiği burada görünecek</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📧</span>
						<h3 className="text-lg font-semibold text-blue-900">E-posta Kampanyası</h3>
					</div>
					<p className="text-blue-700 mb-4">Hedefli e-posta kampanyası oluştur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Kampanya Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-green-900">Segment Analizi</h3>
					</div>
					<p className="text-green-700 mb-4">Müşteri segmentlerini analiz et.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Analiz Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💬</span>
						<h3 className="text-lg font-semibold text-purple-900">Müşteri Desteği</h3>
					</div>
					<p className="text-purple-700 mb-4">Destek biletlerini yönet.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Destek Merkezi
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-orange-900">CRM Raporu</h3>
					</div>
					<p className="text-orange-700 mb-4">Detaylı CRM performance raporu.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Rapor İndir
					</button>
				</div>
			</div>
		</div>
	);
}
