"use client";


// Client components are dynamic by default
import { useState, Suspense } from 'react';

export default function SecurityPage() {
	const [activeTab, setActiveTab] = useState('overview');

	const securityLogs: any[] = [];

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'Düşük': return 'bg-green-100 text-green-800';
			case 'Orta': return 'bg-yellow-100 text-yellow-800';
			case 'Yüksek': return 'bg-orange-100 text-orange-800';
			case 'Kritik': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Engellendi': return 'bg-red-100 text-red-800';
			case 'İnceleniyor': return 'bg-yellow-100 text-yellow-800';
			case 'Çözüldü': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Güvenlik Merkezi</h1>
				<div className="flex space-x-2">
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Acil Durum Modu
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Güvenlik Raporu
					</button>
				</div>
			</div>

			{/* Security Status Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-lg font-semibold text-green-600">Güvenli</div>
							<div className="text-sm text-gray-600">Sistem Durumu</div>
						</div>
						<div className="text-2xl">🛡️</div>
					</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">0</div>
					<div className="text-sm text-gray-600">Aktif Tehdit</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">0</div>
					<div className="text-sm text-gray-600">Engellenen IP</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">0%</div>
					<div className="text-sm text-gray-600">Güvenlik Skoru</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış' },
							{ key: 'threats', label: 'Tehdit Analizi' },
							{ key: 'firewall', label: 'Firewall' },
							{ key: 'access', label: 'Erişim Kontrolü' },
							{ key: 'audit', label: 'Denetim Logları' }
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
								{tab.label}
							</button>
						))}
					</nav>
				</div>

				<div className="p-6">
					{activeTab === 'overview' && (
						<div className="space-y-6">
							{/* Security Score */}
							<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-green-900">Güvenlik Skoru</h3>
									<div className="text-3xl font-bold text-green-600">0%</div>
								</div>
								<div className="grid md:grid-cols-4 gap-4">
									<div className="text-center">
										<div className="text-2xl font-bold text-green-600">✓</div>
										<div className="text-sm text-green-700">SSL Sertifikası</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-green-600">✓</div>
										<div className="text-sm text-green-700">2FA Aktif</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-green-600">✓</div>
										<div className="text-sm text-green-700">Firewall Aktif</div>
									</div>
									<div className="text-center">
										<div className="text-2xl font-bold text-yellow-600">⚠️</div>
										<div className="text-sm text-yellow-700">Backup Eski</div>
									</div>
								</div>
							</div>

							{/* Recent Security Events */}
							<div>
								<h3 className="text-lg font-semibold mb-4">Son Güvenlik Olayları</h3>
								{securityLogs.length === 0 ? (
									<div className="text-center py-12">
										<div className="text-6xl mb-4">🛡️</div>
										<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Güvenlik Olayı Yok</h3>
										<p className="text-gray-600">Güvenlik olayları tespit edildiğinde burada görünecek</p>
									</div>
								) : (
									<div className="space-y-3">
										{securityLogs.slice(0, 5).map((log) => (
										<div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
											<div className="flex items-center space-x-4">
												<div className="w-2 h-2 bg-red-500 rounded-full"></div>
												<div>
													<div className="font-medium text-gray-900">{log.type}</div>
													<div className="text-sm text-gray-500">{log.user} • {log.ip}</div>
												</div>
											</div>
											<div className="text-right">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
													{log.severity}
												</span>
												<div className="text-sm text-gray-500 mt-1">{log.timestamp}</div>
											</div>
										</div>
										))}
									</div>
								)}
							</div>
						</div>
					)}

					{activeTab === 'threats' && (
						<div className="space-y-6">
							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-red-50 p-6 rounded-xl border border-red-200">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">🚨</span>
										<h3 className="text-lg font-semibold text-red-900">Aktif Tehditler</h3>
									</div>
									<div className="text-3xl font-bold text-red-600 mb-2">0</div>
									<p className="text-red-700">Henüz tehdit tespit edilmedi</p>
								</div>

								<div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">⚠️</span>
										<h3 className="text-lg font-semibold text-yellow-900">Şüpheli Aktivite</h3>
									</div>
									<div className="text-3xl font-bold text-yellow-600 mb-2">0</div>
									<p className="text-yellow-700">Şüpheli aktivite yok</p>
								</div>

								<div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
									<div className="flex items-center mb-4">
										<span className="text-2xl mr-3">🔍</span>
										<h3 className="text-lg font-semibold text-blue-900">Tarama</h3>
									</div>
									<div className="text-3xl font-bold text-blue-600 mb-2">0</div>
									<p className="text-blue-700">Tarama denemesi yok</p>
								</div>
							</div>

							{/* Threat Map */}
							<div className="bg-white p-6 rounded-xl border">
								<h3 className="text-lg font-semibold mb-4">Tehdit Haritası</h3>
								<div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
									<p className="text-gray-500">Dünya haritasında tehdit konumları</p>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'firewall' && (
						<div className="space-y-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white p-6 rounded-xl border">
									<h3 className="text-lg font-semibold mb-4">Firewall Durumu</h3>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span>Web Application Firewall</span>
											<span className="text-green-600 font-semibold">Aktif</span>
										</div>
										<div className="flex items-center justify-between">
											<span>DDoS Koruması</span>
											<span className="text-green-600 font-semibold">Aktif</span>
										</div>
										<div className="flex items-center justify-between">
											<span>IP Filtreleme</span>
											<span className="text-green-600 font-semibold">Aktif</span>
										</div>
										<div className="flex items-center justify-between">
											<span>Rate Limiting</span>
											<span className="text-yellow-600 font-semibold">Kısmi</span>
										</div>
									</div>
								</div>

								<div className="bg-white p-6 rounded-xl border">
									<h3 className="text-lg font-semibold mb-4">Engellenen IP'ler</h3>
									<div className="space-y-2">
										<div className="flex items-center justify-between p-2 bg-red-50 rounded">
											<span className="font-mono">203.45.67.89</span>
											<span className="text-sm text-red-600">DDoS</span>
										</div>
										<div className="flex items-center justify-between p-2 bg-red-50 rounded">
											<span className="font-mono">45.123.89.45</span>
											<span className="text-sm text-red-600">Brute Force</span>
										</div>
										<div className="flex items-center justify-between p-2 bg-red-50 rounded">
											<span className="font-mono">78.90.12.34</span>
											<span className="text-sm text-red-600">SQL Injection</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'access' && (
						<div className="space-y-6">
							<div className="bg-white p-6 rounded-xl border">
								<h3 className="text-lg font-semibold mb-4">Erişim Kontrol Ayarları</h3>
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Maksimum Giriş Denemesi
										</label>
										<input
											type="number"
											defaultValue="5"
											className="w-full border rounded-lg px-3 py-2"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Hesap Kilitleme Süresi (dakika)
										</label>
										<input
											type="number"
											defaultValue="30"
											className="w-full border rounded-lg px-3 py-2"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Oturum Zaman Aşımı (dakika)
										</label>
										<input
											type="number"
											defaultValue="120"
											className="w-full border rounded-lg px-3 py-2"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Şifre Karmaşıklığı
										</label>
										<select className="w-full border rounded-lg px-3 py-2">
											<option>Düşük</option>
											<option>Orta</option>
											<option selected>Yüksek</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'audit' && (
						<div>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Olay
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Kullanıcı
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												IP Adresi
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Önem
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Durum
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Zaman
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{securityLogs.length === 0 ? (
											<tr>
												<td colSpan={6} className="px-6 py-12 text-center">
													<div className="text-6xl mb-4">📋</div>
													<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Log Yok</h3>
													<p className="text-gray-600">Güvenlik logları oluştuğunda burada görünecek</p>
												</td>
											</tr>
										) : (
											securityLogs.map((log) => (
											<tr key={log.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{log.type}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{log.user}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
													{log.ip}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
														{log.severity}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
														{log.status}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{log.timestamp}
												</td>
											</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚨</span>
						<h3 className="text-lg font-semibold text-red-900">Acil Durum</h3>
					</div>
					<p className="text-red-700 mb-4">Sistem güvenliğini kilitle.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Kilitle
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-blue-900">Güvenlik Taraması</h3>
					</div>
					<p className="text-blue-700 mb-4">Sistem güvenlik taraması başlat.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Tara
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🛡️</span>
						<h3 className="text-lg font-semibold text-green-900">Firewall Güncelle</h3>
					</div>
					<p className="text-green-700 mb-4">Firewall kurallarını güncelle.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Güncelle
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Güvenlik Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı güvenlik raporu oluştur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>
			</div>
		</div>
	)
}
