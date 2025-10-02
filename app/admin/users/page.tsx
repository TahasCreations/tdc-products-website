"use client";

import { useState } from 'react';

export default function UsersPage() {
	const [activeTab, setActiveTab] = useState('all');

	const users = [
		{
			id: 1,
			name: 'Ahmet Yılmaz',
			email: 'ahmet@example.com',
			role: 'Admin',
			status: 'Aktif',
			lastLogin: '2024-01-15 14:30',
			joinDate: '2023-06-15',
			orders: 45,
			totalSpent: '₺12,450'
		},
		{
			id: 2,
			name: 'Fatma Kaya',
			email: 'fatma@example.com',
			role: 'Müşteri',
			status: 'Aktif',
			lastLogin: '2024-01-14 09:15',
			joinDate: '2023-08-22',
			orders: 23,
			totalSpent: '₺5,680'
		},
		{
			id: 3,
			name: 'Mehmet Demir',
			email: 'mehmet@example.com',
			role: 'Satıcı',
			status: 'Beklemede',
			lastLogin: '2024-01-10 16:45',
			joinDate: '2023-12-01',
			orders: 0,
			totalSpent: '₺0'
		},
		{
			id: 4,
			name: 'Ayşe Şahin',
			email: 'ayse@example.com',
			role: 'Müşteri',
			status: 'Pasif',
			lastLogin: '2023-12-20 11:20',
			joinDate: '2023-05-10',
			orders: 67,
			totalSpent: '₺18,920'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Beklemede': return 'bg-yellow-100 text-yellow-800';
			case 'Pasif': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getRoleColor = (role: string) => {
		switch (role) {
			case 'Admin': return 'bg-purple-100 text-purple-800';
			case 'Satıcı': return 'bg-blue-100 text-blue-800';
			case 'Müşteri': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredUsers = users.filter(user => {
		if (activeTab === 'all') return true;
		if (activeTab === 'active') return user.status === 'Aktif';
		if (activeTab === 'pending') return user.status === 'Beklemede';
		if (activeTab === 'inactive') return user.status === 'Pasif';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Kullanıcı
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Toplu İşlem
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">1,247</div>
					<div className="text-sm text-gray-600">Toplam Kullanıcı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">1,089</div>
					<div className="text-sm text-gray-600">Aktif Kullanıcı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-yellow-600">23</div>
					<div className="text-sm text-gray-600">Bekleyen Onay</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">89</div>
					<div className="text-sm text-gray-600">Bu Ay Kayıt</div>
				</div>
			</div>

			{/* User Activity Chart */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Kullanıcı Aktivitesi (Son 7 Gün)</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">Aktivite grafiği burada görünecek</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'all', label: 'Tümü', count: users.length },
							{ key: 'active', label: 'Aktif', count: users.filter(u => u.status === 'Aktif').length },
							{ key: 'pending', label: 'Beklemede', count: users.filter(u => u.status === 'Beklemede').length },
							{ key: 'inactive', label: 'Pasif', count: users.filter(u => u.status === 'Pasif').length }
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

				{/* Search and Filters */}
				<div className="p-6 border-b">
					<div className="flex flex-wrap gap-4">
						<input
							type="text"
							placeholder="Kullanıcı ara..."
							className="flex-1 min-w-64 border rounded-lg px-3 py-2"
						/>
						<select className="border rounded-lg px-3 py-2">
							<option>Tüm Roller</option>
							<option>Admin</option>
							<option>Satıcı</option>
							<option>Müşteri</option>
						</select>
						<select className="border rounded-lg px-3 py-2">
							<option>Kayıt Tarihi</option>
							<option>Bu Ay</option>
							<option>Son 3 Ay</option>
							<option>Bu Yıl</option>
						</select>
						<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
							Filtrele
						</button>
					</div>
				</div>

				{/* Users Table */}
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Kullanıcı
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Rol
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Durum
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Son Giriş
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Siparişler
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Toplam Harcama
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									İşlemler
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{filteredUsers.map((user) => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
												<span className="text-white font-medium text-sm">
													{user.name.split(' ').map(n => n[0]).join('')}
												</span>
											</div>
											<div>
												<div className="text-sm font-medium text-gray-900">{user.name}</div>
												<div className="text-sm text-gray-500">{user.email}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
											{user.role}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
											{user.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{user.lastLogin}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
										{user.orders}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
										{user.totalSpent}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<button className="text-indigo-600 hover:text-indigo-900 mr-3">
											Görüntüle
										</button>
										<button className="text-green-600 hover:text-green-900 mr-3">
											Düzenle
										</button>
										<button className="text-red-600 hover:text-red-900">
											Deaktif Et
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">👥</span>
						<h3 className="text-lg font-semibold text-blue-900">Toplu E-posta</h3>
					</div>
					<p className="text-blue-700 mb-4">Seçili kullanıcılara toplu e-posta gönder.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Gönder
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-green-900">Kullanıcı Raporu</h3>
					</div>
					<p className="text-green-700 mb-4">Detaylı kullanıcı analizi ve raporları.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔐</span>
						<h3 className="text-lg font-semibold text-purple-900">Rol Yönetimi</h3>
					</div>
					<p className="text-purple-700 mb-4">Kullanıcı rollerini ve izinlerini yönet.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Yönet
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-orange-900">Aktivite İzleme</h3>
					</div>
					<p className="text-orange-700 mb-4">Kullanıcı aktivitelerini takip et.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						İzle
					</button>
				</div>
			</div>
		</div>
	)
}
