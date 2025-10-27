import AuthorProfile from '../../../../src/components/blog/AuthorProfile';

interface BlogPostPageProps {
	params: {
		slug: string;
	};
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
	// Mock blog post data - gerçek uygulamada API'den gelecek
	const blogPost = {
		id: '1',
		title: 'Anime Figürlerinin Tarihi ve Koleksiyonculuk Rehberi',
		slug: params.slug,
		content: `
			<p>Anime figürleri, Japon pop kültürünün en önemli parçalarından biri haline gelmiştir. Bu detaylı rehberde, anime figürlerinin tarihçesini, koleksiyon yapmanın inceliklerini ve kaliteli figürleri nasıl seçeceğinizi öğreneceksiniz.</p>
			
			<h2>Anime Figürlerinin Tarihi</h2>
			<p>Anime figürlerinin kökenleri 1960'lara kadar uzanır. İlk anime figürleri basit plastik oyuncaklar olarak başlamış, zamanla sanat eserlerine dönüşmüştür.</p>
			
			<h3>1960-1980: Başlangıç Dönemi</h3>
			<p>Bu dönemde figürler daha çok çocuk oyuncağı olarak görülüyordu. Malzeme kalitesi düşük, detaylar sınırlıydı.</p>
			
			<h3>1980-2000: Gelişim Dönemi</h3>
			<p>Anime endüstrisinin büyümesiyle birlikte figür kalitesi de arttı. İlk kaliteli PVC figürler bu dönemde üretilmeye başlandı.</p>
			
			<h3>2000-Günümüz: Altın Çağ</h3>
			<p>Günümüzde anime figürleri gerçek sanat eserleri haline gelmiştir. Detaylar, boyama kalitesi ve poz çeşitliliği inanılmaz seviyelere ulaşmıştır.</p>
			
			<h2>Koleksiyon Yapma Rehberi</h2>
			<p>Anime figürü koleksiyonu yapmak hem keyifli hem de değerli bir hobi. İşte başlangıç için ipuçları:</p>
			
			<h3>1. Bütçe Belirleme</h3>
			<p>Figür fiyatları çok geniş bir aralıkta değişir. Aylık bütçenizi belirleyin ve ona sadık kalın.</p>
			
			<h3>2. Kalite vs Miktar</h3>
			<p>Az sayıda kaliteli figür, çok sayıda düşük kaliteli figürden daha değerlidir.</p>
			
			<h3>3. Saklama Koşulları</h3>
			<p>Figürlerinizi güneş ışığından, nemden ve tozdan koruyun. Cam vitrinler ideal saklama yerleridir.</p>
			
			<h2>Kaliteli Figür Nasıl Seçilir?</h2>
			<p>Kaliteli bir figür seçerken dikkat edilmesi gereken faktörler:</p>
			
			<ul>
				<li><strong>Üretici:</strong> Good Smile Company, Kotobukiya, Alter gibi tanınmış markalar</li>
				<li><strong>Malzeme:</strong> PVC ve ABS plastik en kaliteli malzemelerdir</li>
				<li><strong>Boyama:</strong> Temiz, düzgün ve detaylı boyama</li>
				<li><strong>Poz:</strong> Karaktere uygun ve dinamik pozlar</li>
				<li><strong>Aksesuarlar:</strong> Zengin aksesuar seçenekleri</li>
			</ul>
			
			<h2>Sonuç</h2>
			<p>Anime figürü koleksiyonculuğu, sabır, araştırma ve tutku gerektiren bir hobi. Doğru yaklaşımla hem keyifli vakit geçirebilir hem de değerli bir koleksiyon oluşturabilirsiniz.</p>
		`,
		excerpt: 'Anime figürlerinin tarihçesi, koleksiyon yapmanın incelikleri ve kaliteli figür seçme rehberi.',
		publishedAt: '2024-01-15',
		readTime: '8 dakika',
		category: 'Koleksiyon',
		tags: ['anime', 'figür', 'koleksiyon', 'rehber'],
		views: 2340,
		likes: 89,
		comments: 23,
		author: {
			id: 'author-1',
			displayName: 'Ahmet Yılmaz',
			slug: 'ahmet-yilmaz',
			bio: 'Anime figürleri ve koleksiyon konularında uzman. 5 yıldır blog yazıyor ve koleksiyonculuk rehberleri hazırlıyor.',
			expertise: ['Anime', 'Figür Koleksiyonu', 'Pop Culture', 'Japon Kültürü', 'Oyuncak Tarihi'],
			socialLinks: {
				twitter: '@ahmetyilmaz',
				instagram: 'ahmet_collections',
				youtube: 'AhmetCollector'
			},
			authorSince: '2019-03-15',
			avatar: null,
			stats: {
				totalPosts: 24,
				totalViews: 45680,
				followers: 1250
			}
		}
	};

