export const dynamic = 'force-static'

export default function AdminDashboard() {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Dashboard</h1>
			<div className="grid md:grid-cols-3 gap-4">
				<div className="p-4 border rounded-lg">Günlük Siparişler: 124</div>
				<div className="p-4 border rounded-lg">Bekleyen Kargolar: 58</div>
				<div className="p-4 border rounded-lg">İade Talepleri: 6</div>
			</div>
		</div>
	)
}
