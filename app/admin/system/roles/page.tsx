"use client";

import { useState } from 'react';

export default function RolesPage() {
	const [selectedRole, setSelectedRole] = useState<string | null>(null);

	const roles = [
		{
			id: 'admin',
			name: 'Süper Admin',
			description: 'Tüm sistem yetkilerine sahip',
			userCount: 2,
			permissions: ['all'],
			color: 'red'
		},
		{
			id: 'manager',
			name: 'Mağaza Müdürü',
			description: 'Mağaza operasyonlarını yönetir',
			userCount: 5,
			permissions: ['orders', 'products', 'customers', 'reports'],
			color: 'blue'
		},
		{
			id: 'sales',
			name: 'Satış Temsilcisi',
			description: 'Sipariş ve müşteri yönetimi',
			userCount: 12,
			permissions: ['orders', 'customers'],
			color: 'green'
		},
		{
			id: 'content',
			name: 'İçerik Editörü',
			description: 'Ürün ve içerik yönetimi',
			userCount: 3,
			permissions: ['products', 'content', 'media'],
			color: 'purple'
		},
		{
			id: 'support',
			name: 'Müşteri Hizmetleri',
			description: 'Müşteri destek işlemleri',
			userCount: 8,
			permissions: ['customers', 'orders_view', 'returns'],
			color: 'orange'
		}
	];

	const allPermissions = [
		{ id: 'dashboard', name: 'Dashboard', category: 'Genel' },
		{ id: 'analytics', name: 'Analytics', category: 'Genel' },
		{ id: 'reports', name: 'Raporlar', category: 'Genel' },
		{ id: 'orders', name: 'Sipariş Yönetimi', category: 'Ticaret' },
		{ id: 'orders_view', name: 'Sipariş Görüntüleme', category: 'Ticaret' },
		{ id: 'products', name: 'Ürün Yönetimi', category: 'Ticaret' },
		{ id: 'inventory', name: 'Stok Yönetimi', category: 'Ticaret' },
		{ id: 'customers', name: 'Müşteri Yönetimi', category: 'CRM' },
		{ id: 'returns', name: 'İade Yönetimi', category: 'CRM' },
		{ id: 'content', name: 'İçerik Yönetimi', category: 'İçerik' },
		{ id: 'media', name: 'Medya Yönetimi', category: 'İçerik' },
		{ id: 'users', name: 'Kullanıcı Yönetimi', category: 'Sistem' },
		{ id: 'settings', name: 'Sistem Ayarları', category: 'Sistem' }
	];

	const getColorClasses = (color: string) => {
		const colors = {
			red: 'bg-red-100 text-red-800 border-red-200',
			blue: 'bg-blue-100 text-blue-800 border-blue-200',
			green: 'bg-green-100 text-green-800 border-green-200',
			purple: 'bg-purple-100 text-purple-800 border-purple-200',
			orange: 'bg-orange-100 text-orange-800 border-orange-200'
		};
		return colors[color as keyof typeof colors] || colors.blue;
	};

	const groupedPermissions = allPermissions.reduce((acc, permission) => {
		if (!acc[permission.category]) {
			acc[permission.category] = [];
		}
		acc[permission.category].push(permission);
		return acc;
	}, {} as Record<string, typeof allPermissions>);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Rol ve Yetki Yönetimi</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Rol
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Yetki Matrisi
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{roles.length}</div>
					<div className="text-sm text-gray-600">Toplam Rol</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">{roles.reduce((sum, role) => sum + role.userCount, 0)}</div>
					<div className="text-sm text-gray-600">Aktif Kullanıcı</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">{allPermissions.length}</div>
					<div className="text-sm text-gray-600">Toplam Yetki</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">{Object.keys(groupedPermissions).length}</div>
					<div className="text-sm text-gray-600">Kategori</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Roles List */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm border">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold">Roller</h3>
						</div>
						<div className="p-6 space-y-4">
							{roles.map((role) => (
								<div
									key={role.id}
									onClick={() => setSelectedRole(role.id)}
									className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
										selectedRole === role.id
											? getColorClasses(role.color)
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-semibold">{role.name}</h4>
										<span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
											{role.userCount} kullanıcı
										</span>
									</div>
									<p className="text-sm text-gray-600">{role.description}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Role Details */}
				<div className="lg:col-span-2">
					{selectedRole ? (
						<div className="bg-white rounded-xl shadow-sm border">
							<div className="p-6 border-b">
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-semibold">
										{roles.find(r => r.id === selectedRole)?.name} Yetkileri
									</h3>
									<div className="flex space-x-2">
										<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
											Düzenle
										</button>
										<button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
											Kopyala
										</button>
									</div>
								</div>
							</div>
							<div className="p-6">
								{Object.entries(groupedPermissions).map(([category, permissions]) => (
									<div key={category} className="mb-6">
										<h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
										<div className="grid md:grid-cols-2 gap-3">
											{permissions.map((permission) => {
												const selectedRoleData = roles.find(r => r.id === selectedRole);
												const hasPermission = selectedRoleData?.permissions.includes('all') || 
													selectedRoleData?.permissions.includes(permission.id);
												
												return (
													<div key={permission.id} className="flex items-center space-x-3">
														<input
															type="checkbox"
															checked={hasPermission}
															className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
															readOnly
														/>
														<label className="text-sm text-gray-700">
															{permission.name}
														</label>
													</div>
												);
											})}
										</div>
									</div>
								))}
							</div>
						</div>
					) : (
						<div className="bg-white rounded-xl shadow-sm border p-12 text-center">
							<div className="text-6xl mb-4">👥</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Rol Seçin</h3>
							<p className="text-gray-600">
								Detaylarını görmek için sol taraftan bir rol seçin.
							</p>
						</div>
					)}
				</div>
			</div>

			{/* Permission Matrix */}
			<div className="bg-white rounded-xl shadow-sm border">
				<div className="p-6 border-b">
					<h3 className="text-lg font-semibold">Yetki Matrisi</h3>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Yetki
								</th>
								{roles.map((role) => (
									<th key={role.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
										{role.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{allPermissions.map((permission) => (
								<tr key={permission.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{permission.name}
									</td>
									{roles.map((role) => {
										const hasPermission = role.permissions.includes('all') || 
											role.permissions.includes(permission.id);
										return (
											<td key={role.id} className="px-6 py-4 whitespace-nowrap text-center">
												{hasPermission ? (
													<span className="text-green-600">✓</span>
												) : (
													<span className="text-gray-300">-</span>
												)}
											</td>
										);
									})}
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
						<span className="text-2xl mr-3">👤</span>
						<h3 className="text-lg font-semibold text-blue-900">Yeni Rol</h3>
					</div>
					<p className="text-blue-700 mb-4">Özel yetkilere sahip rol oluştur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔑</span>
						<h3 className="text-lg font-semibold text-green-900">Yetki Ata</h3>
					</div>
					<p className="text-green-700 mb-4">Kullanıcılara rol ata.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Ata
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Yetki Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı yetki analizi.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔒</span>
						<h3 className="text-lg font-semibold text-orange-900">Güvenlik Denetimi</h3>
					</div>
					<p className="text-orange-700 mb-4">Yetki güvenlik kontrolü.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Başlat
					</button>
				</div>
			</div>
		</div>
	)
}
