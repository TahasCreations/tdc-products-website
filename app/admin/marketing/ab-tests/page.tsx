"use client";

import { useState } from 'react';

export default function ABTestsPage() {
	const [activeTab, setActiveTab] = useState('active');

	const tests = [
		{
			id: 'TEST001',
			name: 'Ana Sayfa Hero Bölümü',
			type: 'ui',
			status: 'active',
			startDate: '2024-01-10',
			endDate: '2024-01-24',
			visitors: 15420,
			conversions: 892,
			conversionRate: 5.78,
			confidence: 95,
			winner: 'B'
		},
		{
			id: 'TEST002',
			name: 'Ürün Sayfası CTA Butonu',
			type: 'cta',
			status: 'completed',
			startDate: '2024-01-01',
			endDate: '2024-01-15',
			visitors: 8750,
			conversions: 525,
			conversionRate: 6.00,
			confidence: 98,
			winner: 'A'
		},
		{
			id: 'TEST003',
			name: 'Checkout Süreç Optimizasyonu',
			type: 'flow',
			status: 'draft',
			startDate: '2024-01-20',
			endDate: '2024-02-03',
			visitors: 0,
			conversions: 0,
			conversionRate: 0,
			confidence: 0,
			winner: null
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'completed': return 'bg-blue-100 text-blue-800';
			case 'draft': return 'bg-gray-100 text-gray-800';
			case 'paused': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'completed': return 'Tamamlandı';
			case 'draft': return 'Taslak';
			case 'paused': return 'Duraklatıldı';
			default: return status;
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'ui': return '🎨';
			case 'cta': return '🔘';
			case 'flow': return '🔄';
			case 'content': return '📝';
			default: return '🧪';
		}
	};

	const filteredTests = tests.filter(test => {
		if (activeTab === 'all') return true;
		return test.status === activeTab;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">A/B Test Yönetimi</h1>
					<p className="text-gray-600">Deney tasarımı ve performans optimizasyonu</p>
				</div>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
					Yeni Test Oluştur
				</button>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{tests.length}</div>
					<div className="text-sm text-blue-600">Toplam Test</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{tests.filter(t => t.status === 'active').length}</div>
					<div className="text-sm text-green-600">Aktif Test</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{tests.filter(t => t.status === 'completed').length}</div>
					<div className="text-sm text-purple-600">Tamamlanan</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">
						{tests.filter(t => t.status === 'completed').length > 0 
							? (tests.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.conversionRate, 0) / tests.filter(t => t.status === 'completed').length).toFixed(1)
							: '0.0'
						}%
					</div>
					<div className="text-sm text-orange-600">Ortalama Dönüşüm</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'active', label: 'Aktif Testler', count: tests.filter(t => t.status === 'active').length },
							{ key: 'completed', label: 'Tamamlanan', count: tests.filter(t => t.status === 'completed').length },
							{ key: 'draft', label: 'Taslaklar', count: tests.filter(t => t.status === 'draft').length },
							{ key: 'all', label: 'Tümü', count: tests.length }
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
								<span>{tab.label}</span>
								<span className={`px-2 py-1 text-xs rounded-full ${
									activeTab === tab.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
								}`}>
									{tab.count}
								</span>
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					<div className="space-y-6">
						{filteredTests.map((test) => (
							<div key={test.id} className="border rounded-lg p-6">
								<div className="flex items-start justify-between mb-4">
									<div className="flex items-center">
										<span className="text-2xl mr-3">{getTypeIcon(test.type)}</span>
										<div>
											<h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
											<p className="text-sm text-gray-500">Test ID: {test.id}</p>
										</div>
									</div>
									<div className="flex items-center space-x-3">
										<span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(test.status)}`}>
											{getStatusText(test.status)}
										</span>
										{test.winner && (
											<span className="px-3 py-1 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-full">
												Kazanan: Varyant {test.winner}
											</span>
										)}
									</div>
								</div>

								<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
									<div className="text-center">
										<div className="text-2xl font-bold text-blue-600">{test.visitors.toLocaleString()}</div>
										<div className="text-sm text-gray-600">Ziyaretçi</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-green-600">{test.conversions.toLocaleString()}</div>
										<div className="text-sm text-gray-600">Dönüşüm</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-purple-600">{test.conversionRate.toFixed(2)}%</div>
										<div className="text-sm text-gray-600">Dönüşüm Oranı</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-orange-600">{test.confidence}%</div>
										<div className="text-sm text-gray-600">Güven Aralığı</div>
									</div>
								</div>

								<div className="flex items-center justify-between text-sm text-gray-500 mb-4">
									<span>Başlangıç: {test.startDate}</span>
									<span>Bitiş: {test.endDate}</span>
								</div>

								{test.status === 'active' && (
									<div className="bg-gray-50 rounded-lg p-4 mb-4">
										<h4 className="font-semibold text-gray-900 mb-2">Test Varyantları</h4>
										<div className="grid md:grid-cols-2 gap-4">
											<div className="bg-white p-4 rounded border">
												<div className="flex items-center justify-between mb-2">
													<span className="font-medium">Varyant A (Kontrol)</span>
													<span className="text-sm text-gray-500">50% trafik</span>
												</div>
												<div className="text-sm text-gray-600">Mevcut tasarım/içerik</div>
											</div>
											<div className="bg-white p-4 rounded border">
												<div className="flex items-center justify-between mb-2">
													<span className="font-medium">Varyant B (Test)</span>
													<span className="text-sm text-gray-500">50% trafik</span>
												</div>
												<div className="text-sm text-gray-600">Yeni tasarım/içerik</div>
											</div>
										</div>
									</div>
								)}

								<div className="flex justify-end space-x-2">
									<button className="text-indigo-600 hover:text-indigo-900 text-sm">
										Detaylar
									</button>
									{test.status === 'active' && (
										<>
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Duraklat
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm">
												Durdur
											</button>
										</>
									)}
									{test.status === 'draft' && (
										<button className="text-green-600 hover:text-green-900 text-sm">
											Başlat
										</button>
									)}
									{test.status === 'completed' && (
										<button className="text-blue-600 hover:text-blue-900 text-sm">
											Rapor İndir
										</button>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Test Templates */}
			<div className="bg-white rounded-lg border p-6">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Test Şablonları</h3>
				<div className="grid md:grid-cols-3 gap-6">
					<div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
						<div className="flex items-center mb-3">
							<span className="text-2xl mr-3">🔘</span>
							<h4 className="font-semibold text-gray-900">CTA Butonu Testi</h4>
						</div>
						<p className="text-sm text-gray-600 mb-3">Buton rengi, metni ve konumu optimizasyonu</p>
						<button className="text-indigo-600 hover:text-indigo-900 text-sm">
							Şablonu Kullan
						</button>
					</div>

					<div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
						<div className="flex items-center mb-3">
							<span className="text-2xl mr-3">📝</span>
							<h4 className="font-semibold text-gray-900">Başlık Testi</h4>
						</div>
						<p className="text-sm text-gray-600 mb-3">Sayfa başlıkları ve alt başlık optimizasyonu</p>
						<button className="text-indigo-600 hover:text-indigo-900 text-sm">
							Şablonu Kullan
						</button>
					</div>

					<div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
						<div className="flex items-center mb-3">
							<span className="text-2xl mr-3">🎨</span>
							<h4 className="font-semibold text-gray-900">Sayfa Düzeni</h4>
						</div>
						<p className="text-sm text-gray-600 mb-3">Sayfa layout ve element yerleşimi testi</p>
						<button className="text-indigo-600 hover:text-indigo-900 text-sm">
							Şablonu Kullan
						</button>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Test Analizi</h3>
					</div>
					<p className="text-blue-700 mb-4">Detaylı test performans analizi.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Görüntüle
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎯</span>
						<h3 className="text-lg font-semibold text-green-900">Hedef Belirleme</h3>
					</div>
					<p className="text-green-700 mb-4">Test hedefleri ve KPI tanımlama.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Hedef Belirle
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-purple-900">Otomatik Test</h3>
					</div>
					<p className="text-purple-700 mb-4">AI destekli otomatik test önerileri.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Otomasyon Kur
					</button>
				</div>
			</div>
		</div>
	);
}
