"use client";

import { useState } from 'react';

export default function SegmentsPage() {
	const [activeTab, setActiveTab] = useState('segments');

	const segments = [
		{
			id: 'SEG001',
			name: 'VIP Müşteriler',
			description: 'Yüksek harcama yapan sadık müşteriler',
			criteria: 'Toplam harcama > ₺10,000 VE Sipariş sayısı > 10',
			customerCount: 245,
			avgOrderValue: 1250.50,
			conversionRate: 8.5,
			status: 'active',
			lastUpdated: '2024-01-15'
		},
		{
			id: 'SEG002',
			name: 'Yeni Müşteriler',
			description: 'Son 30 günde kayıt olan müşteriler',
			criteria: 'Kayıt tarihi >= 30 gün önce',
			customerCount: 892,
			avgOrderValue: 320.75,
			conversionRate: 3.2,
			status: 'active',
			lastUpdated: '2024-01-14'
		},
		{
			id: 'SEG003',
			name: 'Sepet Terk Eden',
			description: 'Sepete ürün ekleyip satın almayan müşteriler',
			criteria: 'Sepet oluşturma tarihi >= 7 gün VE Satın alma yok',
			customerCount: 1567,
			avgOrderValue: 0,
			conversionRate: 0,
			status: 'active',
			lastUpdated: '2024-01-13'
		},
		{
			id: 'SEG004',
			name: 'Pasif Müşteriler',
			description: 'Son 90 günde alışveriş yapmayan müşteriler',
			criteria: 'Son sipariş tarihi <= 90 gün önce',
			customerCount: 2341,
			avgOrderValue: 450.25,
			conversionRate: 1.8,
			status: 'paused',
			lastUpdated: '2024-01-10'
		}
	];

	const campaigns = [
		{
			id: 'CAM001',
			name: 'VIP Özel İndirim',
			segment: 'VIP Müşteriler',
			type: 'email',
			status: 'active',
			sent: 245,
			opened: 198,
			clicked: 89,
			converted: 23,
			revenue: 28750.50
		},
		{
			id: 'CAM002',
			name: 'Hoş Geldin Kampanyası',
			segment: 'Yeni Müşteriler',
			type: 'email',
			status: 'completed',
			sent: 892,
			opened: 534,
			clicked: 156,
			converted: 45,
			revenue: 14433.75
		},
		{
			id: 'CAM003',
			name: 'Sepet Hatırlatma',
			segment: 'Sepet Terk Eden',
			type: 'email',
			status: 'active',
			sent: 1567,
			opened: 625,
			clicked: 187,
			converted: 78,
			revenue: 25012.50
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'paused': return 'bg-yellow-100 text-yellow-800';
			case 'completed': return 'bg-blue-100 text-blue-800';
			case 'draft': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'paused': return 'Duraklatıldı';
			case 'completed': return 'Tamamlandı';
			case 'draft': return 'Taslak';
			default: return status;
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Müşteri Segmentasyonu</h1>
					<p className="text-gray-600">Hedefli pazarlama için müşteri segmentleri ve kampanya yönetimi</p>
				</div>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
					Yeni Segment Oluştur
				</button>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{segments.length}</div>
					<div className="text-sm text-blue-600">Toplam Segment</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{segments.filter(s => s.status === 'active').length}</div>
					<div className="text-sm text-green-600">Aktif Segment</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{segments.reduce((sum, s) => sum + s.customerCount, 0).toLocaleString()}</div>
					<div className="text-sm text-purple-600">Toplam Müşteri</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{campaigns.length}</div>
					<div className="text-sm text-orange-600">Aktif Kampanya</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'segments', label: 'Segmentler', icon: '🎯' },
							{ key: 'campaigns', label: 'Kampanyalar', icon: '📧' },
							{ key: 'analytics', label: 'Analitik', icon: '📊' },
							{ key: 'automation', label: 'Otomasyon', icon: '⚙️' }
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
					{activeTab === 'segments' && (
						<div className="space-y-6">
							{segments.map((segment) => (
								<div key={segment.id} className="border rounded-lg p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center mb-2">
												<h3 className="text-lg font-semibold text-gray-900">{segment.name}</h3>
												<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(segment.status)}`}>
													{getStatusText(segment.status)}
												</span>
											</div>
											<p className="text-gray-600 mb-2">{segment.description}</p>
											<p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
												<strong>Kriterler:</strong> {segment.criteria}
											</p>
										</div>
									</div>

									<div className="grid md:grid-cols-4 gap-4 mb-4">
										<div className="text-center bg-blue-50 p-3 rounded">
											<div className="text-xl font-bold text-blue-600">{segment.customerCount.toLocaleString()}</div>
											<div className="text-sm text-blue-600">Müşteri Sayısı</div>
										</div>
										<div className="text-center bg-green-50 p-3 rounded">
											<div className="text-xl font-bold text-green-600">{formatCurrency(segment.avgOrderValue)}</div>
											<div className="text-sm text-green-600">Ortalama Sepet</div>
										</div>
										<div className="text-center bg-purple-50 p-3 rounded">
											<div className="text-xl font-bold text-purple-600">{segment.conversionRate}%</div>
											<div className="text-sm text-purple-600">Dönüşüm Oranı</div>
										</div>
										<div className="text-center bg-gray-50 p-3 rounded">
											<div className="text-sm font-medium text-gray-600">Son Güncelleme</div>
											<div className="text-sm text-gray-500">{segment.lastUpdated}</div>
										</div>
									</div>

									<div className="flex justify-end space-x-2">
										<button className="text-indigo-600 hover:text-indigo-900 text-sm">
											Düzenle
										</button>
										<button className="text-green-600 hover:text-green-900 text-sm">
											Kampanya Oluştur
										</button>
										<button className="text-blue-600 hover:text-blue-900 text-sm">
											Müşteri Listesi
										</button>
										{segment.status === 'active' ? (
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Duraklat
											</button>
										) : (
											<button className="text-green-600 hover:text-green-900 text-sm">
												Aktifleştir
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					)}

					{activeTab === 'campaigns' && (
						<div className="space-y-6">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Kampanya
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Segment
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Gönderim
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Açılma
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Tıklama
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Dönüşüm
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Gelir
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
										{campaigns.map((campaign) => (
											<tr key={campaign.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div>
														<div className="text-sm font-medium text-gray-900">{campaign.name}</div>
														<div className="text-sm text-gray-500">{campaign.id}</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{campaign.segment}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{campaign.sent.toLocaleString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">{campaign.opened.toLocaleString()}</div>
													<div className="text-xs text-gray-500">
														{((campaign.opened / campaign.sent) * 100).toFixed(1)}%
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">{campaign.clicked.toLocaleString()}</div>
													<div className="text-xs text-gray-500">
														{((campaign.clicked / campaign.sent) * 100).toFixed(1)}%
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="text-sm text-gray-900">{campaign.converted.toLocaleString()}</div>
													<div className="text-xs text-gray-500">
														{((campaign.converted / campaign.sent) * 100).toFixed(1)}%
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
													{formatCurrency(campaign.revenue)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
														{getStatusText(campaign.status)}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button className="text-indigo-600 hover:text-indigo-900 mr-3">
														Detaylar
													</button>
													<button className="text-blue-600 hover:text-blue-900">
														Rapor
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Segment Performans Analizi</h3>
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Segment Büyüklükleri</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">🥧 Segment dağılım grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Dönüşüm Oranları</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 Dönüşüm oranı grafiği burada görünecek</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'automation' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Segment Otomasyonu</h3>
							<div className="text-center text-gray-500">
								<p>Otomatik segment oluşturma ve kampanya tetikleme ayarları burada görünecek...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-blue-900">Akıllı Segmentasyon</h3>
					</div>
					<p className="text-blue-700 mb-4">AI ile otomatik müşteri segmentleri oluştur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						AI Segmentasyon
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📧</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Kampanya</h3>
					</div>
					<p className="text-green-700 mb-4">Tüm segmentlere özel kampanya gönder.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Kampanya Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Performans Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı segment performans analizi.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Oluştur
					</button>
				</div>
			</div>
		</div>
	);
}
