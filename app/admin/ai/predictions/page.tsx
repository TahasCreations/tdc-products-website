"use client";

import { useState } from 'react';

export default function PredictionsPage() {
	const [activeTab, setActiveTab] = useState('revenue');
	const [selectedModel, setSelectedModel] = useState('arima');
	const [forecastPeriod, setForecastPeriod] = useState('3m');

	const models = [
		{ value: 'arima', label: 'ARIMA', accuracy: 92.5 },
		{ value: 'lstm', label: 'LSTM Neural Network', accuracy: 94.2 },
		{ value: 'prophet', label: 'Facebook Prophet', accuracy: 89.8 },
		{ value: 'linear', label: 'Linear Regression', accuracy: 85.3 }
	];

	const predictions = {
		revenue: {
			current: 234567.80,
			predicted: 289450.25,
			growth: 23.4,
			confidence: 87.5,
			trend: 'increasing'
		},
		customers: {
			current: 15420,
			predicted: 18950,
			growth: 22.9,
			confidence: 91.2,
			trend: 'increasing'
		},
		orders: {
			current: 8750,
			predicted: 10890,
			growth: 24.5,
			confidence: 89.3,
			trend: 'increasing'
		},
		inventory: {
			current: 2340,
			predicted: 1890,
			growth: -19.2,
			confidence: 85.7,
			trend: 'decreasing'
		}
	};

	const scenarios = [
		{
			name: 'Optimistik',
			description: 'En iyi durum senaryosu',
			revenue: 315000,
			probability: 25,
			color: 'green'
		},
		{
			name: 'Gerçekçi',
			description: 'Mevcut trend devam ediyor',
			revenue: 289450,
			probability: 50,
			color: 'blue'
		},
		{
			name: 'Pesimistik',
			description: 'En kötü durum senaryosu',
			revenue: 245000,
			probability: 25,
			color: 'red'
		}
	];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getTrendIcon = (trend: string) => {
		return trend === 'increasing' ? '📈' : trend === 'decreasing' ? '📉' : '➡️';
	};

	const getTrendColor = (trend: string) => {
		return trend === 'increasing' ? 'text-green-600' : trend === 'decreasing' ? 'text-red-600' : 'text-gray-600';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Gelecek Tahminleri</h1>
					<p className="text-gray-600">AI destekli iş tahminleri ve senaryo analizi</p>
				</div>
				<div className="flex items-center space-x-2">
					<span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
					<span className="text-sm text-green-600 font-medium">AI Modeli Aktif</span>
				</div>
			</div>

			{/* Model Selection */}
			<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
				<div className="flex items-center mb-4">
					<span className="text-2xl mr-3">🤖</span>
					<h3 className="text-lg font-semibold text-indigo-900">Tahmin Modeli Ayarları</h3>
				</div>
				<div className="grid md:grid-cols-3 gap-4">
					<div>
						<label className="block text-sm font-medium text-indigo-700 mb-2">Tahmin Modeli</label>
						<select
							value={selectedModel}
							onChange={(e) => setSelectedModel(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
						>
							{models.map(model => (
								<option key={model.value} value={model.value}>
									{model.label} (Doğruluk: %{model.accuracy})
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-sm font-medium text-indigo-700 mb-2">Tahmin Süresi</label>
						<select
							value={forecastPeriod}
							onChange={(e) => setForecastPeriod(e.target.value)}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
						>
							<option value="1m">1 Ay</option>
							<option value="3m">3 Ay</option>
							<option value="6m">6 Ay</option>
							<option value="1y">1 Yıl</option>
						</select>
					</div>
					<div className="flex items-end">
						<button className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
							Tahmin Güncelle
						</button>
					</div>
				</div>
			</div>

			{/* Prediction Cards */}
			<div className="grid md:grid-cols-4 gap-4">
				{Object.entries(predictions).map(([key, data]) => (
					<div key={key} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900 capitalize">
								{key === 'revenue' ? 'Gelir' : key === 'customers' ? 'Müşteriler' : key === 'orders' ? 'Siparişler' : 'Envanter'}
							</h3>
							<span className={`text-2xl ${getTrendColor(data.trend)}`}>
								{getTrendIcon(data.trend)}
							</span>
						</div>
						
						<div className="space-y-3">
							<div>
								<div className="text-sm text-gray-600">Mevcut</div>
								<div className="text-xl font-bold text-gray-900">
									{key === 'revenue' ? formatCurrency(data.current) : data.current.toLocaleString()}
								</div>
							</div>
							
							<div>
								<div className="text-sm text-gray-600">Tahmini ({forecastPeriod})</div>
								<div className="text-xl font-bold text-indigo-600">
									{key === 'revenue' ? formatCurrency(data.predicted) : data.predicted.toLocaleString()}
								</div>
							</div>
							
							<div className="flex items-center justify-between">
								<div className={`text-sm font-medium ${data.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
									{data.growth > 0 ? '+' : ''}{data.growth.toFixed(1)}%
								</div>
								<div className="text-sm text-gray-500">
									Güven: %{data.confidence}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'revenue', label: 'Gelir Tahminleri', icon: '💰' },
							{ key: 'customers', label: 'Müşteri Tahminleri', icon: '👥' },
							{ key: 'inventory', label: 'Envanter Tahminleri', icon: '📦' },
							{ key: 'scenarios', label: 'Senaryo Analizi', icon: '🎭' }
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
							<h3 className="text-lg font-semibold text-gray-900">Gelir Tahmin Analizi</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Gelir Trend Grafiği</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Gelir tahmin grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Güven Aralığı</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 Güven aralığı grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
								<h4 className="font-semibold text-blue-900 mb-2">Tahmin Özeti</h4>
								<p className="text-blue-700">
									Mevcut trendler devam ettiği takdirde, gelecek {forecastPeriod === '3m' ? '3 ay' : forecastPeriod} içinde 
									gelirinizin <strong>%{predictions.revenue.growth.toFixed(1)}</strong> artarak 
									<strong> {formatCurrency(predictions.revenue.predicted)}</strong> seviyesine ulaşması bekleniyor.
								</p>
							</div>
						</div>
					)}

					{activeTab === 'customers' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Müşteri Büyüme Tahminleri</h3>
							<div className="text-center text-gray-500">
								<p>Müşteri büyüme tahmin grafikleri ve analizleri burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'inventory' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Envanter Talep Tahminleri</h3>
							<div className="text-center text-gray-500">
								<p>Envanter talep tahminleri ve stok optimizasyon önerileri burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'scenarios' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Senaryo Analizi</h3>
							
							<div className="grid md:grid-cols-3 gap-6">
								{scenarios.map((scenario, index) => (
									<div key={index} className={`border rounded-lg p-6 ${
										scenario.color === 'green' ? 'bg-green-50 border-green-200' :
										scenario.color === 'blue' ? 'bg-blue-50 border-blue-200' :
										'bg-red-50 border-red-200'
									}`}>
										<div className="flex items-center mb-4">
											<span className="text-2xl mr-3">
												{scenario.color === 'green' ? '🚀' : scenario.color === 'blue' ? '📊' : '⚠️'}
											</span>
											<h4 className={`text-lg font-semibold ${
												scenario.color === 'green' ? 'text-green-900' :
												scenario.color === 'blue' ? 'text-blue-900' :
												'text-red-900'
											}`}>
												{scenario.name}
											</h4>
										</div>
										
										<p className={`mb-4 ${
											scenario.color === 'green' ? 'text-green-700' :
											scenario.color === 'blue' ? 'text-blue-700' :
											'text-red-700'
										}`}>
											{scenario.description}
										</p>
										
										<div className="space-y-2">
											<div className={`text-2xl font-bold ${
												scenario.color === 'green' ? 'text-green-600' :
												scenario.color === 'blue' ? 'text-blue-600' :
												'text-red-600'
											}`}>
												{formatCurrency(scenario.revenue)}
											</div>
											<div className={`text-sm ${
												scenario.color === 'green' ? 'text-green-600' :
												scenario.color === 'blue' ? 'text-blue-600' :
												'text-red-600'
											}`}>
												Olasılık: %{scenario.probability}
											</div>
										</div>
									</div>
								))}
							</div>

							<div className="bg-gray-50 p-4 rounded-lg">
								<h4 className="font-semibold text-gray-900 mb-2">Senaryo Değerlendirmesi</h4>
								<p className="text-gray-700">
									Mevcut pazar koşulları ve iç dinamikler göz önüne alındığında, <strong>Gerçekçi</strong> senaryonun 
									gerçekleşme olasılığı en yüksektir. Ancak pazarlama yatırımlarını artırarak <strong>Optimistik</strong> 
									senaryoya ulaşmak mümkündür.
								</p>
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
						<h3 className="text-lg font-semibold text-blue-900">Hedef Belirleme</h3>
					</div>
					<p className="text-blue-700 mb-4">Tahminlere dayalı gerçekçi hedefler belirle.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Hedef Belirle
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-green-900">Otomatik Uyarılar</h3>
					</div>
					<p className="text-green-700 mb-4">Tahmin sapmaları için uyarı sistemi kur.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Uyarı Kur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Model Optimizasyonu</h3>
					</div>
					<p className="text-purple-700 mb-4">AI modelini daha da iyileştir.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Model Eğit
					</button>
				</div>
			</div>
		</div>
	);
}
