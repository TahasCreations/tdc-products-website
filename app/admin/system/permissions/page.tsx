"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function PermissionManagementPage() {
	const [activeTab, setActiveTab] = useState('roles');

	const roles = [
		{
			id: 'super-admin',
			name: 'Süper Yönetici',
			description: 'Tüm sistem erişimi ve yönetim yetkisi',
			users: 2,
			permissions: 47,
			color: 'red',
			level: 'system'
		},
		{
			id: 'admin',
			name: 'Yönetici',
			description: 'Genel yönetim ve konfigürasyon yetkileri',
			users: 5,
			permissions: 32,
			color: 'blue',
			level: 'admin'
		},
		{
			id: 'manager',
			name: 'Departman Müdürü',
			description: 'Kendi departmanı için yönetim yetkileri',
			users: 12,
			permissions: 18,
			color: 'green',
			level: 'manager'
		},
		{
			id: 'employee',
			name: 'Çalışan',
			description: 'Temel operasyonel yetkiler',
			users: 34,
			permissions: 8,
			color: 'gray',
			level: 'user'
		},
		{
			id: 'viewer',
			name: 'İzleyici',
			description: 'Sadece okuma yetkisi',
			users: 15,
			permissions: 3,
			color: 'yellow',
			level: 'viewer'
		}
	];

	const permissions = [
		{
			module: 'Kullanıcı Yönetimi',
			permissions: [
				{ name: 'Kullanıcı Listesi Görüntüleme', key: 'users.view' },
				{ name: 'Kullanıcı Oluşturma', key: 'users.create' },
				{ name: 'Kullanıcı Düzenleme', key: 'users.edit' },
				{ name: 'Kullanıcı Silme', key: 'users.delete' }
			]
		},
		{
			module: 'E-ticaret',
			permissions: [
				{ name: 'Ürün Yönetimi', key: 'products.manage' },
				{ name: 'Sipariş Yönetimi', key: 'orders.manage' },
				{ name: 'Envanter Takibi', key: 'inventory.view' },
				{ name: 'Raporlara Erişim', key: 'reports.ecommerce' }
			]
		},
		{
			module: 'Finansal',
			permissions: [
				{ name: 'Muhasebe Kayıtları', key: 'accounting.view' },
				{ name: 'Fatura İşlemleri', key: 'invoices.manage' },
				{ name: 'Ödeme Yönetimi', key: 'payments.manage' },
				{ name: 'Finansal Raporlar', key: 'reports.financial' }
			]
		},
		{
			module: 'Sistem',
			permissions: [
				{ name: 'Sistem Ayarları', key: 'system.settings' },
				{ name: 'Yedekleme', key: 'system.backup' },
				{ name: 'Log Görüntüleme', key: 'system.logs' },
				{ name: 'Güvenlik Ayarları', key: 'system.security' }
			]
		}
	];

	const users: any[] = [];

	const auditLogs: any[] = [];

	const getRoleColor = (color: string) => {
		const colors = {
			red: 'bg-red-100 text-red-800',
			blue: 'bg-blue-100 text-blue-800',
			green: 'bg-green-100 text-green-800',
			gray: 'bg-gray-100 text-gray-800',
			yellow: 'bg-yellow-100 text-yellow-800'
		};
		return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800';
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'inactive': return 'bg-red-100 text-red-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Yetki Yönetimi</h1>
					<p className="text-gray-600">Kullanıcı rolleri ve izinleri yönetimi</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Rol
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Kullanıcı Ekle
					</button>
				</div>
			</div>

			{/* Statistics */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{roles.length}</div>
					<div className="text-sm text-blue-600">Toplam Rol</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">0</div>
					<div className="text-sm text-green-600">Aktif Kullanıcı</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">0</div>
					<div className="text-sm text-purple-600">Toplam İzin</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">0</div>
					<div className="text-sm text-orange-600">Son 24s Aktivite</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'roles', label: 'Roller', icon: '👥' },
							{ key: 'permissions', label: 'İzinler', icon: '🔐' },
							{ key: 'users', label: 'Kullanıcılar', icon: '👤' },
							{ key: 'audit', label: 'Denetim Logları', icon: '📋' }
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
							<h3 className="text-lg font-semibold text-gray-900">Sistem Rolleri</h3>

							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{roles.map((role) => (
									<div key={role.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
										<div className="flex items-start justify-between mb-4">
											<div>
												<h4 className="font-semibold text-gray-900 mb-2">{role.name}</h4>
												<p className="text-sm text-gray-600 mb-3">{role.description}</p>
											</div>
											<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role.color)}`}>
												{role.level}
											</span>
										</div>

										<div className="grid grid-cols-2 gap-4 mb-4">
											<div className="text-center">
												<div className="text-lg font-bold text-blue-600">{role.users}</div>
												<div className="text-xs text-gray-600">Kullanıcı</div>
											</div>
											<div className="text-center">
												<div className="text-lg font-bold text-green-600">{role.permissions}</div>
												<div className="text-xs text-gray-600">İzin</div>
											</div>
										</div>

										<div className="flex space-x-2">
											<button className="flex-1 text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Düzenle
											</button>
											<button className="flex-1 text-blue-600 hover:text-blue-900 text-sm font-medium">
												İzinler
											</button>
											<button className="flex-1 text-gray-600 hover:text-gray-900 text-sm font-medium">
												Kopyala
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'permissions' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">İzin Matrisi</h3>

							<div className="space-y-6">
								{permissions.map((module, index) => (
									<div key={index} className="bg-white border rounded-lg">
										<div className="p-4 border-b border-gray-200">
											<h4 className="font-semibold text-gray-900">{module.module}</h4>
										</div>
										<div className="p-4">
											<div className="overflow-x-auto">
												<table className="w-full">
													<thead>
														<tr>
															<th className="text-left text-sm font-medium text-gray-500 pb-3">İzin</th>
															{roles.map((role) => (
																<th key={role.id} className="text-center text-sm font-medium text-gray-500 pb-3">
																	{role.name}
																</th>
															))}
														</tr>
													</thead>
													<tbody>
														{module.permissions.map((permission, i) => (
															<tr key={i} className="border-t border-gray-100">
																<td className="py-3 text-sm text-gray-900">{permission.name}</td>
																{roles.map((role) => (
																	<td key={role.id} className="py-3 text-center">
																		<input
																			type="checkbox"
																			className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
																			defaultChecked={role.level === 'system' || (role.level === 'admin' && permission.key !== 'system.settings')}
																		/>
																	</td>
																))}
															</tr>
														))}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'users' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Kullanıcı Yönetimi</h3>

							<div className="bg-white border rounded-lg overflow-hidden">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Kullanıcı</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rol</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Departman</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Son Giriş</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
											<th className="px-6 py-3 text-right text-sm font-medium text-gray-500">İşlemler</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{users.length === 0 ? (
											<tr>
												<td colSpan={7} className="px-6 py-12 text-center">
													<div className="text-6xl mb-4">👤</div>
													<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Kullanıcı Yok</h3>
													<p className="text-gray-600">Kullanıcılar eklendiğinde burada görünecek</p>
												</td>
											</tr>
										) : (
											users.map((user) => (
											<tr key={user.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap">
													<div className="flex items-center">
														<div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
															{user.name.split(' ').map(n => n[0]).join('')}
														</div>
														<div className="ml-3">
															<div className="font-medium text-gray-900">{user.name}</div>
														</div>
													</div>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(roles.find(r => r.id === user.role)?.color || 'gray')}`}>
														{roles.find(r => r.id === user.role)?.name}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.department}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastLogin}</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
														{user.status === 'active' ? 'Aktif' : 'Pasif'}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
													<button className="text-indigo-600 hover:text-indigo-900 mr-3">Düzenle</button>
													<button className="text-red-600 hover:text-red-900">Sil</button>
												</td>
											</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'audit' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Denetim Logları</h3>

							<div className="bg-white border rounded-lg overflow-hidden">
								<table className="w-full">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Kullanıcı</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">İşlem</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Hedef</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">IP Adresi</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Zaman</th>
											<th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Durum</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200">
										{auditLogs.length === 0 ? (
											<tr>
												<td colSpan={6} className="px-6 py-12 text-center">
													<div className="text-6xl mb-4">📋</div>
													<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Log Yok</h3>
													<p className="text-gray-600">Aktiviteler gerçekleştikçe burada görünecek</p>
												</td>
											</tr>
										) : (
											auditLogs.map((log) => (
											<tr key={log.id} className="hover:bg-gray-50">
												<td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{log.user}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.target}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
												<td className="px-6 py-4 whitespace-nowrap">
													<span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(log.status)}`}>
														{log.status === 'success' ? 'Başarılı' : log.status === 'warning' ? 'Uyarı' : 'Hata'}
													</span>
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
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔐</span>
						<h3 className="text-lg font-semibold text-blue-900">Rol Şablonları</h3>
					</div>
					<p className="text-blue-700 mb-4">Önceden tanımlanmış rol şablonları kullanın.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Şablonları Gör
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">👥</span>
						<h3 className="text-lg font-semibold text-green-900">Toplu İşlemler</h3>
					</div>
					<p className="text-green-700 mb-4">Çoklu kullanıcı ve rol işlemleri yapın.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu İşlem
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Yetki Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı yetki ve erişim raporları oluşturun.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚠️</span>
						<h3 className="text-lg font-semibold text-orange-900">Güvenlik Taraması</h3>
					</div>
					<p className="text-orange-700 mb-4">Yetki anomalilerini tespit edin.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Tarama Başlat
					</button>
				</div>
			</div>
		</div>
	);
}
