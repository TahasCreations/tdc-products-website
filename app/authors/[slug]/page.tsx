import AuthorProfile from '../../../src/components/blog/AuthorProfile';

interface AuthorPageProps {
	params: {
		slug: string;
	};
}

export default function AuthorPage({ params }: AuthorPageProps) {
	// Mock author data - gerçek uygulamada API'den gelecek
	const author = {
		id: 'author-1',
		displayName: 'Ahmet Yılmaz',
		slug: params.slug,
		bio: 'Anime figürleri ve koleksiyon konularında uzman. 5 yıldır blog yazıyor ve koleksiyonculuk rehberleri hazırlıyor. Japonya\'da yaşadığı 2 yıl boyunca anime endüstrisini yakından inceleme fırsatı bulmuş, bu deneyimlerini blog yazılarında paylaşıyor.',
		expertise: ['Anime', 'Figür Koleksiyonu', 'Pop Culture', 'Japon Kültürü', 'Oyuncak Tarihi', 'Manga', 'Cosplay'],
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
		},
		achievements: [
			'En Çok Okunan Anime Yazarı 2023',
			'Koleksiyon Rehberi Uzmanı',
			'Anime Expo Konuşmacısı'
		],
		location: 'İstanbul, Türkiye',
		languages: ['Türkçe', 'İngilizce', 'Japonca (Temel)']
	};

	const authorPosts = [
		{
			id: '1',
			title: 'Anime Figürlerinin Tarihi ve Koleksiyonculuk Rehberi',
			slug: 'anime-figurlerinin-tarihi-ve-koleksiyonculuk-rehberi',
			excerpt: 'Anime figürlerinin tarihçesi, koleksiyon yapmanın incelikleri ve kaliteli figür seçme rehberi.',
			publishedAt: '2024-01-15',
			readTime: '8 dakika',
			category: 'Koleksiyon',
			views: 2340,
			likes: 89,
			comments: 23,
			featured: true
		},
		{
			id: '2',
			title: 'En İyi Anime Figür Üreticileri 2024',
			slug: 'en-iyi-anime-figur-ureticileri-2024',
			excerpt: 'Kaliteli anime figürü üreten en iyi markaları ve özelliklerini keşfedin.',
			publishedAt: '2024-01-10',
			readTime: '5 dakika',
			category: 'Rehber',
			views: 1890,
			likes: 67,
			comments: 15,
			featured: false
		},
		{
			id: '3',
			title: 'Figür Bakımı ve Temizliği Nasıl Yapılır?',
			slug: 'figur-bakimi-ve-temizligi',
			excerpt: 'Anime figürlerinizi uzun yıllar korumanın sırları.',
			publishedAt: '2024-01-08',
			readTime: '4 dakika',
			category: 'Bakım',
			views: 1567,
			likes: 45,
			comments: 12,
			featured: false
		},
		{
			id: '4',
			title: 'Limited Edition Figürler: Yatırım Değeri',
			slug: 'limited-edition-figurler-yatirim-degeri',
			excerpt: 'Hangi figürler değer kazanır? Yatırım açısından figür koleksiyonculuğu.',
			publishedAt: '2024-01-05',
			readTime: '6 dakika',
			category: 'Yatırım',
			views: 2100,
			likes: 78,
			comments: 19,
			featured: true
		},
		{
			id: '5',
			title: 'Japonya\'dan Figür Alışverişi: Rehber',
			slug: 'japonyadan-figur-alisveri-rehberi',
			excerpt: 'Japonya\'dan güvenli ve ekonomik figür alışverişi yapmanın yolları.',
			publishedAt: '2024-01-02',
			readTime: '7 dakika',
			category: 'Alışveriş',
			views: 1780,
			likes: 56,
			comments: 14,
			featured: false
		}
	];

	const getCategoryColor = (category: string) => {
		const colors = {
			'Koleksiyon': 'bg-blue-100 text-blue-800',
			'Rehber': 'bg-green-100 text-green-800',
			'Bakım': 'bg-purple-100 text-purple-800',
			'Yatırım': 'bg-orange-100 text-orange-800',
			'Alışveriş': 'bg-pink-100 text-pink-800'
		};
		return colors[category] || 'bg-gray-100 text-gray-800';
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
					<a href="/" className="hover:text-indigo-600">Ana Sayfa</a>
					<span>›</span>
					<a href="/blog" className="hover:text-indigo-600">Blog</a>
					<span>›</span>
					<a href="/authors" className="hover:text-indigo-600">Yazarlar</a>
					<span>›</span>
					<span className="text-gray-900">{author.displayName}</span>
				</nav>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Author Profile */}
					<div className="lg:col-span-1">
						<div className="sticky top-8">
							{/* Main Author Card */}
							<div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
								<div className="text-center mb-6">
									<div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<span className="text-indigo-600 font-bold text-2xl">
											{author.displayName.split(' ').map(n => n[0]).join('')}
										</span>
									</div>
									<h1 className="text-2xl font-bold text-gray-900 mb-2">{author.displayName}</h1>
									<div className="flex items-center justify-center space-x-2 mb-3">
										<span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
											✍️ Blog Yazarı
										</span>
									</div>
									<p className="text-gray-600 text-sm leading-relaxed">{author.bio}</p>
								</div>

								{/* Stats */}
								<div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
									<div className="text-center">
										<div className="text-xl font-bold text-indigo-600">{author.stats.totalPosts}</div>
										<div className="text-xs text-gray-600">Yazı</div>
									</div>
									<div className="text-center">
										<div className="text-xl font-bold text-green-600">{author.stats.totalViews.toLocaleString()}</div>
										<div className="text-xs text-gray-600">Okunma</div>
									</div>
									<div className="text-center">
										<div className="text-xl font-bold text-purple-600">{author.stats.followers}</div>
										<div className="text-xs text-gray-600">Takipçi</div>
									</div>
								</div>

								{/* Follow Button */}
								<button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold mb-4">
									Takip Et
								</button>

								{/* Social Links */}
								<div className="flex justify-center space-x-4 mb-6">
									{Object.entries(author.socialLinks).map(([platform, username]) => {
										const icons = {
											twitter: '🐦',
											instagram: '📷',
											youtube: '📺'
										};
										return (
											<a
												key={platform}
												href="#"
												className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
												title={`${platform}: ${username}`}
											>
												<span className="text-lg">{icons[platform]}</span>
											</a>
										);
									})}
								</div>

								{/* Author Info */}
								<div className="space-y-3 text-sm">
									<div className="flex items-center space-x-2">
										<span className="text-gray-500">📍</span>
										<span className="text-gray-700">{author.location}</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="text-gray-500">📅</span>
										<span className="text-gray-700">
											{new Date(author.authorSince).toLocaleDateString('tr-TR', { 
												year: 'numeric', 
												month: 'long' 
											})} tarihinden beri yazar
										</span>
									</div>
									<div className="flex items-start space-x-2">
										<span className="text-gray-500">🗣️</span>
										<div className="flex flex-wrap gap-1">
											{author.languages.map((lang, index) => (
												<span key={index} className="text-gray-700">
													{lang}{index < author.languages.length - 1 ? ',' : ''}
												</span>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Expertise */}
							<div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
								<h3 className="font-semibold text-gray-900 mb-4">Uzmanlık Alanları</h3>
								<div className="flex flex-wrap gap-2">
									{author.expertise.map((skill, index) => (
										<span 
											key={index}
											className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800"
										>
											{skill}
										</span>
									))}
								</div>
							</div>

							{/* Achievements */}
							<div className="bg-white rounded-xl shadow-sm border p-6">
								<h3 className="font-semibold text-gray-900 mb-4">Başarılar</h3>
								<div className="space-y-2">
									{author.achievements.map((achievement, index) => (
										<div key={index} className="flex items-center space-x-2">
											<span className="text-yellow-500">🏆</span>
											<span className="text-gray-700 text-sm">{achievement}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Author Posts */}
					<div className="lg:col-span-2">
						<div className="flex items-center justify-between mb-8">
							<h2 className="text-2xl font-bold text-gray-900">
								{author.displayName} tarafından yazılan yazılar
							</h2>
							<div className="flex items-center space-x-2">
								<select className="border rounded-lg px-3 py-2 text-sm">
									<option>En Yeni</option>
									<option>En Popüler</option>
									<option>En Çok Okunan</option>
								</select>
							</div>
						</div>

						{/* Featured Posts */}
						<div className="mb-8">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Öne Çıkan Yazılar</h3>
							<div className="grid md:grid-cols-2 gap-6">
								{authorPosts.filter(post => post.featured).map((post) => (
									<a
										key={post.id}
										href={`/blog/${post.slug}`}
										className="group block bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
									>
										<div className="w-full h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
											<div className="text-center text-white">
												<div className="text-3xl mb-2">📚</div>
												<div className="text-sm font-medium">{post.category}</div>
											</div>
										</div>
										<div className="p-6">
											<div className="flex items-center space-x-2 mb-3">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
													{post.category}
												</span>
												<span className="text-gray-500 text-xs">{post.readTime}</span>
											</div>
											<h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-2 line-clamp-2">
												{post.title}
											</h4>
											<p className="text-gray-600 text-sm mb-4 line-clamp-2">
												{post.excerpt}
											</p>
											<div className="flex items-center justify-between text-xs text-gray-500">
												<span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
												<div className="flex items-center space-x-3">
													<span className="flex items-center space-x-1">
														<span>👁️</span>
														<span>{post.views}</span>
													</span>
													<span className="flex items-center space-x-1">
														<span>❤️</span>
														<span>{post.likes}</span>
													</span>
												</div>
											</div>
										</div>
									</a>
								))}
							</div>
						</div>

						{/* All Posts */}
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Tüm Yazılar</h3>
							<div className="space-y-6">
								{authorPosts.map((post) => (
									<a
										key={post.id}
										href={`/blog/${post.slug}`}
										className="group block bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
									>
										<div className="flex items-start space-x-4">
											<div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
												<span className="text-white text-2xl">📄</span>
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center space-x-2 mb-2">
													<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
														{post.category}
													</span>
													<span className="text-gray-500 text-xs">{post.readTime}</span>
													{post.featured && (
														<span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
															⭐ Öne Çıkan
														</span>
													)}
												</div>
												<h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 mb-2 line-clamp-1">
													{post.title}
												</h4>
												<p className="text-gray-600 text-sm mb-3 line-clamp-2">
													{post.excerpt}
												</p>
												<div className="flex items-center justify-between text-xs text-gray-500">
													<span>{new Date(post.publishedAt).toLocaleDateString('tr-TR')}</span>
													<div className="flex items-center space-x-4">
														<span className="flex items-center space-x-1">
															<span>👁️</span>
															<span>{post.views}</span>
														</span>
														<span className="flex items-center space-x-1">
															<span>❤️</span>
															<span>{post.likes}</span>
														</span>
														<span className="flex items-center space-x-1">
															<span>💬</span>
															<span>{post.comments}</span>
														</span>
													</div>
												</div>
											</div>
										</div>
									</a>
								))}
							</div>

							{/* Load More */}
							<div className="text-center mt-8">
								<button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
									Daha Fazla Yazı Yükle
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
