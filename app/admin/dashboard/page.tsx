"use client";

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
	const [selectedPeriod, setSelectedPeriod] = useState('7d');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate data loading
		const timer = setTimeout(() => setIsLoading(false), 1000);
		return () => clearTimeout(timer);
	}, [selectedPeriod]);

	const kpiData = {
		revenue: {
			current: 2847500,
			previous: 2456780,
			change: 15.9
		},
		orders: {
			current: 1247,
			previous: 1089,
			change: 14.5
		},
		customers: {
			current: 8934,
			previous: 8456,
			change: 5.7
		},
		avgOrderValue: {
			current: 2284,
			previous: 2156,
			change: 5.9
		}
	};

	const recentActivities = [
		{
			id: 1,
			type: 'order',
			message: 'Yeni sipariş #ORD-2024-001247',
			time: '2 dakika önce',
			icon: '📦',
			priority: 'high'
		},
		{
			id: 2,
			type: 'user',
			message: 'Yeni müşteri kaydı: Ayşe Demir',
			time: '15 dakika önce',
			icon: '👤',
			priority: 'medium'
		},
		{
			id: 3,
			type: 'payment',
			message: 'Satıcı ödemesi işlendi: ₺15.450',
			time: '32 dakika önce',
			icon: '💰',
			priority: 'high'
		},
		{
			id: 4,
			type: 'security',
			message: 'Şüpheli giriş denemesi tespit edildi',
			time: '1 saat önce',
			icon: '🔒',
			priority: 'critical'
		},
		{
			id: 5,
			type: 'inventory',
			message: 'Stok uyarısı: Anime Figür Koleksiyonu',
			time: '2 saat önce',
			icon: '📊',
			priority: 'medium'
		}
	];

	const topProducts = [
		{
			id: 1,
			name: 'Anime Figür - Naruto Collectible',
			sales: 234,
			revenue: 156780,
			image: '🎭'
		},
		{
			id: 2,
			name: 'Vintage Poster Set',
			sales: 187,
			revenue: 93500,
			image: '🖼️'
		},
		{
			id: 3,
			name: 'Handmade Ceramic Vase',
			sales: 156,
			revenue: 78000,
			image: '🏺'
		},
		{
			id: 4,
			name: 'Gaming Mechanical Keyboard',
			sales: 134,
			revenue: 134000,
			image: '⌨️'
		}
	];

	const quickActions = [
		{
			title: 'Yeni Sipariş',
			description: 'Manuel sipariş oluştur',
			icon: '📦',
			action: '/admin/commerce/orders',
			color: 'bg-blue-500'
		},
		{
			title: 'Ürün Ekle',
			description: 'Kataloga yeni ürün ekle',
			icon: '➕',
			action: '/admin/products/bulk',
			color: 'bg-green-500'
		},
		{
			title: 'Kullanıcı Yönet',
			description: 'Müşteri hesaplarını yönet',
			icon: '👥',
			action: '/admin/users',
			color: 'bg-purple-500'
		},
		{
			title: 'Raporlar',
			description: 'Detaylı analiz raporları',
			icon: '📊',
			action: '/admin/reports',
			color: 'bg-orange-500'
		}
	];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getChangeColor = (change: number) => {
		return change >= 0 ? 'text-green-600' : 'text-red-600';
	};

	const getChangeIcon = (change: number) => {
		return change >= 0 ? '↗️' : '↘️';
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'critical': return 'border-l-red-500 bg-red-50';
			case 'high': return 'border-l-orange-500 bg-orange-50';
			case 'medium': return 'border-l-blue-500 bg-blue-50';
			default: return 'border-l-gray-500 bg-gray-50';
		}
	};

	if (isLoading) {
		return (
			<div className="p-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="bg-white p-6 rounded-xl border">
								<div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
								<div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
								<div className="h-4 bg-gray-200 rounded w-1/3"></div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Ana Kontrol Paneli</h1>
					<p className="text-gray-600">TDC Market yönetim merkezi</p>
				</div>
				<div className="flex items-center space-x-4">
					<select 
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="1d">Son 24 Saat</option>
						<option value="7d">Son 7 Gün</option>
						<option value="30d">Son 30 Gün</option>
						<option value="90d">Son 90 Gün</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
							<span className="text-2xl">💰</span>
						</div>
						<span className={`text-sm font-medium ${getChangeColor(kpiData.revenue.change)}`}>
							{getChangeIcon(kpiData.revenue.change)} {Math.abs(kpiData.revenue.change)}%
						</span>
					</div>
					<h3 className="text-sm font-medium text-gray-600 mb-1">Toplam Gelir</h3>
					<p className="text-2xl font-bold text-gray-900">{formatCurrency(kpiData.revenue.current)}</p>
					<p className="text-xs text-gray-500 mt-2">
						Önceki dönem: {formatCurrency(kpiData.revenue.previous)}
					</p>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
							<span className="text-2xl">📦</span>
						</div>
						<span className={`text-sm font-medium ${getChangeColor(kpiData.orders.change)}`}>
							{getChangeIcon(kpiData.orders.change)} {Math.abs(kpiData.orders.change)}%
						</span>
					</div>
					<h3 className="text-sm font-medium text-gray-600 mb-1">Toplam Sipariş</h3>
					<p className="text-2xl font-bold text-gray-900">{kpiData.orders.current.toLocaleString()}</p>
					<p className="text-xs text-gray-500 mt-2">
						Önceki dönem: {kpiData.orders.previous.toLocaleString()}
					</p>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
							<span className="text-2xl">👥</span>
						</div>
						<span className={`text-sm font-medium ${getChangeColor(kpiData.customers.change)}`}>
							{getChangeIcon(kpiData.customers.change)} {Math.abs(kpiData.customers.change)}%
						</span>
					</div>
					<h3 className="text-sm font-medium text-gray-600 mb-1">Aktif Müşteri</h3>
					<p className="text-2xl font-bold text-gray-900">{kpiData.customers.current.toLocaleString()}</p>
					<p className="text-xs text-gray-500 mt-2">
						Önceki dönem: {kpiData.customers.previous.toLocaleString()}
					</p>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
							<span className="text-2xl">🛒</span>
						</div>
						<span className={`text-sm font-medium ${getChangeColor(kpiData.avgOrderValue.change)}`}>
							{getChangeIcon(kpiData.avgOrderValue.change)} {Math.abs(kpiData.avgOrderValue.change)}%
						</span>
					</div>
					<h3 className="text-sm font-medium text-gray-600 mb-1">Ortalama Sepet</h3>
					<p className="text-2xl font-bold text-gray-900">{formatCurrency(kpiData.avgOrderValue.current)}</p>
					<p className="text-xs text-gray-500 mt-2">
						Önceki dönem: {formatCurrency(kpiData.avgOrderValue.previous)}
					</p>
				</div>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Sales Chart */}
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Satış Trendi</h3>
					<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
						<p className="text-gray-500">📈 Satış grafiği burada görünecek</p>
					</div>
				</div>

				{/* Orders Chart */}
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Dağılımı</h3>
					<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
						<p className="text-gray-500">📊 Sipariş dağılım grafiği burada görünecek</p>
					</div>
				</div>
			</div>

			{/* Bottom Row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Activities */}
				<div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
						<a href="/admin/system/logs" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
							Tümünü Gör →
						</a>
					</div>
					<div className="space-y-3">
						{recentActivities.map((activity) => (
							<div key={activity.id} className={`border-l-4 pl-4 py-3 ${getPriorityColor(activity.priority)}`}>
								<div className="flex items-center space-x-3">
									<span className="text-lg">{activity.icon}</span>
									<div className="flex-1">
										<p className="text-sm font-medium text-gray-900">{activity.message}</p>
										<p className="text-xs text-gray-500">{activity.time}</p>
									</div>
									{activity.priority === 'critical' && (
										<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
											Kritik
										</span>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Top Products */}
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
					<div className="space-y-4">
						{topProducts.map((product, index) => (
							<div key={product.id} className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
									<span>{product.image}</span>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
									<p className="text-xs text-gray-500">{product.sales} satış</p>
								</div>
								<div className="text-right">
									<p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
									<div className="flex items-center">
										<span className="text-xs text-yellow-500">#{index + 1}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{quickActions.map((action, index) => (
						<a
							key={index}
							href={action.action}
							className="group p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
						>
							<div className="flex items-center space-x-3">
								<div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white`}>
									<span className="text-lg">{action.icon}</span>
								</div>
								<div>
									<h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">{action.title}</h4>
									<p className="text-xs text-gray-500">{action.description}</p>
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}