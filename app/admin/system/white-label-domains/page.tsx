"use client";

import { useState } from 'react';

export default function WhiteLabelDomainsPage() {
	const [activeTab, setActiveTab] = useState('domains');
	const [isAddingDomain, setIsAddingDomain] = useState(false);

	const domains = [
		{
			id: 'DOM-001',
			domain: 'shop.animestoretu.com',
			sellerId: 'SEL-001',
			sellerName: 'Anime Store Turkey',
			status: 'active',
			sslStatus: 'valid',
			sslExpiry: '2024-12-15',
			createdAt: '2024-01-15',
			monthlyVisits: 12450,
			conversionRate: 3.2,
			revenue: 45680,
			customizations: {
				logo: true,
				colors: true,
				theme: 'dark',
				favicon: true
			}
		},
		{
			id: 'DOM-002',
			domain: 'store.vintagetr.com',
			sellerId: 'SEL-002',
			sellerName: 'Vintage Collections',
			status: 'active',
			sslStatus: 'expiring',
			sslExpiry: '2024-02-28',
			createdAt: '2024-01-10',
			monthlyVisits: 8950,
			conversionRate: 2.8,
			revenue: 28340,
			customizations: {
				logo: true,
				colors: true,
				theme: 'light',
				favicon: false
			}
		},
		{
			id: 'DOM-003',
			domain: 'tech.gadgetspro.com',
			sellerId: 'SEL-003',
			sellerName: 'Tech Gadgets Pro',
			status: 'pending',
			sslStatus: 'pending',
			sslExpiry: null,
			createdAt: '2024-01-20',
			monthlyVisits: 0,
			conversionRate: 0,
			revenue: 0,
			customizations: {
				logo: false,
				colors: false,
				theme: 'default',
				favicon: false
			}
		}
	];

	const dnsRecords = [
		{
			id: 'DNS-001',
			domainId: 'DOM-001',
			type: 'A',
			name: '@',
			value: '192.168.1.100',
			ttl: 3600,
			status: 'active'
		},
		{
			id: 'DNS-002',
			domainId: 'DOM-001',
			type: 'CNAME',
			name: 'www',
			value: 'shop.animestoretu.com',
			ttl: 3600,
			status: 'active'
		},
		{
			id: 'DNS-003',
			domainId: 'DOM-002',
			type: 'A',
			name: '@',
			value: '192.168.1.101',
			ttl: 3600,
			status: 'active'
		}
	];

	const subdomainTemplates = [
		{
			id: 'TPL-001',
			name: 'E-ticaret Mağaza',
			description: 'Tam özellikli online mağaza şablonu',
			features: ['Ürün Katalogu', 'Sepet Sistemi', 'Ödeme Entegrasyonu', 'Stok Yönetimi'],
			price: 299,
			setupTime: '24 saat',
			category: 'E-ticaret'
		},
		{
			id: 'TPL-002',
			name: 'Showcase Sitesi',
			description: 'Ürün tanıtımı için basit vitrin sitesi',
			features: ['Ürün Galerisi', 'İletişim Formu', 'Sosyal Medya Entegrasyonu'],
			price: 99,
			setupTime: '4 saat',
			category: 'Vitrin'
		},
		{
			id: 'TPL-003',
			name: 'Premium Store',
			description: 'Gelişmiş özellikler ve özelleştirmeler',
			features: ['Tüm E-ticaret Özellikleri', 'Özel Tasarım', 'Analitik Dashboard', 'API Erişimi'],
			price: 599,
			setupTime: '48 saat',
			category: 'Premium'
		}
	];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'suspended': return 'bg-red-100 text-red-800';
			case 'expired': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getSSLStatusColor = (status: string) => {
		switch (status) {
			case 'valid': return 'bg-green-100 text-green-800';
			case 'expiring': return 'bg-yellow-100 text-yellow-800';
			case 'expired': return 'bg-red-100 text-red-800';
			case 'pending': return 'bg-blue-100 text-blue-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'E-ticaret': return 'bg-blue-100 text-blue-800';
			case 'Vitrin': return 'bg-green-100 text-green-800';
			case 'Premium': return 'bg-purple-100 text-purple-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">White Label Domain Yönetimi</h1>
					<p className="text-gray-600">Satıcılar için özel domain ve subdomain yönetimi</p>
				</div>
				<div className="flex space-x-2">
					<button 
						onClick={() => setIsAddingDomain(true)}
						className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
					>
						Yeni Domain
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						DNS Ayarları
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{domains.length}</div>
					<div className="text-sm text-gray-600">Toplam Domain</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">
						{domains.filter(d => d.status === 'active').length}
					</div>
					<div className="text-sm text-gray-600">Aktif Domain</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">
						{domains.reduce((sum, d) => sum + d.monthlyVisits, 0).toLocaleString()}
					</div>
					<div className="text-sm text-gray-600">Aylık Ziyaret</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">
						{formatCurrency(domains.reduce((sum, d) => sum + d.revenue, 0))}
					</div>
					<div className="text-sm text-gray-600">Toplam Gelir</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'domains', label: 'Domain Listesi', count: domains.length },
							{ key: 'dns', label: 'DNS Yönetimi', count: dnsRecords.length },
							{ key: 'templates', label: 'Şablonlar', count: subdomainTemplates.length },
							{ key: 'analytics', label: 'Analitik', count: null }
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
								{tab.label} {tab.count !== null && `(${tab.count})`}
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'domains' && (
						<div className="space-y-4">
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Domain</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Satıcı</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">SSL</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ziyaret</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dönüşüm</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Gelir</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{domains.map((domain) => (
											<tr key={domain.id} className="hover:bg-gray-50">
												<td className="px-4 py-3">
													<div>
														<div className="font-medium text-gray-900">{domain.domain}</div>
														<div className="text-sm text-gray-500">
															Oluşturulma: {new Date(domain.createdAt).toLocaleDateString('tr-TR')}
														</div>
													</div>
												</td>
												<td className="px-4 py-3">
													<div>
														<div className="font-medium text-gray-900">{domain.sellerName}</div>
														<div className="text-sm text-gray-500">{domain.sellerId}</div>
													</div>
												</td>
												<td className="px-4 py-3">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(domain.status)}`}>
														{domain.status === 'active' ? 'Aktif' : 
														 domain.status === 'pending' ? 'Beklemede' : 
														 domain.status === 'suspended' ? 'Askıda' : 'Süresi Dolmuş'}
													</span>
												</td>
												<td className="px-4 py-3">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSSLStatusColor(domain.sslStatus)}`}>
														{domain.sslStatus === 'valid' ? 'Geçerli' : 
														 domain.sslStatus === 'expiring' ? 'Süresi Doluyor' : 
														 domain.sslStatus === 'expired' ? 'Süresi Dolmuş' : 'Beklemede'}
													</span>
													{domain.sslExpiry && (
														<div className="text-xs text-gray-500 mt-1">
															{new Date(domain.sslExpiry).toLocaleDateString('tr-TR')}
														</div>
													)}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													{domain.monthlyVisits.toLocaleString()}
												</td>
												<td className="px-4 py-3 text-sm text-gray-900">
													%{domain.conversionRate}
												</td>
												<td className="px-4 py-3 text-sm font-medium text-green-600">
													{formatCurrency(domain.revenue)}
												</td>
												<td className="px-4 py-3 text-sm">
													<div className="flex space-x-2">
														<button className="text-indigo-600 hover:text-indigo-900">Düzenle</button>
														<button className="text-blue-600 hover:text-blue-900">SSL</button>
														<button className="text-green-600 hover:text-green-900">Analitik</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'dns' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">DNS Kayıt Yönetimi</h3>
								<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
									Yeni Kayıt Ekle
								</button>
							</div>

							<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
								<h4 className="font-semibold text-blue-900 mb-2">DNS Yapılandırma Bilgisi</h4>
								<p className="text-blue-700 text-sm">
									DNS kayıtları otomatik olarak yapılandırılır. Manuel değişiklikler için DNS yöneticisi ile iletişime geçin.
								</p>
							</div>

							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Domain</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Tip</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">TTL</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
											<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{dnsRecords.map((record) => {
											const domain = domains.find(d => d.id === record.domainId);
											return (
												<tr key={record.id} className="hover:bg-gray-50">
													<td className="px-4 py-3 text-sm text-gray-900">
														{domain?.domain || 'Unknown'}
													</td>
													<td className="px-4 py-3">
														<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
															{record.type}
														</span>
													</td>
													<td className="px-4 py-3 text-sm text-gray-900 font-mono">
														{record.name}
													</td>
													<td className="px-4 py-3 text-sm text-gray-900 font-mono">
														{record.value}
													</td>
													<td className="px-4 py-3 text-sm text-gray-900">
														{record.ttl}s
													</td>
													<td className="px-4 py-3">
														<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
															{record.status === 'active' ? 'Aktif' : 'Pasif'}
														</span>
													</td>
													<td className="px-4 py-3 text-sm">
														<div className="flex space-x-2">
															<button className="text-indigo-600 hover:text-indigo-900">Düzenle</button>
															<button className="text-red-600 hover:text-red-900">Sil</button>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'templates' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Domain Şablonları</h3>
								<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
									Yeni Şablon
								</button>
							</div>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{subdomainTemplates.map((template) => (
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
												<h5 className="font-medium text-gray-900 mb-2">Özellikler:</h5>
												<ul className="text-sm text-gray-600 space-y-1">
													{template.features.map((feature, index) => (
														<li key={index} className="flex items-center">
															<span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
															{feature}
														</li>
													))}
												</ul>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-gray-600">Kurulum Süresi:</span>
												<span className="font-medium">{template.setupTime}</span>
											</div>
										</div>

										<div className="flex items-center justify-between pt-4 border-t border-gray-200">
											<div className="text-2xl font-bold text-indigo-600">
												{formatCurrency(template.price)}
											</div>
											<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
												Şablonu Kullan
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Domain Analitikleri</h3>

							<div className="grid lg:grid-cols-2 gap-6">
								{/* Traffic Chart */}
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Trafik Analizi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Trafik analiz grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								{/* Performance Metrics */}
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Performans Metrikleri</h4>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											{domains.filter(d => d.status === 'active').map((domain) => (
												<div key={domain.id} className="border-l-4 border-indigo-500 pl-4">
													<div className="font-medium text-gray-900">{domain.domain}</div>
													<div className="text-sm text-gray-600 space-y-1">
														<div className="flex justify-between">
															<span>Aylık Ziyaret:</span>
															<span className="font-medium">{domain.monthlyVisits.toLocaleString()}</span>
														</div>
														<div className="flex justify-between">
															<span>Dönüşüm Oranı:</span>
															<span className="font-medium">%{domain.conversionRate}</span>
														</div>
														<div className="flex justify-between">
															<span>Aylık Gelir:</span>
															<span className="font-medium text-green-600">{formatCurrency(domain.revenue)}</span>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Domain Performans Karşılaştırması</h4>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 Karşılaştırmalı performans grafiği burada görünecek</p>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Add Domain Modal */}
			{isAddingDomain && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">Yeni Domain Ekle</h3>
							<button 
								onClick={() => setIsAddingDomain(false)}
								className="text-gray-400 hover:text-gray-600"
							>
								✕
							</button>
						</div>
						<form className="space-y-4">
							<div className="grid md:grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Domain Adı *
									</label>
									<input
										type="text"
										className="w-full border rounded-lg px-3 py-2"
										placeholder="örn: shop.domain.com"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Satıcı Seçin *
									</label>
									<select className="w-full border rounded-lg px-3 py-2">
										<option value="">Satıcı Seçin</option>
										<option value="SEL-001">Anime Store Turkey</option>
										<option value="SEL-002">Vintage Collections</option>
										<option value="SEL-003">Tech Gadgets Pro</option>
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Şablon Seçin *
									</label>
									<select className="w-full border rounded-lg px-3 py-2">
										<option value="">Şablon Seçin</option>
										{subdomainTemplates.map((template) => (
											<option key={template.id} value={template.id}>
												{template.name} - {formatCurrency(template.price)}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										SSL Sertifikası
									</label>
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" defaultChecked />
										<span className="text-sm text-gray-600">Otomatik SSL kurulumu</span>
									</div>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Özelleştirmeler
								</label>
								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" />
										<span className="text-sm text-gray-600">Özel Logo</span>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" />
										<span className="text-sm text-gray-600">Özel Renkler</span>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" />
										<span className="text-sm text-gray-600">Özel Favicon</span>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" className="rounded" />
										<span className="text-sm text-gray-600">Özel Tema</span>
									</div>
								</div>
							</div>
							<div className="flex justify-end space-x-3 pt-4">
								<button 
									type="button"
									onClick={() => setIsAddingDomain(false)}
									className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
								>
									İptal
								</button>
								<button 
									type="submit"
									className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
								>
									Domain Oluştur
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
						<span className="text-2xl mr-3">🌐</span>
						<h3 className="text-lg font-semibold text-blue-900">Domain Kaydı</h3>
					</div>
					<p className="text-blue-700 mb-4">Yeni domain kayıt işlemleri.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Domain Kaydet
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔒</span>
						<h3 className="text-lg font-semibold text-green-900">SSL Yönetimi</h3>
					</div>
					<p className="text-green-700 mb-4">SSL sertifikalarını yönet ve yenile.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						SSL Ayarları
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎨</span>
						<h3 className="text-lg font-semibold text-purple-900">Özelleştirme</h3>
					</div>
					<p className="text-purple-700 mb-4">Domain tasarımlarını özelleştir.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Tasarım Editor
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-orange-900">Performans</h3>
					</div>
					<p className="text-orange-700 mb-4">Domain performans analizi.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Analiz Raporu
					</button>
				</div>
			</div>
		</div>
	);
}