	const relatedPosts = [
		{
			id: '2',
			title: 'En İyi Anime Figür Üreticileri 2024',
			slug: 'en-iyi-anime-figur-ureticileri-2024',
			excerpt: 'Kaliteli anime figürü üreten en iyi markaları ve özelliklerini keşfedin.',
			publishedAt: '2024-01-10',
			readTime: '5 dakika',
			category: 'Rehber'
		},
		{
			id: '3',
			title: 'Figür Bakımı ve Temizliği Nasıl Yapılır?',
			slug: 'figur-bakimi-ve-temizligi',
			excerpt: 'Anime figürlerinizi uzun yıllar korumanın sırları.',
			publishedAt: '2024-01-08',
			readTime: '4 dakika',
			category: 'Bakım'
		},
		{
			id: '4',
			title: 'Limited Edition Figürler: Yatırım Değeri',
			slug: 'limited-edition-figurler-yatirim-degeri',
			excerpt: 'Hangi figürler değer kazanır? Yatırım açısından figür koleksiyonculuğu.',
			publishedAt: '2024-01-05',
			readTime: '6 dakika',
			category: 'Yatırım'
		}
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
					<a href="/" className="hover:text-indigo-600">Ana Sayfa</a>
					<span>›</span>
					<a href="/blog" className="hover:text-indigo-600">Blog</a>
					<span>›</span>
					<span className="text-gray-900">{blogPost.category}</span>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2">
						{/* Article Header */}
						<article className="bg-white rounded-xl shadow-sm border overflow-hidden">
							{/* Featured Image */}
							<div className="w-full h-64 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
								<div className="text-center text-white">
									<div className="text-6xl mb-4">🎭</div>
									<h1 className="text-2xl font-bold">Anime Figür Koleksiyonu</h1>
								</div>
							</div>

							{/* Article Content */}
							<div className="p-8">
								{/* Article Meta */}
								<div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
									<div className="flex items-center space-x-4">
										<span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
											{blogPost.category}
										</span>
										<span className="text-gray-500 text-sm">{blogPost.readTime} okuma</span>
										<span className="text-gray-500 text-sm">
											{new Date(blogPost.publishedAt).toLocaleDateString('tr-TR')}
										</span>
									</div>
									<div className="flex items-center space-x-4 text-sm text-gray-500">
										<span className="flex items-center space-x-1">
											<span>👁️</span>
											<span>{blogPost.views.toLocaleString()}</span>
										</span>
										<span className="flex items-center space-x-1">
											<span>❤️</span>
											<span>{blogPost.likes}</span>
										</span>
										<span className="flex items-center space-x-1">
											<span>💬</span>
											<span>{blogPost.comments}</span>
										</span>
									</div>
								</div>

								{/* Article Title */}
								<h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
									{blogPost.title}
								</h1>

								{/* Article Content */}
								<div 
									className="prose prose-lg max-w-none"
									dangerouslySetInnerHTML={{ __html: blogPost.content }}
								/>

								{/* Tags */}
								<div className="mt-8 pt-6 border-t border-gray-200">
									<div className="flex flex-wrap gap-2">
										{blogPost.tags.map((tag, index) => (
											<a
												key={index}
												href={`/blog/tag/${tag}`}
												className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
											>
												#{tag}
											</a>
										))}
									</div>
								</div>

								{/* Social Share */}
								<div className="mt-6 pt-6 border-t border-gray-200">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-4">
											<span className="text-gray-700 font-medium">Paylaş:</span>
											<button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
												<span>🐦</span>
												<span>Twitter</span>
											</button>
											<button className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">
												<span>📘</span>
												<span>Facebook</span>
											</button>
											<button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
												<span>💬</span>
												<span>WhatsApp</span>
											</button>
										</div>
										<div className="flex items-center space-x-2">
											<button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
												<span className="text-xl">❤️</span>
											</button>
											<button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
												<span className="text-xl">🔖</span>
											</button>
										</div>
									</div>
								</div>
							</div>
						</article>

						{/* Author Profile */}
						<div className="mt-8">
							<AuthorProfile 
								author={blogPost.author}
								size="large"
								showStats={true}
								showSocial={true}
							/>
						</div>

						{/* Comments Section */}
						<div className="mt-8 bg-white rounded-xl shadow-sm border p-8">
							<h3 className="text-xl font-bold text-gray-900 mb-6">
								Yorumlar ({blogPost.comments})
							</h3>
							
							{/* Comment Form */}
							<div className="mb-8 p-6 bg-gray-50 rounded-lg">
								<h4 className="font-semibold text-gray-900 mb-4">Yorum Yap</h4>
								<textarea
									rows={4}
									className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
									placeholder="Düşüncelerinizi paylaşın..."
								/>
								<div className="mt-4 flex justify-end">
									<button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
										Yorum Gönder
									</button>
								</div>
							</div>

							{/* Sample Comments */}
							<div className="space-y-6">
								<div className="flex space-x-4">
									<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
										<span className="text-green-600 font-semibold">MK</span>
									</div>
									<div className="flex-1">
										<div className="flex items-center space-x-2 mb-2">
											<span className="font-semibold text-gray-900">Mehmet K.</span>
											<span className="text-gray-500 text-sm">2 gün önce</span>
										</div>
										<p className="text-gray-700">
											Çok detaylı ve faydalı bir yazı olmuş. Özellikle kalite kriterleri kısmı çok işime yaradı. Teşekkürler!
										</p>
										<div className="mt-2 flex items-center space-x-4 text-sm">
											<button className="text-gray-500 hover:text-indigo-600">👍 5</button>
											<button className="text-gray-500 hover:text-indigo-600">Yanıtla</button>
										</div>
									</div>
								</div>

								<div className="flex space-x-4">
									<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
										<span className="text-purple-600 font-semibold">AS</span>
									</div>
									<div className="flex-1">
										<div className="flex items-center space-x-2 mb-2">
											<span className="font-semibold text-gray-900">Ayşe S.</span>
											<span className="text-gray-500 text-sm">1 gün önce</span>
										</div>
										<p className="text-gray-700">
											Yeni başlayan biri olarak bu rehber tam aradığım şeydi. Hangi markalardan başlamam gerektiği konusunda fikir sahibi oldum.
										</p>
										<div className="mt-2 flex items-center space-x-4 text-sm">
											<button className="text-gray-500 hover:text-indigo-600">👍 3</button>
											<button className="text-gray-500 hover:text-indigo-600">Yanıtla</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						{/* Author Mini Profile */}
						<div className="mb-8">
							<AuthorProfile 
								author={blogPost.author}
								size="small"
								showStats={false}
								showSocial={true}
							/>
						</div>

						{/* Related Posts */}
						<div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
							<h3 className="text-lg font-bold text-gray-900 mb-4">İlgili Yazılar</h3>
							<div className="space-y-4">
								{relatedPosts.map((post) => (
									<a
										key={post.id}
										href={`/blog/${post.slug}`}
										className="block group"
									>
										<div className="p-4 rounded-lg border border-gray-200 group-hover:border-indigo-300 group-hover:shadow-md transition-all">
											<h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-2 line-clamp-2">
												{post.title}
											</h4>
											<p className="text-gray-600 text-sm mb-3 line-clamp-2">
												{post.excerpt}
											</p>
											<div className="flex items-center justify-between text-xs text-gray-500">
												<span className="bg-gray-100 px-2 py-1 rounded-full">
													{post.category}
												</span>
												<span>{post.readTime}</span>
											</div>
										</div>
									</a>
								))}
							</div>
						</div>

						{/* Newsletter */}
						<div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
							<h3 className="text-lg font-bold mb-2">Blog Güncellemeleri</h3>
							<p className="text-indigo-100 text-sm mb-4">
								Yeni yazılarımızdan haberdar olmak için e-posta listemize katılın.
							</p>
							<div className="space-y-3">
								<input
									type="email"
									placeholder="E-posta adresiniz"
									className="w-full px-4 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
								/>
								<button className="w-full bg-white text-indigo-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
									Abone Ol
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
