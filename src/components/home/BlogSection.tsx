'use client';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
}

export default function BlogSection({ posts, onPostClick }: BlogSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900 mb-4">
            Blog & Rehberler
          </h2>
          <p className="text-xl text-ink-600 max-w-2xl mx-auto">
            3D figür dünyasından haberler ve ipuçları
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => onPostClick(post)}
              className="group cursor-pointer bg-white rounded-tdc shadow-tdc hover:shadow-tdc-lg transition-all duration-300 border border-gray-200 hover:border-primary-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary-100 to-accent-100 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-tdc rounded-tdc mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-ink-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-ink-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-ink-500">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-primary-500 text-white px-8 py-4 rounded-tdc font-semibold text-lg hover:bg-primary-600 transition-colors">
            Tüm Yazıları Gör
          </button>
        </div>
      </div>
    </section>
  );
}
