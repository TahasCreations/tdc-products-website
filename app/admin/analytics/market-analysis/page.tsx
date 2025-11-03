"use client";

import { useState } from 'react';

export default function MarketAnalysisPage() {
	const [selectedMarket, setSelectedMarket] = useState('ecommerce');
	const [analysisType, setAnalysisType] = useState('competitor');
	const [activeTab, setActiveTab] = useState('overview');

	const marketData = {
		ecommerce: {
			size: '0',
			growth: '0',
			segments: []
		},
		retail: {
			size: '0',
			growth: '0',
			segments: []
		}
	};

	const competitors: any[] = [];
	const trends: any[] = [];
	const opportunities: any[] = [];
	const threats: any[] = [];

	const swotAnalysis = {
		strengths: [],
		weaknesses: [],
		opportunities: [],
		threats: []
	};

	const formatCurrency = (amount: string) => {
		return `$${amount}`;
	};

	const getPotentialColor = (potential: string) => {
		switch (potential) {
			case 'Çok Yüksek': return 'text-green-700 bg-green-100';
			case 'Yüksek': return 'text-blue-700 bg-blue-100';
			case 'Orta': return 'text-yellow-700 bg-yellow-100';
			case 'Düşük': return 'text-gray-700 bg-gray-100';
			default: return 'text-gray-700 bg-gray-100';
		}
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'Yüksek': return 'text-red-700 bg-red-100';
			case 'Orta': return 'text-yellow-700 bg-yellow-100';
			case 'Düşük': return 'text-green-700 bg-green-100';
			default: return 'text-gray-700 bg-gray-100';
		}
	};

	const getTrendColor = (category: string) => {
		switch (category) {
			case 'Teknoloji': return 'bg-blue-100 text-blue-800';
			case 'Sosyal Trend': return 'bg-green-100 text-green-800';
			case 'Pazarlama': return 'bg-purple-100 text-purple-800';
			case 'Lojistik': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Pazar Analizi</h1>
					<p className="text-gray-600">Rakip analizi ve pazar fırsatları</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={selectedMarket}
						onChange={(e) => setSelectedMarket(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="ecommerce">E-ticaret</option>
						<option value="retail">Perakende</option>
						<option value="tech">Teknoloji</option>
					</select>
					<select 
						value={analysisType}
						onChange={(e) => setAnalysisType(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="competitor">Rakip Analizi</option>
						<option value="market">Pazar Büyüklüğü</option>
						<option value="trend">Trend Analizi</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Market Overview Cards */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<h3 className="text-lg font-semibold text-blue-900 mb-2">Pazar Büyüklüğü</h3>
					<div className="text-3xl font-bold text-blue-700">
						{formatCurrency(marketData[selectedMarket as keyof typeof marketData]?.size || '0')}
					</div>
					<div className="text-sm text-blue-600 mt-1">Global değer</div>
				</div>
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<h3 className="text-lg font-semibold text-green-900 mb-2">Büyüme Oranı</h3>
					<div className="text-3xl font-bold text-green-700">
						%{marketData[selectedMarket as keyof typeof marketData]?.growth || '0'}
					</div>
					<div className="text-sm text-green-600 mt-1">Yıllık büyüme</div>
				</div>
				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<h3 className="text-lg font-semibold text-purple-900 mb-2">Rakip Sayısı</h3>
					<div className="text-3xl font-bold text-purple-700">0</div>
					<div className="text-sm text-purple-600 mt-1">Ana rakip</div>
				</div>
				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<h3 className="text-lg font-semibold text-orange-900 mb-2">Pazar Payımız</h3>
					<div className="text-3xl font-bold text-orange-700">%0</div>
					<div className="text-sm text-orange-600 mt-1">Hedef: %0</div>
				</div>
			</div>

			{/* Main Content Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'competitors', label: 'Rakip Analizi', icon: '🏢' },
							{ key: 'trends', label: 'Trend Analizi', icon: '📈' },
							{ key: 'opportunities', label: 'Fırsatlar', icon: '🎯' },
							{ key: 'swot', label: 'SWOT Analizi', icon: '⚖️' }
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
							<h3 className="text-lg font-semibold text-gray-900">Pazar Genel Durumu</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Segment Dağılımı</h4>
									</div>
									<div className="p-4">
										{marketData[selectedMarket as keyof typeof marketData]?.segments.length === 0 ? (
											<div className="text-center py-8">
												<div className="text-gray-400 mb-2">📊</div>
												<p className="text-gray-500">Henüz segment verisi yok</p>
											</div>
										) : (
											<div className="space-y-4">
												{marketData[selectedMarket as keyof typeof marketData]?.segments.map((segment, index) => (
												<div key={index} className="flex justify-between items-center">
													<div>
														<div className="font-medium text-gray-900">{segment.name}</div>
														<div className="text-sm text-gray-600">{formatCurrency(segment.size)}</div>
													</div>
													<div className="text-right">
														<div className="font-semibold text-green-600">%{segment.growth}</div>
														<div className="text-xs text-gray-500">büyüme</div>
													</div>
												</div>
												))}
											</div>
										)}
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Pazar Payı Dağılımı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🥧 Pazar payı grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">📊</span>
										<h4 className="font-semibold text-blue-900">Büyüme Dinamikleri</h4>
									</div>
									<div className="space-y-2 text-sm text-blue-800">
										<div>• Mobil ticaret %67 artış</div>
										<div>• Sosyal medya etkisi güçleniyor</div>
										<div>• Same-day delivery beklentisi</div>
										<div>• Kişiselleştirme talebi</div>
									</div>
								</div>

								<div className="bg-green-50 border border-green-200 rounded-lg p-6">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">💡</span>
										<h4 className="font-semibold text-green-900">Yeni Fırsatlar</h4>
									</div>
									<div className="space-y-2 text-sm text-green-800">
										<div>• AR/VR deneyim teknolojileri</div>
										<div>• Sürdürülebilir ürün talebi</div>
										<div>• B2B marketplace büyümesi</div>
										<div>• Mikro-influencer pazarlaması</div>
									</div>
								</div>

								<div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">⚠️</span>
										<h4 className="font-semibold text-orange-900">Dikkat Alanları</h4>
									</div>
									<div className="space-y-2 text-sm text-orange-800">
										<div>• Artan rekabet baskısı</div>
										<div>• Müşteri edinme maliyeti artışı</div>
										<div>• Platform bağımlılığı riski</div>
										<div>• Siber güvenlik tehditleri</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'competitors' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Rakip Analizi Detayları</h3>

							{competitors.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">🏢</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Rakip Verisi Yok</h3>
									<p className="text-gray-600">Rakip eklendiğinde detaylı analizler burada görünecek.</p>
								</div>
							) : (
								<div className="space-y-6">
									{competitors.map((competitor, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<h4 className="text-xl font-semibold text-gray-900 mb-2">{competitor.name}</h4>
												<div className="grid md:grid-cols-4 gap-4 mb-4">
													<div>
														<div className="text-sm text-gray-600">Pazar Payı</div>
														<div className="text-lg font-bold text-blue-600">%{competitor.marketShare}</div>
													</div>
													<div>
														<div className="text-sm text-gray-600">Gelir</div>
														<div className="text-lg font-bold text-green-600">{formatCurrency(competitor.revenue)}</div>
													</div>
													<div>
														<div className="text-sm text-gray-600">Büyüme</div>
														<div className="text-lg font-bold text-purple-600">%{competitor.growth}</div>
													</div>
													<div>
														<div className="text-sm text-gray-600">Trafik (Aylık)</div>
														<div className="text-lg font-bold text-orange-600">{competitor.traffic}</div>
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-2xl font-bold text-yellow-600">★ {competitor.rating}</div>
												<div className="text-sm text-gray-500">Müşteri Puanı</div>
											</div>
										</div>

										<div className="grid md:grid-cols-2 gap-6">
											<div>
												<h5 className="font-semibold text-green-900 mb-3">💪 Güçlü Yanları</h5>
												<div className="space-y-2">
													{competitor.strengths.map((strength, i) => (
														<div key={i} className="flex items-center space-x-2">
															<span className="w-2 h-2 bg-green-500 rounded-full"></span>
															<span className="text-sm text-gray-700">{strength}</span>
														</div>
													))}
												</div>
											</div>
											<div>
												<h5 className="font-semibold text-red-900 mb-3">🎯 Zayıf Yanları</h5>
												<div className="space-y-2">
													{competitor.weaknesses.map((weakness, i) => (
														<div key={i} className="flex items-center space-x-2">
															<span className="w-2 h-2 bg-red-500 rounded-full"></span>
															<span className="text-sm text-gray-700">{weakness}</span>
														</div>
													))}
												</div>
											</div>
										</div>
									</div>
									))}
								</div>
							)}

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Rakip Karşılaştırma Matrisi</h4>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 Detaylı karşılaştırma tablosu burada görünecek</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'trends' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Pazar Trend Analizi</h3>

							{trends.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">📈</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Trend Verisi Yok</h3>
									<p className="text-gray-600">Pazar trendleri analiz edildiğinde burada görünecek.</p>
								</div>
							) : (
								<div className="grid gap-6">
									{trends.map((trend, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="text-lg font-semibold text-gray-900">{trend.name}</h4>
													<span className={`px-3 py-1 text-xs font-semibold rounded-full ${getTrendColor(trend.category)}`}>
														{trend.category}
													</span>
													<span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
														{trend.timeframe}
													</span>
												</div>
												<p className="text-gray-600 mb-3">{trend.description}</p>
												<div className="text-sm text-gray-500">
													📈 Büyüme: <span className="font-semibold text-green-600">{trend.growth}</span>
												</div>
											</div>
											<div className="text-right">
												<div className="text-2xl font-bold text-indigo-600">{trend.impact}</div>
												<div className="text-sm text-gray-500">Etki Skoru</div>
											</div>
										</div>

										<div className="w-full bg-gray-200 rounded-full h-3">
											<div 
												className="bg-indigo-600 h-3 rounded-full"
												style={{ width: `${trend.impact}%` }}
											></div>
										</div>
									</div>
									))}
								</div>
							)}

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Trend Kategorileri</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📊 Trend kategorisi dağılımı burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Zaman Çizelgesi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">⏱️ Trend zaman çizelgesi burada görünecek</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'opportunities' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Büyüme Fırsatları ve Tehditler</h3>

							<div className="grid md:grid-cols-2 gap-8">
								{/* Opportunities */}
								<div>
									<h4 className="text-lg font-semibold text-green-900 mb-4">🎯 Fırsatlar</h4>
									{opportunities.length === 0 ? (
										<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
											<div className="text-4xl mb-4">🎯</div>
											<p className="text-gray-600">Henüz fırsat verisi yok</p>
										</div>
									) : (
										<div className="space-y-4">
											{opportunities.map((opp, index) => (
											<div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
												<div className="flex items-start justify-between mb-3">
													<h5 className="font-semibold text-green-900">{opp.title}</h5>
													<span className={`px-2 py-1 text-xs font-medium rounded-full ${getPotentialColor(opp.potential)}`}>
														{opp.potential}
													</span>
												</div>
												<p className="text-sm text-green-800 mb-3">{opp.description}</p>
												<div className="grid grid-cols-2 gap-4 text-sm">
													<div>
														<span className="text-green-700">💰 Potansiyel Gelir:</span>
														<div className="font-semibold">{formatCurrency(opp.revenue)}</div>
													</div>
													<div>
														<span className="text-green-700">⏱️ Süre:</span>
														<div className="font-semibold">{opp.timeline}</div>
													</div>
													<div>
														<span className="text-green-700">💲 Yatırım:</span>
														<div className="font-semibold">{opp.investment}</div>
													</div>
													<div>
														<span className="text-green-700">🎯 Olasılık:</span>
														<div className="font-semibold">%{opp.probability}</div>
													</div>
												</div>
											</div>
											))}
										</div>
									)}
								</div>

								{/* Threats */}
								<div>
									<h4 className="text-lg font-semibold text-red-900 mb-4">⚠️ Tehditler</h4>
									{threats.length === 0 ? (
										<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
											<div className="text-4xl mb-4">⚠️</div>
											<p className="text-gray-600">Henüz tehdit verisi yok</p>
										</div>
									) : (
										<div className="space-y-4">
											{threats.map((threat, index) => (
											<div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
												<div className="flex items-start justify-between mb-3">
													<h5 className="font-semibold text-red-900">{threat.title}</h5>
													<span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(threat.severity)}`}>
														{threat.severity}
													</span>
												</div>
												<div className="text-sm text-red-800 mb-3">
													<div className="mb-2"><strong>Etki:</strong> {threat.impact}</div>
													<div className="mb-2"><strong>Süre:</strong> {threat.timeline}</div>
													<div><strong>Olasılık:</strong> %{threat.probability}</div>
												</div>
												<div className="bg-red-100 border border-red-200 rounded p-3">
													<div className="text-xs text-red-700 font-medium mb-1">🛡️ Önlem Stratejisi:</div>
													<div className="text-xs text-red-800">{threat.mitigation}</div>
												</div>
											</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{activeTab === 'swot' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">SWOT Analizi</h3>

							<div className="grid md:grid-cols-2 gap-6">
								{/* Strengths */}
								<div className="bg-green-50 border border-green-200 rounded-lg p-6">
									<h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
										<span className="mr-2">💪</span>
										Güçlü Yanlar (Strengths)
									</h4>
									{swotAnalysis.strengths.length === 0 ? (
										<div className="text-center py-8">
											<p className="text-gray-500">Henüz veri yok</p>
										</div>
									) : (
										<div className="space-y-3">
											{swotAnalysis.strengths.map((strength, index) => (
											<div key={index} className="flex items-center space-x-3">
												<span className="w-2 h-2 bg-green-600 rounded-full"></span>
												<span className="text-green-800">{strength}</span>
											</div>
											))}
										</div>
									)}
								</div>

								{/* Weaknesses */}
								<div className="bg-red-50 border border-red-200 rounded-lg p-6">
									<h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
										<span className="mr-2">🎯</span>
										Zayıf Yanlar (Weaknesses)
									</h4>
									{swotAnalysis.weaknesses.length === 0 ? (
										<div className="text-center py-8">
											<p className="text-gray-500">Henüz veri yok</p>
										</div>
									) : (
										<div className="space-y-3">
											{swotAnalysis.weaknesses.map((weakness, index) => (
											<div key={index} className="flex items-center space-x-3">
												<span className="w-2 h-2 bg-red-600 rounded-full"></span>
												<span className="text-red-800">{weakness}</span>
											</div>
											))}
										</div>
									)}
								</div>

								{/* Opportunities */}
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
									<h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
										<span className="mr-2">🚀</span>
										Fırsatlar (Opportunities)
									</h4>
									{swotAnalysis.opportunities.length === 0 ? (
										<div className="text-center py-8">
											<p className="text-gray-500">Henüz veri yok</p>
										</div>
									) : (
										<div className="space-y-3">
											{swotAnalysis.opportunities.map((opportunity, index) => (
											<div key={index} className="flex items-center space-x-3">
												<span className="w-2 h-2 bg-blue-600 rounded-full"></span>
												<span className="text-blue-800">{opportunity}</span>
											</div>
											))}
										</div>
									)}
								</div>

								{/* Threats */}
								<div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
									<h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
										<span className="mr-2">⚠️</span>
										Tehditler (Threats)
									</h4>
									{swotAnalysis.threats.length === 0 ? (
										<div className="text-center py-8">
											<p className="text-gray-500">Henüz veri yok</p>
										</div>
									) : (
										<div className="space-y-3">
											{swotAnalysis.threats.map((threat, index) => (
											<div key={index} className="flex items-center space-x-3">
												<span className="w-2 h-2 bg-orange-600 rounded-full"></span>
												<span className="text-orange-800">{threat}</span>
											</div>
											))}
										</div>
									)}
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">SWOT Strateji Matrisi</h4>
								</div>
								<div className="p-4">
									<div className="grid md:grid-cols-2 gap-6">
										<div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
											<h5 className="font-semibold text-gray-900 mb-2">SO Stratejisi (Saldırgan)</h5>
											<p className="text-sm text-gray-700">
												Güçlü yanlarınızı kullanarak fırsatları değerlendirin. 
												Teknoloji altyapınızı dijital dönüşüm trendleriyle birleştirin.
											</p>
										</div>
										<div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border">
											<h5 className="font-semibold text-gray-900 mb-2">ST Stratejisi (Çeşitlendirme)</h5>
											<p className="text-sm text-gray-700">
												Güçlü yanlarınızı tehditleri azaltmak için kullanın. 
												Esnek yapınızla rekabet baskısına karşı durun.
											</p>
										</div>
										<div className="bg-gradient-to-r from-yellow-50 to-green-50 p-4 rounded-lg border">
											<h5 className="font-semibold text-gray-900 mb-2">WO Stratejisi (Gözden Geçirme)</h5>
											<p className="text-sm text-gray-700">
												Zayıf yanlarınızı iyileştirerek fırsatları yakalayın. 
												Marka bilinirliğinizi artırarak niş pazarlara girin.
											</p>
										</div>
										<div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border">
											<h5 className="font-semibold text-gray-900 mb-2">WT Stratejisi (Savunma)</h5>
											<p className="text-sm text-gray-700">
												Zayıflıkları azaltıp tehditleri minimize edin. 
												Platform bağımlılığını azaltarak risk yönetimi yapın.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Action Items */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-blue-900">Detaylı Analiz</h3>
					</div>
					<p className="text-blue-700 mb-4">Özel rakip araştırması ve pazar segmentasyonu.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Talep Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-green-900">Otomasyon</h3>
					</div>
					<p className="text-green-700 mb-4">Rakip takibi ve pazar değişiklik uyarıları.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Uyarıları Kur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-purple-900">Strateji Planlama</h3>
					</div>
					<p className="text-purple-700 mb-4">Analiz sonuçlarına göre aksiyon planı oluştur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Plan Oluştur
					</button>
				</div>
			</div>
		</div>
	);
}
