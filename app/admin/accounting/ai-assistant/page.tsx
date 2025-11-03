"use client";

import { useState } from 'react';

export default function AIAssistantPage() {
	const [activeTab, setActiveTab] = useState('vat');
	const [query, setQuery] = useState('');
	const [isProcessing, setIsProcessing] = useState(false);

	const [vatSuggestions, setVatSuggestions] = useState<any[]>([]);

	const recentQueries = [
		'KDV beyanname nasıl hazırlanır?',
		'İhracat işlemlerinde KDV uygulaması',
		'Stopaj hesaplama yöntemleri',
		'Kurumlar vergisi matrah hesabı'
	];

	const handleSubmitQuery = async () => {
		if (!query.trim()) return;
		
		setIsProcessing(true);
		// Simulate AI processing
		setTimeout(() => {
			setIsProcessing(false);
			setQuery('');
		}, 2000);
	};

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">AI KDV Asistanı</h1>
					<p className="text-gray-600">Yapay zeka destekli vergi danışmanlığı ve otomasyonu</p>
				</div>
				<div className="flex items-center space-x-2">
					<span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
					<span className="text-sm text-green-600 font-medium">AI Aktif</span>
				</div>
			</div>

			{/* AI Query Interface */}
			<div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
				<div className="flex items-center mb-4">
					<span className="text-2xl mr-3">🤖</span>
					<h3 className="text-lg font-semibold text-indigo-900">AI Vergi Danışmanı</h3>
				</div>
				<div className="flex space-x-4">
					<div className="flex-1">
						<textarea
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="KDV, stopaj, kurumlar vergisi hakkında sorularınızı sorun..."
							className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
							rows={3}
						/>
					</div>
					<button
						onClick={handleSubmitQuery}
						disabled={isProcessing || !query.trim()}
						className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
					>
						{isProcessing ? (
							<>
								<span className="animate-spin mr-2">⚙️</span>
								İşleniyor...
							</>
						) : (
							<>
								<span className="mr-2">🚀</span>
								Sor
							</>
						)}
					</button>
				</div>
				<div className="mt-4">
					<p className="text-sm text-indigo-700 mb-2">Sık Sorulan Sorular:</p>
					<div className="flex flex-wrap gap-2">
						{recentQueries.map((q, index) => (
							<button
								key={index}
								onClick={() => setQuery(q)}
								className="px-3 py-1 bg-white text-indigo-700 text-sm rounded-full border border-indigo-200 hover:bg-indigo-50"
							>
								{q}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Main Content Tabs */}
			<div className="bg-white rounded-lg border">
				<div className="border-b border-gray-200">
					<nav className="flex space-x-8 px-6">
						{[
							{ key: 'vat', label: 'KDV Yönetimi', icon: '📊' },
							{ key: 'withholding', label: 'Stopaj', icon: '💰' },
							{ key: 'corporate', label: 'Kurumlar Vergisi', icon: '🏢' },
							{ key: 'automation', label: 'Otomasyon', icon: '⚙️' }
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
					{activeTab === 'vat' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">KDV Yönetimi ve Öneriler</h3>
							
							{vatSuggestions.length === 0 ? (
								<div className="text-center py-12">
									<div className="text-6xl mb-4">📋</div>
									<p className="text-gray-500 text-lg mb-2">Henüz KDV Önerisi Yok</p>
									<p className="text-gray-400 text-sm">İşlemleriniz analiz edildiğinde AI destekli öneriler burada görünecek</p>
								</div>
							) : (
								<div className="space-y-4">
									{vatSuggestions.map((suggestion) => (
										<div key={suggestion.id} className={`border rounded-lg p-4 ${
											suggestion.priority === 'high' ? 'border-red-200 bg-red-50' :
											suggestion.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
											'border-blue-200 bg-blue-50'
										}`}>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center mb-2">
														<span className={`w-3 h-3 rounded-full mr-2 ${
															suggestion.priority === 'high' ? 'bg-red-500' :
															suggestion.priority === 'medium' ? 'bg-yellow-500' :
															'bg-blue-500'
														}`}></span>
														<h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
													</div>
													<p className="text-gray-700 mb-3">{suggestion.description}</p>
												</div>
												<button className={`px-4 py-2 rounded-lg text-sm font-medium ${
													suggestion.priority === 'high' ? 'bg-red-600 text-white hover:bg-red-700' :
													suggestion.priority === 'medium' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
													'bg-blue-600 text-white hover:bg-blue-700'
												}`}>
													{suggestion.action}
												</button>
											</div>
										</div>
									))}
								</div>
							)}

							<div className="grid md:grid-cols-2 gap-6">
								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">KDV Hesaplama</h4>
									<div className="space-y-3">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Tutar (KDV Hariç)</label>
											<input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="0.00" />
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">KDV Oranı</label>
											<select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
												<option value="18">%18</option>
												<option value="8">%8</option>
												<option value="1">%1</option>
												<option value="0">%0</option>
											</select>
										</div>
										<button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
											Hesapla
										</button>
									</div>
								</div>

								<div className="border rounded-lg p-4">
									<h4 className="font-semibold text-gray-900 mb-3">Beyanname Durumu</h4>
									<div className="space-y-3">
										<div className="flex justify-between items-center">
											<span className="text-gray-600">Ocak 2024</span>
											<span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">Verildi</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600">Şubat 2024</span>
											<span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Hazırlanıyor</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-gray-600">Mart 2024</span>
											<span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">Beklemede</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'withholding' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Stopaj Yönetimi</h3>
							<div className="text-center text-gray-500">
								<p>Stopaj hesaplama ve beyanname araçları burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'corporate' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Kurumlar Vergisi</h3>
							<div className="text-center text-gray-500">
								<p>Kurumlar vergisi hesaplama ve beyanname araçları burada görünecek...</p>
							</div>
						</div>
					)}

					{activeTab === 'automation' && (
						<div className="space-y-6">
							<h3 className="text-lg font-semibold text-gray-900">Vergi Otomasyonu</h3>
							<div className="text-center text-gray-500">
								<p>Otomatik vergi hesaplama ve beyanname oluşturma ayarları burada görünecek...</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid md:grid-cols-4 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
					<div className="text-2xl font-bold text-blue-700">₺0</div>
					<div className="text-sm text-blue-600">Bu Ay KDV</div>
				</div>
				<div className="bg-green-50 p-4 rounded-lg border border-green-200">
					<div className="text-2xl font-bold text-green-700">₺0</div>
					<div className="text-sm text-green-600">Stopaj</div>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
					<div className="text-2xl font-bold text-purple-700">₺0</div>
					<div className="text-sm text-purple-600">Kurumlar Vergisi</div>
				</div>
				<div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
					<div className="text-2xl font-bold text-orange-700">0%</div>
					<div className="text-sm text-orange-600">Otomasyon Oranı</div>
				</div>
			</div>
		</div>
	);
}
