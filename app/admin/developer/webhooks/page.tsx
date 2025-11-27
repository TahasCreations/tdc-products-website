"use client";


// Client components are dynamic by default
import { useState, Suspense } from 'react';

export default function WebhooksPage() {
	const [activeTab, setActiveTab] = useState('all');
	const [isTestingWebhook, setIsTestingWebhook] = useState<string | null>(null);

	const webhooks: any[] = [];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Pasif': return 'bg-gray-100 text-gray-800';
			case 'Hata': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredWebhooks = webhooks.filter(webhook => {
		if (activeTab === 'all') return true;
		if (activeTab === 'active') return webhook.status === 'Aktif';
		if (activeTab === 'inactive') return webhook.status === 'Pasif';
		return true;
	});

	const handleTestWebhook = (webhookId: string) => {
		setIsTestingWebhook(webhookId);
		setTimeout(() => {
			setIsTestingWebhook(null);
		}, 2000);
	};

	const availableEvents = [
		'order.created', 'order.updated', 'order.cancelled', 'order.shipped',
		'payment.completed', 'payment.failed', 'payment.refunded',
		'user.created', 'user.updated', 'user.deleted',
		'inventory.low', 'inventory.out', 'inventory.updated',
		'product.created', 'product.updated', 'product.deleted'
	];

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Webhook Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Webhook
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Webhook Logları
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{webhooks.length}</div>
					<div className="text-sm text-gray-600">Toplam Webhook</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">{webhooks.filter(w => w.status === 'Aktif').length}</div>
					<div className="text-sm text-gray-600">Aktif Webhook</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">0</div>
					<div className="text-sm text-gray-600">Toplam Çağrı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">0%</div>
					<div className="text-sm text-gray-600">Başarı Oranı</div>
				</div>
			</div>

			{/* Webhook Activity Chart */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Webhook Aktivitesi (Son 7 Gün)</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">Webhook çağrı grafiği burada görünecek</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: webhooks.length },
							{ key: 'active', label: 'Aktif', count: webhooks.filter(w => w.status === 'Aktif').length },
							{ key: 'inactive', label: 'Pasif', count: webhooks.filter(w => w.status === 'Pasif').length }
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

				{/* Webhooks Table */}
				<div className="overflow-x-auto">
					{filteredWebhooks.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🔗</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Webhook Yok</h3>
							<p className="text-gray-600">İlk webhook oluşturduğunuzda burada görünecek</p>
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Webhook
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										URL
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Olaylar
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Performans
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Son Çağrı
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Durum
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										İşlemler
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredWebhooks.map((webhook) => (
								<tr key={webhook.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">{webhook.name}</div>
											<div className="text-sm text-gray-500">{webhook.id}</div>
										</div>
									</td>
									<td className="px-6 py-4 text-sm font-mono text-gray-900">
										<div className="max-w-xs truncate">{webhook.url}</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex flex-wrap gap-1">
											{webhook.events.slice(0, 2).map((event, i) => (
												<span key={i} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
													{event}
												</span>
											))}
											{webhook.events.length > 2 && (
												<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
													+{webhook.events.length - 2}
												</span>
											)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div>{webhook.successRate}</div>
										<div className="text-gray-500">{webhook.totalCalls} çağrı</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{webhook.lastTriggered}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(webhook.status)}`}>
											{webhook.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button 
											onClick={() => handleTestWebhook(webhook.id)}
											disabled={isTestingWebhook === webhook.id}
											className="text-indigo-600 hover:text-indigo-900 mr-3 disabled:opacity-50"
										>
											{isTestingWebhook === webhook.id ? 'Test Ediliyor...' : 'Test Et'}
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Düzenle
										</button>
										<button className="text-blue-600 hover:text-blue-900 mr-3">
											Loglar
										</button>
										<button className="text-red-600 hover:text-red-900">
											Sil
										</button>
									</td>
								</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>

			{/* Create Webhook Form */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Yeni Webhook Oluştur</h3>
				<div className="grid md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Webhook Adı
						</label>
						<input
							type="text"
							placeholder="Örn: Sipariş Bildirimi"
							className="w-full border rounded-lg px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Endpoint URL
						</label>
						<input
							type="url"
							placeholder="https://api.example.com/webhook"
							className="w-full border rounded-lg px-3 py-2"
						/>
					</div>
					<div className="md:col-span-2">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Dinlenecek Olaylar
						</label>
						<div className="grid md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
							{availableEvents.map((event) => (
								<label key={event} className="flex items-center space-x-2">
									<input type="checkbox" className="rounded" />
									<span className="text-sm text-gray-700">{event}</span>
								</label>
							))}
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Secret Key (Opsiyonel)
						</label>
						<input
							type="password"
							placeholder="Webhook doğrulama için"
							className="w-full border rounded-lg px-3 py-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Timeout (saniye)
						</label>
						<input
							type="number"
							defaultValue="30"
							className="w-full border rounded-lg px-3 py-2"
						/>
					</div>
				</div>
				<div className="mt-6 flex justify-end space-x-3">
					<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
						İptal
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Webhook Oluştur
					</button>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔗</span>
						<h3 className="text-lg font-semibold text-blue-900">Webhook Test</h3>
					</div>
					<p className="text-blue-700 mb-4">Tüm webhook'ları test et.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Toplu Test
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-green-900">Webhook Logları</h3>
					</div>
					<p className="text-green-700 mb-4">Detaylı webhook loglarını görüntüle.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Logları Görüntüle
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔄</span>
						<h3 className="text-lg font-semibold text-purple-900">Yeniden Dene</h3>
					</div>
					<p className="text-purple-700 mb-4">Başarısız webhook'ları yeniden dene.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Yeniden Dene
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📋</span>
						<h3 className="text-lg font-semibold text-orange-900">Webhook Şablonları</h3>
					</div>
					<p className="text-orange-700 mb-4">Hazır webhook şablonları kullan.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Şablonlar
					</button>
				</div>
			</div>
		</div>
	)
}
