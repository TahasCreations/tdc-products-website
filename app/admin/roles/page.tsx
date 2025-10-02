"use client";

import { useState } from 'react';

export default function RolesPage() {
	const [activeTab, setActiveTab] = useState('roles');

	const roles = [
		{
			id: 'ROLE001',
			name: 'Super Admin',
			description: 'Tüm sistem yetkilerine sahip ana yönetici',
			userCount: 2,
			permissions: ['*'],
			color: 'red',
			createdAt: '2024-01-01',
			isSystem: true
		},
		{
			id: 'ROLE002',
			name: 'Admin',
			description: 'Genel yönetim yetkilerine sahip yönetici',
			userCount: 5,
			permissions: ['users.manage', 'orders.manage', 'products.manage', 'reports.view'],
			color: 'blue',
			createdAt: '2024-01-01',
			isSystem: true
		},
		{
			id: 'ROLE003',
			name: 'Satış Temsilcisi',
			description: 'Sipariş ve müşteri yönetimi yetkilerine sahip',
			userCount: 12,
			permissions: ['orders.view', 'orders.edit', 'customers.view', 'customers.edit'],
			color: 'green',
			createdAt: '2024-01-05',
			isSystem: false
		},
		{
			id: 'ROLE004',
			name: 'Muhasebe',
			description: 'Mali işlemler ve raporlama yetkilerine sahip',
			userCount: 3,
			permissions: ['accounting.manage', 'reports.financial', 'invoices.manage'],
			color: 'purple',
			createdAt: '2024-01-10',
			isSystem: false
		},
		{
			id: 'ROLE005',
			name: 'Pazarlama',
			description: 'Pazarlama kampanyaları ve analitik yetkilerine sahip',
			userCount: 8,
			permissions: ['marketing.manage', 'campaigns.manage', 'analytics.view'],
			color: 'orange',
			createdAt: '2024-01-12',
			isSystem: false
		}
	];

	const permissions = [
		{
			category: 'Kullanıcı Yönetimi',
			permissions: [
				{ key: 'users.view', name: 'Kullanıcıları Görüntüle', description: 'Kullanıcı listesini görüntüleme' },
				{ key: 'users.create', name: 'Kullanıcı Oluştur', description: 'Yeni kullanıcı ekleme' },
				{ key: 'users.edit', name: 'Kullanıcı Düzenle', description: 'Kullanıcı bilgilerini düzenleme' },
				{ key: 'users.delete', name: 'Kullanıcı Sil', description: 'Kullanıcı hesabını silme' },
				{ key: 'users.manage', name: 'Kullanıcı Yönetimi', description: 'Tüm kullanıcı işlemleri' }
			]
		},
		{
			category: 'Sipariş Yönetimi',
			permissions: [
				{ key: 'orders.view', name: 'Siparişleri Görüntüle', description: 'Sipariş listesini görüntüleme' },
				{ key: 'orders.edit', name: 'Sipariş Düzenle', description: 'Sipariş durumunu güncelleme' },
				{ key: 'orders.cancel', name: 'Sipariş İptal', description: 'Siparişleri iptal etme' },
				{ key: 'orders.manage', name: 'Sipariş Yönetimi', description: 'Tüm sipariş işlemleri' }
			]
		},
		{
			category: 'Ürün Yönetimi',
			permissions: [
				{ key: 'products.view', name: 'Ürünleri Görüntüle', description: 'Ürün kataloğunu görüntüleme' },
				{ key: 'products.create', name: 'Ürün Oluştur', description: 'Yeni ürün ekleme' },
				{ key: 'products.edit', name: 'Ürün Düzenle', description: 'Ürün bilgilerini düzenleme' },
				{ key: 'products.delete', name: 'Ürün Sil', description: 'Ürünleri silme' },
				{ key: 'products.manage', name: 'Ürün Yönetimi', description: 'Tüm ürün işlemleri' }
			]
		},
		{
			category: 'Muhasebe',
			permissions: [
				{ key: 'accounting.view', name: 'Mali Verileri Görüntüle', description: 'Mali raporları görüntüleme' },
				{ key: 'accounting.manage', name: 'Muhasebe Yönetimi', description: 'Tüm muhasebe işlemleri' },
				{ key: 'invoices.manage', name: 'Fatura Yönetimi', description: 'Fatura oluşturma ve yönetme' },
				{ key: 'reports.financial', name: 'Mali Raporlar', description: 'Mali raporlara erişim' }
			]
		},
		{
			category: 'Pazarlama',
			permissions: [
				{ key: 'marketing.view', name: 'Pazarlama Verilerini Görüntüle', description: 'Pazarlama analitiğini görüntüleme' },
				{ key: 'marketing.manage', name: 'Pazarlama Yönetimi', description: 'Pazarlama stratejilerini yönetme' },
				{ key: 'campaigns.manage', name: 'Kampanya Yönetimi', description: 'Pazarlama kampanyalarını yönetme' },
				{ key: 'analytics.view', name: 'Analitik Görüntüleme', description: 'Analitik raporlara erişim' }
			]
		}
	];

	const users = [
		{
			id: 'USER001',
			name: 'Ahmet Yılmaz',
			email: 'ahmet@tdcmarket.com',
			role: 'Super Admin',
			status: 'active',
			lastLogin: '2024-01-15 14:30'
		},
		{
			id: 'USER002',
			name: 'Ayşe Demir',
			email: 'ayse@tdcmarket.com',
			role: 'Admin',
			status: 'active',
			lastLogin: '2024-01-15 12:15'
		},
		{
			id: 'USER003',
			name: 'Mehmet Can',
			email: 'mehmet@tdcmarket.com',
			role: 'Satış Temsilcisi',
			status: 'active',
			lastLogin: '2024-01-15 10:45'
		},
		{
			id: 'USER004',
			name: 'Fatma Özkan',
			email: 'fatma@tdcmarket.com',
			role: 'Muhasebe',
			status: 'inactive',
			lastLogin: '2024-01-10 16:20'
		}
	];

	const auditLogs = [
		{
			id: 'LOG001',
			user: 'Ahmet Yılmaz',
			action: 'Rol oluşturuldu',
			target: 'Pazarlama',
			timestamp: '2024-01-15 14:30',
			ip: '192.168.1.100'
		},
		{
			id: 'LOG002',
			user: 'Ayşe Demir',
			action: 'Kullanıcı yetkisi güncellendi',
			target: 'Mehmet Can',
			timestamp: '2024-01-15 12:15',
			ip: '192.168.1.101'
		},
		{
			id: 'LOG003',
			user: 'Ahmet Yılmaz',
			action: 'Rol silindi',
			target: 'Eski Rol',
			timestamp: '2024-01-14 16:45',
			ip: '192.168.1.100'
		}
	];

	const getRoleColor = (color: string) => {
		switch (color) {
			case 'red': return 'bg-red-100 text-red-800';
			case 'blue': return 'bg-blue-100 text-blue-800';
			case 'green': return 'bg-green-100 text-green-800';
			case 'purple': return 'bg-purple-100 text-purple-800';
			case 'orange': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusColor = (status: string) => {
		return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Yetki Yönetimi</h1>
					<p className="text-gray-600">Kullanıcı rolleri, yetkiler ve erişim kontrolü</p>
				</div>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
					Yeni Rol Oluştur
				</button>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{roles.length}</div>
					<div className="text-sm text-blue-600">Toplam Rol</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{users.length}</div>
					<div className="text-sm text-green-600">Toplam Kullanıcı</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{permissions.reduce((sum, cat) => sum + cat.permissions.length, 0)}</div>
					<div className="text-sm text-purple-600">Toplam Yetki</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{users.filter(u => u.status === 'active').length}</div>
					<div className="text-sm text-orange-600">Aktif Kullanıcı</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'roles', label: 'Roller', icon: '🎭' },
							{ key: 'permissions', label: 'Yetkiler', icon: '🔐' },
							{ key: 'users', label: 'Kullanıcı Atamaları', icon: '👥' },
							{ key: 'audit', label: 'Denetim Kayıtları', icon: '📋' }
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
					{activeTab === 'roles' && (
						<div className="space-y-6">
							{roles.map((role) => (
								<div key={role.id} className="border rounded-lg p-6">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center mb-2">
												<h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
												<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role.color)}`}>
													{role.userCount} kullanıcı
												</span>
												{role.isSystem && (
													<span className="ml-2 px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
														Sistem Rolü
													</span>
												)}
											</div>
											<p className="text-gray-600 mb-3">{role.description}</p>
											<p className="text-sm text-gray-500">Oluşturulma: {role.createdAt}</p>
										</div>
									</div>

									<div className="mb-4">
										<h4 className="font-medium text-gray-900 mb-2">Yetkiler:</h4>
										<div className="flex flex-wrap gap-2">
											{role.permissions.includes('*') ? (
												<span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
													🔥 Tüm Yetkiler
												</span>
											) : (
												role.permissions.map((permission, index) => (
													<span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
														{permission}
													</span>
												))
											)}
										</div>
									</div>

									<div className="flex justify-end space-x-2">
										<button className="text-indigo-600 hover:text-indigo-900 text-sm">
											Düzenle
										</button>
										<button className="text-blue-600 hover:text-blue-900 text-sm">
											Kopyala
										</button>
										{!role.isSystem && (
											<button className="text-red-600 hover:text-red-900 text-sm">
												Sil
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					)}

					{activeTab === 'permissions' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Yetki Matrisi</h3>
							
							{permissions.map((category, categoryIndex) => (
								<div key={categoryIndex} className="border rounded-lg p-6">
									<h4 className="text-lg font-semibold text-gray-900 mb-4">{category.category}</h4>
									<div className="space-y-3">
										{category.permissions.map((permission, permIndex) => (
											<div key={permIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded">
												<div>
													<h5 className="font-medium text-gray-900">{permission.name}</h5>
													<p className="text-sm text-gray-600">{permission.description}</p>
												</div>
												<code className="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded">
													{permission.key}
												</code>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					)}

					{activeTab === 'users' && (
						<div className="space-y-6">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Kullanıcı
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												E-posta
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
											<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
												İşlemler
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{users.map((user) => (
											<tr key={user.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
															<span className="text-indigo-600 font-medium text-sm">
																{user.name.split(' ').map(n => n[0]).join('')}
															</span>
														</div>
														<div className="ml-4">
															<div className="text-sm font-medium text-gray-900">{user.name}</div>
															<div className="text-sm text-gray-500">{user.id}</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
													{user.email}
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
														{user.role}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
														{user.status === 'active' ? 'Aktif' : 'Pasif'}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{user.lastLogin}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button className="text-indigo-600 hover:text-indigo-900 mr-3">
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
					)}

					{activeTab === 'audit' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Denetim Kayıtları</h3>
							
							<div className="space-y-4">
								{auditLogs.map((log) => (
									<div key={log.id} className="border rounded-lg p-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-lg mr-2">📋</span>
													<h4 className="font-semibold text-gray-900">{log.action}</h4>
												</div>
												<p className="text-gray-700 mb-1">
													<strong>{log.user}</strong> tarafından <strong>{log.target}</strong> üzerinde işlem yapıldı
												</p>
												<div className="flex items-center text-sm text-gray-500 space-x-4">
													<span>🕐 {log.timestamp}</span>
													<span>🌐 {log.ip}</span>
													<span>🆔 {log.id}</span>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🎭</span>
						<h3 className="text-lg font-semibold text-blue-900">Rol Şablonları</h3>
					</div>
					<p className="text-blue-700 mb-4">Hazır rol şablonlarından seç.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Şablonları Gör
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">👥</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu Atama</h3>
					</div>
					<p className="text-green-700 mb-4">Birden fazla kullanıcıya rol ata.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Atama
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔍</span>
						<h3 className="text-lg font-semibold text-purple-900">Yetki Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">Yetki kullanım raporları oluştur.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Başlat
					</button>
				</div>
			</div>
		</div>
	);
}
