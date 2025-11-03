"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function WorkflowsPage() {
	const [activeTab, setActiveTab] = useState('active');
	const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);

	const workflows: any[] = [];

	const workflowTemplates: any[] = [];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Aktif': return 'bg-green-100 text-green-800';
			case 'Pasif': return 'bg-gray-100 text-gray-800';
			case 'Taslak': return 'bg-yellow-100 text-yellow-800';
			case 'Hata': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case 'E-ticaret': return 'bg-blue-100 text-blue-800';
			case 'Envanter': return 'bg-purple-100 text-purple-800';
			case 'Pazarlama': return 'bg-pink-100 text-pink-800';
			case 'Finans': return 'bg-green-100 text-green-800';
			case 'Müşteri İlişkileri': return 'bg-orange-100 text-orange-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const filteredWorkflows = workflows.filter(workflow => {
		if (activeTab === 'active') return workflow.status === 'Aktif';
		if (activeTab === 'draft') return workflow.status === 'Taslak';
		if (activeTab === 'inactive') return workflow.status === 'Pasif';
		return true;
	});

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Workflow Yönetimi</h1>
				<div className="flex space-x-2">
					<button 
						onClick={() => setIsCreatingWorkflow(true)}
						className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
					>
						Yeni Workflow
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Şablonlar
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{workflows.length}</div>
					<div className="text-sm text-gray-600">Toplam Workflow</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">{workflows.filter(w => w.status === 'Aktif').length}</div>
					<div className="text-sm text-gray-600">Aktif Workflow</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">0</div>
					<div className="text-sm text-gray-600">Toplam Çalıştırma</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">0%</div>
					<div className="text-sm text-gray-600">Başarı Oranı</div>
				</div>
			</div>

			{/* Workflow Activity Chart */}
			<div className="bg-white p-6 rounded-xl shadow-sm border">
				<h3 className="text-lg font-semibold mb-4">Workflow Aktivitesi (Son 7 Gün)</h3>
				<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<p className="text-gray-500">Workflow çalıştırma grafiği burada görünecek</p>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'active', label: 'Aktif', count: workflows.filter(w => w.status === 'Aktif').length },
							{ key: 'draft', label: 'Taslak', count: workflows.filter(w => w.status === 'Taslak').length },
							{ key: 'inactive', label: 'Pasif', count: workflows.filter(w => w.status === 'Pasif').length },
							{ key: 'templates', label: 'Şablonlar', count: workflowTemplates.length }
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

				<div className="p-6">
					{activeTab !== 'templates' ? (
						filteredWorkflows.length === 0 ? (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">📋</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Workflow Yok</h3>
								<p className="text-gray-600">İlk workflow oluşturduğunuzda burada görünecek</p>
							</div>
						) : (
							<div className="space-y-4">
								{filteredWorkflows.map((workflow) => (
								<div key={workflow.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center space-x-3 mb-2">
												<h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}>
													{workflow.status}
												</span>
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(workflow.category)}`}>
													{workflow.category}
												</span>
											</div>
											<p className="text-gray-600 mb-3">{workflow.description}</p>
											<div className="flex items-center space-x-6 text-sm text-gray-500">
												<span>Tetikleyici: <code className="bg-gray-100 px-2 py-1 rounded">{workflow.trigger}</code></span>
												<span>{workflow.steps} adım</span>
												<span>Başarı: {workflow.successRate}</span>
												<span>{workflow.totalRuns} çalıştırma</span>
											</div>
										</div>
									</div>
									
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-500">
											{workflow.lastRun ? `Son çalıştırma: ${workflow.lastRun}` : 'Henüz çalıştırılmadı'}
										</div>
										<div className="flex space-x-2">
											<button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
												Düzenle
											</button>
											<button className="text-green-600 hover:text-green-900 text-sm font-medium">
												Çalıştır
											</button>
											<button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
												Loglar
											</button>
											{workflow.status === 'Aktif' ? (
												<button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
													Durdur
												</button>
											) : (
												<button className="text-green-600 hover:text-green-900 text-sm font-medium">
													Başlat
												</button>
											)}
										</div>
									</div>
								</div>
								))}
							</div>
						)
					) : (
						workflowTemplates.length === 0 ? (
							<div className="text-center py-12">
								<div className="text-6xl mb-4">📋</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Şablon Yok</h3>
								<p className="text-gray-600">Workflow şablonları burada görünecek</p>
							</div>
						) : (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{workflowTemplates.map((template) => (
								<div key={template.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
											<p className="text-gray-600 mb-3">{template.description}</p>
											<div className="flex items-center space-x-2 mb-3">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(template.category)}`}>
													{template.category}
												</span>
												<span className="text-xs text-gray-500">{template.steps} adım</span>
											</div>
										</div>
									</div>
									
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500">Popülerlik: {template.popularity}</span>
										<button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 text-sm">
											Kullan
										</button>
									</div>
								</div>
								))}
							</div>
						)
					)}
				</div>
			</div>

			{/* Workflow Builder */}
			{isCreatingWorkflow && (
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold">Yeni Workflow Oluştur</h3>
						<button 
							onClick={() => setIsCreatingWorkflow(false)}
							className="text-gray-400 hover:text-gray-600"
						>
							✕
						</button>
					</div>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Workflow Adı
							</label>
							<input
								type="text"
								placeholder="Örn: Müşteri Onboarding"
								className="w-full border rounded-lg px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Kategori
							</label>
							<select className="w-full border rounded-lg px-3 py-2">
								<option>E-ticaret</option>
								<option>Pazarlama</option>
								<option>Müşteri İlişkileri</option>
								<option>Finans</option>
								<option>Envanter</option>
							</select>
						</div>
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Açıklama
							</label>
							<textarea
								rows={3}
								placeholder="Workflow'un ne yaptığını açıklayın..."
								className="w-full border rounded-lg px-3 py-2"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Tetikleyici Olay
							</label>
							<select className="w-full border rounded-lg px-3 py-2">
								<option>order.created</option>
								<option>user.registered</option>
								<option>payment.completed</option>
								<option>inventory.low</option>
								<option>product.updated</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Durum
							</label>
							<select className="w-full border rounded-lg px-3 py-2">
								<option>Taslak</option>
								<option>Aktif</option>
								<option>Pasif</option>
							</select>
						</div>
					</div>
					<div className="mt-6 flex justify-end space-x-3">
						<button 
							onClick={() => setIsCreatingWorkflow(false)}
							className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
						>
							İptal
						</button>
						<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
							Workflow Oluştur
						</button>
					</div>
				</div>
			)}

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">⚡</span>
						<h3 className="text-lg font-semibold text-green-900">Hızlı Workflow</h3>
					</div>
					<p className="text-green-700 mb-4">Hazır şablonlarla hızlı workflow oluştur.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Şablon Seç
					</button>
				</div>

				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔄</span>
						<h3 className="text-lg font-semibold text-blue-900">Toplu Çalıştır</h3>
					</div>
					<p className="text-blue-700 mb-4">Seçili workflow'ları toplu çalıştır.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Çalıştır
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">Workflow Analizi</h3>
					</div>
					<p className="text-purple-700 mb-4">Detaylı performans analizi.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Et
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📋</span>
						<h3 className="text-lg font-semibold text-orange-900">Workflow Logları</h3>
					</div>
					<p className="text-orange-700 mb-4">Tüm workflow çalıştırma logları.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Logları Görüntüle
					</button>
				</div>
			</div>
		</div>
	)
}
