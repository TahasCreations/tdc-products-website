"use client";

import { useState } from 'react';

export default function SegmentationPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedSegment, setSelectedSegment] = useState('high-value');

	const segments = [
		{
			id: 'high-value',
			name: 'Yüksek Değerli Müşteriler',
			count: 1245,
			percentage: 8.3,
			avgOrderValue: 450,
			ltv: 1890,
			churnRate: 2.1
		},
		{
			id: 'frequent-buyers',
			name: 'Sıkça Alışveriş Yapanlar',
			count: 2890,
			percentage: 19.2,
			avgOrderValue: 180,
			ltv: 1240,
			churnRate: 3.8
		},
		{
			id: 'price-sensitive',
			name: 'Fiyat Hassası Müşteriler',
			count: 4567,
			percentage: 30.4,
			avgOrderValue: 85,
			ltv: 380,
			churnRate: 15.2
		},
		{
			id: 'new-customers',
			name: 'Yeni Müşteriler',
			count: 3421,
			percentage: 22.8,
			avgOrderValue: 120,
			ltv: 180,
			churnRate: 45.6
		}
	];

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
					<p className="text-gray-600">Akıllı müşteri analizi ve hedefleme</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						AI Segmentasyon
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Yeni Segment
					</button>
				</div>
			</div>

			{/* Segment Overview Cards */}
			<div className="grid md:grid-cols-4 gap-4">
				{segments.map((segment) => (
					<div 
						key={segment.id}
						className={`p-4 rounded-lg border cursor-pointer transition-colors ${
							selectedSegment === segment.id 
								? 'border-indigo-500 bg-indigo-50' 
								: 'border-gray-200 bg-white hover:bg-gray-50'
						}`}
						onClick={() => setSelectedSegment(segment.id)}
					>
						<div className="flex items-center justify-between mb-2">
							<h3 className="font-semibold text-gray-900 text-sm">{segment.name}</h3>
							<span className="text-xl font-bold text-indigo-600">{segment.count}</span>
						</div>
						<div className="text-xs text-gray-600 mb-2">%{segment.percentage} müşteri</div>
						<div className="flex justify-between text-xs">
							<span className="text-green-600">AOV: {formatCurrency(segment.avgOrderValue)}</span>
							<span className="text-blue-600">LTV: {formatCurrency(segment.ltv)}</span>
						</div>
					</div>
				))}
			</div>

			{/* Key Insights */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<h3 className="font-semibold text-green-900 mb-2">Segment Büyümesi</h3>
					<p className="text-sm text-green-700 mb-2">Yüksek değerli müşteri segmenti %23 büyüdü</p>
					<div className="text-xs text-green-600">VIP program genişletilmeli</div>
				</div>
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<h3 className="font-semibold text-red-900 mb-2">Churn Riski</h3>
					<p className="text-sm text-red-700 mb-2">Fiyat hassası segmentte churn oranı artıyor</p>
					<div className="text-xs text-red-600">Özel indirim stratejisi gerekli</div>
				</div>
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h3 className="font-semibold text-blue-900 mb-2">Cross-selling Fırsatı</h3>
					<p className="text-sm text-blue-700 mb-2">Sık alışveriş yapanlar yeni kategorilere açık</p>
					<div className="text-xs text-blue-600">Kişiselleştirilmiş öneriler artırılmalı</div>
				</div>
				<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
					<h3 className="font-semibold text-purple-900 mb-2">Mobil Trend</h3>
					<p className="text-sm text-purple-700 mb-2">Mobil app kullanımı tüm segmentlerde artıyor</p>
					<div className="text-xs text-purple-600">Mobil deneyim optimize edilmeli</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'details', label: 'Segment Detayları', icon: '👥' },
							{ key: 'campaigns', label: 'Hedefli Kampanyalar', icon: '🎯' },
							{ key: 'automation', label: 'Otomasyon', icon: '⚡' }
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
							<h3 className="text-lg font-semibold text-gray-900">Segmentasyon Genel Bakışı</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Segment Dağılımı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🥧 Segment dağılım grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Segment Performansı</h4>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											{segments.map((segment) => (
												<div key={segment.id} className="flex justify-between items-center">
													<div>
														<div className="font-medium text-gray-900">{segment.name}</div>
														<div className="text-sm text-gray-600">{segment.count} müşteri</div>
													</div>
													<div className="text-right">
														<div className="font-semibold text-green-600">{formatCurrency(segment.ltv)}</div>
														<div className="text-xs text-gray-500">LTV</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Segment Karşılaştırması</h4>
								</div>
								<div className="p-4">
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead className="bg-gray-50">
												<tr>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Segment</th>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Müşteri Sayısı</th>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">AOV</th>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">LTV</th>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Churn Rate</th>
													<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Toplam Değer</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-gray-200">
												{segments.map((segment) => (
													<tr key={segment.id} className="hover:bg-gray-50">
														<td className="px-4 py-3 font-medium text-gray-900">{segment.name}</td>
														<td className="px-4 py-3 text-sm text-gray-900">{segment.count.toLocaleString()}</td>
														<td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(segment.avgOrderValue)}</td>
														<td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(segment.ltv)}</td>
														<td className="px-4 py-3 text-sm">
															<span className={`font-medium ${segment.churnRate > 20 ? 'text-red-600' : segment.churnRate > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
																%{segment.churnRate}
															</span>
														</td>
														<td className="px-4 py-3 text-sm font-bold text-blue-600">
															{formatCurrency(segment.count * segment.ltv)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'details' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Segment Detayları</h3>
							<div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
								<h4 className="font-semibold text-indigo-900 mb-4">
									{segments.find(s => s.id === selectedSegment)?.name} Analizi
								</h4>
								<div className="grid md:grid-cols-3 gap-6">
									<div className="text-center">
										<div className="text-3xl font-bold text-indigo-700">
											{segments.find(s => s.id === selectedSegment)?.count}
										</div>
										<div className="text-sm text-indigo-600">Toplam Müşteri</div>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold text-green-700">
											{formatCurrency(segments.find(s => s.id === selectedSegment)?.avgOrderValue || 0)}
										</div>
										<div className="text-sm text-green-600">Ortalama Sipariş Değeri</div>
									</div>
									<div className="text-center">
										<div className="text-3xl font-bold text-purple-700">
											{formatCurrency(segments.find(s => s.id === selectedSegment)?.ltv || 0)}
										</div>
										<div className="text-sm text-purple-600">Yaşam Boyu Değer</div>
									</div>
								</div>
							</div>
							<div className="text-center text-gray-500">
								<p>Detaylı segment analiz sayfası geliştiriliyor...</p>
							</div>
						</div>
					)}

					{activeTab === 'campaigns' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Hedefli Kampanyalar</h3>
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-green-50 border border-green-200 rounded-lg p-6">
									<h4 className="font-semibold text-green-900 mb-4">VIP Müşteri Programı</h4>
									<div className="space-y-2 text-sm text-green-800">
										<div>Hedef: Yüksek Değerli Müşteriler</div>
										<div>Erişim: 1,245 müşteri</div>
										<div>ROI: %340</div>
										<div>Durum: Aktif</div>
									</div>
								</div>
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
									<h4 className="font-semibold text-blue-900 mb-4">Hoş Geldin Serisi</h4>
									<div className="space-y-2 text-sm text-blue-800">
										<div>Hedef: Yeni Müşteriler</div>
										<div>Erişim: 3,421 müşteri</div>
										<div>ROI: %150</div>
										<div>Durum: Aktif</div>
									</div>
								</div>
							</div>
							<div className="text-center text-gray-500">
								<p>Kampanya yönetim arayüzü geliştiriliyor...</p>
							</div>
						</div>
					)}

					{activeTab === 'automation' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Segmentasyon Otomasyonu</h3>
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">🤖 Otomatik Segmentasyon</h4>
									</div>
									<div className="p-4 space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-gray-700">RFM Analizi</span>
											<span className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg">Aktif</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-gray-700">Davranışsal Segmentasyon</span>
											<span className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg">Aktif</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-gray-700">Churn Risk Tahmini</span>
											<span className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg">Aktif</span>
										</div>
									</div>
								</div>
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">📊 Performans İzleme</h4>
									</div>
									<div className="p-4">
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center p-4 bg-blue-50 rounded-lg">
												<div className="text-xl font-bold text-blue-600">94.3%</div>
												<div className="text-sm text-blue-700">Doğruluk</div>
											</div>
											<div className="text-center p-4 bg-green-50 rounded-lg">
												<div className="text-xl font-bold text-green-600">23.4%</div>
												<div className="text-sm text-green-700">ROI Artışı</div>
											</div>
										</div>
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
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-blue-900">AI Segmentasyon</h3>
					</div>
					<p className="text-blue-700 mb-4">Makine öğrenmesi ile otomatik segmentleme.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📧</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Kampanya</h3>
					</div>
					<p className="text-green-700 mb-4">Tüm segmentler için koordineli kampanya.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Detaylı Analiz</h3>
					</div>
					<p className="text-purple-700 mb-4">Gelişmiş segment performans raporu.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Al
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-orange-900">Hızlı Otomasyon</h3>
					</div>
					<p className="text-orange-700 mb-4">Segment bazlı otomatik aksiyon kurulumu.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Kur
					</button>
				</div>
			</div>
		</div>
	);
}
