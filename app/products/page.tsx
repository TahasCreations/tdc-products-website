export const dynamic = 'force-static'

const mockCategories = [
	{ slug: 'figur-koleksiyon', name: 'Figür & Koleksiyon' },
	{ slug: 'moda-aksesuar', name: 'Moda & Aksesuar' },
	{ slug: 'elektronik', name: 'Elektronik' },
	{ slug: 'ev-yasam', name: 'Ev & Yaşam' },
	{ slug: 'sanat-hobi', name: 'Sanat & Hobi' },
	{ slug: 'hediyelik', name: 'Hediyelik' },
];

const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
	id: i + 1,
	title: `Ürün ${i + 1}`,
	price: (i + 1) * 99,
	image: '/placeholder.png',
	category: mockCategories[i % mockCategories.length].slug,
}));

export default function AllProductsPage() {
	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Tüm Ürünler</h1>
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Filters */}
				<aside className="md:col-span-1 space-y-4">
					<input placeholder="Ara" className="w-full border border-gray-300 rounded-md px-3 py-2" />
					<select className="w-full border border-gray-300 rounded-md px-3 py-2">
						<option value="">Kategori</option>
						{mockCategories.map(c => (
							<option key={c.slug} value={c.slug}>{c.name}</option>
						))}
					</select>
					<div className="space-y-2">
						<label className="flex items-center space-x-2"><input type="checkbox"/> <span>Stokta</span></label>
						<label className="flex items-center space-x-2"><input type="checkbox"/> <span>Ücretsiz kargo</span></label>
					</div>
				</aside>

				{/* Grid */}
				<section className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
					{mockProducts.map(p => (
						<a key={p.id} href={`/product/${p.id}`} className="border rounded-lg overflow-hidden hover:shadow-md transition">
							<div className="bg-gray-100 aspect-square" />
							<div className="p-3">
								<div className="text-sm text-gray-500 mb-1">{p.category}</div>
								<div className="font-medium">{p.title}</div>
								<div className="text-indigo-600 font-semibold mt-1">{p.price.toLocaleString('tr-TR')} ₺</div>
							</div>
						</a>
					))}
				</section>
			</div>
		</div>
	)
}
