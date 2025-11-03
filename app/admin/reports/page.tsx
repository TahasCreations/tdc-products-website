"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function ReportsPage() {
	const [activeTab, setActiveTab] = useState('financial');
	const [reports, setReports] = useState<Array<{
		id: number;
		name: string;
		type: string;
		lastGenerated: string;
		status: string;
		size: string;
	}>>([]);

	// Demo veriler temizlendi - gerçek raporlar veritabanından gelecek

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Raporlar</h1>
					<p className="text-gray-600">Mali ve operasyonel raporlama merkezi</p>
				</div>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
					Yeni Rapor Oluştur
				</button>
			</div>

			{/* Statistics */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">0</div>
					<div className="text-sm text-blue-600">Toplam Rapor</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">0</div>
					<div className="text-sm text-green-600">Bu Ay Oluşturulan</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">0</div>
					<div className="text-sm text-purple-600">Otomatik Rapor</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">0</div>
					<div className="text-sm text-orange-600">Oluşturuluyor</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'financial', label: 'Mali Raporlar', icon: '💰' },
							{ key: 'sales', label: 'Satış Raporları', icon: '📊' },
							{ key: 'customer', label: 'Müşteri Raporları', icon: '👥' },
							{ key: 'inventory', label: 'Envanter Raporları', icon: '📦' }
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
					{reports.filter(r => r.type === activeTab).length > 0 ? (
						<div className="space-y-4">
							{reports.filter(r => r.type === activeTab).map((report) => (
								<div key={report.id} className="border rounded-lg p-6 flex items-center justify-between">
									<div>
										<h4 className="font-semibold text-gray-900">{report.name}</h4>
										<p className="text-sm text-gray-600">Son oluşturulma: {report.lastGenerated}</p>
									</div>
									<div className="flex items-center space-x-4">
										<span className={`px-2 py-1 text-xs font-semibold rounded-full ${
											report.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
										}`}>
											{report.status === 'ready' ? 'Hazır' : 'Oluşturuluyor'}
										</span>
										<span className="text-sm text-gray-500">{report.size}</span>
										{report.status === 'ready' && (
											<button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
												İndir
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12">
							<div className="text-gray-400 mb-2">📄</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Rapor Bulunmuyor</h3>
							<p className="text-gray-600 text-sm mb-4">
								Yeni bir rapor oluşturarak başlayın
							</p>
							<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
								İlk Raporunuzu Oluşturun
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
