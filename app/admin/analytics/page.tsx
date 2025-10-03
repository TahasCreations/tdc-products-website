"use client";

import { useState } from 'react';

export default function AnalyticsPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedPeriod, setSelectedPeriod] = useState('30d');

	const analyticsData = {
		totalRevenue: 2847500,
		totalOrders: 15420,
		avgOrderValue: 184.50,
		conversionRate: 3.2,
		customerCount: 8940,
		returnRate: 2.8
	};

	const topProducts = [
		{ name: 'Anime Figür Koleksiyonu', sales: 1240, revenue: 186000, growth: 15.2 },
		{ name: 'Vintage Poster Set', sales: 890, revenue: 134000, growth: 8.7 },
		{ name: 'Teknoloji Gadget', sales: 567, revenue: 98000, growth: 22.1 },
		{ name: 'Ev Dekorasyon', sales: 445, revenue: 67000, growth: -3.4 }
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
					<h1 className="text-2xl font-bold text-gray-900">Analitik Dashboard</h1>
					<p className="text-gray-600">Kapsamlı iş performans analizi</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="7d">Son 7 Gün</option>
						<option value="30d">Son 30 Gün</option>
						<option value="90d">Son 90 Gün</option>
						<option value="1y">Son 1 Yıl</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid md:grid-cols-6 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{formatCurrency(analyticsData.totalRevenue)}</div>
					<div className="text-sm text-blue-600">Toplam Gelir</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{analyticsData.totalOrders.toLocaleString()}</div>
					<div className="text-sm text-green-600">Toplam Sipariş</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{formatCurrency(analyticsData.avgOrderValue)}</div>
					<div className="text-sm text-purple-600">Ortalama Sepet</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">%{analyticsData.conversionRate}</div>
					<div className="text-sm text-orange-600">Dönüşüm Oranı</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{analyticsData.customerCount.toLocaleString()}</div>
					<div className="text-sm text-red-600">Aktif Müşteri</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">%{analyticsData.returnRate}</div>
					<div className="text-sm text-yellow-600">İade Oranı</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'sales', label: 'Satış Analizi', icon: '💰' },
							{ key: 'customers', label: 'Müşteri Analizi', icon: '👥' },
							{ key: 'products', label: 'Ürün Performansı', icon: '📦' },
							{ key: 'traffic', label: 'Trafik Analizi', icon: '🌐' }
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
							<h3 className="text-lg font-semibold text-gray-900">Genel Performans Özeti</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Gelir Trendi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Gelir trend grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Sipariş Dağılımı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🥧 Sipariş dağılım grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">En Çok Satan Ürünler</h4>
								</div>
								<div className="p-4">
									<div className="space-y-4">
										{topProducts.map((product, index) => (
											<div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
												<div>
													<h5 className="font-medium text-gray-900">{product.name}</h5>
													<p className="text-sm text-gray-600">{product.sales} satış</p>
												</div>
												<div className="text-right">
													<div className="font-semibold text-green-600">{formatCurrency(product.revenue)}</div>
													<div className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
														{product.growth > 0 ? '+' : ''}{product.growth}%
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'sales' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Satış Performans Analizi</h3>
							<div className="text-center text-gray-500">
								<p>Detaylı satış analiz grafikleri burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'customers' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Müşteri Davranış Analizi</h3>
							<div className="text-center text-gray-500">
								<p>Müşteri segmentasyonu ve davranış analizleri burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'products' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Ürün Performans Metrikleri</h3>
							<div className="text-center text-gray-500">
								<p>Ürün bazlı performans analizleri burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'traffic' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Web Trafik Analizi</h3>
							<div className="text-center text-gray-500">
								<p>Trafik kaynakları ve kullanıcı davranış analizleri burada görünecek...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Custom Dashboard</h3>
					</div>
					<p className="text-blue-700 mb-4">Özel analitik dashboard oluşturun.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Dashboard Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-green-900">Trend Analizi</h3>
					</div>
					<p className="text-green-700 mb-4">Gelişmiş trend analizi ve tahminler.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Analiz Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-purple-900">Otomatik Rapor</h3>
					</div>
					<p className="text-purple-700 mb-4">Periyodik otomatik raporlama kurulumu.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Otomasyon Kur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-orange-900">KPI Takibi</h3>
					</div>
					<p className="text-orange-700 mb-4">Anahtar performans göstergelerini izleyin.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						KPI Ayarla
					</button>
				</div>
			</div>
		</div>
	);
}
