export default function AnalyticsPage() {
	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Analitik Dashboard</h1>
				<div className="flex space-x-2">
					<select className="border rounded-lg px-3 py-2">
						<option>Son 7 gün</option>
						<option>Son 30 gün</option>
						<option>Son 3 ay</option>
					</select>
				</div>
			</div>

			{/* KPI Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<span className="text-2xl">📈</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Toplam Satış</p>
							<p className="text-2xl font-bold text-gray-900">₺124,580</p>
							<p className="text-sm text-green-600">+12.5%</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<span className="text-2xl">📦</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Siparişler</p>
							<p className="text-2xl font-bold text-gray-900">1,247</p>
							<p className="text-sm text-green-600">+8.2%</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-purple-100 rounded-lg">
							<span className="text-2xl">👥</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Yeni Müşteriler</p>
							<p className="text-2xl font-bold text-gray-900">89</p>
							<p className="text-sm text-red-600">-2.1%</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-orange-100 rounded-lg">
							<span className="text-2xl">💰</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Ortalama Sipariş</p>
							<p className="text-2xl font-bold text-gray-900">₺99.8</p>
							<p className="text-sm text-green-600">+4.3%</p>
						</div>
					</div>
				</div>
			</div>

			{/* Charts */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-semibold mb-4">Satış Trendi</h3>
					<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
						<p className="text-gray-500">Grafik burada görünecek</p>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-semibold mb-4">Kategori Dağılımı</h3>
					<div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
						<p className="text-gray-500">Pasta grafik burada görünecek</p>
					</div>
				</div>
			</div>

			{/* Recent Activity */}
			<div className="bg-white rounded-xl shadow-sm border">
				<div className="p-6 border-b">
					<h3 className="text-lg font-semibold">Son Aktiviteler</h3>
				</div>
				<div className="p-6">
					<div className="space-y-4">
						{[
							{ time: '2 dk önce', action: 'Yeni sipariş alındı', amount: '₺156.50' },
							{ time: '15 dk önce', action: 'Ürün stoğu güncellendi', amount: '' },
							{ time: '1 saat önce', action: 'Müşteri kaydı tamamlandı', amount: '' },
							{ time: '3 saat önce', action: 'Kargo gönderildi', amount: '₺89.90' },
						].map((item, i) => (
							<div key={i} className="flex items-center justify-between py-2">
								<div>
									<p className="font-medium">{item.action}</p>
									<p className="text-sm text-gray-500">{item.time}</p>
								</div>
								{item.amount && <span className="font-semibold text-green-600">{item.amount}</span>}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
