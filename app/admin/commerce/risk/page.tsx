"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';

export default function RiskPage() {
	const [activeTab, setActiveTab] = useState('overview');
	const [riskAlerts, setRiskAlerts] = useState<Array<{
		id: string;
		type: string;
		severity: string;
		title: string;
		description: string;
		timestamp: string;
		status: string;
	}>>([]);

	// Demo veriler kaldırıldı - gerçek veriler veritabanından gelecek
	const riskMetrics = {
		fraudScore: 0,
		riskTransactions: 0,
		blockedUsers: 0,
		falsePositives: 0
	};

	const getSeverityColor = (severity: string) => {
		switch (severity) {
			case 'high': return 'bg-red-100 text-red-800 border-red-200';
			case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
			case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-red-100 text-red-800';
			case 'investigating': return 'bg-yellow-100 text-yellow-800';
			case 'resolved': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'investigating': return 'İnceleniyor';
			case 'resolved': return 'Çözüldü';
			default: return status;
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Risk Analizi & Fraud Tespiti</h1>
					<p className="text-gray-600">Gerçek zamanlı risk izleme ve dolandırıcılık tespiti</p>
				</div>
				<div className="flex items-center space-x-2">
					<span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
					<span className="text-sm text-green-600 font-medium">Risk Motoru Aktif</span>
				</div>
			</div>

			{/* Risk Metrics */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{riskMetrics.fraudScore}%</div>
					<div className="text-sm text-red-600">Fraud Skoru</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{riskMetrics.riskTransactions}</div>
					<div className="text-sm text-yellow-600">Riskli İşlem</div>
				</div>
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{riskMetrics.blockedUsers}</div>
					<div className="text-sm text-blue-600">Engellenen Kullanıcı</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{riskMetrics.falsePositives}</div>
					<div className="text-sm text-green-600">Yanlış Pozitif</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'overview', label: 'Genel Bakış', icon: '📊' },
							{ key: 'alerts', label: 'Risk Uyarıları', icon: '🚨' },
							{ key: 'rules', label: 'Risk Kuralları', icon: '⚙️' },
							{ key: 'reports', label: 'Raporlar', icon: '📋' }
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
					{riskAlerts.length === 0 && (
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-4xl">🛡️</span>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Risk Uyarısı Yok</h3>
							<p className="text-gray-600 text-sm">
								Sistem güvenli çalışıyor, risk tespit edildiğinde burada görünecek
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
