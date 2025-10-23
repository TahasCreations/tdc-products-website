"use client";

import { useState } from 'react';

export default function SEOAssistantPage() {
	const [url, setUrl] = useState('');
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [results, setResults] = useState<any>(null);

	// Demo veriler temizlendi - API'den gerçek veriler gelecek
	const mockResults: any = null;
	const oldMockResults = {
		score: 78,
		issues: [
			{ type: 'error', title: 'Meta description eksik', description: '3 sayfada meta description bulunamadı' },
			{ type: 'warning', title: 'H1 etiketi tekrarı', description: '2 sayfada birden fazla H1 etiketi var' },
			{ type: 'info', title: 'Alt text önerisi', description: '12 görselin alt text\'i optimize edilebilir' }
		],
		keywords: [
			{ keyword: 'figür koleksiyon', density: '2.3%', position: 5, volume: 8900 },
			{ keyword: 'anime figür', density: '1.8%', position: 12, volume: 12400 },
			{ keyword: 'el yapımı', density: '1.2%', position: 8, volume: 5600 }
		],
		suggestions: [
			'Title etiketlerini 60 karakter altında tutun',
			'İç bağlantıları artırarak sayfa otoritesini güçlendirin',
			'Sayfa yükleme hızını optimize edin (şu an 3.2s)',
			'Schema markup ekleyerek zengin snippet\'ları aktifleştirin'
		]
	};

	const handleAnalyze = async () => {
		if (!url.trim()) return;
		setIsAnalyzing(true);
		
		try {
			const response = await fetch('/api/ai/seo-analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					url: url,
					title: 'TDC Market - ' + url.split('/').pop(),
					description: 'TDC Market ürün sayfası',
					content: 'Ürün açıklaması ve detayları burada yer alacak...'
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
			console.error('SEO analysis error:', error);
			setResults(mockResults);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const getIssueColor = (type: string) => {
		switch (type) {
			case 'error': return 'text-red-600 bg-red-100';
			case 'warning': return 'text-yellow-600 bg-yellow-100';
			case 'info': return 'text-blue-600 bg-blue-100';
			default: return 'text-gray-600 bg-gray-100';
		}
	};

	const getScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-600';
		if (score >= 60) return 'text-yellow-600';
		return 'text-red-600';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">AI SEO Asistanı</h1>
				<div className="text-sm text-gray-500">
					Powered by AI • Son güncelleme: 1 saat önce
				</div>
			</div>

			{/* URL Analysis Section */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Sayfa Analizi</h3>
				<div className="flex items-center space-x-4">
					<div className="flex-1">
						<input
							type="url"
							placeholder="Analiz edilecek URL'yi girin (örn: https://tdcmarket.com/products)"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
						/>
					</div>
					<button
						onClick={handleAnalyze}
						disabled={isAnalyzing || !url.trim()}
						className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
					>
						{isAnalyzing ? (
							<>
								<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
								<span>Analiz ediliyor...</span>
							</>
						) : (
							<>
								<span>🔍</span>
								<span>Analiz Et</span>
							</>
						)}
					</button>
				</div>
			</div>

			{/* Results */}
			{results && (
				<>
					{/* SEO Score */}
					<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-indigo-900">SEO Skoru</h3>
							<div className={`text-4xl font-bold ${getScoreColor(results.score)}`}>
								{results.score}/100
							</div>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-3">
							<div 
								className={`h-3 rounded-full ${results.score >= 80 ? 'bg-green-500' : results.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
								style={{ width: `${results.score}%` }}
							></div>
						</div>
					</div>

					{/* Issues */}
					<div className="bg-white rounded-xl shadow-sm border">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold">Tespit Edilen Sorunlar</h3>
						</div>
						<div className="p-6">
							<div className="space-y-4">
								{results.issues.map((issue: any, i: number) => (
									<div key={i} className="flex items-start space-x-4 p-4 rounded-lg border">
										<div className={`p-2 rounded-lg ${getIssueColor(issue.type)}`}>
											<span className="text-sm font-semibold">
												{issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
											</span>
										</div>
										<div className="flex-1">
											<h4 className="font-semibold text-gray-900">{issue.title}</h4>
											<p className="text-gray-600 text-sm mt-1">{issue.description}</p>
										</div>
										<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
											Düzelt
										</button>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Keywords */}
					<div className="bg-white rounded-xl shadow-sm border">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold">Anahtar Kelime Analizi</h3>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Anahtar Kelime
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Yoğunluk
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Sıralama
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Arama Hacmi
										</th>
										<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											İşlemler
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{results.keywords.map((keyword: any, i: number) => (
										<tr key={i} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
												{keyword.keyword}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{keyword.density}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
												#{keyword.position}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
												{keyword.volume.toLocaleString()}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<button className="text-indigo-600 hover:text-indigo-900">
													Optimize Et
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* AI Suggestions */}
					<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
						<div className="flex items-center mb-4">
							<span className="text-2xl mr-2">🤖</span>
							<h3 className="text-lg font-semibold text-green-900">AI Önerileri</h3>
						</div>
						<div className="space-y-3">
							{results.suggestions.map((suggestion: string, i: number) => (
								<div key={i} className="flex items-start space-x-3">
									<span className="text-green-600 mt-1">✓</span>
									<p className="text-green-800">{suggestion}</p>
								</div>
							))}
						</div>
					</div>
				</>
			)}

			{/* Empty State */}
			{!results && !isAnalyzing && (
				<div className="bg-white p-12 rounded-xl shadow-sm border text-center">
					<div className="text-6xl mb-4">🎯</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Analizi</h3>
					<p className="text-gray-600 mb-6">
						Web sitenizin SEO performansını analiz edin ve iyileştirme önerilerini alın.
					</p>
					<div className="grid md:grid-cols-3 gap-4 text-sm">
						<div className="p-4 bg-gray-50 rounded-lg">
							<div className="font-semibold mb-1">Teknik SEO</div>
							<div className="text-gray-600">Meta etiketler, başlıklar, yapı</div>
						</div>
						<div className="p-4 bg-gray-50 rounded-lg">
							<div className="font-semibold mb-1">İçerik Analizi</div>
							<div className="text-gray-600">Anahtar kelime yoğunluğu</div>
						</div>
						<div className="p-4 bg-gray-50 rounded-lg">
							<div className="font-semibold mb-1">Performans</div>
							<div className="text-gray-600">Sayfa hızı, mobile uyumluluk</div>
						</div>
					</div>
				</div>
			)}

			{/* Quick Tools */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📝</span>
						<h3 className="text-lg font-semibold text-blue-900">Meta Etiket Oluşturucu</h3>
					</div>
					<p className="text-blue-700 mb-4">AI ile optimize edilmiş meta etiketler oluşturun.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔗</span>
						<h3 className="text-lg font-semibold text-green-900">Sitemap Oluşturucu</h3>
					</div>
					<p className="text-green-700 mb-4">Otomatik XML sitemap oluşturun.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">SEO Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı SEO performans raporu alın.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						İndir
					</button>
				</div>
			</div>
		</div>
	)
}
