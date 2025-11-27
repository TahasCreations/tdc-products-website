"use client";


// Client components are dynamic by default
import { useState, Suspense } from 'react';

export default function ApiDocsPage() {
	const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState('overview');

	const apiEndpoints = [
		{
			id: 'products',
			method: 'GET',
			path: '/api/products',
			description: 'Ürün listesini getirir',
			category: 'Products',
			parameters: ['page', 'limit', 'category', 'search'],
			response: { products: [], total: 0, page: 1 }
		},
		{
			id: 'product-create',
			method: 'POST',
			path: '/api/products',
			description: 'Yeni ürün oluşturur',
			category: 'Products',
			parameters: ['name', 'price', 'description', 'category_id'],
			response: { id: 1, name: 'Product Name', created_at: '2024-01-01' }
		},
		{
			id: 'orders',
			method: 'GET',
			path: '/api/orders',
			description: 'Sipariş listesini getirir',
			category: 'Orders',
			parameters: ['page', 'limit', 'status', 'customer_id'],
			response: { orders: [], total: 0, page: 1 }
		},
		{
			id: 'customers',
			method: 'GET',
			path: '/api/customers',
			description: 'Müşteri listesini getirir',
			category: 'Customers',
			parameters: ['page', 'limit', 'search'],
			response: { customers: [], total: 0, page: 1 }
		}
	];

	const getMethodColor = (method: string) => {
		switch (method) {
			case 'GET': return 'bg-green-100 text-green-800';
			case 'POST': return 'bg-blue-100 text-blue-800';
			case 'PUT': return 'bg-yellow-100 text-yellow-800';
			case 'DELETE': return 'bg-red-100 text-red-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const categories = [...new Set(apiEndpoints.map(ep => ep.category))];
	const selectedEndpointData = apiEndpoints.find(ep => ep.id === selectedEndpoint);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">API Dokümantasyonu</h1>
				<div className="flex space-x-2">
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						API Key Oluştur
					</button>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Postman Collection
					</button>
				</div>
			</div>

			{/* API Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-blue-600">{apiEndpoints.length}</div>
					<div className="text-sm text-gray-600">Toplam Endpoint</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-green-600">v2.1</div>
					<div className="text-sm text-gray-600">API Versiyonu</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-purple-600">0%</div>
					<div className="text-sm text-gray-600">Uptime</div>
				</div>
				<div className="bg-white p-4 rounded-lg border">
					<div className="text-lg font-semibold text-orange-600">0ms</div>
					<div className="text-sm text-gray-600">Ortalama Yanıt</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Sidebar */}
				<div className="lg:col-span-1">
					<div className="bg-white rounded-xl shadow-sm border">
						<div className="p-6 border-b">
							<h3 className="text-lg font-semibold">Endpoints</h3>
						</div>
						<div className="p-6">
							{categories.map((category) => (
								<div key={category} className="mb-6">
									<h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
									<div className="space-y-2">
										{apiEndpoints
											.filter(ep => ep.category === category)
											.map((endpoint) => (
												<button
													key={endpoint.id}
													onClick={() => setSelectedEndpoint(endpoint.id)}
													className={`w-full text-left p-3 rounded-lg border transition-all ${
														selectedEndpoint === endpoint.id
															? 'border-indigo-200 bg-indigo-50'
															: 'border-gray-200 hover:border-gray-300'
													}`}
												>
													<div className="flex items-center justify-between mb-1">
														<span className={`text-xs px-2 py-1 rounded-full font-semibold ${getMethodColor(endpoint.method)}`}>
															{endpoint.method}
														</span>
													</div>
													<div className="text-sm font-mono text-gray-700">
														{endpoint.path}
													</div>
													<div className="text-xs text-gray-500 mt-1">
														{endpoint.description}
													</div>
												</button>
											))}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="lg:col-span-3">
					{selectedEndpointData ? (
						<div className="bg-white rounded-xl shadow-sm border">
							<div className="p-6 border-b">
								<div className="flex items-center space-x-3 mb-2">
									<span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMethodColor(selectedEndpointData.method)}`}>
										{selectedEndpointData.method}
									</span>
									<code className="text-lg font-mono text-gray-900">
										{selectedEndpointData.path}
									</code>
								</div>
								<p className="text-gray-600">{selectedEndpointData.description}</p>
							</div>

							{/* Tabs */}
							<div className="border-b border-gray-200">
								<nav className="flex space-x-8 px-6">
									{[
										{ key: 'overview', label: 'Genel Bakış' },
										{ key: 'parameters', label: 'Parametreler' },
										{ key: 'response', label: 'Yanıt' },
										{ key: 'examples', label: 'Örnekler' }
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
											{tab.label}
										</button>
									))}
								</nav>
							</div>

							<div className="p-6">
								{activeTab === 'overview' && (
									<div className="space-y-4">
										<div>
											<h4 className="font-semibold text-gray-900 mb-2">Açıklama</h4>
											<p className="text-gray-700">{selectedEndpointData.description}</p>
										</div>
										<div>
											<h4 className="font-semibold text-gray-900 mb-2">Base URL</h4>
											<code className="bg-gray-100 px-3 py-2 rounded-lg text-sm">
												https://api.tdcmarket.com/v2
											</code>
										</div>
										<div>
											<h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
											<p className="text-gray-700">Bu endpoint API key gerektirir.</p>
											<code className="bg-gray-100 px-3 py-2 rounded-lg text-sm block mt-2">
												Authorization: Bearer YOUR_API_KEY
											</code>
										</div>
									</div>
								)}

								{activeTab === 'parameters' && (
									<div>
										<h4 className="font-semibold text-gray-900 mb-4">Parametreler</h4>
										<div className="overflow-x-auto">
											<table className="w-full border border-gray-200 rounded-lg">
												<thead className="bg-gray-50">
													<tr>
														<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
															Parametre
														</th>
														<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
															Tip
														</th>
														<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
															Zorunlu
														</th>
														<th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
															Açıklama
														</th>
													</tr>
												</thead>
												<tbody className="divide-y divide-gray-200">
													{selectedEndpointData.parameters.map((param, i) => (
														<tr key={i}>
															<td className="px-4 py-3 text-sm font-mono text-gray-900">
																{param}
															</td>
															<td className="px-4 py-3 text-sm text-gray-600">
																string
															</td>
															<td className="px-4 py-3 text-sm text-gray-600">
																{i < 2 ? 'Hayır' : 'Evet'}
															</td>
															<td className="px-4 py-3 text-sm text-gray-600">
																{param} parametresi açıklaması
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								)}

								{activeTab === 'response' && (
									<div>
										<h4 className="font-semibold text-gray-900 mb-4">Yanıt Formatı</h4>
										<div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
											<pre>{JSON.stringify(selectedEndpointData.response, null, 2)}</pre>
										</div>
									</div>
								)}

								{activeTab === 'examples' && (
									<div className="space-y-6">
										<div>
											<h4 className="font-semibold text-gray-900 mb-2">cURL Örneği</h4>
											<div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
												<pre>{`curl -X ${selectedEndpointData.method} \\
  https://api.tdcmarket.com/v2${selectedEndpointData.path} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</pre>
											</div>
										</div>
										<div>
											<h4 className="font-semibold text-gray-900 mb-2">JavaScript Örneği</h4>
											<div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
												<pre>{`fetch('https://api.tdcmarket.com/v2${selectedEndpointData.path}', {
  method: '${selectedEndpointData.method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}</pre>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="bg-white rounded-xl shadow-sm border p-12 text-center">
							<div className="text-6xl mb-4">📚</div>
							<h3 className="text-lg font-semibold text-gray-900 mb-2">API Dokümantasyonu</h3>
							<p className="text-gray-600 mb-6">
								Detaylarını görmek için sol taraftan bir endpoint seçin.
							</p>
							<div className="grid md:grid-cols-2 gap-4 text-sm">
								<div className="p-4 bg-gray-50 rounded-lg">
									<div className="font-semibold mb-1">Hızlı Başlangıç</div>
									<div className="text-gray-600">API key alın ve ilk isteğinizi gönderin</div>
								</div>
								<div className="p-4 bg-gray-50 rounded-lg">
									<div className="font-semibold mb-1">Rate Limiting</div>
									<div className="text-gray-600">Dakikada 1000 istek limiti</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Quick Actions */}
			<div className="grid md:grid-cols-4 gap-6">
				<div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔑</span>
						<h3 className="text-lg font-semibold text-blue-900">API Key</h3>
					</div>
					<p className="text-blue-700 mb-4">Yeni API anahtarı oluştur.</p>
					<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
						Oluştur
					</button>
				</div>

				<div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📋</span>
						<h3 className="text-lg font-semibold text-green-900">Postman</h3>
					</div>
					<p className="text-green-700 mb-4">Postman collection indir.</p>
					<button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
						İndir
					</button>
				</div>

				<div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">📊</span>
						<h3 className="text-lg font-semibold text-purple-900">API Metrikleri</h3>
					</div>
					<p className="text-purple-700 mb-4">API kullanım istatistikleri.</p>
					<button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
						Görüntüle
					</button>
				</div>

				<div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
					<div className="flex items-center mb-4">
						<span className="text-2xl mr-3">🔧</span>
						<h3 className="text-lg font-semibold text-orange-900">API Testi</h3>
					</div>
					<p className="text-orange-700 mb-4">Endpoint'leri test et.</p>
					<button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
						Test Et
					</button>
				</div>
			</div>
		</div>
	)
}
