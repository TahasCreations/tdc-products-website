import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "3D Baskı Teknolojisinin Geleceği",
    excerpt: "3D baskı teknolojisinin gelişimi ve figür üretimindeki rolü hakkında detaylı bir analiz.",
    category: "Teknoloji",
    author: "Ahmet Yılmaz",
    date: "15 Ocak 2024",
    readTime: "5 dk",
    image: "https://images.unsplash.com/photo-1601582585289-250ed79444c4?q=80&w=800&auto=format&fit=crop",
    slug: "3d-baski-teknolojisinin-gelecegi"
  },
  {
    id: 2,
    title: "Anime Figürlerinin Tarihi",
    excerpt: "Japon anime figürlerinin ortaya çıkışından günümüze kadar olan gelişim süreci.",
    category: "Anime",
    author: "Elif Kaya",
    date: "12 Ocak 2024",
    readTime: "7 dk",
    image: "https://images.unsplash.com/photo-1615828500058-cf2f8e6f3f6a?q=80&w=800&auto=format&fit=crop",
    slug: "anime-figurlerinin-tarihi"
  },
  {
    id: 3,
    title: "Koleksiyon Figürlerinin Bakımı",
    excerpt: "Değerli figür koleksiyonunuzu uzun yıllar korumak için önemli bakım ipuçları.",
    category: "Bakım",
    author: "Mehmet Demir",
    date: "10 Ocak 2024",
    readTime: "4 dk",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8b?q=80&w=800&auto=format&fit=crop",
    slug: "koleksiyon-figurlerinin-bakimi"
  },
  {
    id: 4,
    title: "Oyun Karakterlerinin Tasarım Süreci",
    excerpt: "Bir oyun karakterinin figüre dönüştürülme sürecinde yaşanan aşamalar.",
    category: "Tasarım",
    author: "Ahmet Yılmaz",
    date: "8 Ocak 2024",
    readTime: "6 dk",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    slug: "oyun-karakterlerinin-tasarim-sureci"
  },
  {
    id: 5,
    title: "Film Figürlerinin Üretim Teknikleri",
    excerpt: "Film karakterlerinin figür olarak üretilmesinde kullanılan özel teknikler.",
    category: "Üretim",
    author: "Elif Kaya",
    date: "5 Ocak 2024",
    readTime: "8 dk",
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6b820d4c?q=80&w=800&auto=format&fit=crop",
    slug: "film-figurlerinin-uretim-teknikleri"
  },
  {
    id: 6,
    title: "Koleksiyonculuk Rehberi",
    excerpt: "Yeni başlayan koleksiyoncular için temel rehber ve öneriler.",
    category: "Rehber",
    author: "Mehmet Demir",
    date: "3 Ocak 2024",
    readTime: "10 dk",
    image: "https://images.unsplash.com/photo-1613336026275-d6d0d1a82561?q=80&w=800&auto=format&fit=crop",
    slug: "koleksiyonculuk-rehberi"
  }
];

const categories = ["Tümü", "Teknoloji", "Anime", "Bakım", "Tasarım", "Üretim", "Rehber"];

export default function BlogPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              3D baskı, figür koleksiyonculuğu ve daha fazlası hakkında güncel yazılarımızı keşfedin.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Blog yazılarında ara..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === "Tümü" 
                      ? "bg-orange-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Öne Çıkan Yazı</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-gray-500 text-sm">{blogPosts[0].readTime}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{blogPosts[0].title}</h3>
                <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <span className="text-sm text-gray-600">{blogPosts[0].author}</span>
                  </div>
                  <span className="text-sm text-gray-500">{blogPosts[0].date}</span>
                </div>
                <Link 
                  href={`/blog/${blogPosts[0].slug}`}
                  className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                >
                  Devamını Oku
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Son Yazılar</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                      <span className="text-xs text-gray-600">{post.author}</span>
                    </div>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Devamını Oku →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Güncel Kalın</h2>
          <p className="text-gray-600 mb-8">
            Yeni blog yazılarımızdan ve ürün güncellemelerimizden haberdar olmak için bültenimize abone olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
