import Link from 'next/link';
import Image from 'next/image';

const mockBlogPosts = [
  {
    id: '1',
    title: 'E-ticarette Başarılı Olmanın 5 Yolu',
    slug: 'e-ticarette-basarili-olmanin-5-yolu',
    excerpt: 'Online satışlarınızı artırmak için uygulayabileceğiniz etkili stratejiler ve püf noktaları.',
    content: 'E-ticaret dünyasında başarılı olmak için...',
    author: {
      name: 'Ahmet Yılmaz',
      slug: 'ahmet-yilmaz',
      avatar: 'https://via.placeholder.com/50x50/A0D995/FFFFFF?text=AY'
    },
    category: 'E-ticaret',
    tags: ['e-ticaret', 'pazarlama', 'satış'],
    coverImage: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=E-ticaret',
    publishedAt: '2023-10-26',
    readTime: '5 dk',
    views: 1250
  },
  {
    id: '2',
    title: 'Dijital Pazarlamada Yeni Trendler',
    slug: 'dijital-pazarlamada-yeni-trendler',
    excerpt: '2024 yılında dijital pazarlamayı şekillendirecek anahtar trendler ve fırsatlar.',
    content: 'Dijital pazarlama sürekli gelişen bir alan...',
    author: {
      name: 'Ayşe Demir',
      slug: 'ayse-demir',
      avatar: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=AD'
    },
    category: 'Pazarlama',
    tags: ['dijital-pazarlama', 'trendler', '2024'],
    coverImage: 'https://via.placeholder.com/600x400/7C3AED/FFFFFF?text=Marketing',
    publishedAt: '2023-11-15',
    readTime: '7 dk',
    views: 890
  },
  {
    id: '3',
    title: 'Anime Koleksiyonculuğu Rehberi',
    slug: 'anime-koleksiyonculugu-rehberi',
    excerpt: 'Anime figürleri ve koleksiyon ürünleri hakkında bilmeniz gereken her şey.',
    content: 'Anime koleksiyonculuğu giderek popülerleşen bir hobi...',
    author: {
      name: 'Mehmet Can',
      slug: 'mehmet-can',
      avatar: 'https://via.placeholder.com/50x50/FF9F43/FFFFFF?text=MC'
    },
    category: 'Hobi',
    tags: ['anime', 'koleksiyon', 'figür'],
    coverImage: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Anime',
    publishedAt: '2023-12-01',
    readTime: '6 dk',
    views: 2100
  },
  {
    id: '4',
    title: 'Teknoloji ve Yaşam: Akıllı Ev Sistemleri',
    slug: 'teknoloji-ve-yasam-akilli-ev-sistemleri',
    excerpt: 'Akıllı ev teknolojileri ile yaşam kalitenizi nasıl artırabilirsiniz?',
    content: 'Akıllı ev sistemleri artık hayatımızın ayrılmaz bir parçası...',
    author: {
      name: 'Elif Kaya',
      slug: 'elif-kaya',
      avatar: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=EK'
    },
    category: 'Teknoloji',
    tags: ['akıllı-ev', 'teknoloji', 'yaşam'],
    coverImage: 'https://via.placeholder.com/600x400/059669/FFFFFF?text=Smart+Home',
    publishedAt: '2023-12-10',
    readTime: '8 dk',
    views: 1560
  },
  {
    id: '5',
    title: 'Sanat ve Hobi Malzemeleri Seçimi',
    slug: 'sanat-ve-hobi-malzemeleri-secimi',
    excerpt: 'Doğru sanat malzemelerini seçerek yaratıcılığınızı nasıl destekleyebilirsiniz?',
    content: 'Sanat ve hobi malzemeleri seçimi yaratıcı sürecin önemli bir parçası...',
    author: {
      name: 'Zeynep Özkan',
      slug: 'zeynep-ozkan',
      avatar: 'https://via.placeholder.com/50x50/8E44AD/FFFFFF?text=ZO'
    },
    category: 'Sanat',
    tags: ['sanat', 'hobi', 'malzemeler'],
    coverImage: 'https://via.placeholder.com/600x400/FF9F43/FFFFFF?text=Art',
    publishedAt: '2023-12-18',
    readTime: '4 dk',
    views: 980
  },
  {
    id: '6',
    title: 'Hediyelik Ürünlerde Trendler',
    slug: 'hediyelik-urunlerde-trendler',
    excerpt: '2024 yılında popüler olacak hediyelik ürünler ve kişiselleştirme seçenekleri.',
    content: 'Hediyelik ürünler seçimi her zaman özel bir önem taşır...',
    author: {
      name: 'Can Yıldız',
      slug: 'can-yildiz',
      avatar: 'https://via.placeholder.com/50x50/E74C3C/FFFFFF?text=CY'
    },
    category: 'Hediyelik',
    tags: ['hediyelik', 'kişiselleştirme', 'trendler'],
    coverImage: 'https://via.placeholder.com/600x400/E74C3C/FFFFFF?text=Gifts',
    publishedAt: '2023-12-25',
    readTime: '5 dk',
    views: 1200
  }
];

const categories = ['Tümü', 'E-ticaret', 'Pazarlama', 'Hobi', 'Teknoloji', 'Sanat', 'Hediyelik'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TDC Market Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            E-ticaret, teknoloji, hobi ve yaşam konularında güncel içerikler ve uzman görüşleri
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === 'Tümü'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <Link href={`/blog/${mockBlogPosts[0].slug}`}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-square">
                  <Image
                    src={mockBlogPosts[0].coverImage}
                    alt={mockBlogPosts[0].title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                      {mockBlogPosts[0].category}
                    </span>
                    <span className="text-sm text-gray-500">Öne Çıkan</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{mockBlogPosts[0].title}</h2>
                  <p className="text-gray-600 mb-4">{mockBlogPosts[0].excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <img
                        src={mockBlogPosts[0].author.avatar}
                        alt={mockBlogPosts[0].author.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{mockBlogPosts[0].author.name}</span>
                    </div>
                    <span>{mockBlogPosts[0].publishedAt}</span>
                    <span>{mockBlogPosts[0].readTime}</span>
                    <span>{mockBlogPosts[0].views} görüntüleme</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogPosts.slice(1).map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span>{post.author.name}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{post.publishedAt}</span>
                    <span>{post.views} görüntüleme</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Daha Fazla Yazı Yükle
          </button>
        </div>
      </div>
    </div>
  );
}
