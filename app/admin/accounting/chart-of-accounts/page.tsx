"use client";

import { useState } from 'react';

export default function ChartOfAccountsPage() {
	const [expandedGroups, setExpandedGroups] = useState<string[]>(['100', '200']);

	const [accounts, setAccounts] = useState<any[]>([]);

	const toggleGroup = (code: string) => {
		setExpandedGroups(prev => 
			prev.includes(code) 
				? prev.filter(g => g !== code)
				: [...prev, code]
		);
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Hesap Planı</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Yeni Hesap
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						İçe Aktar
					</button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">₺0</div>
					<div className="text-sm text-gray-600">Toplam Varlıklar</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-red-600">₺0</div>
					<div className="text-sm text-gray-600">Toplam Yükümlülükler</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">₺0</div>
					<div className="text-sm text-gray-600">Toplam Özkaynaklar</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">0</div>
					<div className="text-sm text-gray-600">Aktif Hesap Sayısı</div>
				</div>
			</div>

			{/* Account Tree */}
			<div className="bg-white rounded-xl shadow-sm border">
				<div className="p-6 border-b">
					<h3 className="text-lg font-semibold">Hesap Hiyerarşisi</h3>
				</div>
				<div className="p-6">
					{accounts.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">📊</div>
							<p className="text-gray-500 text-lg mb-2">Henüz Hesap Tanımlanmamış</p>
							<p className="text-gray-400 text-sm">Hesap planınızı oluşturun</p>
						</div>
					) : (
						<div className="space-y-2">
							{accounts.map((group) => (
								<div key={group.code}>
									{/* Group Header */}
									<div 
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
										onClick={() => toggleGroup(group.code)}
									>
										<div className="flex items-center space-x-3">
											<span className="text-gray-400">
												{expandedGroups.includes(group.code) ? '▼' : '▶'}
											</span>
											<span className="font-semibold text-gray-900">
												{group.code} - {group.name}
											</span>
										</div>
										<div className="text-sm text-gray-500">
											{group.children.length} hesap
										</div>
									</div>

									{/* Group Children */}
									{expandedGroups.includes(group.code) && (
										<div className="ml-8 space-y-1">
											{group.children.map((account) => (
												<div key={account.code} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
													<div className="flex items-center space-x-3">
														<span className="text-gray-400">📄</span>
														<span className="text-gray-900">
															{account.code} - {account.name}
														</span>
													</div>
													<div className="flex items-center space-x-4">
														<span className="font-semibold text-gray-900">
															{account.balance}
														</span>
														<div className="flex space-x-2">
															<button className="text-indigo-600 hover:text-indigo-900 text-sm">
																Düzenle
															</button>
															<button className="text-green-600 hover:text-green-900 text-sm">
																Hareket
															</button>
															<button className="text-red-600 hover:text-red-900 text-sm">
																Sil
															</button>
														</div>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-3 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-blue-900">Mizan Raporu</h3>
					</div>
					<p className="text-blue-700 mb-4">Tüm hesapların bakiyelerini görüntüleyin.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Rapor Al
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">💼</span>
						<h3 className="text-lg font-semibold text-green-900">Bilanço</h3>
					</div>
					<p className="text-green-700 mb-4">Varlık ve yükümlülük bilançosunu oluşturun.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📈</span>
						<h3 className="text-lg font-semibold text-purple-900">Gelir Tablosu</h3>
					</div>
					<p className="text-purple-700 mb-4">Dönemsel gelir-gider analizini görün.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Analiz Et
					</button>
				</div>
			</div>
		</div>
	)
}
