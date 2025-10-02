export default function ReportsPage() {
	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">Mali Raporlar</h1>
				<div className="flex space-x-2">
					<select className="border rounded-lg px-3 py-2">
						<option>Bu Ay</option>
						<option>Son 3 Ay</option>
						<option>Bu Yıl</option>
					</select>
					<button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
						Rapor İndir
					</button>
				</div>
			</div>

			{/* Financial Summary */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-green-100 rounded-lg">
							<span className="text-2xl">💰</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Toplam Gelir</p>
							<p className="text-2xl font-bold text-green-600">₺456,780</p>
							<p className="text-sm text-green-600">+15.2%</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-red-100 rounded-lg">
							<span className="text-2xl">💸</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Toplam Gider</p>
							<p className="text-2xl font-bold text-red-600">₺234,560</p>
							<p className="text-sm text-red-600">+8.7%</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-blue-100 rounded-lg">
							<span className="text-2xl">📊</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Net Kâr</p>
							<p className="text-2xl font-bold text-blue-600">₺222,220</p>
							<p className="text-sm text-green-600">+22.1%</p>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<div className="flex items-center">
						<div className="p-2 bg-purple-100 rounded-lg">
							<span className="text-2xl">📈</span>
						</div>
						<div className="ml-4">
							<p className="text-sm text-gray-600">Kâr Marjı</p>
							<p className="text-2xl font-bold text-purple-600">48.6%</p>
							<p className="text-sm text-green-600">+3.2%</p>
						</div>
					</div>
				</div>
			</div>

			{/* Report Categories */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-semibold mb-4">📋 Gelir-Gider Raporu</h3>
					<p className="text-gray-600 mb-4">Aylık gelir ve gider analizi</p>
					<button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
						Raporu Görüntüle
					</button>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-semibold mb-4">💼 Bilanço Raporu</h3>
					<p className="text-gray-600 mb-4">Varlık ve yükümlülükler</p>
					<button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
						Raporu Görüntüle
					</button>
				</div>

				<div className="bg-white p-6 rounded-xl shadow-sm border">
					<h3 className="text-lg font-semibold mb-4">📊 Nakit Akış Raporu</h3>
					<p className="text-gray-600 mb-4">Nakit giriş ve çıkışları</p>
					<button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
						Raporu Görüntüle
					</button>
				</div>
			</div>

			{/* Recent Reports */}
			<div className="bg-white rounded-xl shadow-sm border">
				<div className="p-6 border-b">
					<h3 className="text-lg font-semibold">Son Oluşturulan Raporlar</h3>
				</div>
				<div className="p-6">
					<div className="space-y-4">
						{[
							{ name: 'Ocak 2024 Gelir-Gider Raporu', date: '2024-02-01', type: 'PDF', size: '2.3 MB' },
							{ name: 'Q4 2023 Bilanço Raporu', date: '2024-01-15', type: 'Excel', size: '1.8 MB' },
							{ name: 'Aralık 2023 Nakit Akış', date: '2024-01-05', type: 'PDF', size: '1.5 MB' },
						].map((report, i) => (
							<div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
								<div>
									<p className="font-medium">{report.name}</p>
									<p className="text-sm text-gray-500">{report.date} • {report.type} • {report.size}</p>
								</div>
								<button className="text-indigo-600 hover:text-indigo-900">İndir</button>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
