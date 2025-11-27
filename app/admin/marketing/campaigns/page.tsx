"use client";


// Client components are dynamic by default
import { useState, Suspense } from 'react';

export default function CampaignsPage() {
	const [activeTab, setActiveTab] = useState('all');

	const campaigns = [
		{
			id: 1,
			name: 'Yeni Yıl Kampanyası',
			type: 'Email',
			status: 'Aktif',
			sent: 12450,
			opened: 3890,
			clicked: 567,
			conversion: '4.6%',
			startDate: '2024-01-01',
			endDate: '2024-01-31'
		},
		{
			id: 2,
			name: 'Figür Koleksiyonu Tanıtımı',
			type: 'SMS',
			status: 'Tamamlandı',
			sent: 8900,
			opened: 7234,
			clicked: 892,
			conversion: '10.0%',
			startDate: '2023-12-15',
			endDate: '2023-12-30'
		},
		{
			id: 3,
			name: 'Sevgililer Günü Özel',
			type: 'Email',
			status: 'Taslak',
			sent: 0,
			opened: 0,
			clicked: 0,
			conversion: '0%',
			startDate: '2024-02-10',
			endDate: '2024-02-14'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Tamamlandı': return 'bg-blue-100 text-blue-800';
			case 'Taslak': return 'bg-gray-100 text-gray-800';
			case 'Duraklatıldı': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredCampaigns = campaigns.filter(campaign => {
		if (activeTab === 'all') return true;
		if (activeTab === 'active') return campaign.status === 'Aktif';
		if (activeTab === 'completed') return campaign.status === 'Tamamlandı';
		if (activeTab === 'draft') return campaign.status === 'Taslak';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Kampanya Yönetimi</h1>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2">
					<span>📧</span>
					<span>Yeni Kampanya</span>
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<span className="text-2xl">📊</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Toplam Kampanya</p>
							<p className="text-2xl font-bold text-gray-900">24</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<span className="text-2xl">📈</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Ortalama Açılma</p>
							<p className="text-2xl font-bold text-gray-900">31.2%</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-purple-100 rounded-lg">
							<span className="text-2xl">🎯</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Tıklama Oranı</p>
							<p className="text-2xl font-bold text-gray-900">6.8%</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-orange-100 rounded-lg">
							<span className="text-2xl">💰</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">ROI</p>
							<p className="text-2xl font-bold text-gray-900">340%</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: campaigns.length },
							{ key: 'active', label: 'Aktif', count: campaigns.filter(c => c.status === 'Aktif').length },
							{ key: 'completed', label: 'Tamamlandı', count: campaigns.filter(c => c.status === 'Tamamlandı').length },
							{ key: 'draft', label: 'Taslak', count: campaigns.filter(c => c.status === 'Taslak').length }
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

				{/* Campaign List */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kampanya
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tip
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Durum
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Gönderildi
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Açıldı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Tıklandı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Dönüşüm
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredCampaigns.map((campaign) => (
								<tr key={campaign.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900">{campaign.name}</div>
											<div className="text-sm text-gray-500">{campaign.startDate} - {campaign.endDate}</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{campaign.type}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
											{campaign.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{campaign.sent.toLocaleString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{campaign.opened.toLocaleString()}
										{campaign.sent > 0 && (
											<div className="text-xs text-gray-500">
												{((campaign.opened / campaign.sent) * 100).toFixed(1)}%
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{campaign.clicked.toLocaleString()}
										{campaign.opened > 0 && (
											<div className="text-xs text-gray-500">
												{((campaign.clicked / campaign.opened) * 100).toFixed(1)}%
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="text-sm font-semibold text-green-600">{campaign.conversion}</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Görüntüle
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Düzenle
										</button>
										{campaign.status === 'Aktif' && (
											<button className="text-yellow-600 hover:text-yellow-900 mr-3">
												Duraklat
											</button>
										)}
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

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📧</span>
						<h3 className="text-lg font-semibold text-blue-900">Email Kampanyası</h3>
					</div>
					<p className="text-blue-700 mb-4">Müşterilerinize özel email kampanyaları oluşturun.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📱</span>
						<h3 className="text-lg font-semibold text-green-900">SMS Kampanyası</h3>
					</div>
					<p className="text-green-700 mb-4">Hızlı ve etkili SMS kampanyaları düzenleyin.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Başlat
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-purple-900">AI Kampanya</h3>
					</div>
					<p className="text-purple-700 mb-4">AI destekli otomatik kampanya oluşturun.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Başlat
					</button>
				</div>
			</div>
		</div>
	)
}
