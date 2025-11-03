"use client";

import { useState } from 'react';

export default function ForecastingPage() {
	const [selectedModel, setSelectedModel] = useState('autoarima');
	const [forecastPeriod, setForecastPeriod] = useState('90');
	const [activeTab, setActiveTab] = useState('revenue');

	const models = [
		{ id: 'autoarima', name: 'Auto ARIMA', accuracy: 0, description: 'Otomatik zaman serisi analizi' },
		{ id: 'lstm', name: 'LSTM Neural Network', accuracy: 0, description: 'Derin öğrenme tabanlı tahmin' },
		{ id: 'prophet', name: 'Facebook Prophet', accuracy: 0, description: 'Mevsimsel trend analizi' },
		{ id: 'regression', name: 'Regression Model', accuracy: 0, description: 'Doğrusal regresyon tabanlı' }
	];

	const forecastData = {
		revenue: {
			historical: [],
			predictions: []
		},
		users: {
			growth: { monthly: 0, expected: 0, confidence: 0 },
			churn: { current: 0, predicted: 0, confidence: 0 },
			ltv: { current: 0, predicted: 0, confidence: 0 }
		},
		inventory: {
			stockouts: { current: 0, predicted: 0, confidence: 0 },
			demandSpikes: []
		}
	};

	const insights: any[] = [];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getImpactColor = (impact: string) => {
		switch (impact) {
			case 'Yüksek': return 'text-red-600 bg-red-100';
			case 'Orta': return 'text-yellow-600 bg-yellow-100';
			case 'Düşük': return 'text-green-600 bg-green-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	};

	const getInsightColor = (color: string) => {
		const colors = {
			green: 'border-green-200 bg-green-50',
			blue: 'border-blue-200 bg-blue-50',
			yellow: 'border-yellow-200 bg-yellow-50',
			purple: 'border-purple-200 bg-purple-50',
			red: 'border-red-200 bg-red-50'
		};
		return colors[color as keyof typeof colors] || 'border-gray-200 bg-gray-50';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Gelecek Tahminleri</h1>
					<p className="text-gray-600">AI destekli iş zekası ve tahmin modelleri</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={selectedModel}
						onChange={(e) => setSelectedModel(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						{models.map(model => (
							<option key={model.id} value={model.id}>
								{model.name} (%{model.accuracy})
							</option>
						))}
					</select>
					<select 
						value={forecastPeriod}
						onChange={(e) => setForecastPeriod(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="30">30 Gün</option>
						<option value="90">90 Gün</option>
						<option value="180">6 Ay</option>
						<option value="365">1 Yıl</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Tahmin Yenile
					</button>
				</div>
			</div>

			{/* Model Performance Cards */}
			<div className="grid md:grid-cols-4 gap-4">
				{models.map((model) => (
					<div 
						key={model.id}
						className={`p-4 rounded-lg border cursor-pointer transition-colors ${
							selectedModel === model.id 
								? 'border-indigo-500 bg-indigo-50' 
								: 'border-gray-200 bg-white hover:bg-gray-50'
						}`}
						onClick={() => setSelectedModel(model.id)}
					>
						<div className="flex items-center justify-between mb-2">
							<h3 className="font-semibold text-gray-900">{model.name}</h3>
							<span className="text-green-600 font-bold">%{model.accuracy}</span>
						</div>
						<p className="text-sm text-gray-600">{model.description}</p>
					</div>
				))}
			</div>

			{/* Key Insights */}
			<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
				{insights.length === 0 ? (
					<div className="col-span-4 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
						<div className="text-4xl mb-4">🎯</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz İçgörü Yok</h3>
						<p className="text-gray-600">Tahmin modelleri çalıştırıldığında içgörüler burada görünecek.</p>
					</div>
				) : (
					insights.map((insight, index) => (
					<div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.color)}`}>
						<div className="flex items-start justify-between mb-2">
							<h3 className="font-semibold text-gray-900">{insight.title}</h3>
							<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(insight.impact)}`}>
								{insight.impact}
							</span>
						</div>
						<p className="text-sm text-gray-700 mb-3">{insight.description}</p>
						<div className="flex items-center text-xs text-gray-600">
							<span className="mr-2">🎯 Güven:</span>
							<span className="font-medium">%{insight.confidence}</span>
						</div>
					</div>
					))
				)}
			</div>

			{/* Forecast Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'revenue', label: 'Gelir Tahmini', icon: '💰' },
							{ key: 'customers', label: 'Müşteri Metrikleri', icon: '👥' },
							{ key: 'inventory', label: 'Envanter Yönetimi', icon: '📦' },
							{ key: 'scenarios', label: 'Senaryo Analizi', icon: '🎯' }
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
					{activeTab === 'revenue' && (
						<div className="space-y-6">
							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
									<h3 className="text-lg font-semibold text-green-900 mb-2">Bu Ay Tahmini</h3>
									<div className="text-3xl font-bold text-green-700">₺0</div>
									<div className="text-sm text-green-600 mt-1">%0 artış bekleniyor</div>
								</div>
								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
									<h3 className="text-lg font-semibold text-blue-900 mb-2">3 Ay Toplam</h3>
									<div className="text-3xl font-bold text-blue-700">₺0</div>
									<div className="text-sm text-blue-600 mt-1">%0 büyüme trendi</div>
								</div>
								<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
									<h3 className="text-lg font-semibold text-purple-900 mb-2">Yıl Sonu Hedef</h3>
									<div className="text-3xl font-bold text-purple-700">₺0</div>
									<div className="text-sm text-purple-600 mt-1">%0 hedef aşım</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h3 className="font-semibold text-gray-900">Gelir Tahmin Grafiği</h3>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Gelir tahmin grafiği ve güven aralıkları burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Tahmin Detayları</h4>
									</div>
									<div className="p-4">
										{forecastData.revenue.predictions.length === 0 ? (
											<div className="text-center py-8">
												<div className="text-gray-400 mb-2">📈</div>
												<p className="text-gray-500">Henüz tahmin verisi yok</p>
											</div>
										) : (
											<div className="space-y-3">
												{forecastData.revenue.predictions.slice(0, 3).map((item, index) => (
												<div key={index} className="flex justify-between items-center">
													<span className="text-gray-700">{item.month}</span>
													<div className="text-right">
														<div className="font-semibold">{formatCurrency(item.forecast!)}</div>
														<div className="text-xs text-gray-500">
															{formatCurrency(item.confidence.min)} - {formatCurrency(item.confidence.max)}
														</div>
													</div>
												</div>
												))}
											</div>
										)}
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Model Performansı</h4>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											<div className="flex justify-between">
												<span>Doğruluk Oranı</span>
												<span className="font-medium text-green-600">%0</span>
											</div>
											<div className="flex justify-between">
												<span>Ortalama Hata</span>
												<span className="font-medium text-blue-600">%0</span>
											</div>
											<div className="flex justify-between">
												<span>Güven Aralığı</span>
												<span className="font-medium text-purple-600">%0</span>
											</div>
											<div className="flex justify-between">
												<span>Son Güncelleme</span>
												<span className="font-medium text-gray-600">Henüz güncelleme yok</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'customers' && (
						<div className="space-y-6">
							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-white border rounded-lg p-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold text-gray-900">Müşteri Büyümesi</h3>
										<span className="text-2xl">👥</span>
									</div>
									<div className="text-2xl font-bold text-blue-600 mb-2">
										%{forecastData.users.growth.expected}
									</div>
									<div className="text-sm text-gray-600">
										Mevcut: %{forecastData.users.growth.monthly} | 
										Güven: %{forecastData.users.growth.confidence}
									</div>
								</div>

								<div className="bg-white border rounded-lg p-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold text-gray-900">Churn Oranı</h3>
										<span className="text-2xl">⚠️</span>
									</div>
									<div className="text-2xl font-bold text-green-600 mb-2">
										%{forecastData.users.churn.predicted}
									</div>
									<div className="text-sm text-gray-600">
										Mevcut: %{forecastData.users.churn.current} | 
										Güven: %{forecastData.users.churn.confidence}
									</div>
								</div>

								<div className="bg-white border rounded-lg p-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-semibold text-gray-900">LTV Tahmini</h3>
										<span className="text-2xl">💎</span>
									</div>
									<div className="text-2xl font-bold text-purple-600 mb-2">
										₺{forecastData.users.ltv.predicted}
									</div>
									<div className="text-sm text-gray-600">
										Mevcut: ₺{forecastData.users.ltv.current} | 
										Güven: %{forecastData.users.ltv.confidence}
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Müşteri Segment Tahminleri</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📊 Segment tahmin grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Cohort Projeksiyon</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">👥 Cohort tahmin analizi burada görünecek</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'inventory' && (
						<div className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg p-6">
									<h3 className="font-semibold text-gray-900 mb-4">Stok Tükenmesi Riski</h3>
									<div className="text-3xl font-bold text-red-600 mb-2">
										{forecastData.inventory.stockouts.predicted}
									</div>
									<div className="text-sm text-gray-600">
										ürün için risk var (Şu an: {forecastData.inventory.stockouts.current})
									</div>
									<div className="mt-4 text-xs text-gray-500">
										Güven: %{forecastData.inventory.stockouts.confidence}
									</div>
								</div>

								<div className="bg-white border rounded-lg p-6">
									<h3 className="font-semibold text-gray-900 mb-4">Talep Artışı Tahminleri</h3>
									{forecastData.inventory.demandSpikes.length === 0 ? (
										<div className="text-center py-8">
											<div className="text-gray-400 mb-2">📦</div>
											<p className="text-gray-500">Henüz talep tahmini yok</p>
										</div>
									) : (
										<div className="space-y-3">
											{forecastData.inventory.demandSpikes.map((item, index) => (
											<div key={index} className="flex justify-between items-center">
												<div>
													<div className="font-medium text-gray-900">{item.product}</div>
													<div className="text-xs text-gray-500">%{item.probability} olasılık</div>
												</div>
												<div className="text-right">
													<div className="font-semibold text-green-600">+%{item.expectedIncrease}</div>
													<div className="text-xs text-gray-500">talep artışı</div>
												</div>
											</div>
											))}
										</div>
									)}
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Envanter Optimizasyon Önerileri</h4>
								</div>
								<div className="p-4">
									<div className="space-y-4">
										<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
											<div className="flex items-start space-x-3">
												<span className="text-blue-600 text-xl">💡</span>
												<div>
													<h5 className="font-semibold text-blue-900">Stok Seviyesi Optimizasyonu</h5>
													<p className="text-sm text-blue-700 mt-1">
														Anime figür kategorisinde güvenlik stoku %20 artırmanız önerilir. 
														Önümüzdeki 30 gün içinde %78 olasılıkla talep artışı bekleniyor.
													</p>
												</div>
											</div>
										</div>

										<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
											<div className="flex items-start space-x-3">
												<span className="text-green-600 text-xl">📈</span>
												<div>
													<h5 className="font-semibold text-green-900">Tedarik Zamanlaması</h5>
													<p className="text-sm text-green-700 mt-1">
														Vintage poster kategorisinde 15 gün içinde yeni sipariş vermeniz önerilir. 
														Mevcut stok 45 gün sonra tükenecek.
													</p>
												</div>
											</div>
										</div>

										<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
											<div className="flex items-start space-x-3">
												<span className="text-yellow-600 text-xl">⚠️</span>
												<div>
													<h5 className="font-semibold text-yellow-900">Mevsimsel Hazırlık</h5>
													<p className="text-sm text-yellow-700 mt-1">
														Aralık ayı için teknoloji ürünlerinde %40 stok artışı yapmanız önerilir. 
														Yılbaşı kampanyaları için hazırlık yapın.
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'scenarios' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Senaryo Analizi</h3>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
									<h4 className="font-semibold text-green-900 mb-3">🎯 İyimser Senaryo</h4>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-green-700">Gelir Artışı:</span>
											<span className="font-bold text-green-800">%0</span>
										</div>
										<div className="flex justify-between">
											<span className="text-green-700">Müşteri Artışı:</span>
											<span className="font-bold text-green-800">%0</span>
										</div>
										<div className="flex justify-between">
											<span className="text-green-700">Olasılık:</span>
											<span className="font-bold text-green-800">%0</span>
										</div>
									</div>
									<div className="mt-4 text-xs text-green-600">
										Henüz veri yok
									</div>
								</div>

								<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
									<h4 className="font-semibold text-blue-900 mb-3">⚖️ Gerçekçi Senaryo</h4>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-blue-700">Gelir Artışı:</span>
											<span className="font-bold text-blue-800">%0</span>
										</div>
										<div className="flex justify-between">
											<span className="text-blue-700">Müşteri Artışı:</span>
											<span className="font-bold text-blue-800">%0</span>
										</div>
										<div className="flex justify-between">
											<span className="text-blue-700">Olasılık:</span>
											<span className="font-bold text-blue-800">%0</span>
										</div>
									</div>
									<div className="mt-4 text-xs text-blue-600">
										Henüz veri yok
									</div>
								</div>

								<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
									<h4 className="font-semibold text-orange-900 mb-3">⚠️ Kötümser Senaryo</h4>
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-orange-700">Gelir Artışı:</span>
											<span className="font-bold text-orange-800">%0</span>
										</div>
										<div className="flex justify-between">
											<span className="text-orange-700">Müşteri Artışı:</span>
											<span className="font-bold text-orange-800">%0</span>
										</div>
										<div className="flex justify-between">
											<span className="text-orange-700">Olasılık:</span>
											<span className="font-bold text-orange-800">%0</span>
										</div>
									</div>
									<div className="mt-4 text-xs text-orange-600">
										Henüz veri yok
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Monte Carlo Simulasyonu</h4>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">🎲 Monte Carlo simulasyon sonuçları burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Risk Faktörleri</h4>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Enflasyon Etkisi</span>
												<span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
													Yüksek Risk
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Tedarik Zinciri</span>
												<span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
													Orta Risk
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Rekabet Artışı</span>
												<span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
													Düşük Risk
												</span>
											</div>
											<div className="flex items-center justify-between">
												<span className="text-gray-700">Teknoloji Değişimi</span>
												<span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
													Fırsat
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Aksiyon Önerileri</h4>
									</div>
									<div className="p-4">
										<div className="space-y-3">
											<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
												<div className="font-medium text-blue-900">📊 Veri Toplama</div>
												<div className="text-sm text-blue-700 mt-1">
													Daha doğru tahminler için müşteri davranış verilerini artırın
												</div>
											</div>
											<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
												<div className="font-medium text-green-900">🎯 Stratejik Planlama</div>
												<div className="text-sm text-green-700 mt-1">
													İyimser senaryolar için kaynak tahsisini gözden geçirin
												</div>
											</div>
											<div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
												<div className="font-medium text-orange-900">⚠️ Risk Yönetimi</div>
												<div className="text-sm text-orange-700 mt-1">
													Kötümser senaryolar için acil durum planları hazırlayın
												</div>
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
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-purple-900">Custom Model</h3>
					</div>
					<p className="text-purple-700 mb-4">Özel tahmin modeli oluşturun.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Model Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-blue-900">Otomatik Uyarılar</h3>
					</div>
					<p className="text-blue-700 mb-4">Tahmin sapmaları için uyarı sistemi.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Uyarı Kurulumu
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-green-900">Rapor Dışa Aktar</h3>
					</div>
					<p className="text-green-700 mb-4">Detaylı tahmin raporları oluşturun.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Rapor Oluştur
					</button>
				</div>
			</div>
		</div>
	);
}
