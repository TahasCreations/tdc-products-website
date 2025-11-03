"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function ContentApprovalPage() {
	const [activeTab, setActiveTab] = useState('pending');
	const [contentItems, setContentItems] = useState<any[]>([]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Onay Bekliyor': return 'bg-yellow-100 text-yellow-800';
			case 'Onaylandı': return 'bg-green-100 text-green-800';
			case 'Reddedildi': return 'bg-red-100 text-red-800';
			case 'Revizyon Gerekli': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'Yüksek': return 'bg-red-100 text-red-800';
			case 'Orta': return 'bg-yellow-100 text-yellow-800';
			case 'Düşük': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'Blog Yazısı': return 'bg-blue-100 text-blue-800';
			case 'Ürün İçeriği': return 'bg-purple-100 text-purple-800';
			case 'Rehber': return 'bg-green-100 text-green-800';
			case 'Haber': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredContent = contentItems.filter(item => {
		if (activeTab === 'pending') return item.status === 'Onay Bekliyor';
		if (activeTab === 'approved') return item.status === 'Onaylandı';
		if (activeTab === 'rejected') return item.status === 'Reddedildi';
		if (activeTab === 'revision') return item.status === 'Revizyon Gerekli';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">İçerik Onay Sistemi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Onay
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Onay Kuralları
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">0</div>
					<div className="text-sm text-gray-600">Onay Bekliyor</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">0</div>
					<div className="text-sm text-gray-600">Onaylandı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">0</div>
					<div className="text-sm text-gray-600">Revizyon Gerekli</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">0</div>
					<div className="text-sm text-gray-600">Reddedildi</div>
				</div>
			</div>

			{/* Approval Workflow */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Onay Süreci</h3>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="flex items-center">
							<div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
								1
							</div>
							<span className="ml-2 text-sm font-medium">Gönderim</span>
						</div>
						<div className="w-16 h-1 bg-gray-300"></div>
						<div className="flex items-center">
							<div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
								2
							</div>
							<span className="ml-2 text-sm font-medium">İnceleme</span>
						</div>
						<div className="w-16 h-1 bg-gray-300"></div>
						<div className="flex items-center">
							<div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
								3
							</div>
							<span className="ml-2 text-sm font-medium">Onay</span>
						</div>
						<div className="w-16 h-1 bg-gray-300"></div>
						<div className="flex items-center">
							<div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
								4
							</div>
							<span className="ml-2 text-sm font-medium">Yayın</span>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'pending', label: 'Onay Bekliyor', count: contentItems.filter(item => item.status === 'Onay Bekliyor').length },
							{ key: 'revision', label: 'Revizyon Gerekli', count: contentItems.filter(item => item.status === 'Revizyon Gerekli').length },
							{ key: 'approved', label: 'Onaylandı', count: contentItems.filter(item => item.status === 'Onaylandı').length },
							{ key: 'rejected', label: 'Reddedildi', count: contentItems.filter(item => item.status === 'Reddedildi').length }
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

				{/* Content Table */}
				<div className="overflow-x-auto">
					{filteredContent.length === 0 ? (
						<div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
							<div className="text-4xl mb-4">📄</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">Henüz İçerik Yok</h3>
							<p className="text-gray-600">Onay bekleyen içerikler burada görünecek.</p>
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										<input type="checkbox" className="rounded" />
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										İçerik
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Yazar
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tip
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Öncelik
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										İçerik Detayı
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tarih
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										İşlemler
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredContent.map((item) => (
								<tr key={item.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<input type="checkbox" className="rounded" />
									</td>
									<td className="px-6 py-4">
										<div>
											<div className="text-sm font-medium text-gray-900">{item.title}</div>
											<div className="text-sm text-gray-500">{item.category}</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{item.author}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
											{item.type}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(item.priority)}`}>
											{item.priority}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										<div>{item.wordCount} kelime</div>
										<div className="text-gray-500">{item.images} görsel</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{item.submittedDate}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Görüntüle
										</button>
										{item.status === 'Onay Bekliyor' && (
											<>
												<button className="text-green-600 hover:text-green-900 mr-3">
													Onayla
												</button>
												<button className="text-orange-600 hover:text-orange-900 mr-3">
													Revizyon
												</button>
												<button className="text-red-600 hover:text-red-900">
													Reddet
												</button>
											</>
										)}
										{item.status === 'Revizyon Gerekli' && (
											<button className="text-blue-600 hover:text-blue-900">
												Yorum Ekle
											</button>
										)}
									</td>
								</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>

			{/* Content Preview */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">İçerik Önizleme</h3>
				<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
					<div className="text-4xl mb-4">📄</div>
					<h4 className="text-lg font-semibold text-gray-900 mb-2">İçerik Seçin</h4>
					<p className="text-gray-600">
						Önizlemek için yukarıdaki tablodan bir içerik seçin.
					</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">✅</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Onay</h3>
					</div>
					<p className="text-green-700 mb-4">Seçili içerikleri toplu onayla.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Onayla
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📝</span>
						<h3 className="text-lg font-semibold text-orange-900">Revizyon Talebi</h3>
					</div>
					<p className="text-orange-700 mb-4">Toplu revizyon talebi gönder.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Revizyon İste
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚙️</span>
						<h3 className="text-lg font-semibold text-blue-900">Onay Kuralları</h3>
					</div>
					<p className="text-blue-700 mb-4">Otomatik onay kuralları ayarla.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Kurallar
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Onay Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">İçerik onay istatistikleri.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Al
					</button>
				</div>
			</div>
		</div>
	)
}
