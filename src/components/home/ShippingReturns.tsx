export default function ShippingReturns() {
	const items = [
		{ icon: '🚚', title: 'Kargo Süreçleri', desc: 'Siparişleriniz 24‑48 saat içinde kargoya verilir.' },
		{ icon: '↩️', title: 'İade Politikası', desc: '14 gün içinde koşulsuz iade hakkı.' },
		{ icon: '📦', title: 'Paketleme', desc: 'Ürünler kırılmaya dayanıklı paketlerle gönderilir.' },
		{ icon: '🔒', title: 'Güvenli Ödeme', desc: '3D Secure ve SSL korumalı işlemler.' },
	];
	return (
		<section className="py-12 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-2xl font-bold mb-6">Kargo & İade Süreçleri</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{items.map((it, i) => (
						<div key={i} className="border rounded-xl p-5 bg-neutral-50">
							<div className="text-2xl mb-2">{it.icon}</div>
							<div className="font-semibold">{it.title}</div>
							<div className="text-sm text-ink-600 mt-1">{it.desc}</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
