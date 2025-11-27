"use client";


// Client components are dynamic by default
import { useState, Suspense } from 'react';

export default function SystemLogsPage() {
	const [activeTab, setActiveTab] = useState('recent');
	const [logLevel, setLogLevel] = useState('all');

	const logs: any[] = [];

	const logStats = {
		total: 0,
		critical: 0,
		error: 0,
		warning: 0,
		info: 0,
		debug: 0
	};

	const sources: any[] = [];

	const getLevelColor = (level: string) => {
		switch (level) {
			case 'critical': return 'bg-red-600 text-white';
			case 'error': return 'bg-red-100 text-red-800';
			case 'warning': return 'bg-yellow-100 text-yellow-800';
			case 'info': return 'bg-blue-100 text-blue-800';
			case 'debug': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getLevelIcon = (level: string) => {
		switch (level) {
			case 'critical': return '🚨';
			case 'error': return '❌';
			case 'warning': return '⚠️';
			case 'info': return 'ℹ️';
			case 'debug': return '🔍';
			default: return '📄';
		}
	};

	const filteredLogs = logLevel === 'all' ? logs : logs.filter(log => log.level === logLevel);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Sistem Logları</h1>
					<p className="text-gray-600">Sistem aktivitesi ve hata takibi</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={logLevel}
						onChange={(e) => setLogLevel(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="all">Tüm Seviyeler</option>
						<option value="critical">Critical</option>
						<option value="error">Error</option>
						<option value="warning">Warning</option>
						<option value="info">Info</option>
						<option value="debug">Debug</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Log İndir
					</button>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Temizle
					</button>
				</div>
			</div>

			{/* Log Level Statistics */}
			<div className="grid md:grid-cols-6 gap-4">
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-2xl font-bold text-gray-700">{logStats.total.toLocaleString()}</div>
					<div className="text-sm text-gray-600">Toplam Log</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{logStats.critical}</div>
					<div className="text-sm text-red-600">Critical</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{logStats.error}</div>
					<div className="text-sm text-orange-600">Error</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{logStats.warning}</div>
					<div className="text-sm text-yellow-600">Warning</div>
				</div>
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{logStats.info.toLocaleString()}</div>
					<div className="text-sm text-blue-600">Info</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{logStats.debug.toLocaleString()}</div>
					<div className="text-sm text-purple-600">Debug</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'recent', label: 'Son Loglar', icon: '📄' },
							{ key: 'analytics', label: 'Analitik', icon: '📊' },
							{ key: 'search', label: 'Gelişmiş Arama', icon: '🔍' },
							{ key: 'alerts', label: 'Uyarılar', icon: '🔔' }
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
					{activeTab === 'recent' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Son Sistem Logları</h3>

							{filteredLogs.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl mb-4">📋</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Log Yok</h3>
									<p className="text-gray-600">Sistem logları oluştuğunda burada görünecek</p>
								</div>
							) : (
								<>
									<div className="space-y-3">
										{filteredLogs.map((log) => (
									<div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
										<div className="flex items-start justify-between">
											<div className="flex items-start space-x-3 flex-1">
												<span className="text-xl">{getLevelIcon(log.level)}</span>
												<div className="flex-1">
													<div className="flex items-center space-x-3 mb-2">
														<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(log.level)}`}>
															{log.level.toUpperCase()}
														</span>
														<span className="text-sm font-medium text-gray-900">{log.source}</span>
														<span className="text-sm text-gray-500">{log.timestamp}</span>
													</div>
													<div className="text-gray-900 mb-1">{log.message}</div>
													{log.details && (
														<div className="text-sm text-gray-600">{log.details}</div>
													)}
													<div className="text-xs text-gray-500 mt-2">IP: {log.ip}</div>
												</div>
											</div>
											<button className="text-gray-400 hover:text-gray-600">
												<span className="text-sm">📋</span>
											</button>
										</div>
									</div>
										))}
									</div>

									<div className="flex justify-center">
										<button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
											Daha Fazla Yükle
										</button>
									</div>
								</>
							)}
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Log Analitikleri</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Log Seviyesi Dağılımı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📊 Log seviyesi grafik burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Kaynak Dağılımı</h4>
									</div>
									<div className="p-4">
										{sources.length === 0 ? (
											<div className="text-center py-12">
												<p className="text-gray-500">Henüz kaynak verisi yok</p>
											</div>
										) : (
											<div className="space-y-3">
												{sources.map((source, index) => (
												<div key={index} className="flex justify-between items-center">
													<span className="text-gray-700">{source.name}</span>
													<div className="flex items-center space-x-2">
														<div className="w-24 bg-gray-200 rounded-full h-2">
															<div 
																className="bg-indigo-600 h-2 rounded-full"
																style={{ width: `${(source.count / Math.max(...sources.map(s => s.count))) * 100}%` }}
															></div>
														</div>
														<span className="text-sm font-medium text-gray-900">{source.count}</span>
													</div>
												</div>
												))}
											</div>
										)}
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Zaman Bazlı Aktivite</h4>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Zaman bazlı log aktivite grafiği burada görünecek</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'search' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Gelişmiş Log Arama</h3>

							<div className="bg-white border rounded-lg p-6">
								<div className="grid md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Arama Terimi
										</label>
										<input 
											type="text" 
											className="w-full border border-gray-300 rounded-lg px-3 py-2"
											placeholder="Log mesajında ara..."
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Log Seviyesi
										</label>
										<select className="w-full border border-gray-300 rounded-lg px-3 py-2">
											<option value="">Tümü</option>
											<option value="critical">Critical</option>
											<option value="error">Error</option>
											<option value="warning">Warning</option>
											<option value="info">Info</option>
											<option value="debug">Debug</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Kaynak
										</label>
										<select className="w-full border border-gray-300 rounded-lg px-3 py-2">
											<option value="">Tümü</option>
											<option value="authentication">Authentication</option>
											<option value="order">Order Processing</option>
											<option value="database">Database</option>
											<option value="api">API</option>
											<option value="system">System</option>
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											IP Adresi
										</label>
										<input 
											type="text" 
											className="w-full border border-gray-300 rounded-lg px-3 py-2"
											placeholder="192.168.1.1"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Başlangıç Tarihi
										</label>
										<input 
											type="datetime-local" 
											className="w-full border border-gray-300 rounded-lg px-3 py-2"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Bitiş Tarihi
										</label>
										<input 
											type="datetime-local" 
											className="w-full border border-gray-300 rounded-lg px-3 py-2"
										/>
									</div>
								</div>
								<div className="mt-6 flex space-x-3">
									<button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
										Ara
									</button>
									<button className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400">
										Temizle
									</button>
									<button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
										Sonuçları İndir
									</button>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'alerts' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Log Uyarı Kuralları</h3>

							<div className="space-y-4">
								<div className="border rounded-lg p-6">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h4 className="font-semibold text-gray-900">Kritik Hata Uyarısı</h4>
											<p className="text-sm text-gray-600">Critical seviyesindeki loglar için anında bildirim</p>
										</div>
										<span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
											Aktif
										</span>
									</div>
									<div className="text-sm text-gray-700">
										<strong>Kural:</strong> level = "critical"<br/>
										<strong>Bildirim:</strong> Email + SMS<br/>
										<strong>Frekans:</strong> Anında
									</div>
								</div>

								<div className="border rounded-lg p-6">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h4 className="font-semibold text-gray-900">Yüksek Hata Oranı</h4>
											<p className="text-sm text-gray-600">5 dakikada 10'dan fazla error logu</p>
										</div>
										<span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
											Aktif
										</span>
									</div>
									<div className="text-sm text-gray-700">
										<strong>Kural:</strong> count(level = &quot;error&quot;) &gt; 10 in 5min<br/>
										<strong>Bildirim:</strong> Email<br/>
										<strong>Frekans:</strong> 15 dakikada bir
									</div>
								</div>

								<div className="border rounded-lg p-6">
									<div className="flex items-start justify-between mb-4">
										<div>
											<h4 className="font-semibold text-gray-900">Başarısız Login Denemeleri</h4>
											<p className="text-sm text-gray-600">Aynı IP'den 5 başarısız login</p>
										</div>
										<span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
											Duraklatıldı
										</span>
									</div>
									<div className="text-sm text-gray-700">
										<strong>Kural:</strong> source = &quot;Authentication&quot; AND message contains &quot;Failed login&quot; count &gt; 5<br/>
										<strong>Bildirim:</strong> Email<br/>
										<strong>Frekans:</strong> Saatte bir
									</div>
								</div>
							</div>

							<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
								Yeni Uyarı Kuralı
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚨</span>
						<h3 className="text-lg font-semibold text-red-900">Kritik Loglar</h3>
					</div>
					<p className="text-red-700 mb-4">Son 24 saatteki kritik logları inceleyin.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						İncele
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Log Analizi</h3>
					</div>
					<p className="text-blue-700 mb-4">Detaylı log analiz raporu oluşturun.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔧</span>
						<h3 className="text-lg font-semibold text-green-900">Log Ayarları</h3>
					</div>
					<p className="text-green-700 mb-4">Log seviyesi ve rotation ayarları.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Ayarla
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💾</span>
						<h3 className="text-lg font-semibold text-purple-900">Log Arşivi</h3>
					</div>
					<p className="text-purple-700 mb-4">Eski logları arşivleyin ve yönetin.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Arşivle
					</button>
				</div>
			</div>
		</div>
	);
}
