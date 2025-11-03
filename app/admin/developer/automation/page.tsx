"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function ProcessAutomationPage() {
	const [activeTab, setActiveTab] = useState('workflows');
	const [selectedWorkflow, setSelectedWorkflow] = useState('order-processing');

	const workflows: any[] = [];

	const automationTypes = [
		{
			category: 'E-ticaret',
			automations: [
				'Sipariş onayı ve işleme',
				'Stok yönetimi ve uyarıları',
				'Fatura oluşturma',
				'Kargo takibi ve bilgilendirme',
				'İade süreç yönetimi'
			]
		},
		{
			category: 'Marketing',
			automations: [
				'Email pazarlama kampanyaları',
				'Sosyal medya paylaşımları',
				'Lead nurturing süreçleri',
				'A/B test yönetimi',
				'Segment bazlı hedefleme'
			]
		},
		{
			category: 'Müşteri Hizmetleri',
			automations: [
				'Ticket yönlendirme',
				'Otomatik yanıtlar',
				'Memnuniyet anketleri',
				'SLA takibi',
				'Escalation yönetimi'
			]
		},
		{
			category: 'Finansal',
			automations: [
				'Fatura tahsilat takibi',
				'Expense onayları',
				'Budget kontrolü',
				'Finansal raporlama',
				'Ödeme hatırlatmaları'
			]
		}
	];

	const triggers: any[] = [];

	const recentExecutions: any[] = [];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'paused': return 'bg-yellow-100 text-yellow-800';
			case 'error': return 'bg-red-100 text-red-800';
			case 'draft': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getExecutionStatusColor = (status: string) => {
		switch (status) {
			case 'success': return 'text-green-600';
			case 'warning': return 'text-yellow-600';
			case 'error': return 'text-red-600';
			default: return 'text-gray-600';
		}
	};

	const getExecutionStatusIcon = (status: string) => {
		switch (status) {
			case 'success': return '✅';
			case 'warning': return '⚠️';
			case 'error': return '❌';
			default: return '🔄';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">İş Süreç Otomasyonu</h1>
					<p className="text-gray-600">Akıllı iş akışları ve otomasyon yönetimi</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Workflow
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Template Galerisi
					</button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid md:grid-cols-5 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{workflows.filter(w => w.status === 'active').length}</div>
					<div className="text-sm text-blue-600">Aktif Workflow</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">0</div>
					<div className="text-sm text-green-600">Bugün Çalıştırılan</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">0%</div>
					<div className="text-sm text-purple-600">Başarı Oranı</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">0s</div>
					<div className="text-sm text-orange-600">Ortalama Süre</div>
				</div>
				<div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
					<div className="text-2xl font-bold text-indigo-700">₺0</div>
					<div className="text-sm text-indigo-600">Aylık Tasarruf</div>
				</div>
			</div>

			{/* Main Content Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'workflows', label: 'İş Akışları', icon: '🔄' },
							{ key: 'triggers', label: 'Tetikleyiciler', icon: '⚡' },
							{ key: 'templates', label: 'Şablonlar', icon: '📋' },
							{ key: 'monitoring', label: 'İzleme', icon: '📊' },
							{ key: 'analytics', label: 'Analitik', icon: '📈' }
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
					{activeTab === 'workflows' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Aktif İş Akışları</h3>

							{workflows.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl mb-4">🔄</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Workflow Yok</h3>
									<p className="text-gray-600">İlk workflow oluşturduğunuzda burada görünecek</p>
								</div>
							) : (
								<div className="space-y-4">
									{workflows.map((workflow) => {
										return (
									<div key={workflow.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{workflow.name}</h4>
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}>
														{workflow.status === 'active' ? 'Aktif' : 
														 workflow.status === 'paused' ? 'Duraklatıldı' : workflow.status}
													</span>
												</div>
												<p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
												<div className="text-sm text-gray-500">
													Son çalışma: {workflow.last_run}
												</div>
											</div>
											<div className="text-right">
												<div className="text-lg font-semibold text-green-600">
													%{workflow.success_rate}
												</div>
												<div className="text-sm text-gray-500">Başarı Oranı</div>
											</div>
										</div>

										<div className="grid md:grid-cols-4 gap-4 mb-4">
											<div className="text-center">
												<div className="text-lg font-semibold text-blue-600">{workflow.triggers}</div>
												<div className="text-xs text-gray-600">Tetikleyici</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-purple-600">{workflow.actions}</div>
												<div className="text-xs text-gray-600">Aksiyon</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-green-600">{workflow.executions.toLocaleString()}</div>
												<div className="text-xs text-gray-600">Toplam Çalışma</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-orange-600">
													{workflow.status === 'active' ? '🟢' : workflow.status === 'paused' ? '🟡' : '🔴'}
												</div>
												<div className="text-xs text-gray-600">Durum</div>
											</div>
										</div>

										<div className="flex space-x-3">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Düzenle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
												Analiz
											</button>
											{workflow.status === 'active' ? (
												<button className="text-yellow-600 hover:text-yellow-900 text-sm font-medium">
													Duraklat
												</button>
											) : (
												<button className="text-green-600 hover:text-green-900 text-sm font-medium">
													Başlat
												</button>
											)}
											<button className="text-purple-600 hover:text-purple-900 text-sm font-medium">
												Kopyala
											</button>
											<button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
												Loglar
											</button>
										</div>
									</div>
										);
									})}
								</div>
							)}
						</div>
					)}

					{activeTab === 'triggers' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Tetikleyici Aktivitesi</h3>

							{triggers.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl mb-4">⚡</div>
									<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Tetikleyici Yok</h3>
									<p className="text-gray-600">Workflow'lar çalıştıkça tetikleyici aktivitesi burada görünecek</p>
								</div>
							) : (
								<div className="grid md:grid-cols-3 gap-6">
									{triggers.map((trigger, index) => (
									<div key={index} className="bg-white border rounded-lg p-6">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center space-x-3">
												<span className="text-2xl">{trigger.icon}</span>
												<h4 className="font-semibold text-gray-900">{trigger.name}</h4>
											</div>
											<span className="text-2xl font-bold text-indigo-600">{trigger.count}</span>
										</div>
									<div className="text-sm text-gray-600">Son 24 saatte tetiklendi</div>
									</div>
								))}
								</div>
							)}

							{recentExecutions.length > 0 && (
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Son Çalışmalar</h4>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											{recentExecutions.map((execution, index) => (
											<div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
												<div className="flex items-center space-x-4">
													<span className="text-xl">{getExecutionStatusIcon(execution.status)}</span>
													<div>
														<div className="font-medium text-gray-900">{execution.workflow}</div>
														<div className="text-sm text-gray-600">{execution.trigger}</div>
													</div>
												</div>
												<div className="text-right">
													<div className={`text-sm font-medium ${getExecutionStatusColor(execution.status)}`}>
														{execution.duration}
													</div>
													<div className="text-xs text-gray-500">{execution.timestamp}</div>
												</div>
											</div>
											))}
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{activeTab === 'templates' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Otomasyon Şablonları</h3>

							<div className="space-y-6">
								{automationTypes.map((type, index) => (
									<div key={index} className="bg-white border rounded-lg">
										<div className="p-4 border-b border-gray-200">
											<h4 className="font-semibold text-gray-900">{type.category} Otomasyonları</h4>
										</div>
										<div className="p-4">
											<div className="grid md:grid-cols-2 gap-4">
												{type.automations.map((automation, i) => (
													<div key={i} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
														<div className="flex items-center justify-between">
															<span className="font-medium text-gray-900">{automation}</span>
															<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
																Kullan
															</button>
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'monitoring' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Sistem İzleme</h3>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Anlık Performans</h4>
									</div>
									<div className="p-4">
										<div className="space-y-4">
											<div className="flex justify-between items-center">
												<span className="text-gray-700">CPU Kullanımı</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-2">
														<div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
													</div>
													<span className="text-sm font-medium text-blue-600">0%</span>
												</div>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-gray-700">Bellek Kullanımı</span>
												<div className="flex items-center space-x-2">
													<div className="w-32 bg-gray-200 rounded-full h-2">
														<div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
													</div>
													<span className="text-sm font-medium text-green-600">0%</span>
												</div>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-gray-700">Aktif İş Akışı</span>
												<span className="text-lg font-bold text-indigo-600">0</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-gray-700">Bekleyen Görev</span>
												<span className="text-lg font-bold text-orange-600">0</span>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Hata İzleme</h4>
									</div>
									<div className="p-4">
										<div className="text-center py-8 text-gray-500">
											Henüz hata bulunmuyor
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">İş Akışı Durumları</h4>
								</div>
								<div className="p-4">
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 Workflow durumu grafiği burada görünecek</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Otomasyon Analitikleri</h3>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-green-50 border border-green-200 rounded-lg p-6">
									<h4 className="font-semibold text-green-900 mb-4">💰 Maliyet Tasarrufu</h4>
									<div className="text-3xl font-bold text-green-700 mb-2">₺0</div>
									<div className="text-sm text-green-600">Bu ay tasarruf edilen</div>
									<div className="mt-3 text-xs text-green-700">
										• Manuel işlem süresi: -0%<br/>
										• Hata oranı: -0%<br/>
										• İşlem maliyeti: -0%
									</div>
								</div>

								<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
									<h4 className="font-semibold text-blue-900 mb-4">⏱️ Zaman Kazanımı</h4>
									<div className="text-3xl font-bold text-blue-700 mb-2">0 saat</div>
									<div className="text-sm text-blue-600">Bu ay kazanılan zaman</div>
									<div className="mt-3 text-xs text-blue-700">
										• Ortalama işlem süresi: 0s<br/>
										• Manuel süre: 0 dakika<br/>
										• Verimlilik artışı: %0
									</div>
								</div>

								<div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
									<h4 className="font-semibold text-purple-900 mb-4">📈 Performans</h4>
									<div className="text-3xl font-bold text-purple-700 mb-2">%0</div>
									<div className="text-sm text-purple-600">Genel başarı oranı</div>
									<div className="mt-3 text-xs text-purple-700">
										• Uptime: %0<br/>
										• Ortalama yanıt: 0s<br/>
										• SLA uyumluluk: %0
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Workflow Performansı</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📊 Workflow performans grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Trend Analizi</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📈 Trend analizi grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">ROI Hesaplama</h4>
								</div>
								<div className="p-4">
									<div className="grid md:grid-cols-4 gap-6">
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">₺0</div>
											<div className="text-sm text-gray-600">Otomasyon Yatırımı</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-blue-600">₺0</div>
											<div className="text-sm text-gray-600">Toplam Tasarruf</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-purple-600">0%</div>
											<div className="text-sm text-gray-600">ROI Oranı</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-orange-600">0 ay</div>
											<div className="text-sm text-gray-600">Geri Ödeme Süresi</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚀</span>
						<h3 className="text-lg font-semibold text-green-900">Hızlı Başlangıç</h3>
					</div>
					<p className="text-green-700 mb-4">Popüler workflow şablonları ile hızlıca başlayın.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Şablonları Gör
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-blue-900">AI Önerileri</h3>
					</div>
					<p className="text-blue-700 mb-4">AI destekli otomasyon önerileri alın.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Önerileri Gör
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Performans Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı otomasyon performans raporu oluşturun.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔧</span>
						<h3 className="text-lg font-semibold text-orange-900">Workflow Builder</h3>
					</div>
					<p className="text-orange-700 mb-4">Sürükle-bırak ile özel workflow oluşturun.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Builder Aç
					</button>
				</div>
			</div>
		</div>
	);
}
