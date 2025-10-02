"use client";

import { useState } from 'react';

export default function ContentReportsPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [selectedPeriod, setSelectedPeriod] = useState('month');

	const reportStats = {
		totalReports: 1247,
		pendingReports: 89,
		resolvedReports: 1158,
		falsePositives: 67,
		contentRemoved: 234,
		usersWarned: 156,
		usersBanned: 23,
		responseTime: '2.4 saat'
	};

	const recentReports = [
		{
			id: 'REP001',
			contentType: 'blog_post',
			contentTitle: 'Yanıltıcı Ürün İncelemesi',
			contentId: 'BP123',
			reportedBy: 'user@example.com',
			reportType: 'misleading_content',
			reportReason: 'Ürün hakkında yanlış bilgiler içeriyor',
			reportedAt: '2024-01-15 14:30',
			status: 'pending',
			priority: 'high',
			assignedTo: 'moderator1@tdcmarket.com',
			contentAuthor: 'author@example.com'
		},
		{
			id: 'REP002',
			contentType: 'product_review',
			contentTitle: 'Sahte Pozitif İnceleme',
			contentId: 'PR456',
			reportedBy: 'reporter2@example.com',
			reportType: 'fake_review',
			reportReason: 'Satın almadan yapılmış sahte inceleme',
			reportedAt: '2024-01-15 12:15',
			status: 'investigating',
			priority: 'medium',
			assignedTo: 'moderator2@tdcmarket.com',
			contentAuthor: 'reviewer@example.com'
		},
		{
			id: 'REP003',
			contentType: 'comment',
			contentTitle: 'Küfürlü Yorum',
			contentId: 'CM789',
			reportedBy: 'user3@example.com',
			reportType: 'inappropriate_language',
			reportReason: 'Argo ve küfür içeren yorum',
			reportedAt: '2024-01-15 10:45',
			status: 'resolved',
			priority: 'low',
			assignedTo: 'moderator1@tdcmarket.com',
			contentAuthor: 'commenter@example.com',
			resolution: 'Yorum kaldırıldı, kullanıcı uyarıldı'
		},
		{
			id: 'REP004',
			contentType: 'media_upload',
			contentTitle: 'Telif Hakkı İhlali',
			contentId: 'MU012',
			reportedBy: 'copyright@company.com',
			reportType: 'copyright_violation',
			reportReason: 'İzinsiz kullanılan telif hakkı korumalı görsel',
			reportedAt: '2024-01-14 16:20',
			status: 'resolved',
			priority: 'high',
			assignedTo: 'moderator3@tdcmarket.com',
			contentAuthor: 'uploader@example.com',
			resolution: 'İçerik kaldırıldı, kullanıcı hesabı askıya alındı'
		}
	];

	const reportCategories = [
		{
			category: 'Spam/Sahte İçerik',
			count: 345,
			percentage: 27.7,
			trend: '+12%',
			color: 'bg-red-500'
		},
		{
			category: 'Uygunsuz Dil',
			count: 289,
			percentage: 23.2,
			trend: '-5%',
			color: 'bg-orange-500'
		},
		{
			category: 'Yanıltıcı Bilgi',
			count: 234,
			percentage: 18.8,
			trend: '+8%',
			color: 'bg-yellow-500'
		},
		{
			category: 'Telif Hakkı İhlali',
			count: 156,
			percentage: 12.5,
			trend: '+3%',
			color: 'bg-purple-500'
		},
		{
			category: 'Kişisel Saldırı',
			count: 123,
			percentage: 9.9,
			trend: '-2%',
			color: 'bg-pink-500'
		},
		{
			category: 'Diğer',
			count: 100,
			percentage: 8.0,
			trend: '+1%',
			color: 'bg-gray-500'
		}
	];

	const moderators = [
		{
			name: 'Moderatör 1',
			email: 'moderator1@tdcmarket.com',
			assignedReports: 23,
			resolvedReports: 156,
			avgResponseTime: '1.8 saat',
			accuracy: '94%',
			status: 'online'
		},
		{
			name: 'Moderatör 2',
			email: 'moderator2@tdcmarket.com',
			assignedReports: 18,
			resolvedReports: 134,
			avgResponseTime: '2.1 saat',
			accuracy: '91%',
			status: 'online'
		},
		{
			name: 'Moderatör 3',
			email: 'moderator3@tdcmarket.com',
			assignedReports: 15,
			resolvedReports: 98,
			avgResponseTime: '3.2 saat',
			accuracy: '89%',
			status: 'offline'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'investigating': return 'bg-blue-100 text-blue-800';
			case 'resolved': return 'bg-green-100 text-green-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			case 'escalated': return 'bg-purple-100 text-purple-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending': return 'Beklemede';
			case 'investigating': return 'İnceleniyor';
			case 'resolved': return 'Çözüldü';
			case 'rejected': return 'Reddedildi';
			case 'escalated': return 'Yükseltildi';
			default: return status;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high': return 'Yüksek';
			case 'medium': return 'Orta';
			case 'low': return 'Düşük';
			default: return priority;
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'blog_post': return '📝';
			case 'product_review': return '⭐';
			case 'comment': return '💬';
			case 'media_upload': return '🎥';
			default: return '📄';
		}
	};

	const getTypeText = (type: string) => {
		switch (type) {
			case 'blog_post': return 'Blog Yazısı';
			case 'product_review': return 'Ürün İncelemesi';
			case 'comment': return 'Yorum';
			case 'media_upload': return 'Medya';
			default: return type;
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">İçerik Raporları</h1>
					<p className="text-gray-600">İçerik şikayetleri, moderasyon ve çözüm takibi</p>
				</div>
				<div className="flex space-x-2">
					<select 
						value={selectedPeriod} 
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
					>
						<option value="week">Bu Hafta</option>
						<option value="month">Bu Ay</option>
						<option value="quarter">Bu Çeyrek</option>
						<option value="year">Bu Yıl</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-8 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{reportStats.totalReports.toLocaleString()}</div>
					<div className="text-sm text-blue-600">Toplam Rapor</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{reportStats.pendingReports}</div>
					<div className="text-sm text-yellow-600">Beklemede</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{reportStats.resolvedReports.toLocaleString()}</div>
					<div className="text-sm text-green-600">Çözüldü</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{reportStats.contentRemoved}</div>
					<div className="text-sm text-red-600">İçerik Kaldırıldı</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{reportStats.usersWarned}</div>
					<div className="text-sm text-orange-600">Kullanıcı Uyarıldı</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{reportStats.usersBanned}</div>
					<div className="text-sm text-purple-600">Kullanıcı Banlandı</div>
				</div>
				<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<div className="text-2xl font-bold text-gray-700">{reportStats.falsePositives}</div>
					<div className="text-sm text-gray-600">Yanlış Pozitif</div>
				</div>
				<div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
					<div className="text-2xl font-bold text-emerald-700">{reportStats.responseTime}</div>
					<div className="text-sm text-emerald-600">Ort. Yanıt Süresi</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'reports', label: 'Aktif Raporlar', icon: '🚨' },
							{ key: 'categories', label: 'Kategori Analizi', icon: '📈' },
							{ key: 'moderators', label: 'Moderatörler', icon: '👮' }
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
					{activeTab === 'overview' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Rapor Durumu ve Trendler</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Haftalık Rapor Trendi</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Haftalık rapor grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Çözüm Süreleri</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">⏱️ Çözüm süreleri grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-red-50 p-6 rounded-lg border border-red-200">
									<h4 className="font-semibold text-red-900 mb-3">Acil Durumlar</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">🚨</span>
										<div>
											<p className="text-red-800 font-medium">12 Yüksek Öncelik</p>
											<p className="text-red-600 text-sm">Hemen müdahale gerekli</p>
										</div>
									</div>
								</div>

								<div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
									<h4 className="font-semibold text-yellow-900 mb-3">Bekleyen İşlemler</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">⏳</span>
										<div>
											<p className="text-yellow-800 font-medium">{reportStats.pendingReports} Rapor</p>
											<p className="text-yellow-600 text-sm">İnceleme bekliyor</p>
										</div>
									</div>
								</div>

								<div className="bg-green-50 p-6 rounded-lg border border-green-200">
									<h4 className="font-semibold text-green-900 mb-3">Başarı Oranı</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">✅</span>
										<div>
											<p className="text-green-800 font-medium">92.8% Doğruluk</p>
											<p className="text-green-600 text-sm">Moderasyon kalitesi</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'reports' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Aktif Raporlar</h3>
								<div className="flex space-x-2">
									<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
										<option value="">Tüm Durumlar</option>
										<option value="pending">Beklemede</option>
										<option value="investigating">İnceleniyor</option>
										<option value="escalated">Yükseltildi</option>
									</select>
									<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
										<option value="">Tüm Öncelikler</option>
										<option value="high">Yüksek</option>
										<option value="medium">Orta</option>
										<option value="low">Düşük</option>
									</select>
								</div>
							</div>

							<div className="space-y-4">
								{recentReports.map((report) => (
									<div key={report.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getTypeIcon(report.contentType)}</span>
													<h4 className="font-semibold text-gray-900">{report.contentTitle}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
														{getStatusText(report.status)}
													</span>
													<span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(report.priority)}`}>
														{getPriorityText(report.priority)}
													</span>
													<span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
														{getTypeText(report.contentType)}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>Şikayet Eden:</strong> {report.reportedBy}</p>
													<p><strong>İçerik Sahibi:</strong> {report.contentAuthor}</p>
													<p><strong>Atanan Moderatör:</strong> {report.assignedTo}</p>
													<p><strong>Tarih:</strong> {report.reportedAt}</p>
												</div>
												<div className="bg-gray-50 p-3 rounded border mb-3">
													<p className="text-sm text-gray-700"><strong>Şikayet Nedeni:</strong> {report.reportReason}</p>
												</div>
												{report.resolution && (
													<div className="bg-green-50 p-3 rounded border border-green-200">
														<p className="text-sm text-green-700"><strong>Çözüm:</strong> {report.resolution}</p>
													</div>
												)}
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												İçeriği Görüntüle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Detaylar
											</button>
											{report.status === 'pending' && (
												<>
													<button className="text-green-600 hover:text-green-900 text-sm">
														Kabul Et
													</button>
													<button className="text-red-600 hover:text-red-900 text-sm">
														Reddet
													</button>
													<button className="text-purple-600 hover:text-purple-900 text-sm">
														Yükselt
													</button>
												</>
											)}
											{report.status === 'investigating' && (
												<>
													<button className="text-green-600 hover:text-green-900 text-sm">
														Çöz
													</button>
													<button className="text-yellow-600 hover:text-yellow-900 text-sm">
														Beklet
													</button>
												</>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'categories' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Rapor Kategorileri Analizi</h3>
							
							<div className="space-y-4">
								{reportCategories.map((category, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-center justify-between mb-4">
											<h4 className="font-semibold text-gray-900">{category.category}</h4>
											<div className="flex items-center space-x-4">
												<span className="text-sm text-gray-600">{category.trend}</span>
												<span className="text-lg font-bold text-gray-900">{category.count}</span>
											</div>
										</div>

										<div className="mb-4">
											<div className="flex justify-between text-sm text-gray-600 mb-1">
												<span>Toplam raporların %{category.percentage}'si</span>
												<span>{category.count} rapor</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div 
													className={`h-2 rounded-full ${category.color}`}
													style={{ width: `${category.percentage}%` }}
												></div>
											</div>
										</div>

										<div className="grid md:grid-cols-3 gap-4 text-sm">
											<div className="bg-blue-50 p-3 rounded">
												<p className="text-blue-600 font-medium">Bu Hafta</p>
												<p className="text-blue-800 font-bold">{Math.round(category.count * 0.15)}</p>
											</div>
											<div className="bg-green-50 p-3 rounded">
												<p className="text-green-600 font-medium">Çözüldü</p>
												<p className="text-green-800 font-bold">{Math.round(category.count * 0.85)}</p>
											</div>
											<div className="bg-yellow-50 p-3 rounded">
												<p className="text-yellow-600 font-medium">Beklemede</p>
												<p className="text-yellow-800 font-bold">{Math.round(category.count * 0.15)}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'moderators' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Moderatör Performansı</h3>
							
							<div className="space-y-4">
								{moderators.map((moderator, index) => (
									<div key={index} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center">
												<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
													<span className="text-indigo-600 font-bold text-lg">
														{moderator.name.split(' ').map(n => n[0]).join('')}
													</span>
												</div>
												<div className="ml-4">
													<h4 className="font-semibold text-gray-900">{moderator.name}</h4>
													<p className="text-gray-600">{moderator.email}</p>
													<span className={`px-2 py-1 text-xs rounded-full ${
														moderator.status === 'online' 
															? 'bg-green-100 text-green-800' 
															: 'bg-gray-100 text-gray-800'
													}`}>
														{moderator.status === 'online' ? '🟢 Çevrimiçi' : '⚫ Çevrimdışı'}
													</span>
												</div>
											</div>
										</div>

										<div className="grid md:grid-cols-4 gap-4 mb-4">
											<div className="text-center bg-blue-50 p-3 rounded">
												<div className="text-xl font-bold text-blue-600">{moderator.assignedReports}</div>
												<div className="text-sm text-blue-600">Atanan Rapor</div>
											</div>
											<div className="text-center bg-green-50 p-3 rounded">
												<div className="text-xl font-bold text-green-600">{moderator.resolvedReports}</div>
												<div className="text-sm text-green-600">Çözülen Rapor</div>
											</div>
											<div className="text-center bg-yellow-50 p-3 rounded">
												<div className="text-xl font-bold text-yellow-600">{moderator.avgResponseTime}</div>
												<div className="text-sm text-yellow-600">Ort. Yanıt Süresi</div>
											</div>
											<div className="text-center bg-purple-50 p-3 rounded">
												<div className="text-xl font-bold text-purple-600">{moderator.accuracy}</div>
												<div className="text-sm text-purple-600">Doğruluk Oranı</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Profil
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Raporları
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Mesaj Gönder
											</button>
											<button className="text-purple-600 hover:text-purple-900 text-sm">
												Performans
											</button>
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
				<div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🚨</span>
						<h3 className="text-lg font-semibold text-red-900">Acil Müdahale</h3>
					</div>
					<p className="text-red-700 mb-4">Yüksek öncelikli raporları hemen incele.</p>
					<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
						Acil Raporlar
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Detaylı Analiz</h3>
					</div>
					<p className="text-blue-700 mb-4">Kapsamlı moderasyon raporu oluştur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Analiz Raporu
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-green-900">Otomatik Moderasyon</h3>
					</div>
					<p className="text-green-700 mb-4">AI destekli otomatik moderasyon ayarları.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Ayarları Yönet
					</button>
				</div>
			</div>
		</div>
	);
}
