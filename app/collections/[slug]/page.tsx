export const dynamic = 'force-static'

interface Params { params: { slug: string } }

export default function CollectionPage({ params }: Params) {
	const { slug } = params
	const title = slug.replace(/-/g, ' ')

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-4">Koleksiyon: {title}</h1>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<a key={i} href={`/product/${slug}-${i+1}`} className="border rounded-lg overflow-hidden hover:shadow-md transition">
						<div className="bg-gray-100 aspect-square" />
						<div className="p-3">
							<div className="font-medium">Ürün {i+1}</div>
							<div className="text-indigo-600 font-semibold mt-1">{((i+1)*199).toLocaleString('tr-TR')} ₺</div>
						</div>
					</a>
				))}
			</div>
		</div>
	)
}
