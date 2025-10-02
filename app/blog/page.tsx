export const dynamic = 'force-static'

export default function BlogIndex() {
	const posts = [
		{ slug: 'hos-geldiniz', title: 'Hoş Geldiniz', excerpt: 'TDC Market bloguna hoş geldiniz.' },
	];

	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Blog</h1>
				<a href="/blog/new" className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Yeni Yazı</a>
			</div>
			<ul className="space-y-4">
				{posts.map(p => (
					<li key={p.slug} className="border border-gray-200 rounded-lg p-4">
						<a href={`/blog/${p.slug}`} className="text-lg font-semibold text-indigo-700 hover:underline">{p.title}</a>
						<p className="text-sm text-gray-600 mt-1">{p.excerpt}</p>
					</li>
				))}
			</ul>
		</div>
	)
}
