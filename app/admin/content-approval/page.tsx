"use client";

import { useState } from 'react';

export default function ContentApprovalPage() {
	const [activeTab, setActiveTab] = useState('workflow');
	const [selectedWorkflow, setSelectedWorkflow] = useState('blog');

	const workflowStats = {
		totalWorkflows: 8,
		activeWorkflows: 6,
		pendingApprovals: 45,
		completedToday: 23,
		avgApprovalTime: '3.2 saat',
		automationRate: '65%',
		rejectionRate: '12%',
		escalationRate: '8%'
	};

	const workflows = [
		{
			id: 'WF001',
			name: 'Blog Yazısı Onay Süreci',
			type: 'blog_post',
			status: 'active',
			steps: [
				{ name: 'Otomatik İnceleme', type: 'automated', duration: '2 dk', responsible: 'AI Sistem' },
				{ name: 'İçerik Editörü İncelemesi', type: 'manual', duration: '30 dk', responsible: 'İçerik Editörü' },
				{ name: 'SEO Uzmanı Onayı', type: 'manual', duration: '15 dk', responsible: 'SEO Uzmanı' },
				{ name: 'Yayın Onayı', type: 'manual', duration: '10 dk', responsible: 'Yayın Sorumlusu' }
			],
			pendingItems: 12,
			completedToday: 8,
			avgCompletionTime: '2.5 saat',
			successRate: '92%'
		},
		{
			id: 'WF002',
			name: 'Ürün İncelemesi Onay Süreci',
			type: 'product_review',
			status: 'active',
			steps: [
				{ name: 'Spam Kontrolü', type: 'automated', duration: '1 dk', responsible: 'AI Sistem' },
				{ name: 'İçerik Moderasyonu', type: 'manual', duration: '10 dk', responsible: 'Moderatör' },
				{ name: 'Kalite Kontrolü', type: 'manual', duration: '5 dk', responsible: 'Kalite Uzmanı' }
			],
			pendingItems: 18,
			completedToday: 25,
			avgCompletionTime: '45 dk',
			successRate: '89%'
		},
		{
			id: 'WF003',
			name: 'Kullanıcı Yorumu Onay Süreci',
			type: 'user_comment',
			status: 'active',
			steps: [
				{ name: 'Otomatik Filtreleme', type: 'automated', duration: '30 sn', responsible: 'AI Sistem' },
				{ name: 'Manuel İnceleme', type: 'manual', duration: '3 dk', responsible: 'Moderatör' }
			],
			pendingItems: 89,
			completedToday: 156,
			avgCompletionTime: '8 dk',
			successRate: '95%'
		},
		{
			id: 'WF004',
			name: 'Medya İçerik Onay Süreci',
			type: 'media_content',
			status: 'active',
			steps: [
				{ name: 'Telif Hakkı Kontrolü', type: 'automated', duration: '5 dk', responsible: 'AI Sistem' },
				{ name: 'İçerik Uygunluk Kontrolü', type: 'manual', duration: '15 dk', responsible: 'Medya Moderatörü' },
				{ name: 'Teknik Kalite Kontrolü', type: 'manual', duration: '10 dk', responsible: 'Teknik Uzman' }
			],
			pendingItems: 7,
			completedToday: 3,
			avgCompletionTime: '1.2 saat',
			successRate: '87%'
		}
	];

	const pendingApprovals = [
		{
			id: 'PA001',
			title: 'E-ticaret Pazarlama Stratejileri',
			type: 'blog_post',
			workflow: 'Blog Yazısı Onay Süreci',
			currentStep: 'İçerik Editörü İncelemesi',
			submittedBy: 'Ahmet Yılmaz',
			submittedAt: '2024-01-15 14:30',
			assignedTo: 'editor@tdcmarket.com',
			priority: 'normal',
			deadline: '2024-01-16 18:00',
			status: 'in_progress',
			progress: 50,
			estimatedCompletion: '1.5 saat'
		},
		{
			id: 'PA002',
			title: 'Kablosuz Kulaklık İncelemesi',
			type: 'product_review',
			workflow: 'Ürün İncelemesi Onay Süreci',
			currentStep: 'Kalite Kontrolü',
			submittedBy: 'Ayşe Demir',
			submittedAt: '2024-01-15 12:15',
			assignedTo: 'quality@tdcmarket.com',
			priority: 'high',
			deadline: '2024-01-15 20:00',
			status: 'in_progress',
			progress: 75,
			estimatedCompletion: '30 dk'
		},
		{
			id: 'PA003',
			title: 'Ürün hakkında yorum',
			type: 'user_comment',
			workflow: 'Kullanıcı Yorumu Onay Süreci',
			currentStep: 'Manuel İnceleme',
			submittedBy: 'Mehmet Can',
			submittedAt: '2024-01-15 16:45',
			assignedTo: 'moderator@tdcmarket.com',
			priority: 'low',
			deadline: '2024-01-16 12:00',
			status: 'pending',
			progress: 25,
			estimatedCompletion: '5 dk'
		}
	];

	const approvalHistory = [
		{
			id: 'AH001',
			title: 'Mobil E-ticaret Optimizasyonu',
			type: 'blog_post',
			workflow: 'Blog Yazısı Onay Süreci',
			submittedBy: 'Fatma Özkan',
			completedAt: '2024-01-14 16:20',
			finalApprover: 'publisher@tdcmarket.com',
			totalTime: '2.1 saat',
			status: 'approved',
			result: 'Yayınlandı'
		},
		{
			id: 'AH002',
			title: 'Kalitesiz İçerik Örneği',
			type: 'blog_post',
			workflow: 'Blog Yazısı Onay Süreci',
			submittedBy: 'Test User',
			completedAt: '2024-01-14 11:30',
			finalApprover: 'editor@tdcmarket.com',
			totalTime: '45 dk',
			status: 'rejected',
			result: 'İçerik kalitesi yetersiz'
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'inactive': return 'bg-gray-100 text-gray-800';
			case 'in_progress': return 'bg-blue-100 text-blue-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'approved': return 'bg-green-100 text-green-800';
			case 'rejected': return 'bg-red-100 text-red-800';
			case 'escalated': return 'bg-purple-100 text-purple-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'inactive': return 'Pasif';
			case 'in_progress': return 'İşlemde';
			case 'pending': return 'Beklemede';
			case 'approved': return 'Onaylandı';
			case 'rejected': return 'Reddedildi';
			case 'escalated': return 'Yükseltildi';
			default: return status;
		}
	};

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'normal': return 'bg-blue-100 text-blue-800';
			case 'low': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getPriorityText = (priority: string) => {
		switch (priority) {
			case 'high': return 'Yüksek';
			case 'normal': return 'Normal';
			case 'low': return 'Düşük';
			default: return priority;
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'blog_post': return '📝';
			case 'product_review': return '⭐';
			case 'user_comment': return '💬';
			case 'media_content': return '🎥';
			default: return '📄';
		}
	};

	const getTypeText = (type: string) => {
		switch (type) {
			case 'blog_post': return 'Blog Yazısı';
			case 'product_review': return 'Ürün İncelemesi';
			case 'user_comment': return 'Kullanıcı Yorumu';
			case 'media_content': return 'Medya İçeriği';
			default: return type;
		}
	};

	const getStepTypeIcon = (type: string) => {
		switch (type) {
			case 'automated': return '🤖';
			case 'manual': return '👤';
			default: return '⚙️';
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">İçerik Onay Süreçleri</h1>
					<p className="text-gray-600">Onay iş akışları, süreç yönetimi ve otomasyonu</p>
				</div>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni İş Akışı
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Toplu İşlemler
					</button>
				</div>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-8 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{workflowStats.totalWorkflows}</div>
					<div className="text-sm text-blue-600">Toplam İş Akışı</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{workflowStats.activeWorkflows}</div>
					<div className="text-sm text-green-600">Aktif İş Akışı</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{workflowStats.pendingApprovals}</div>
					<div className="text-sm text-yellow-600">Bekleyen Onay</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">{workflowStats.completedToday}</div>
					<div className="text-sm text-purple-600">Bugün Tamamlanan</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">{workflowStats.avgApprovalTime}</div>
					<div className="text-sm text-orange-600">Ort. Onay Süresi</div>
				</div>
				<div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
					<div className="text-2xl font-bold text-emerald-700">{workflowStats.automationRate}</div>
					<div className="text-sm text-emerald-600">Otomasyon Oranı</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{workflowStats.rejectionRate}</div>
					<div className="text-sm text-red-600">Ret Oranı</div>
				</div>
				<div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
					<div className="text-2xl font-bold text-pink-700">{workflowStats.escalationRate}</div>
					<div className="text-sm text-pink-600">Yükseltme Oranı</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'workflow', label: 'İş Akışları', icon: '🔄' },
							{ key: 'pending', label: 'Bekleyen Onaylar', icon: '⏳' },
							{ key: 'history', label: 'Onay Geçmişi', icon: '📋' },
							{ key: 'analytics', label: 'Analitik', icon: '📊' }
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
					{activeTab === 'workflow' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">İş Akışı Yönetimi</h3>
							
							<div className="space-y-6">
								{workflows.map((workflow) => (
									<div key={workflow.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getTypeIcon(workflow.type)}</span>
													<h4 className="font-semibold text-gray-900 text-lg">{workflow.name}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}>
														{getStatusText(workflow.status)}
													</span>
													<span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
														{getTypeText(workflow.type)}
													</span>
												</div>
											</div>
										</div>

										<div className="grid md:grid-cols-4 gap-4 mb-6">
											<div className="text-center bg-blue-50 p-3 rounded">
												<div className="text-xl font-bold text-blue-600">{workflow.pendingItems}</div>
												<div className="text-sm text-blue-600">Bekleyen</div>
											</div>
											<div className="text-center bg-green-50 p-3 rounded">
												<div className="text-xl font-bold text-green-600">{workflow.completedToday}</div>
												<div className="text-sm text-green-600">Bugün Tamamlanan</div>
											</div>
											<div className="text-center bg-yellow-50 p-3 rounded">
												<div className="text-xl font-bold text-yellow-600">{workflow.avgCompletionTime}</div>
												<div className="text-sm text-yellow-600">Ort. Tamamlama</div>
											</div>
											<div className="text-center bg-purple-50 p-3 rounded">
												<div className="text-xl font-bold text-purple-600">{workflow.successRate}</div>
												<div className="text-sm text-purple-600">Başarı Oranı</div>
											</div>
										</div>

										<div className="mb-4">
											<h5 className="font-medium text-gray-900 mb-3">İş Akışı Adımları</h5>
											<div className="space-y-3">
												{workflow.steps.map((step, index) => (
													<div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
														<div className="flex items-center flex-1">
															<span className="text-lg mr-3">{getStepTypeIcon(step.type)}</span>
															<div className="flex-1">
																<p className="font-medium text-gray-900">{step.name}</p>
																<p className="text-sm text-gray-600">
																	Sorumlu: {step.responsible} • Süre: {step.duration}
																</p>
															</div>
														</div>
														{index < workflow.steps.length - 1 && (
															<span className="text-gray-400 ml-3">→</span>
														)}
													</div>
												))}
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Düzenle
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Kopyala
											</button>
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Duraklat
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm">
												Devre Dışı
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'pending' && (
						<div className="space-y-6">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-semibold text-gray-900">Bekleyen Onaylar</h3>
								<div className="flex space-x-2">
									<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
										<option value="">Tüm İş Akışları</option>
										{workflows.map(wf => (
											<option key={wf.id} value={wf.id}>{wf.name}</option>
										))}
									</select>
									<select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
										<option value="">Tüm Öncelikler</option>
										<option value="high">Yüksek</option>
										<option value="normal">Normal</option>
										<option value="low">Düşük</option>
									</select>
								</div>
							</div>

							<div className="space-y-4">
								{pendingApprovals.map((approval) => (
									<div key={approval.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getTypeIcon(approval.type)}</span>
													<h4 className="font-semibold text-gray-900">{approval.title}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(approval.status)}`}>
														{getStatusText(approval.status)}
													</span>
													<span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(approval.priority)}`}>
														{getPriorityText(approval.priority)}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>İş Akışı:</strong> {approval.workflow}</p>
													<p><strong>Mevcut Adım:</strong> {approval.currentStep}</p>
													<p><strong>Gönderen:</strong> {approval.submittedBy}</p>
													<p><strong>Atanan:</strong> {approval.assignedTo}</p>
													<p><strong>Son Tarih:</strong> {approval.deadline}</p>
												</div>
											</div>
										</div>

										<div className="mb-4">
											<div className="flex justify-between text-sm text-gray-600 mb-1">
												<span>İlerleme: %{approval.progress}</span>
												<span>Tahmini Tamamlama: {approval.estimatedCompletion}</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div 
													className="h-2 bg-indigo-600 rounded-full"
													style={{ width: `${approval.progress}%` }}
												></div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												İçeriği Görüntüle
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												Detaylar
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm">
												Hızlı Onayla
											</button>
											<button className="text-yellow-600 hover:text-yellow-900 text-sm">
												Yeniden Ata
											</button>
											<button className="text-red-600 hover:text-red-900 text-sm">
												Reddet
											</button>
											<button className="text-purple-600 hover:text-purple-900 text-sm">
												Yükselt
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'history' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Onay Geçmişi</h3>
							
							<div className="space-y-4">
								{approvalHistory.map((item) => (
									<div key={item.id} className="border rounded-lg p-6">
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1">
												<div className="flex items-center mb-2">
													<span className="text-2xl mr-3">{getTypeIcon(item.type)}</span>
													<h4 className="font-semibold text-gray-900">{item.title}</h4>
													<span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
														{getStatusText(item.status)}
													</span>
												</div>
												<div className="text-sm text-gray-600 mb-3">
													<p><strong>İş Akışı:</strong> {item.workflow}</p>
													<p><strong>Gönderen:</strong> {item.submittedBy}</p>
													<p><strong>Son Onaylayan:</strong> {item.finalApprover}</p>
													<p><strong>Tamamlanma:</strong> {item.completedAt}</p>
													<p><strong>Toplam Süre:</strong> {item.totalTime}</p>
												</div>
												<div className={`p-3 rounded border ${
													item.status === 'approved' 
														? 'bg-green-50 border-green-200' 
														: 'bg-red-50 border-red-200'
												}`}>
													<p className={`text-sm ${
														item.status === 'approved' 
															? 'text-green-700' 
															: 'text-red-700'
													}`}>
														<strong>Sonuç:</strong> {item.result}
													</p>
												</div>
											</div>
										</div>

										<div className="flex justify-end space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm">
												Detaylar
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm">
												İş Akışı Geçmişi
											</button>
											{item.status === 'approved' && (
												<button className="text-green-600 hover:text-green-900 text-sm">
													İçeriği Görüntüle
												</button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'analytics' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Onay Süreci Analitikleri</h3>
							
							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Onay Süreleri Trendi</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📈 Onay süreleri grafiği burada görünecek</p>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">İş Akışı Performansı</h4>
									<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
										<p className="text-gray-500">📊 Performans grafiği burada görünecek</p>
									</div>
								</div>
							</div>

							<div className="grid md:grid-cols-3 gap-6">
								<div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
									<h4 className="font-semibold text-blue-900 mb-3">En Hızlı İş Akışı</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">⚡</span>
										<div>
											<p className="text-blue-800 font-medium">Kullanıcı Yorumu</p>
											<p className="text-blue-600 text-sm">Ort. 8 dakika</p>
										</div>
									</div>
								</div>

								<div className="bg-green-50 p-6 rounded-lg border border-green-200">
									<h4 className="font-semibold text-green-900 mb-3">En Yüksek Başarı Oranı</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">🎯</span>
										<div>
											<p className="text-green-800 font-medium">Kullanıcı Yorumu</p>
											<p className="text-green-600 text-sm">%95 başarı</p>
										</div>
									</div>
								</div>

								<div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
									<h4 className="font-semibold text-yellow-900 mb-3">En Çok Kullanılan</h4>
									<div className="flex items-center">
										<span className="text-3xl mr-3">🔥</span>
										<div>
											<p className="text-yellow-800 font-medium">Ürün İncelemesi</p>
											<p className="text-yellow-600 text-sm">Günde 25 onay</p>
										</div>
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
						<h3 className="text-lg font-semibold text-blue-900">Hızlı Onay</h3>
					</div>
					<p className="text-blue-700 mb-4">Bekleyen onayları hızlıca işle.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Onay Merkezi
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🤖</span>
						<h3 className="text-lg font-semibold text-green-900">Otomasyon</h3>
					</div>
					<p className="text-green-700 mb-4">İş akışı otomasyonu ayarları.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Otomasyon Ayarları
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Performans Raporu</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı performans analizi.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Rapor Oluştur
					</button>
				</div>
			</div>
		</div>
	);
}