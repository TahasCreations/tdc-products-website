"use client";

import { useState } from 'react';

export default function DomainsPage() {
	const [activeTab, setActiveTab] = useState('domains');
	const [newDomain, setNewDomain] = useState('');

	const domains = [
		{
			id: 'DOM001',
			domain: 'shop.example.com',
			seller: 'Satıcı A',
			status: 'active',
			sslStatus: 'valid',
			lastCheck: '2024-01-15 10:30',
			traffic: 1250,
			orders: 45
		},
		{
			id: 'DOM002',
			domain: 'store.brand.net',
			seller: 'Satıcı B',
			status: 'pending',
			sslStatus: 'pending',
			lastCheck: '2024-01-15 09:15',
			traffic: 0,
			orders: 0
		},
		{
			id: 'DOM003',
			domain: 'market.company.org',
			seller: 'Satıcı C',
			status: 'error',
			sslStatus: 'expired',
			lastCheck: '2024-01-14 16:45',
			traffic: 890,
			orders: 23
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'error': return 'bg-red-100 text-red-800';
			case 'suspended': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'pending': return 'Beklemede';
			case 'error': return 'Hata';
			case 'suspended': return 'Askıda';
			default: return status;
		}
	};

	const getSSLColor = (sslStatus: string) => {
		switch (sslStatus) {
			case 'valid': return 'text-green-600';
			case 'expired': return 'text-red-600';
			case 'pending': return 'text-yellow-600';
			default: return 'text-gray-600';
		}
	};

	const handleAddDomain = () => {
		if (newDomain.trim()) {
			// Add domain logic here
			setNewDomain('');
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">White Label Domain Yönetimi</h1>
					<p className="text-gray-600">Satıcılar için özel domain yönetimi ve SSL sertifikaları</p>
				</div>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
					Yeni Domain Ekle
				</button>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{domains.length}</div>
					<div className="text-sm text-blue-600">Toplam Domain</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{domains.filter(d => d.status === 'active').length}</div>
					<div className="text-sm text-green-600">Aktif Domain</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{domains.filter(d => d.status === 'pending').length}</div>
					<div className="text-sm text-yellow-600">Bekleyen Domain</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{domains.filter(d => d.sslStatus === 'expired').length}</div>
					<div className="text-sm text-red-600">SSL Süresi Dolmuş</div>
				</div>
			</div>

			{/* Add New Domain */}
			<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
				<div className="flex items-center mb-4">
					<span className="text-2xl mr-3">🌐</span>
					<h3 className="text-lg font-semibold text-indigo-900">Yeni Domain Ekle</h3>
				</div>
				<div className="flex space-x-4">
					<div className="flex-1">
						<input
							type="text"
							value={newDomain}
							onChange={(e) => setNewDomain(e.target.value)}
							placeholder="ör: shop.markaadi.com"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
						/>
					</div>
					<select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
						<option value="">Satıcı Seçin</option>
						<option value="seller1">Satıcı A</option>
						<option value="seller2">Satıcı B</option>
						<option value="seller3">Satıcı C</option>
					</select>
					<button
						onClick={handleAddDomain}
						className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
					>
						Ekle
					</button>
				</div>
				<p className="text-sm text-indigo-700 mt-3">
					💡 Domain ekledikten sonra DNS ayarlarında CNAME kaydını <code>tdcmarket.com</code> olarak ayarlayın.
				</p>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'domains', label: 'Domain Listesi', icon: '🌐' },
							{ key: 'ssl', label: 'SSL Yönetimi', icon: '🔒' },
							{ key: 'dns', label: 'DNS Ayarları', icon: '⚙️' },
							{ key: 'analytics', label: 'Domain Analitik', icon: '📊' }
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
					{activeTab === 'domains' && (
						<div className="space-y-6">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Domain
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Satıcı
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Durum
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												SSL Durumu
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Trafik
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Siparişler
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Son Kontrol
											</th>
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												İşlemler
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{domains.map((domain) => (
											<tr key={domain.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<span className="text-2xl mr-2">🌐</span>
														<div>
															<div className="text-sm font-medium text-gray-900">{domain.domain}</div>
															<div className="text-sm text-gray-500">{domain.id}</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{domain.seller}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(domain.status)}`}>
														{getStatusText(domain.status)}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<span className={`text-lg mr-1 ${getSSLColor(domain.sslStatus)}`}>
															{domain.sslStatus === 'valid' ? '🔒' : domain.sslStatus === 'expired' ? '🔓' : '⏳'}
														</span>
														<span className={`text-sm ${getSSLColor(domain.sslStatus)}`}>
															{domain.sslStatus === 'valid' ? 'Geçerli' : domain.sslStatus === 'expired' ? 'Süresi Dolmuş' : 'Beklemede'}
														</span>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{domain.traffic.toLocaleString()}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{domain.orders}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{domain.lastCheck}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button className="text-indigo-600 hover:text-indigo-900 mr-3">
														Düzenle
													</button>
													<button className="text-blue-600 hover:text-blue-900 mr-3">
														Test Et
													</button>
													<button className="text-red-600 hover:text-red-900">
														Sil
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'ssl' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">SSL Sertifika Yönetimi</h3>
							<div className="text-center text-gray-500">
								<p>SSL sertifika yönetimi ve otomatik yenileme ayarları burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'dns' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">DNS Ayarları</h3>
							<div className="text-center text-gray-500">
								<p>DNS kayıtları ve yönlendirme ayarları burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Domain Performans Analitik</h3>
							<div className="text-center text-gray-500">
								<p>Domain bazlı trafik ve performans analizleri burada görünecek...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔒</span>
						<h3 className="text-lg font-semibold text-green-900">SSL Otomasyonu</h3>
					</div>
					<p className="text-green-700 mb-4">Otomatik SSL sertifika yenileme kurulumu.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Otomasyon Kur
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-blue-900">Domain Sağlık Kontrolü</h3>
					</div>
					<p className="text-blue-700 mb-4">Tüm domainlerin sağlık durumunu kontrol et.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Kontrol Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Performans Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Domain performans raporu oluştur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Oluştur
					</button>
				</div>
			</div>
		</div>
	);
}
