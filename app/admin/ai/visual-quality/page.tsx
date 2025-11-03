"use client";

import { useState } from 'react';

export default function VisualQualityPage() {
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const [analysisResults, setAnalysisResults] = useState<any[]>([]);

	const getScoreColor = (score: number) => {
		if (score >= 90) return 'text-green-600';
		if (score >= 70) return 'text-yellow-600';
		return 'text-red-600';
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Onaylandı': return 'bg-green-100 text-green-800';
			case 'İnceleniyor': return 'bg-yellow-100 text-yellow-800';
			case 'Düzeltme Gerekli': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const handleBulkAnalysis = () => {
		setIsAnalyzing(true);
		setTimeout(() => {
			setIsAnalyzing(false);
		}, 3000);
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">AI Görsel Kalite Kontrolü</h1>
				<div className="flex space-x-2">
					<button 
						onClick={handleBulkAnalysis}
						disabled={isAnalyzing}
						className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
					>
						{isAnalyzing ? 'Analiz Ediliyor...' : 'Toplu Analiz'}
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Görsel Yükle
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">0</div>
					<div className="text-sm text-gray-600">Analiz Edilen Görsel</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">0</div>
					<div className="text-sm text-gray-600">Ortalama Kalite Skoru</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">0</div>
					<div className="text-sm text-gray-600">Düzeltme Gerekli</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">0</div>
					<div className="text-sm text-gray-600">Reddedilen</div>
				</div>
			</div>

			{/* Upload Area */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Yeni Görsel Analizi</h3>
				<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
					<div className="text-4xl mb-4">📸</div>
					<h4 className="text-lg font-semibold text-gray-900 mb-2">Görselleri Sürükle ve Bırak</h4>
					<p className="text-gray-600 mb-4">veya dosya seçmek için tıkla</p>
					<button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
						Dosya Seç
					</button>
					<p className="text-sm text-gray-500 mt-2">
						Desteklenen formatlar: JPG, PNG, WebP (Max 10MB)
					</p>
				</div>
			</div>

			{/* Analysis Results */}
			<div className="bg-white rounded-xl shadow-sm border">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold">Analiz Sonuçları</h3>
						<div className="flex space-x-2">
							<button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200">
								Tümünü Seç
							</button>
							<button className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200">
								Seçilenleri Onayla
							</button>
						</div>
					</div>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									<input type="checkbox" className="rounded" />
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Görsel
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Ürün
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kalite Skoru
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Sorunlar
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Öneriler
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Durum
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{analysisResults.length === 0 ? (
								<tr>
									<td colSpan={8} className="px-6 py-12 text-center">
										<div className="text-4xl mb-4">📸</div>
										<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Analiz Yok</h3>
										<p className="text-gray-600">Görsel yükleyerek AI kalite kontrolüne başlayın.</p>
									</td>
								</tr>
							) : (
								analysisResults.map((result) => (
								<tr key={result.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<input type="checkbox" className="rounded" />
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
												<span className="text-gray-500 text-xs">IMG</span>
											</div>
											<div className="ml-3">
												<div className="text-sm font-medium text-gray-900">{result.filename}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-gray-900">
										{result.product}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<span className={`text-2xl font-bold ${getScoreColor(result.qualityScore)}`}>
												{result.qualityScore}
											</span>
											<span className="text-gray-500 ml-1">/100</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="space-y-1">
											{result.issues.map((issue, i) => (
												<span key={i} className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mr-1">
													{issue}
												</span>
											))}
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="space-y-1">
											{result.recommendations.slice(0, 2).map((rec, i) => (
												<div key={i} className="text-xs text-gray-600">
													• {rec}
												</div>
											))}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(result.status)}`}>
											{result.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Detay
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Onayla
										</button>
										<button className="text-red-600 hover:text-red-900">
											Reddet
										</button>
									</td>
								</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* AI Quality Guidelines */}
			<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
				<div className="flex items-center mb-4">
					<span className="text-2xl mr-3">🤖</span>
					<h3 className="text-lg font-semibold text-blue-900">AI Kalite Kriterleri</h3>
				</div>
				<div className="grid md:grid-cols-2 gap-4">
					<div className="bg-white p-4 rounded-lg">
						<div className="font-semibold text-gray-900 mb-2">✅ İyi Görsel Özellikleri</div>
						<ul className="text-sm text-gray-700 space-y-1">
							<li>• Yüksek çözünürlük (min 1200x1200px)</li>
							<li>• İyi aydınlatma ve netlik</li>
							<li>• Temiz arka plan</li>
							<li>• Doğru renk dengesi</li>
							<li>• Ürünün tüm detayları görünür</li>
						</ul>
					</div>
					<div className="bg-white p-4 rounded-lg">
						<div className="font-semibold text-gray-900 mb-2">❌ Kaçınılması Gerekenler</div>
						<ul className="text-sm text-gray-700 space-y-1">
							<li>• Bulanık veya pixelli görüntüler</li>
							<li>• Kötü aydınlatma</li>
							<li>• Dağınık arka plan</li>
							<li>• Yanlış renk tonu</li>
							<li>• Ürünün gizli kalan kısımları</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-green-900">Otomatik Analiz</h3>
					</div>
					<p className="text-green-700 mb-4">Tüm ürün görsellerini analiz et.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">✨</span>
						<h3 className="text-lg font-semibold text-purple-900">Otomatik Düzeltme</h3>
					</div>
					<p className="text-purple-700 mb-4">AI ile görsel iyileştirme yap.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Düzelt
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-orange-900">Kalite Raporu</h3>
					</div>
					<p className="text-orange-700 mb-4">Detaylı kalite analiz raporu.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-blue-900">Kalite Ayarları</h3>
					</div>
					<p className="text-blue-700 mb-4">AI kalite kriterlerini ayarla.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Ayarla
					</button>
				</div>
			</div>
		</div>
	)
}
