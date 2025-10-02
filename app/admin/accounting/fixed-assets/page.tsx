"use client";

import { useState } from 'react';

export default function FixedAssetsPage() {
	const [activeTab, setActiveTab] = useState('assets');
	const [isAddingAsset, setIsAddingAsset] = useState(false);

	const fixedAssets = [
		{
			id: 'FA-001',
			name: 'Ofis Bilgisayarları (10 Adet)',
			category: 'Bilgi İşlem Ekipmanları',
			purchaseDate: '2023-03-15',
			purchasePrice: 150000,
			currentValue: 112500,
			depreciationRate: 25,
			usefulLife: 4,
			location: 'Ana Ofis - IT Departmanı',
			status: 'Aktif',
			lastMaintenance: '2024-01-15'
		},
		{
			id: 'FA-002',
			name: 'Depo Forklift',
			category: 'Taşıma Araçları',
			purchaseDate: '2022-08-20',
			purchasePrice: 85000,
			currentValue: 59500,
			depreciationRate: 15,
			usefulLife: 10,
			location: 'Ana Depo',
			status: 'Aktif',
			lastMaintenance: '2024-01-10'
		},
		{
			id: 'FA-003',
			name: 'Ofis Mobilyaları',
			category: 'Mobilya ve Demirbaş',
			purchaseDate: '2023-01-10',
			purchasePrice: 45000,
			currentValue: 40500,
			depreciationRate: 10,
			usefulLife: 10,
			location: 'Ana Ofis',
			status: 'Aktif',
			lastMaintenance: null
		},
		{
			id: 'FA-004',
			name: 'Güvenlik Kamera Sistemi',
			category: 'Güvenlik Ekipmanları',
			purchaseDate: '2023-06-01',
			purchasePrice: 25000,
			currentValue: 21250,
			depreciationRate: 15,
			usefulLife: 8,
			location: 'Tüm Lokasyonlar',
			status: 'Aktif',
			lastMaintenance: '2024-01-08'
		}
	];

	const depreciationSchedule = [
		{
			year: 2023,
			openingValue: 150000,
			depreciation: 37500,
			closingValue: 112500,
			assetId: 'FA-001'
		},
		{
			year: 2024,
			openingValue: 112500,
			depreciation: 28125,
			closingValue: 84375,
			assetId: 'FA-001'
		}
	];

	const maintenanceSchedule = [
		{
			id: 'MT-001',
			assetId: 'FA-001',
			assetName: 'Ofis Bilgisayarları',
			type: 'Periyodik Bakım',
			scheduledDate: '2024-04-15',
			cost: 2500,
			status: 'Planlandı',
			vendor: 'TechCare Servis'
		},
		{
			id: 'MT-002',
			assetId: 'FA-002',
			assetName: 'Depo Forklift',
			type: 'Yıllık Muayene',
			scheduledDate: '2024-02-20',
			cost: 1500,
			status: 'Tamamlandı',
			vendor: 'ForkliftCare Ltd.'
		}
	];

	const categories = [
		'Bilgi İşlem Ekipmanları',
		'Taşıma Araçları',
		'Mobilya ve Demirbaş',
		'Güvenlik Ekipmanları',
		'Üretim Makineleri',
		'Diğer'
	];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Bakımda': return 'bg-yellow-100 text-yellow-800';
			case 'Arızalı': return 'bg-red-100 text-red-800';
			case 'Elden Çıkarıldı': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getMaintenanceStatusColor = (status: string) => {
		switch (status) {
			case 'Tamamlandı': return 'bg-green-100 text-green-800';
			case 'Planlandı': return 'bg-blue-100 text-blue-800';
			case 'Gecikti': return 'bg-red-100 text-red-800';
			case 'İptal': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const calculateAge = (purchaseDate: string) => {
		const purchase = new Date(purchaseDate);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - purchase.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const years = Math.floor(diffDays / 365);
		const months = Math.floor((diffDays % 365) / 30);
		return `${years} yıl ${months} ay`;
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Sabit Kıymet Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Amortisman Hesapla
					</button>
					<button 
						onClick={() => setIsAddingAsset(true)}
						className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
					>
						Yeni Kıymet Ekle
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">
						{formatCurrency(fixedAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0))}
					</div>
					<div className="text-sm text-gray-600">Toplam Alış Değeri</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">
						{formatCurrency(fixedAssets.reduce((sum, asset) => sum + asset.currentValue, 0))}
					</div>
					<div className="text-sm text-gray-600">Güncel Değer</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">
						{formatCurrency(fixedAssets.reduce((sum, asset) => sum + (asset.purchasePrice - asset.currentValue), 0))}
					</div>
					<div className="text-sm text-gray-600">Toplam Amortisman</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">{fixedAssets.length}</div>
					<div className="text-sm text-gray-600">Toplam Kıymet</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'assets', label: 'Sabit Kıymetler', count: fixedAssets.length },
							{ key: 'depreciation', label: 'Amortisman Planı', count: depreciationSchedule.length },
							{ key: 'maintenance', label: 'Bakım Planı', count: maintenanceSchedule.length }
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setActiveTab(tab.key)}
								className={`py-4 px-1 border-b-2 font-medium text-sm ${
									activeTab === tab.key
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								{tab.label} ({tab.count})
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'assets' && (
						<div className="space-y-4">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kıymet</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kategori</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Alış Tarihi</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Alış Değeri</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Güncel Değer</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Yaşı</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{fixedAssets.map((asset) => (
											<tr key={asset.id} className="hover:bg-gray-50">
												<td className="px-4 py-3">
													<div>
														<div className="font-medium text-gray-900">{asset.name}</div>
														<div className="text-sm text-gray-500">{asset.id}</div>
														<div className="text-xs text-gray-400">{asset.location}</div>
													</div>
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">{asset.category}</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{new Date(asset.purchaseDate).toLocaleDateString('tr-TR')}
												</td>
												<td className="px-4 py-3 text-sm font-medium text-gray-900">
													{formatCurrency(asset.purchasePrice)}
												</td>
												<td className="px-4 py-3 text-sm font-medium text-green-600">
													{formatCurrency(asset.currentValue)}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{calculateAge(asset.purchaseDate)}
												</td>
												<td className="px-4 py-3">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
														{asset.status}
													</span>
												</td>
												<td className="px-4 py-3 text-sm">
													<div className="flex space-x-2">
														<button className="text-indigo-600 hover:text-indigo-900">Düzenle</button>
														<button className="text-blue-600 hover:text-blue-900">Detay</button>
														<button className="text-green-600 hover:text-green-900">Bakım</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'depreciation' && (
						<div className="space-y-6">
							<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
								<h3 className="font-semibold text-blue-900 mb-2">Amortisman Hesaplama Bilgisi</h3>
								<p className="text-blue-700 text-sm">
									Amortisman hesaplamaları normal amortisman yöntemi ile yapılmaktadır. 
									Her yıl için amortisman oranı sabit kıymetin faydalı ömrüne göre belirlenir.
								</p>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-semibold text-gray-900">Yıllık Amortisman Planı</h3>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											{fixedAssets.map((asset) => {
												const annualDepreciation = asset.purchasePrice / asset.usefulLife;
												return (
													<div key={asset.id} className="border-l-4 border-indigo-500 pl-4">
														<div className="font-medium text-gray-900">{asset.name}</div>
														<div className="text-sm text-gray-600">
															Yıllık Amortisman: {formatCurrency(annualDepreciation)}
														</div>
														<div className="text-xs text-gray-500">
															Faydalı Ömür: {asset.usefulLife} yıl | Oran: %{asset.depreciationRate}
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h3 className="font-semibold text-gray-900">Amortisman Grafiği</h3>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📉 Amortisman trend grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'maintenance' && (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Bakım Planlaması</h3>
								<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
									Yeni Bakım Planla
								</button>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Kıymet</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Bakım Türü</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Planlanan Tarih</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Maliyet</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tedarikçi</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{maintenanceSchedule.map((maintenance) => (
											<tr key={maintenance.id} className="hover:bg-gray-50">
												<td className="px-4 py-3">
													<div>
														<div className="font-medium text-gray-900">{maintenance.assetName}</div>
														<div className="text-sm text-gray-500">{maintenance.assetId}</div>
													</div>
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">{maintenance.type}</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{new Date(maintenance.scheduledDate).toLocaleDateString('tr-TR')}
												</td>
												<td className="px-4 py-3 text-sm font-medium text-gray-900">
													{formatCurrency(maintenance.cost)}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">{maintenance.vendor}</td>
												<td className="px-4 py-3">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMaintenanceStatusColor(maintenance.status)}`}>
														{maintenance.status}
													</span>
												</td>
												<td className="px-4 py-3 text-sm">
													<div className="flex space-x-2">
														<button className="text-indigo-600 hover:text-indigo-900">Düzenle</button>
														<button className="text-green-600 hover:text-green-900">Tamamla</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Add Asset Modal */}
			{isAddingAsset && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">Yeni Sabit Kıymet Ekle</h3>
							<button 
								onClick={() => setIsAddingAsset(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>
						<form className="space-y-4">
							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Kıymet Adı *
									</label>
									<input
										type="text"
										className="w-full border rounded-lg px-3 py-2"
										placeholder="Örn: Ofis Bilgisayarları"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Kategori *
									</label>
									<select className="w-full border rounded-lg px-3 py-2">
										<option value="">Kategori Seçin</option>
										{categories.map((category) => (
											<option key={category} value={category}>{category}</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Alış Tarihi *
									</label>
									<input
										type="date"
										className="w-full border rounded-lg px-3 py-2"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Alış Bedeli (₺) *
									</label>
									<input
										type="number"
										className="w-full border rounded-lg px-3 py-2"
										placeholder="0.00"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Faydalı Ömür (Yıl) *
									</label>
									<input
										type="number"
										className="w-full border rounded-lg px-3 py-2"
										placeholder="5"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Amortisman Oranı (%) *
									</label>
									<input
										type="number"
										className="w-full border rounded-lg px-3 py-2"
										placeholder="20"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Lokasyon
								</label>
								<input
									type="text"
									className="w-full border rounded-lg px-3 py-2"
									placeholder="Örn: Ana Ofis - IT Departmanı"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Açıklama
								</label>
								<textarea
									rows={3}
									className="w-full border rounded-lg px-3 py-2"
									placeholder="Kıymet hakkında ek bilgiler..."
								/>
							</div>
							<div className="flex justify-end space-x-3 pt-4">
								<button 
									type="button"
									onClick={() => setIsAddingAsset(false)}
									className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
								>
									İptal
								</button>
								<button 
									type="submit"
									className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
								>
									Kıymet Ekle
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Amortisman Raporu</h3>
					</div>
					<p className="text-blue-700 mb-4">Yıllık amortisman hesaplamalarını görüntüle.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Raporu Görüntüle
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔧</span>
						<h3 className="text-lg font-semibold text-green-900">Bakım Takibi</h3>
					</div>
					<p className="text-green-700 mb-4">Bekleyen bakım işlemlerini yönet.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Bakımları Görüntüle
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📋</span>
						<h3 className="text-lg font-semibold text-purple-900">Envanter Sayım</h3>
					</div>
					<p className="text-purple-700 mb-4">Sabit kıymet envanteri sayımı yap.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Sayım Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💰</span>
						<h3 className="text-lg font-semibold text-orange-900">Değer Analizi</h3>
					</div>
					<p className="text-orange-700 mb-4">Kıymet değerlerinin analizi ve karşılaştırması.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Analiz Et
					</button>
				</div>
			</div>
		</div>
	);
}
