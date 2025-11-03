"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';

export default function SellerPaymentsPage() {
	const [activeTab, setActiveTab] = useState('payments');
	const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
	const [payments, setPayments] = useState<Array<{
		id: string;
		sellerId: string;
		sellerName: string;
		period: string;
		totalSales: number;
		commission: number;
		commissionRate: number;
		tax: number;
		netPayment: number;
		status: string;
		paymentDate: string | null;
		paymentMethod: string;
		bankAccount: string;
	}>>([]);

	// Demo veriler temizlendi - gerçek veriler veritabanından gelecek
	const commissionRules: never[] = [];
	const paymentHistory: never[] = [];

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('tr-TR', {
			style: 'currency',
			currency: 'TRY'
		}).format(amount);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Ödendi': return 'bg-green-100 text-green-800';
			case 'İşlemde': return 'bg-blue-100 text-blue-800';
			case 'Beklemede': return 'bg-yellow-100 text-yellow-800';
			case 'İptal': return 'bg-red-100 text-red-800';
			case 'Tamamlandı': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const stats = {
		totalSales: 0,
		totalCommission: 0,
		totalTax: 0,
		totalNetPayment: 0
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Satıcı Ödeme Yönetimi</h1>
				<div className="flex space-x-2">
					<select 
						value={selectedPeriod}
						onChange={(e) => setSelectedPeriod(e.target.value)}
						className="border rounded-lg px-3 py-2"
					>
						<option value="2024-01">Ocak 2024</option>
						<option value="2024-02">Şubat 2024</option>
						<option value="2024-03">Mart 2024</option>
					</select>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Toplu Ödeme
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">
						{formatCurrency(stats.totalSales)}
					</div>
					<div className="text-sm text-gray-600">Toplam Satış</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">
						{formatCurrency(stats.totalCommission)}
					</div>
					<div className="text-sm text-gray-600">Toplam Komisyon</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">
						{formatCurrency(stats.totalTax)}
					</div>
					<div className="text-sm text-gray-600">Toplam Vergi</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">
						{formatCurrency(stats.totalNetPayment)}
					</div>
					<div className="text-sm text-gray-600">Net Ödeme</div>
				</div>
			</div>

			{/* Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'payments', label: 'Ödemeler', count: payments.length },
							{ key: 'commission', label: 'Komisyon Kuralları', count: commissionRules.length },
							{ key: 'history', label: 'Ödeme Geçmişi', count: paymentHistory.length }
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
					{payments.length === 0 && (
						<div className="text-center py-12">
							<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-4xl">💰</span>
							</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Ödeme Yok</h3>
							<p className="text-gray-600 text-sm">
								Satıcı ödemeleri burada görünecek
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
