"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function ContentApprovalWorkflowsPage() {
	const [activeTab, setActiveTab] = useState('workflows');
	const [workflows] = useState<any[]>([]);
	const [pendingApprovals] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'draft': return 'bg-gray-100 text-gray-800';
			case 'paused': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'urgent': return 'bg-red-100 text-red-800';
			case 'high': return 'bg-orange-100 text-orange-800';
			case 'normal': return 'bg-blue-100 text-blue-800';
			case 'low': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">İçerik Onay Süreçleri</h1>
					<p className="text-gray-600">Workflow tabanlı içerik onay sistemleri</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Workflow
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Şablonlar
					</button>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid md:grid-cols-5 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">0</div>
					<div className="text-sm text-blue-600">Bekleyen Onay</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">0</div>
					<div className="text-sm text-green-600">Aktif Workflow</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">0 saat</div>
					<div className="text-sm text-purple-600">Ortalama Süre</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">0%</div>
					<div className="text-sm text-orange-600">Onay Oranı</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">0</div>
					<div className="text-sm text-red-600">Acil Durum</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'workflows', label: 'Workflow\'lar', icon: '🔄' },
							{ key: 'pending', label: 'Bekleyen Onaylar', icon: '⏳' },
							{ key: 'analytics', label: 'Analitik', icon: '📊' },
							{ key: 'settings', label: 'Ayarlar', icon: '⚙️' }
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
							<h3 className="text-lg font-semibold text-gray-900">Onay Workflow\'ları</h3>

							{workflows.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">🔄</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Workflow Yok</h3>
									<p className="text-gray-600 mb-4">İçerik onay süreçleri için workflow oluşturun.</p>
									<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
										İlk Workflow'u Oluştur
									</button>
								</div>
							) : (
								<div className="space-y-4">
									{workflows.map((workflow) => (
									<div key={workflow.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{workflow.name}</h4>
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}>
														{workflow.status === 'active' ? 'Aktif' : workflow.status}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-2">
													<strong>Tip:</strong> {workflow.type} • 
													<strong> Adım Sayısı:</strong> {workflow.steps} • 
													<strong> Son Güncelleme:</strong> {workflow.lastUpdated}
												</div>
											</div>
										</div>

										<div className="grid md:grid-cols-3 gap-4 mb-4">
											<div className="text-center">
												<div className="text-lg font-semibold text-blue-600">{workflow.pendingItems}</div>
												<div className="text-xs text-gray-600">Bekleyen İtem</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-green-600">{workflow.avgTime}</div>
												<div className="text-xs text-gray-600">Ortalama Süre</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-semibold text-purple-600">{workflow.steps}</div>
												<div className="text-xs text-gray-600">Toplam Adım</div>
											</div>
										</div>

										<div className="flex space-x-3">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Düzenle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
												Görüntüle
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm font-medium">
												Kopyala
											</button>
											<button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
												Raporlar
											</button>
										</div>
									</div>
								))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'pending' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Bekleyen Onaylar</h3>

							{pendingApprovals.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">⏳</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Bekleyen Onay Yok</h3>
									<p className="text-gray-600">Onay bekleyen içerikler burada görünecek.</p>
								</div>
							) : (
								<div className="space-y-4">
									{pendingApprovals.map((item) => (
									<div key={item.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center space-x-3 mb-2">
													<h4 className="font-semibold text-gray-900">{item.title}</h4>
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
														{item.priority === 'urgent' ? 'Acil' : 
														 item.priority === 'high' ? 'Yüksek' : 
														 item.priority === 'normal' ? 'Normal' : 'Düşük'}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-2">
													<strong>Tip:</strong> {item.type} • 
													<strong> Yazar:</strong> {item.author} • 
													<strong> Gönderilme:</strong> {item.submittedAt}
												</div>
												<div className="text-sm text-gray-600 mb-2">
													<strong>Workflow:</strong> {item.workflow} • 
													<strong> Mevcut Adım:</strong> {item.currentStep}
												</div>
												<div className="text-sm text-gray-600">
													<strong>Atanan:</strong> {item.assignedTo} • 
													<strong> Deadline:</strong> {item.deadline}
												</div>
											</div>
										</div>

										<div className="flex space-x-3">
											<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
												Onayla
											</button>
											<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
												Reddet
											</button>
											<button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
												Geri Gönder
											</button>
											<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
												Yorum Ekle
											</button>
										</div>
									</div>
								))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Workflow Analitikleri</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Onay Süreleri</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">📊 Workflow süre analiz grafiği burada görünecek</p>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg">
									<div className="p-4 border-b border-gray-200">
										<h4 className="font-semibold text-gray-900">Onay Oranları</h4>
									</div>
									<div className="p-4">
										<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
											<p className="text-gray-500">🥧 Onay/ret oranları grafiği burada görünecek</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-white border rounded-lg">
								<div className="p-4 border-b border-gray-200">
									<h4 className="font-semibold text-gray-900">Performans Metrikleri</h4>
								</div>
								<div className="p-4">
									<div className="grid md:grid-cols-4 gap-6">
										<div className="text-center">
											<div className="text-2xl font-bold text-green-600">0%</div>
											<div className="text-sm text-gray-600">Onay Oranı</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-blue-600">0 saat</div>
											<div className="text-sm text-gray-600">Ortalama Süre</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-purple-600">0 gün</div>
											<div className="text-sm text-gray-600">Ortalama Bekleme</div>
										</div>
										<div className="text-center">
											<div className="text-2xl font-bold text-orange-600">0%</div>
											<div className="text-sm text-gray-600">Red Oranı</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'settings' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Workflow Ayarları</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="bg-white border rounded-lg p-6">
									<h4 className="font-semibold text-gray-900 mb-4">Genel Ayarlar</h4>
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<input type="checkbox" id="auto_assign" defaultChecked />
											<label htmlFor="auto_assign" className="text-sm text-gray-700">
												Otomatik görevlendirme
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<input type="checkbox" id="deadline_alerts" defaultChecked />
											<label htmlFor="deadline_alerts" className="text-sm text-gray-700">
												Deadline uyarıları
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<input type="checkbox" id="escalation" />
											<label htmlFor="escalation" className="text-sm text-gray-700">
												Otomatik escalation
											</label>
										</div>
									</div>
								</div>

								<div className="bg-white border rounded-lg p-6">
									<h4 className="font-semibold text-gray-900 mb-4">Bildirim Ayarları</h4>
									<div className="space-y-4">
										<div className="flex items-center space-x-2">
											<input type="checkbox" id="email_notifications" defaultChecked />
											<label htmlFor="email_notifications" className="text-sm text-gray-700">
												Email bildirimleri
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<input type="checkbox" id="slack_integration" />
											<label htmlFor="slack_integration" className="text-sm text-gray-700">
												Slack entegrasyonu
											</label>
										</div>
										<div className="flex items-center space-x-2">
											<input type="checkbox" id="daily_digest" defaultChecked />
											<label htmlFor="daily_digest" className="text-sm text-gray-700">
												Günlük özet
											</label>
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
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-green-900">Hızlı Onay</h3>
					</div>
					<p className="text-green-700 mb-4">Bekleyen onayları toplu olarak işleyin.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu İşlem
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔧</span>
						<h3 className="text-lg font-semibold text-blue-900">Workflow Builder</h3>
					</div>
					<p className="text-blue-700 mb-4">Yeni onay süreçleri oluşturun.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Builder Aç
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Performans Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı workflow performans raporu.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⏰</span>
						<h3 className="text-lg font-semibold text-orange-900">SLA İzleme</h3>
					</div>
					<p className="text-orange-700 mb-4">Servis seviyesi anlaşmaları takibi.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						SLA Kontrol
					</button>
				</div>
			</div>
		</div>
	);
}
