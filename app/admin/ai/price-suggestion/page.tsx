"use client";

import { useState } from 'react';

export default function PriceSuggestionPage() {
	const [selectedProduct, setSelectedProduct] = useState('');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [results, setResults] = useState<any>(null);

	const products = [
		{ id: 'PRD-001', name: 'Anime Figür - Naruto', currentPrice: '₺149.90' },
		{ id: 'PRD-002', name: 'El Yapımı Seramik Vazo', currentPrice: '₺249.90' },
		{ id: 'PRD-003', name: 'Vintage Poster Seti', currentPrice: '₺89.90' }
	];

	const mockResults = {
		currentPrice: 149.90,
		suggestedPrice: 164.50,
		confidence: 87,
		priceRange: { min: 155.00, max: 175.00 },
		competitors: [
			{ name: 'Rakip A', price: '₺159.90', url: 'competitor-a.com' },
			{ name: 'Rakip B', price: '₺169.90', url: 'competitor-b.com' },
			{ name: 'Rakip C', price: '₺154.90', url: 'competitor-c.com' }
		],
		factors: [
			{ factor: 'Pazar Talebi', impact: '+8.5%', description: 'Yüksek talep nedeniyle fiyat artışı öneriliyor' },
			{ factor: 'Rakip Analizi', impact: '+3.2%', description: 'Rakiplere göre düşük fiyatlandırılmış' },
			{ factor: 'Stok Durumu', impact: '+2.8%', description: 'Düşük stok seviyesi fiyat artışını destekliyor' },
			{ factor: 'Mevsimsellik', impact: '-1.5%', description: 'Mevsimsel düşüş etkisi' }
		],
		projections: {
			salesIncrease: '+12%',
			revenueIncrease: '+18%',
			profitIncrease: '+22%'
		}
	};

	const handleAnalyze = async () => {
		if (!selectedProduct) return;
		setIsAnalyzing(true);
		
		try {
			const product = products.find(p => p.id === selectedProduct);
			if (!product) return;
			
			const response = await fetch('/api/ai/price-suggestion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productId: selectedProduct,
					currentPrice: parseFloat(product.currentPrice.replace('₺', '').replace(',', '.')),
					category: 'figur-koleksiyon',
					title: product.name,
					description: 'Yüksek kaliteli koleksiyon ürünü'
				})
			});
			
			if (response.ok) {
				const data = await response.json();
				setResults(data.data);
			} else {
				// Fallback to mock data
				setResults(mockResults);
			}
		} catch (error) {
			console.error('Price suggestion error:', error);
			setResults(mockResults);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const getImpactColor = (impact: string) => {
		if (impact.startsWith('+')) return 'text-green-600';
		if (impact.startsWith('-')) return 'text-red-600';
		return 'text-gray-600';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">AI Fiyat Önerisi</h1>
				<div className="text-sm text-gray-500">
					Powered by AI • Son güncelleme: 30 dk önce
				</div>
			</div>

			{/* Product Selection */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Ürün Seçimi</h3>
				<div className="flex items-center space-x-4">
					<div className="flex-1">
						<select
							value={selectedProduct}
							onChange={(e) => setSelectedProduct(e.target.value)}
							className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						>
							<option value="">Analiz edilecek ürünü seçin...</option>
							{products.map((product) => (
								<option key={product.id} value={product.id}>
									{product.name} - {product.currentPrice}
								</option>
							))}
						</select>
					</div>
					<button
						onClick={handleAnalyze}
						disabled={isAnalyzing || !selectedProduct}
						className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
					>
						{isAnalyzing ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Analiz ediliyor...</span>
							</>
						) : (
							<>
								<span>💰</span>
								<span>Fiyat Analizi</span>
							</>
						)}
					</button>
				</div>
			</div>

			{/* Results */}
			{results && (
				<>
					{/* Price Recommendation */}
					<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-green-900">Fiyat Önerisi</h3>
							<div className="text-right">
								<div className="text-sm text-green-700">Güven Skoru</div>
								<div className="text-2xl font-bold text-green-600">{results.confidence}%</div>
							</div>
						</div>
						<div className="grid md:grid-cols-3 gap-4">
							<div className="text-center p-4 bg-white rounded-lg">
								<div className="text-sm text-gray-600 mb-1">Mevcut Fiyat</div>
								<div className="text-2xl font-bold text-gray-900">₺{results.currentPrice}</div>
							</div>
							<div className="text-center p-4 bg-green-100 rounded-lg">
								<div className="text-sm text-green-700 mb-1">Önerilen Fiyat</div>
								<div className="text-2xl font-bold text-green-600">₺{results.suggestedPrice}</div>
							</div>
							<div className="text-center p-4 bg-white rounded-lg">
								<div className="text-sm text-gray-600 mb-1">Fiyat Aralığı</div>
								<div className="text-lg font-semibold text-gray-900">
									₺{results.priceRange.min} - ₺{results.priceRange.max}
								</div>
							</div>
						</div>
					</div>

					{/* Competitor Analysis */}
					<div className="bg-white rounded-xl shadow-sm border">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold">Rakip Analizi</h3>
						</div>
						<div className="p-6">
							<div className="grid md:grid-cols-3 gap-4">
								{results.competitors.map((competitor: any, i: number) => (
									<div key={i} className="p-4 border rounded-lg">
										<div className="font-semibold text-gray-900 mb-2">{competitor.name}</div>
										<div className="text-2xl font-bold text-blue-600 mb-2">{competitor.price}</div>
										<div className="text-sm text-gray-500">{competitor.url}</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Price Factors */}
					<div className="bg-white rounded-xl shadow-sm border">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold">Fiyat Etkileyicileri</h3>
						</div>
						<div className="p-6">
							<div className="space-y-4">
								{results.factors.map((factor: any, i: number) => (
									<div key={i} className="flex items-start space-x-4 p-4 rounded-lg border">
										<div className="flex-1">
											<div className="flex items-center justify-between mb-2">
												<h4 className="font-semibold text-gray-900">{factor.factor}</h4>
												<span className={`font-bold ${getImpactColor(factor.impact)}`}>
													{factor.impact}
												</span>
											</div>
											<p className="text-gray-600 text-sm">{factor.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Projections */}
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
						<div className="flex items-center mb-4">
							<span className="text-2xl mr-2">📈</span>
							<h3 className="text-lg font-semibold text-blue-900">Tahminler</h3>
						</div>
						<div className="grid md:grid-cols-3 gap-4">
							<div className="text-center p-4 bg-white rounded-lg">
								<div className="text-sm text-gray-600 mb-1">Satış Artışı</div>
								<div className="text-2xl font-bold text-green-600">{results.projections.salesIncrease}</div>
							</div>
							<div className="text-center p-4 bg-white rounded-lg">
								<div className="text-sm text-gray-600 mb-1">Gelir Artışı</div>
								<div className="text-2xl font-bold text-blue-600">{results.projections.revenueIncrease}</div>
							</div>
							<div className="text-center p-4 bg-white rounded-lg">
								<div className="text-sm text-gray-600 mb-1">Kâr Artışı</div>
								<div className="text-2xl font-bold text-purple-600">{results.projections.profitIncrease}</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-center space-x-4">
						<button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700">
							Fiyatı Uygula
						</button>
						<button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
							A/B Test Başlat
						</button>
						<button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50">
							Rapor İndir
						</button>
					</div>
				</>
			)}

			{/* Empty State */}
			{!results && !isAnalyzing && (
				<div className="bg-white p-12 rounded-xl shadow-sm border text-center">
					<div className="text-6xl mb-4">💰</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">AI Fiyat Optimizasyonu</h3>
					<p className="text-gray-600 mb-6">
						Ürünleriniz için optimal fiyatları belirleyin ve kârlılığınızı artırın.
					</p>
					<div className="grid md:grid-cols-3 gap-4 text-sm">
						<div className="p-4 bg-gray-50 rounded-lg">
							<div className="font-semibold mb-1">Rakip Analizi</div>
							<div className="text-gray-600">Pazar fiyatlarını karşılaştır</div>
						</div>
						<div className="p-4 bg-gray-50 rounded-lg">
							<div className="font-semibold mb-1">Talep Tahmini</div>
							<div className="text-gray-600">Fiyat değişiminin etkisini öngör</div>
						</div>
						<div className="p-4 bg-gray-50 rounded-lg">
							<div className="font-semibold mb-1">Kâr Optimizasyonu</div>
							<div className="text-gray-600">Maksimum kâr için fiyat öner</div>
						</div>
					</div>
				</div>
			)}

			{/* Quick Tools */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Toplu Analiz</h3>
					</div>
					<p className="text-purple-700 mb-4">Tüm ürünler için fiyat analizi yap.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-orange-900">Dinamik Fiyatlama</h3>
					</div>
					<p className="text-orange-700 mb-4">Otomatik fiyat güncellemeleri ayarla.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Ayarla
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-green-900">Fiyat Raporu</h3>
					</div>
					<p className="text-green-700 mb-4">Detaylı fiyatlama analizi raporu.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Oluştur
					</button>
				</div>
			</div>
		</div>
	)
}
