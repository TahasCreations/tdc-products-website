"use client";

import { useState } from 'react';

export default function TrendAnalysisPage() {
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [timeRange, setTimeRange] = useState('30d');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [results, setResults] = useState<any>(null);

	const trendData = [
		{
			keyword: 'Anime Figür',
			category: 'Koleksiyon',
			searchVolume: 12500,
			trend: '+15%',
			competition: 'Yüksek',
			opportunity: 85,
			products: 23
		},
		{
			keyword: 'El Yapımı Takı',
			category: 'Aksesuar',
			searchVolume: 8900,
			trend: '+8%',
			competition: 'Orta',
			opportunity: 72,
			products: 15
		},
		{
			keyword: 'Vintage Poster',
			category: 'Dekorasyon',
			searchVolume: 6700,
			trend: '+22%',
			competition: 'Düşük',
			opportunity: 91,
			products: 8
		},
		{
			keyword: 'Seramik Vazo',
			category: 'Ev Dekor',
			searchVolume: 4500,
			trend: '-3%',
			competition: 'Orta',
			opportunity: 45,
			products: 12
		}
	];

	const handleAnalyze = async () => {
		setIsAnalyzing(true);
		
		try {
			const response = await fetch('/api/ai/trend-analysis', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					category: selectedCategory,
					timeframe: timeRange === '30d' ? '1month' : timeRange === '90d' ? '3months' : '6months',
					keywords: []
				})
			});
			
			if (response.ok) {
				const data = await response.json();
				setResults(data.data);
			} else {
				// Fallback to mock data
				setResults({ trends: trendData });
			}
		} catch (error) {
			console.error('Trend analysis error:', error);
			setResults({ trends: trendData });
		} finally {
			setIsAnalyzing(false);
		}
	};

	const getTrendColor = (trend: string) => {
		if (trend.startsWith('+')) return 'text-green-600';
		if (trend.startsWith('-')) return 'text-red-600';
		return 'text-gray-600';
	};

	const getCompetitionColor = (competition: string) => {
		switch (competition) {
			case 'Düşük': return 'bg-green-100 text-green-800';
			case 'Orta': return 'bg-yellow-100 text-yellow-800';
			case 'Yüksek': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getOpportunityColor = (score: number) => {
		if (score >= 80) return 'text-green-600';
		if (score >= 60) return 'text-yellow-600';
		return 'text-red-600';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">AI Trend Analizi</h1>
				<div className="flex space-x-2">
					<select 
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="all">Tüm Kategoriler</option>
						<option value="figur-koleksiyon">Figür & Koleksiyon</option>
						<option value="moda-aksesuar">Moda & Aksesuar</option>
						<option value="elektronik">Elektronik</option>
						<option value="ev-yasam">Ev & Yaşam</option>
					</select>
					<select 
						value={timeRange}
						onChange={(e) => setTimeRange(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="7d">Son 7 Gün</option>
						<option value="30d">Son 30 Gün</option>
						<option value="90d">Son 90 Gün</option>
						<option value="1y">Son 1 Yıl</option>
					</select>
					<button 
						onClick={handleAnalyze}
						disabled={isAnalyzing}
						className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
					>
						{isAnalyzing ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Analiz ediliyor...</span>
							</>
						) : (
							<>
								<span>📊</span>
								<span>Trend Analizi</span>
							</>
						)}
					</button>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">+18%</div>
					<div className="text-sm text-gray-600">Genel Trend</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">156</div>
					<div className="text-sm text-gray-600">Takip Edilen Kelime</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">23</div>
					<div className="text-sm text-gray-600">Yükselen Trend</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">89</div>
					<div className="text-sm text-gray-600">Fırsat Skoru</div>
				</div>
			</div>

			{/* AI Insights */}
			{results && (
				<div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-2">🤖</span>
						<h3 className="text-lg font-semibold text-purple-900">AI Trend Öngörüleri</h3>
					</div>
					<div className="grid md:grid-cols-2 gap-4 text-sm">
						{results.insights?.map((insight: any, i: number) => (
							<div key={i} className="bg-white p-4 rounded-lg">
								<h4 className="font-semibold text-purple-800 mb-2">{insight.title}</h4>
								<p className="text-gray-700">{insight.description}</p>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Trend Chart */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Trend Grafiği (Son 30 Gün)</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">Trend grafiği burada görünecek</p>
				</div>
			</div>

			{/* Top Trends */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">Yükselen Trendler</h3>
					<select 
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="all">Tüm Kategoriler</option>
						<option value="koleksiyon">Koleksiyon</option>
						<option value="aksesuar">Aksesuar</option>
						<option value="dekorasyon">Dekorasyon</option>
						<option value="ev-dekor">Ev Dekor</option>
					</select>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Anahtar Kelime
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kategori
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Arama Hacmi
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Trend
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Rekabet
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Fırsat Skoru
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Ürün Sayısı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{(results?.trends || trendData).map((item: any, i: number) => (
								<tr key={i} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{item.keyword}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{item.category}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{item.searchVolume?.toLocaleString() || 'N/A'}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
										<span className={getTrendColor(item.trend || `+${item.growthRate}%`)}>
											{item.trend || `+${item.growthRate}%`}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCompetitionColor(item.competition || 'Orta')}`}>
											{item.competition || 'Orta'}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
										<span className={getOpportunityColor(item.opportunity || 50)}>
											{item.opportunity || 50}/100
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{item.products}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Detay
										</button>
										<button className="text-green-600 hover:text-green-900">
											Ürün Öner
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* AI Insights */}
			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
				<div className="flex items-center mb-4">
					<span className="text-2xl mr-3">🤖</span>
					<h3 className="text-lg font-semibold text-blue-900">AI Önerileri</h3>
				</div>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="bg-white p-4 rounded-lg">
						<div className="font-semibold text-gray-900 mb-2">📈 Yükselen Kategori</div>
						<p className="text-gray-700 text-sm">
							"Anime Figür" kategorisinde %15 artış var. Bu kategoriye odaklanmanız öneriliyor.
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg">
						<div className="font-semibold text-gray-900 mb-2">🎯 Fırsat Alanı</div>
						<p className="text-gray-700 text-sm">
							"Vintage Poster" düşük rekabet ve yüksek fırsat skoru ile dikkat çekiyor.
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg">
						<div className="font-semibold text-gray-900 mb-2">⚠️ Risk Uyarısı</div>
						<p className="text-gray-700 text-sm">
							"Seramik Vazo" kategorisinde düşüş trendi gözlemleniyor.
						</p>
					</div>
					<div className="bg-white p-4 rounded-lg">
						<div className="font-semibold text-gray-900 mb-2">💡 Yeni Trend</div>
						<p className="text-gray-700 text-sm">
							"Sürdürülebilir Ürünler" kategorisi hızla yükseliyor.
						</p>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-green-900">Kelime Araştır</h3>
					</div>
					<p className="text-green-700 mb-4">Yeni anahtar kelimeler keşfet.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Araştır
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Rakip Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">Rakiplerin trend analizini yap.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-orange-900">Ürün Önerisi</h3>
					</div>
					<p className="text-orange-700 mb-4">Trend bazlı ürün önerileri al.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Öner
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-blue-900">Otomatik Takip</h3>
					</div>
					<p className="text-blue-700 mb-4">Trend takibini otomatikleştir.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Ayarla
					</button>
				</div>
			</div>
		</div>
	)
}
