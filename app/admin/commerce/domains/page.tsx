"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function DomainsPage() {
	const [activeTab, setActiveTab] = useState('domains');
	const [newDomain, setNewDomain] = useState('');
	const [domains, setDomains] = useState<Array<{
		id: string;
		domain: string;
		seller: string;
		status: string;
		sslStatus: string;
		lastCheck: string;
		traffic: number;
		orders: number;
	}>>([]);

	// Demo veriler kaldırıldı - gerçek veriler veritabanından gelecek

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-100 text-green-800';
			case 'pending': return 'bg-yellow-100 text-yellow-800';
			case 'error': return 'bg-red-100 text-red-800';
			case 'suspended': return 'bg-gray-100 text-gray-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'active': return 'Aktif';
			case 'pending': return 'Beklemede';
			case 'error': return 'Hata';
			case 'suspended': return 'Askıda';
			default: return status;
		}
	};

	const getSSLColor = (sslStatus: string) => {
		switch (sslStatus) {
			case 'valid': return 'text-green-600';
			case 'expired': return 'text-red-600';
			case 'pending': return 'text-yellow-600';
			default: return 'text-gray-600';
		}
	};

	const handleAddDomain = () => {
		if (newDomain.trim()) {
			// Add domain logic here
			setNewDomain('');
		}
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">White Label Domain Yönetimi</h1>
					<p className="text-gray-600">Satıcılar için özel domain yönetimi ve SSL sertifikaları</p>
				</div>
				<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
					Yeni Domain Ekle
				</button>
			</div>

			{/* Summary Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">{domains.length}</div>
					<div className="text-sm text-blue-600">Toplam Domain</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">{domains.filter(d => d.status === 'active').length}</div>
					<div className="text-sm text-green-600">Aktif Domain</div>
				</div>
				<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
					<div className="text-2xl font-bold text-yellow-700">{domains.filter(d => d.status === 'pending').length}</div>
					<div className="text-sm text-yellow-600">Bekleyen Domain</div>
				</div>
				<div className="bg-red-50 p-4 rounded-lg border border-red-200">
					<div className="text-2xl font-bold text-red-700">{domains.filter(d => d.sslStatus === 'expired').length}</div>
					<div className="text-sm text-red-600">SSL Süresi Dolmuş</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'domains', label: 'Domain Listesi', icon: '🌐' },
							{ key: 'ssl', label: 'SSL Yönetimi', icon: '🔒' },
							{ key: 'dns', label: 'DNS Ayarları', icon: '⚙️' },
							{ key: 'analytics', label: 'Domain Analitik', icon: '📊' }
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
					{domains.length === 0 && (
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-4xl">🌐</span>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Domain Yok</h3>
							<p className="text-gray-600 text-sm mb-4">
								Satıcılar için white label domain ekleyin
							</p>
							<button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
								İlk Domain'i Ekle
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
