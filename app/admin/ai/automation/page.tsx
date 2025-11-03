"use client";

import { useState } from 'react';

export default function AutomationPage() {
	const [activeTab, setActiveTab] = useState('workflows');

	const [workflows, setWorkflows] = useState<any[]>([]);
	const [triggers, setTriggers] = useState<any[]>([]);
	const [templates, setTemplates] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'paused': return 'bg-yellow-100 text-yellow-800';
			case 'error': return 'bg-red-100 text-red-800';
			case 'draft': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'paused': return 'Duraklatıldı';
			case 'error': return 'Hata';
			case 'draft': return 'Taslak';
			default: return status;
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">İş Süreç Otomasyonu</h1>
					<p className="text-gray-600">Akıllı iş akışları ve süreç otomasyonu yönetimi</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Workflow
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Şablon Galerisi
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">0</div>
					<div className="text-sm text-blue-600">Toplam Workflow</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">0</div>
					<div className="text-sm text-green-600">Aktif Workflow</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">0</div>
					<div className="text-sm text-purple-600">Toplam Çalıştırma</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">0%</div>
					<div className="text-sm text-orange-600">Ortalama Başarı</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'workflows', label: 'İş Akışları', icon: '⚙️' },
							{ key: 'triggers', label: 'Tetikleyiciler', icon: '🎯' },
							{ key: 'templates', label: 'Şablonlar', icon: '📋' },
							{ key: 'monitoring', label: 'İzleme', icon: '📊' }
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
							{workflows.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">⚙️</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Workflow Yok</h3>
									<p className="text-gray-600 mb-4">İlk iş akışınızı oluşturarak otomasyona başlayın.</p>
									<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
										Yeni Workflow Oluştur
									</button>
								</div>
							) : (
								workflows.map((workflow) => (
								<div key={workflow.id} className="border rounded-lg p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center mb-2">
												<h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
												<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}>
													{getStatusText(workflow.status)}
												</span>
											</div>
											<p className="text-gray-600 mb-3">{workflow.description}</p>
											<div className="flex items-center text-sm text-gray-500">
												<span className="mr-4">🎯 Tetikleyici: {workflow.trigger}</span>
												<span>⏰ Son çalıştırma: {workflow.lastRun}</span>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-3 gap-4 mb-4">
										<div className="text-center bg-blue-50 p-3 rounded">
											<div className="text-xl font-bold text-blue-600">{workflow.executions.toLocaleString()}</div>
											<div className="text-sm text-blue-600">Çalıştırma</div>
										</div>
										<div className="text-center bg-green-50 p-3 rounded">
											<div className="text-xl font-bold text-green-600">{workflow.successRate}%</div>
											<div className="text-sm text-green-600">Başarı Oranı</div>
										</div>
										<div className="text-center bg-purple-50 p-3 rounded">
											<div className="text-xl font-bold text-purple-600">{workflow.actions.length}</div>
											<div className="text-sm text-purple-600">Adım Sayısı</div>
										</div>
									</div>

									<div className="mb-4">
										<h4 className="font-medium text-gray-900 mb-2">İş Akışı Adımları:</h4>
										<div className="flex flex-wrap gap-2">
											{workflow.actions.map((action, index) => (
												<span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
													{index + 1}. {action}
												</span>
											))}
										</div>
									</div>

									<div className="flex justify-end space-x-2">
										<button className="text-indigo-600 hover:text-indigo-900 text-sm">
											Düzenle
										</button>
										<button className="text-blue-600 hover:text-blue-900 text-sm">
											Çalıştır
										</button>
										<button className="text-green-600 hover:text-green-900 text-sm">
											Kopyala
										</button>
										{workflow.status === 'active' ? (
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Duraklat
											</button>
										) : (
											<button className="text-green-600 hover:text-green-900 text-sm">
												Aktifleştir
											</button>
										)}
									</div>
								</div>
								))
							)}
						</div>
					)}

					{activeTab === 'triggers' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Tetikleyici Türleri</h3>
							
							{triggers.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">🎯</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Tetikleyici Yok</h3>
									<p className="text-gray-600 mb-4">İş akışlarınızı tetikleyecek olayları tanımlayın.</p>
								</div>
							) : (
								<div className="grid md:grid-cols-3 gap-6">
									{triggers.map((trigger, index) => (
									<div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
										<div className="flex items-center mb-4">
											<span className="text-3xl mr-3">{trigger.icon}</span>
											<div>
												<h4 className="font-semibold text-gray-900">{trigger.name}</h4>
												<p className="text-sm text-gray-600">Son 24 saatte {trigger.count} kez tetiklendi</p>
											</div>
										</div>
										<button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
											Workflow Oluştur
										</button>
									</div>
									))}
								</div>
							)}

							<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
								<h4 className="font-semibold text-blue-900 mb-3">Özel Tetikleyici Oluştur</h4>
								<p className="text-blue-700 mb-4">
									Kendi özel tetikleyicilerinizi oluşturarak iş süreçlerinizi tam olarak ihtiyaçlarınıza göre otomatikleştirebilirsiniz.
								</p>
								<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
									Özel Tetikleyici Oluştur
								</button>
							</div>
						</div>
					)}

					{activeTab === 'templates' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Hazır Şablonlar</h3>
							
							{templates.length === 0 ? (
								<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
									<div className="text-4xl mb-4">📋</div>
									<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz Şablon Yok</h3>
									<p className="text-gray-600 mb-4">Hazır şablonları kullanarak hızlıca başlayın.</p>
								</div>
							) : (
								<div className="grid md:grid-cols-2 gap-6">
									{templates.map((template, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div>
												<h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
												<span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
													{template.category}
												</span>
											</div>
											<span className="text-sm text-gray-500">{template.workflows} workflow</span>
										</div>
										
										<p className="text-gray-600 mb-4">{template.description}</p>
										
										<div className="flex space-x-2">
											<button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
												Şablonu Kullan
											</button>
											<button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
												Önizle
											</button>
										</div>
									</div>
									))}
								</div>
							)}
						</div>
					)}

					{activeTab === 'monitoring' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Otomasyon İzleme</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Günlük Çalıştırma Sayısı</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 Çalıştırma sayısı grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Başarı Oranları</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Başarı oranı grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="border rounded-lg p-4">
								<h4 className="font-semibold text-gray-900 mb-3">Son Çalıştırma Logları</h4>
								<div className="space-y-2">
									<div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
										<span className="text-green-800">✅ Sipariş İşleme Otomasyonu başarıyla tamamlandı</span>
										<span className="text-green-600 text-sm">2 dakika önce</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
										<span className="text-green-800">✅ Müşteri Onboarding workflow çalıştırıldı</span>
										<span className="text-green-600 text-sm">5 dakika önce</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-yellow-50 rounded border border-yellow-200">
										<span className="text-yellow-800">⚠️ Sepet Terk Etme kampanyası yavaş çalışıyor</span>
										<span className="text-yellow-600 text-sm">8 dakika önce</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚀</span>
						<h3 className="text-lg font-semibold text-blue-900">Hızlı Başlangıç</h3>
					</div>
					<p className="text-blue-700 mb-4">En popüler otomasyonları hemen kur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Başlangıç Paketi
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-green-900">AI Önerileri</h3>
					</div>
					<p className="text-green-700 mb-4">AI ile otomasyon önerileri al.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Önerileri Gör
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">ROI Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">Otomasyon ROI'nizi hesapla.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						ROI Hesapla
					</button>
				</div>
			</div>
		</div>
	);
}
