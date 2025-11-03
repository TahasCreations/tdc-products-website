"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function ABTestingPage() {
	const [activeTab, setActiveTab] = useState('tests');
	const [isCreatingTest, setIsCreatingTest] = useState(false);

	const [tests, setTests] = useState<any[]>([]);
	const [testTemplates, setTestTemplates] = useState<any[]>([]);

	const [insights, setInsights] = useState<any[]>([]);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'running': return 'bg-green-100 text-green-800';
			case 'completed': return 'bg-blue-100 text-blue-800';
			case 'draft': return 'bg-gray-100 text-gray-800';
			case 'paused': return 'bg-yellow-100 text-yellow-800';
			case 'failed': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getImpactColor = (impact: string) => {
		switch (impact) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getComplexityColor = (complexity: string) => {
		switch (complexity) {
			case 'Kolay': return 'bg-green-100 text-green-800';
			case 'Orta': return 'bg-yellow-100 text-yellow-800';
			case 'Zor': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'UI/UX': return 'bg-blue-100 text-blue-800';
			case 'Email Marketing': return 'bg-purple-100 text-purple-800';
			case 'Conversion': return 'bg-green-100 text-green-800';
			case 'Pricing': return 'bg-orange-100 text-orange-800';
			case 'Layout': return 'bg-pink-100 text-pink-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getWinnerBadge = (winner: string | null, confidence: number) => {
		if (!winner || confidence < 90) return null;
		
		return (
			<span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gold-100 text-gold-800">
				🏆 {winner === 'variant' ? 'Varyant Kazandı' : 'Kontrol Kazandı'}
			</span>
		);
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">A/B Test & Deney Yönetimi</h1>
					<p className="text-gray-600">Veri odaklı optimizasyon ve deney tasarımı</p>
				</div>
				<div className="flex space-x-2">
					<button 
						onClick={() => setIsCreatingTest(true)}
						className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
					>
						Yeni Test
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Test Raporu
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{tests.length}</div>
					<div className="text-sm text-gray-600">Toplam Test</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">
						{tests.filter(t => t.status === 'running').length}
					</div>
					<div className="text-sm text-gray-600">Aktif Test</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">
						{tests.filter(t => t.status === 'completed').length}
					</div>
					<div className="text-sm text-gray-600">Tamamlanan Test</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">
						{Math.round(tests.filter(t => t.status === 'completed').reduce((acc, t) => {
							const control = t.variants[0];
							const variant = t.variants[1];
							const lift = ((variant.conversionRate - control.conversionRate) / control.conversionRate) * 100;
							return acc + (lift > 0 ? lift : 0);
						}, 0) / tests.filter(t => t.status === 'completed').length) || 0}%
					</div>
					<div className="text-sm text-gray-600">Ortalama İyileştirme</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'tests', label: 'Aktif Testler', icon: '🧪' },
							{ key: 'templates', label: 'Test Şablonları', icon: '📋' },
							{ key: 'insights', label: 'İçgörüler', icon: '💡' },
							{ key: 'analytics', label: 'Analitik', icon: '📊' }
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
					{activeTab === 'tests' && (
						<div className="space-y-6">
							{tests.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl mb-4">🧪</div>
									<p className="text-gray-500 text-lg mb-2">Henüz A/B Test Yok</p>
									<p className="text-gray-400 text-sm">Yeni test oluşturarak başlayın</p>
								</div>
							) : (
								tests.map((test) => (
								<div key={test.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h3 className="font-semibold text-gray-900">{test.name}</h3>
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(test.status)}`}>
													{test.status === 'running' ? 'Çalışıyor' : 
													 test.status === 'completed' ? 'Tamamlandı' : 
													 test.status === 'draft' ? 'Taslak' : 'Duraklatıldı'}
												</span>
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(test.category)}`}>
													{test.category}
												</span>
												{getWinnerBadge(test.winner, test.confidence)}
											</div>
											<p className="text-gray-600 mb-3">
												<strong>Hipotez:</strong> {test.hypothesis}
											</p>
											<div className="text-sm text-gray-500 mb-4">
												{test.startDate} - {test.endDate} • Trafik: %{test.traffic}
												{test.confidence > 0 && <span> • Güven: %{test.confidence}</span>}
											</div>
										</div>
									</div>

									{/* Variants Comparison */}
									<div className="grid md:grid-cols-2 gap-6 mb-4">
										{test.variants.map((variant, index) => (
											<div key={index} className={`p-4 rounded-lg border ${
												test.winner === (index === 0 ? 'control' : 'variant') && test.confidence >= 90 
													? 'border-green-500 bg-green-50' 
													: 'border-gray-200'
											}`}>
												<h4 className="font-medium text-gray-900 mb-3">{variant.name}</h4>
												<div className="space-y-2 text-sm">
													<div className="flex justify-between">
														<span className="text-gray-600">Ziyaretçi:</span>
														<span className="font-medium">{variant.visitors.toLocaleString()}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-600">Dönüşüm:</span>
														<span className="font-medium">{variant.conversions}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-600">Dönüşüm Oranı:</span>
														<span className="font-medium text-blue-600">%{variant.conversionRate}</span>
													</div>
													<div className="flex justify-between">
														<span className="text-gray-600">Gelir:</span>
														<span className="font-medium text-green-600">{formatCurrency(variant.revenue)}</span>
													</div>
												</div>
											</div>
										))}
									</div>

									{/* Test Actions */}
									<div className="flex space-x-3">
										<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
											Detaylar
										</button>
										{test.status === 'running' && (
											<button className="text-yellow-600 hover:text-yellow-900 text-sm font-medium">
												Duraklat
											</button>
										)}
										{test.status === 'completed' && test.confidence >= 90 && (
											<button className="text-green-600 hover:text-green-900 text-sm font-medium">
												Kazananı Uygula
											</button>
										)}
										<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
											Analiz
										</button>
										<button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
											Kopyala
										</button>
									</div>
								</div>
								))
							)}
						</div>
					)}

					{activeTab === 'templates' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Test Şablonları</h3>
								<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
									Özel Şablon Oluştur
								</button>
							</div>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{testTemplates.map((template) => (
									<div key={template.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{template.name}</h4>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
														{template.category}
													</span>
												</div>
												<p className="text-gray-600 mb-3">{template.description}</p>
											</div>
										</div>
										
										<div className="space-y-3 mb-4">
											<div>
												<h5 className="font-medium text-gray-900 mb-2">Test Edilecek Öğeler:</h5>
												<div className="flex flex-wrap gap-1">
													{template.elements.map((element, index) => (
														<span key={index} className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
															{element}
														</span>
													))}
												</div>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-gray-600">Süre:</span>
												<span className="font-medium">{template.duration}</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-gray-600">Zorluk:</span>
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getComplexityColor(template.complexity)}`}>
													{template.complexity}
												</span>
											</div>
										</div>

										<button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
											Şablonu Kullan
										</button>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'insights' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Test İçgörüleri ve Öneriler</h3>

							<div className="space-y-4">
								{insights.map((insight) => (
									<div key={insight.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{insight.title}</h4>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(insight.impact)}`}>
														{insight.impact === 'high' ? 'Yüksek Etki' : 
														 insight.impact === 'medium' ? 'Orta Etki' : 'Düşük Etki'}
													</span>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(insight.category)}`}>
														{insight.category}
													</span>
												</div>
												<p className="text-gray-600 mb-3">{insight.description}</p>
												<div className="text-sm text-gray-500">
													{new Date(insight.date).toLocaleDateString('tr-TR')}
												</div>
											</div>
										</div>
										<div className="flex space-x-3">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Detayları Gör
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm font-medium">
												Test Oluştur
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
												Paylaş
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">A/B Test Analitikleri</h3>

							<div className="grid lg:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Test Performance Trendi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Test performans grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Kategori Bazlı Başarı Oranları</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📊 Kategori analiz grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">İyileştirme Etkisi ve ROI</h4>
								</div>
								<div className="p-4">
									<div className="grid md:grid-cols-3 gap-6">
										<div className="text-center p-4 bg-green-50 rounded-lg">
											<div className="text-2xl font-bold text-green-600">+24%</div>
											<div className="text-sm text-green-700">Ortalama Dönüşüm Artışı</div>
										</div>
										<div className="text-center p-4 bg-blue-50 rounded-lg">
											<div className="text-2xl font-bold text-blue-600">{formatCurrency(45680)}</div>
											<div className="text-sm text-blue-700">Toplam Ek Gelir</div>
										</div>
										<div className="text-center p-4 bg-purple-50 rounded-lg">
											<div className="text-2xl font-bold text-purple-600">12:1</div>
											<div className="text-sm text-purple-700">ROI Oranı</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Create Test Modal */}
			{isCreatingTest && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">Yeni A/B Test Oluştur</h3>
							<button 
								onClick={() => setIsCreatingTest(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>
						<form className="space-y-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Test Adı *
								</label>
								<input
									type="text"
									className="w-full border rounded-lg px-3 py-2"
									placeholder="Örn: Ana Sayfa CTA Buton Testi"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Hipotez *
								</label>
								<textarea
									rows={3}
									className="w-full border rounded-lg px-3 py-2"
									placeholder="Test hipotezinizi açıklayın..."
								/>
							</div>

							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Kategori *
									</label>
									<select className="w-full border rounded-lg px-3 py-2">
										<option value="">Kategori Seçin</option>
										<option value="UI/UX">UI/UX</option>
										<option value="Email Marketing">Email Marketing</option>
										<option value="Conversion">Conversion</option>
										<option value="Pricing">Pricing</option>
										<option value="Layout">Layout</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Trafik Dağılımı (%)
									</label>
									<input
										type="number"
										className="w-full border rounded-lg px-3 py-2"
										placeholder="50"
										min="10"
										max="100"
									/>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Başlangıç Tarihi *
									</label>
									<input
										type="date"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Bitiş Tarihi *
									</label>
									<input
										type="date"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-gray-900 mb-3">Varyantlar</h4>
								<div className="space-y-4">
									<div className="p-4 border rounded-lg">
										<h5 className="font-medium text-gray-700 mb-2">Kontrol (A)</h5>
										<input
											type="text"
											className="w-full border rounded-lg px-3 py-2 mb-2"
											placeholder="Kontrol varyant açıklaması"
										/>
										<textarea
											rows={2}
											className="w-full border rounded-lg px-3 py-2"
											placeholder="Kontrol varyant detayları..."
										/>
									</div>
									<div className="p-4 border rounded-lg">
										<h5 className="font-medium text-gray-700 mb-2">Varyant (B)</h5>
										<input
											type="text"
											className="w-full border rounded-lg px-3 py-2 mb-2"
											placeholder="Test varyant açıklaması"
										/>
										<textarea
											rows={2}
											className="w-full border rounded-lg px-3 py-2"
											placeholder="Test varyant detayları..."
										/>
									</div>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Başarı Metrikleri
								</label>
								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" defaultChecked />
										<span className="text-sm text-gray-600">Dönüşüm Oranı</span>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" />
										<span className="text-sm text-gray-600">Gelir</span>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" />
										<span className="text-sm text-gray-600">Sayfa Görüntüleme</span>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" />
										<span className="text-sm text-gray-600">Tıklama Oranı</span>
									</div>
								</div>
							</div>

							<div className="flex justify-end space-x-3 pt-4">
								<button 
									type="button"
									onClick={() => setIsCreatingTest(false)}
									className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
								>
									İptal
								</button>
								<button 
									type="submit"
									className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
								>
									Test Oluştur
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🧪</span>
						<h3 className="text-lg font-semibold text-green-900">Hızlı Test</h3>
					</div>
					<p className="text-green-700 mb-4">Şablon kullanarak hızlı test oluştur.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Şablon Seç
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Test Analizi</h3>
					</div>
					<p className="text-blue-700 mb-4">Mevcut testlerin performansını analiz et.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Yap
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💡</span>
						<h3 className="text-lg font-semibold text-purple-900">Test Önerileri</h3>
					</div>
					<p className="text-purple-700 mb-4">AI destekli test önerilerini incele.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Önerileri Gör
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-orange-900">ROI Hesaplayıcı</h3>
					</div>
					<p className="text-orange-700 mb-4">Test yatırımlarının geri dönüşünü hesapla.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Hesapla
					</button>
				</div>
			</div>
		</div>
	);
}
