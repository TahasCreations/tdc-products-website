"use client";

import { useState } from 'react';

export default function MarketIntelligencePage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedCategory, setSelectedCategory] = useState('figur-koleksiyon');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [results, setResults] = useState<any>(null);

	// Demo veriler temizlendi - API'den gerçek veriler gelecek
	const marketData = {
		marketSize: 0,
		growth: 0,
		competitors: 0,
		marketShare: 0,
		opportunities: 0,
		threats: 0
	};

	const competitors: any[] = [];

	const handleAnalyze = async () => {
		setIsAnalyzing(true);
		
		try {
			const response = await fetch('/api/ai/market-intelligence', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					category: selectedCategory,
					region: 'TR',
					timeframe: '6months'
				})
			});
			
			if (response.ok) {
				const data = await response.json();
				setResults(data.data);
			} else {
				// Fallback to mock data
				setResults({ marketOverview: marketData, competitors, opportunities: [], threats: [] });
			}
		} catch (error) {
			console.error('Market intelligence error:', error);
			setResults({ marketOverview: marketData, competitors, opportunities: [], threats: [] });
		} finally {
			setIsAnalyzing(false);
		}
	};

	const trends = [
		{
			id: 1,
			title: 'Sürdürülebilir Ürünlere Talep Artışı',
			impact: 'high',
			probability: 85,
			timeframe: '6-12 ay',
			description: 'Tüketiciler çevre dostu ürünlere yönelim gösteriyor',
			opportunity: true
		},
		{
			id: 2,
			title: 'E-ticaret Penetrasyonu Artışı',
			impact: 'high',
			probability: 92,
			timeframe: '3-6 ay',
			description: 'Online alışveriş oranı hızla artmaya devam ediyor',
			opportunity: true
		},
		{
			id: 3,
			title: 'Tedarik Zinciri Sorunları',
			impact: 'medium',
			probability: 70,
			timeframe: '1-3 ay',
			description: 'Global tedarik zincirinde aksamalar devam ediyor',
			opportunity: false
		},
		{
			id: 4,
			title: 'Yapay Zeka Entegrasyonu',
			impact: 'high',
			probability: 78,
			timeframe: '12+ ay',
			description: 'AI teknolojilerinin iş süreçlerine entegrasyonu',
			opportunity: true
		}
	];

	const swotAnalysis = {
		strengths: [
			'Güçlü teknoloji altyapısı',
			'Deneyimli ekip',
			'Esnek operasyon modeli',
			'Müşteri odaklı yaklaşım'
		],
		weaknesses: [
			'Sınırlı marka bilinirliği',
			'Küçük pazar payı',
			'Sınırlı pazarlama bütçesi',
			'Coğrafi kısıtlılık'
		],
		opportunities: [
			'Büyüyen e-ticaret pazarı',
			'Dijital dönüşüm trendi',
			'Sürdürülebilirlik odağı',
			'Yeni pazar segmentleri'
		],
		threats: [
			'Büyük rakiplerin agresif stratejileri',
			'Ekonomik belirsizlik',
			'Regülasyon değişiklikleri',
			'Teknolojik değişim hızı'
		]
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	};

	const getThreatColor = (threat: string) => {
		switch (threat) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getImpactColor = (impact: string) => {
		switch (impact) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Pazar Analizi & İstihbarat</h1>
					<p className="text-gray-600">Kapsamlı pazar analizi, rakip izleme ve trend takibi</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="figur-koleksiyon">Figür & Koleksiyon</option>
						<option value="moda-aksesuar">Moda & Aksesuar</option>
						<option value="elektronik">Elektronik</option>
						<option value="ev-yasam">Ev & Yaşam</option>
					</select>
					<button 
						onClick={handleAnalyze}
						disabled={isAnalyzing}
						className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
					>
						{isAnalyzing ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Analiz ediliyor...</span>
							</>
						) : (
							<>
								<span>📊</span>
								<span>Pazar Analizi</span>
							</>
						)}
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Market Overview */}
			<div className="grid md:grid-cols-6 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{formatCurrency(marketData.marketSize)}</div>
					<div className="text-sm text-blue-600">Pazar Büyüklüğü</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">%{marketData.growth}</div>
					<div className="text-sm text-green-600">Yıllık Büyüme</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{marketData.competitors}</div>
					<div className="text-sm text-purple-600">Aktif Rakip</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">%{marketData.marketShare}</div>
					<div className="text-sm text-orange-600">Pazar Payımız</div>
				</div>
				<div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
					<div className="text-2xl font-bold text-emerald-700">{marketData.opportunities}</div>
					<div className="text-sm text-emerald-600">Fırsatlar</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{marketData.threats}</div>
					<div className="text-sm text-red-600">Tehditler</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Pazar Genel Bakış', icon: '🌍' },
							{ key: 'competitors', label: 'Rakip Analizi', icon: '🏢' },
							{ key: 'trends', label: 'Trendler & Fırsatlar', icon: '📈' },
							{ key: 'swot', label: 'SWOT Analizi', icon: '🎯' }
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
							<h3 className="text-lg font-semibold text-gray-900">Pazar Durumu Özeti</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Pazar Büyüme Trendi</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Pazar büyüme grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Pazar Payı Dağılımı</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">🥧 Pazar payı grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
								<h4 className="font-semibold text-blue-900 mb-3">Pazar Öngörüleri</h4>
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<h5 className="font-medium text-blue-800 mb-2">Büyüme Faktörleri</h5>
										<ul className="text-blue-700 text-sm space-y-1">
											<li>• Dijital dönüşüm hızlanması</li>
											<li>• E-ticaret penetrasyonu artışı</li>
											<li>• Mobil kullanım yaygınlaşması</li>
											<li>• Sürdürülebilirlik odağı</li>
										</ul>
									</div>
									<div>
										<h5 className="font-medium text-blue-800 mb-2">Riskler</h5>
										<ul className="text-blue-700 text-sm space-y-1">
											<li>• Ekonomik belirsizlik</li>
											<li>• Regülasyon değişiklikleri</li>
											<li>• Tedarik zinciri sorunları</li>
											<li>• Artan rekabet</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'competitors' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Rakip Analizi</h3>
							
							<div className="space-y-6">
								{competitors.map((competitor, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div>
												<h4 className="text-lg font-semibold text-gray-900">{competitor.name}</h4>
												<p className="text-gray-600">Pazar Payı: %{competitor.marketShare}</p>
											</div>
											<span className={`px-3 py-1 text-sm font-semibold rounded-full ${getThreatColor(competitor.threat)}`}>
												{competitor.threat === 'high' ? 'Yüksek Tehdit' : competitor.threat === 'medium' ? 'Orta Tehdit' : 'Düşük Tehdit'}
											</span>
										</div>

										<div className="grid md:grid-cols-3 gap-4 mb-4">
											<div className="text-center bg-blue-50 p-3 rounded">
												<div className="text-xl font-bold text-blue-600">{formatCurrency(competitor.revenue)}</div>
												<div className="text-sm text-blue-600">Tahmini Gelir</div>
											</div>
											<div className="text-center bg-green-50 p-3 rounded">
												<div className="text-xl font-bold text-green-600">%{competitor.growth}</div>
												<div className="text-sm text-green-600">Büyüme Oranı</div>
											</div>
											<div className="text-center bg-purple-50 p-3 rounded">
												<div className="text-xl font-bold text-purple-600">%{competitor.marketShare}</div>
												<div className="text-sm text-purple-600">Pazar Payı</div>
											</div>
										</div>

										<div className="grid md:grid-cols-2 gap-4">
											<div>
												<h5 className="font-medium text-green-700 mb-2">Güçlü Yönler</h5>
												<ul className="text-sm text-gray-700 space-y-1">
													{competitor.strengths.map((strength, i) => (
														<li key={i}>• {strength}</li>
													))}
												</ul>
											</div>
											<div>
												<h5 className="font-medium text-red-700 mb-2">Zayıf Yönler</h5>
												<ul className="text-sm text-gray-700 space-y-1">
													{competitor.weaknesses.map((weakness, i) => (
														<li key={i}>• {weakness}</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'trends' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Pazar Trendleri ve Fırsatlar</h3>
							
							<div className="space-y-4">
								{trends.map((trend) => (
									<div key={trend.id} className={`border rounded-lg p-6 ${
										trend.opportunity ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
									}`}>
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center">
												<span className="text-2xl mr-3">
													{trend.opportunity ? '🚀' : '⚠️'}
												</span>
												<h4 className="text-lg font-semibold text-gray-900">{trend.title}</h4>
											</div>
											<div className="flex space-x-2">
												<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(trend.impact)}`}>
													{trend.impact === 'high' ? 'Yüksek Etki' : trend.impact === 'medium' ? 'Orta Etki' : 'Düşük Etki'}
												</span>
												<span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
													%{trend.probability} Olasılık
												</span>
											</div>
										</div>
										
										<p className={`mb-3 ${trend.opportunity ? 'text-green-700' : 'text-red-700'}`}>
											{trend.description}
										</p>
										
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600">
												Zaman Çerçevesi: {trend.timeframe}
											</span>
											<button className={`px-4 py-2 text-sm font-medium rounded-lg ${
												trend.opportunity 
													? 'bg-green-600 text-white hover:bg-green-700' 
													: 'bg-red-600 text-white hover:bg-red-700'
											}`}>
												{trend.opportunity ? 'Fırsatı Değerlendir' : 'Risk Planı Oluştur'}
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'swot' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">SWOT Analizi</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-green-50 border border-green-200 rounded-lg p-6">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">💪</span>
										<h4 className="text-lg font-semibold text-green-900">Güçlü Yönler (Strengths)</h4>
									</div>
									<ul className="space-y-2">
										{swotAnalysis.strengths.map((item, index) => (
											<li key={index} className="text-green-700 flex items-start">
												<span className="text-green-500 mr-2">•</span>
												{item}
											</li>
										))}
									</ul>
								</div>

								<div className="bg-red-50 border border-red-200 rounded-lg p-6">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">⚠️</span>
										<h4 className="text-lg font-semibold text-red-900">Zayıf Yönler (Weaknesses)</h4>
									</div>
									<ul className="space-y-2">
										{swotAnalysis.weaknesses.map((item, index) => (
											<li key={index} className="text-red-700 flex items-start">
												<span className="text-red-500 mr-2">•</span>
												{item}
											</li>
										))}
									</ul>
								</div>

								<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">🚀</span>
										<h4 className="text-lg font-semibold text-blue-900">Fırsatlar (Opportunities)</h4>
									</div>
									<ul className="space-y-2">
										{swotAnalysis.opportunities.map((item, index) => (
											<li key={index} className="text-blue-700 flex items-start">
												<span className="text-blue-500 mr-2">•</span>
												{item}
											</li>
										))}
									</ul>
								</div>

								<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">⚡</span>
										<h4 className="text-lg font-semibold text-yellow-900">Tehditler (Threats)</h4>
									</div>
									<ul className="space-y-2">
										{swotAnalysis.threats.map((item, index) => (
											<li key={index} className="text-yellow-700 flex items-start">
												<span className="text-yellow-500 mr-2">•</span>
												{item}
											</li>
										))}
									</ul>
								</div>
							</div>

							<div className="bg-gray-50 p-6 rounded-lg">
								<h4 className="font-semibold text-gray-900 mb-3">Stratejik Öneriler</h4>
								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<h5 className="font-medium text-gray-800 mb-2">SO Stratejileri (Güçlü Yönler + Fırsatlar)</h5>
										<p className="text-gray-700 text-sm">Teknoloji altyapınızı kullanarak büyüyen e-ticaret pazarında daha fazla pay alın.</p>
									</div>
									<div>
										<h5 className="font-medium text-gray-800 mb-2">WO Stratejileri (Zayıf Yönler + Fırsatlar)</h5>
										<p className="text-gray-700 text-sm">Marka bilinirliğini artırmak için dijital pazarlama yatırımlarını artırın.</p>
									</div>
									<div>
										<h5 className="font-medium text-gray-800 mb-2">ST Stratejileri (Güçlü Yönler + Tehditler)</h5>
										<p className="text-gray-700 text-sm">Esnek operasyon modelinizi kullanarak ekonomik belirsizliklere karşı dayanıklılık sağlayın.</p>
									</div>
									<div>
										<h5 className="font-medium text-gray-800 mb-2">WT Stratejileri (Zayıf Yönler + Tehditler)</h5>
										<p className="text-gray-700 text-sm">Stratejik ortaklıklar kurarak hem marka bilinirliğini artırın hem de rekabet gücünüzü güçlendirin.</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-blue-900">Rakip İzleme</h3>
					</div>
					<p className="text-blue-700 mb-4">Otomatik rakip izleme sistemi kur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						İzleme Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-green-900">Trend Analizi</h3>
					</div>
					<p className="text-green-700 mb-4">AI ile pazar trendlerini analiz et.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Analiz Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Strateji Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Kapsamlı strateji raporu oluştur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Oluştur
					</button>
				</div>
			</div>
		</div>
	);
}
