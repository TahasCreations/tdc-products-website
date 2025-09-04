'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { PageLoader } from '../../../components/LoadingSpinner';
import Link from 'next/link';

// Client-side Supabase client
const createClientSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

const categories = ['Genel', 'Anime', 'Gaming', 'Film', 'Teknoloji', 'Lifestyle'] as const;

// Popüler etiket önerileri
const popularTags = ['figür', 'anime', 'gaming', 'koleksiyon', 'nostalji', 'popüler kültür', 'oyun', 'film', 'manga', 'cosplay'] as const;

// Etiket kategorileri
const tagCategories = {
  'figür': ['anime figürü', 'gaming figürü', 'film figürü', 'manga figürü', 'cosplay figürü'],
  'anime': ['shounen', 'shoujo', 'seinen', 'josei', 'mecha', 'fantasy', 'romance', 'action'],
  'gaming': ['rpg', 'fps', 'strategy', 'adventure', 'puzzle', 'simulation', 'sports', 'racing'],
  'koleksiyon': ['limited edition', 'exclusive', 'vintage', 'modern', 'rare', 'common', 'premium'],
  'nostalji': ['90s', '80s', 'retro', 'classic', 'vintage', 'old school', 'throwback'],
  'popüler kültür': ['trending', 'viral', 'meme', 'influencer', 'social media', 'celebrities'],
  'oyun': ['board game', 'card game', 'video game', 'mobile game', 'tabletop', 'arcade'],
  'film': ['action', 'comedy', 'drama', 'horror', 'sci-fi', 'romance', 'thriller', 'documentary'],
  'manga': ['shounen', 'shoujo', 'seinen', 'josei', 'mecha', 'fantasy', 'romance', 'action'],
  'cosplay': ['anime cosplay', 'gaming cosplay', 'film cosplay', 'original', 'group cosplay']
} as const;

// Başlık önerileri
const titleSuggestions = [
  'En İyi Anime Figürleri 2024',
  'Gaming Koleksiyonunuzu Nasıl Başlatırsınız',
  'Nostalji: 90\'ların Unutulmaz Oyunları',
  'Popüler Kültür ve Figür Koleksiyonculuğu',
  'Manga\'dan Figüre: Koleksiyon Rehberi',
  'Cosplay ve Koleksiyon: Sanatın İki Yüzü',
  'Teknoloji ve Gaming: Geleceğin Oyunları',
  'Lifestyle: Koleksiyonculuk Bir Yaşam Tarzı'
] as const;

export default function WriteBlogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: 'Genel' as const,
    tags: [] as string[],
    tagInput: ''
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [draftCount, setDraftCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [showTagCategories, setShowTagCategories] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  // Otomatik kaydetme - debounced
  useEffect(() => {
    if (blog.title || blog.content) {
      const timer = setTimeout(() => {
        localStorage.setItem('blog-draft', JSON.stringify(blog));
        setLastSaved(new Date());
      }, 2000); // 2 saniye sonra kaydet

      return () => clearTimeout(timer);
    }
  }, [blog.title, blog.content]); // Sadece title ve content değiştiğinde

  // Sayfa yüklendiğinde draft'ı yükle
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setBlog(draft);
        // Draft sayısını hesapla
        const wordCount = (draft.content || '').split(/\s+/).filter(word => word.length > 0).length;
        setDraftCount(wordCount);
      } catch (error) {
        console.error('Draft yüklenirken hata:', error);
      }
    }
  }, []);

  const handleTagAdd = () => {
    const trimmedTag = blog.tagInput.trim().toLowerCase();
    if (trimmedTag && !blog.tags.includes(trimmedTag)) {
      // Maksimum 10 etiket
      if (blog.tags.length >= 10) {
        alert('Maksimum 10 etiket ekleyebilirsiniz');
        return;
      }
      setBlog(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
        tagInput: ''
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Etiket önerileri
  const getTagSuggestions = (input: string) => {
    if (!input.trim()) {
      setTagSuggestions([]);
      return;
    }
    
    const suggestions: string[] = [];
    const inputLower = input.toLowerCase();
    
    // Ana etiketlerden öneri
    popularTags.forEach(tag => {
      if (tag.includes(inputLower) && !blog.tags.includes(tag)) {
        suggestions.push(tag);
      }
    });
    
    // Kategori etiketlerinden öneri
    Object.values(tagCategories).flat().forEach(tag => {
      if (tag.includes(inputLower) && !blog.tags.includes(tag) && !suggestions.includes(tag)) {
        suggestions.push(tag);
      }
    });
    
    // Benzer etiketler
    blog.tags.forEach(existingTag => {
      Object.values(tagCategories).flat().forEach(tag => {
        if (tag.includes(existingTag) && !blog.tags.includes(tag) && !suggestions.includes(tag)) {
          suggestions.push(tag);
        }
      });
    });
    
    setTagSuggestions(suggestions.slice(0, 8)); // Maksimum 8 öneri
  };

  const clearDraft = () => {
    localStorage.removeItem('blog-draft');
    setBlog({
      title: '',
      content: '',
      excerpt: '',
      image: '',
      category: 'Genel' as const,
      tags: [],
      tagInput: ''
    });
    setLastSaved(null);
  };

  // Memoized değerler
  const characterCount = blog.content.length;
  const wordCount = blog.content.split(/\s+/).filter(word => word.length > 0).length;
  const paragraphCount = blog.content.split('\n\n').filter(p => p.trim().length > 0).length;
  const readTime = Math.ceil(characterCount / 200);
  const commentEstimate = Math.ceil(characterCount / 500);
  
  // Otomatik özet oluşturma
  const generateExcerpt = (content: string) => {
    if (!content) return '';
    // HTML etiketlerini kaldır ve ilk 150 karakteri al
    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    return cleanContent.length > 150 ? cleanContent.substring(0, 150) + '...' : cleanContent;
  };
  
  // Otomatik özet güncelleme
  useEffect(() => {
    if (!blog.excerpt && blog.content) {
      const autoExcerpt = generateExcerpt(blog.content);
      setBlog(prev => ({ ...prev, excerpt: autoExcerpt }));
    }
  }, [blog.content, blog.excerpt]);

  // Gerçek zamanlı validasyon
  useEffect(() => {
    const errors: {[key: string]: string} = {};
    
    // Başlık validasyonu
    if (blog.title.trim()) {
      if (blog.title.length < 10) {
        errors.title = 'Başlık en az 10 karakter olmalıdır';
      } else if (blog.title.length > 200) {
        errors.title = 'Başlık en fazla 200 karakter olabilir';
      }
    }
    
    // İçerik validasyonu
    if (blog.content.trim()) {
      if (blog.content.length < 100) {
        errors.content = 'İçerik en az 100 karakter olmalıdır';
      }
    }
    
    // Etiket validasyonu
    if (blog.tags.length > 10) {
      errors.tags = 'Maksimum 10 etiket ekleyebilirsiniz';
    }
    
    setValidationErrors(errors);
  }, [blog.title, blog.content, blog.tags]);

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: Kaydet
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const newDraft = {
          ...blog,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('blog-draft', JSON.stringify(newDraft));
        setLastSaved(new Date());
        setShowShortcuts(true);
        setTimeout(() => setShowShortcuts(false), 2000);
      }
      
      // Ctrl/Cmd + Enter: Gönder
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!loading && Object.keys(validationErrors).length === 0 && characterCount >= 100 && blog.title.length >= 10) {
          handleSubmit(e as any);
        }
      }
      
      // Ctrl/Cmd + K: Kategori değiştir
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const currentIndex = categories.indexOf(blog.category);
        const nextIndex = (currentIndex + 1) % categories.length;
        setBlog(prev => ({ ...prev, category: categories[nextIndex] }));
      }
      
      // Ctrl/Cmd + T: Etiket ekleme alanına odaklan
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const tagInput = document.querySelector('input[placeholder*="Etiket"]') as HTMLInputElement;
        if (tagInput) tagInput.focus();
      }
      
      // Ctrl/Cmd + ?: Kısayol yardımını göster/gizle
      if ((e.ctrlKey || e.metaKey) && e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [blog, loading, validationErrors, characterCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gelişmiş validasyon
    if (!blog.title.trim()) {
      alert('Lütfen blog başlığını girin');
      return;
    }
    
    if (blog.title.length < 10) {
      alert('Blog başlığı en az 10 karakter olmalıdır');
      return;
    }
    
    if (!blog.content.trim()) {
      alert('Lütfen blog içeriğini girin');
      return;
    }
    
    if (blog.content.length < 100) {
      alert('Blog içeriği en az 100 karakter olmalıdır');
      return;
    }
    
    if (blog.title.length > 200) {
      alert('Blog başlığı en fazla 200 karakter olabilir');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...blog,
          author: user?.user_metadata?.full_name || user?.email || 'Anonim',
          user_id: user?.id
        }),
      });

      if (response.ok) {
        alert('Blog yazınız başarıyla gönderildi! Admin onayından sonra yayınlanacak.');
        clearDraft(); // Draft&apos;ı temizle
        router.push('/blog');
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert('Blog gönderilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <PageLoader text="Yönlendiriliyor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Yaz</h1>
              <p className="text-gray-600 mt-2">Düşüncelerinizi paylaşın, blog yazınız onaylandıktan sonra yayınlanacak</p>
            </div>
            <Link
              href="/blog"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Blog&apos;a Dön
            </Link>
          </div>
        </div>

                 {/* Blog Form */}
         <div className="bg-white rounded-2xl shadow-lg p-8">
           {/* Kısayol Bildirimi */}
           {showShortcuts && (
             <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
               <div className="flex items-center gap-2 text-green-700">
                 <i className="ri-check-line text-xl"></i>
                 <span className="font-medium">Kısayol kullanıldı!</span>
                 <span className="text-sm">Draft kaydedildi</span>
               </div>
             </div>
           )}
          <form onSubmit={handleSubmit} className="space-y-6">
                         {/* Title */}
             <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-sm font-medium text-gray-700">
                   Blog Başlığı * ({blog.title.length}/200)
                 </label>
                 <div className="flex items-center gap-2">
                   <div className="w-24 bg-gray-200 rounded-full h-2">
                     <div 
                       className={`h-2 rounded-full transition-all duration-300 ${
                         blog.title.length >= 10 ? 'bg-green-500' : 
                         blog.title.length >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                       }`}
                       style={{ width: `${Math.min((blog.title.length / 10) * 100, 100)}%` }}
                     ></div>
                   </div>
                   <span className="text-xs text-gray-500">
                     {Math.min((blog.title.length / 10) * 100, 100).toFixed(0)}%
                   </span>
                 </div>
               </div>
                              <input
                  type="text"
                  value={blog.title}
                  onChange={(e) => setBlog(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    blog.title.length > 200 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Blog başlığınızı yazın"
                  maxLength={200}
                  required
                />
                               {blog.title.length > 180 && (
                  <p className={`text-xs mt-1 ${blog.title.length > 200 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {blog.title.length > 200 ? 'Başlık çok uzun!' : 'Başlık uzunluğuna dikkat edin'}
                  </p>
                )}
                {validationErrors.title && (
                  <p className="text-xs text-red-600 mt-1">
                    ⚠️ {validationErrors.title}
                  </p>
                )}
             </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
                             <select
                 value={blog.category}
                 onChange={(e) => setBlog(prev => ({ ...prev, category: e.target.value }))}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Görsel URL (Opsiyonel)
              </label>
                             <input
                 type="url"
                 value={blog.image}
                 onChange={(e) => setBlog(prev => ({ ...prev, image: e.target.value }))}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="https://example.com/image.jpg"
               />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özet (Opsiyonel)
              </label>
                             <textarea
                 value={blog.excerpt}
                 onChange={(e) => setBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                 rows={3}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 placeholder="Blog yazınızın kısa özeti (otomatik oluşturulacak)"
               />
              <p className="text-sm text-gray-500 mt-1">
                Boş bırakırsanız, içerikten otomatik olarak oluşturulacak
              </p>
            </div>

                         {/* Tags */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Etiketler ({blog.tags.length}/10)
               </label>
                             <div className="flex gap-2 mb-3">
                                  <input
                    type="text"
                    value={blog.tagInput}
                    onChange={(e) => {
                      setBlog(prev => ({ ...prev, tagInput: e.target.value }));
                      getTagSuggestions(e.target.value);
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Etiket ekleyin ve Enter'a basın"
                  />
                 <button
                   type="button"
                   onClick={handleTagAdd}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                 >
                   Ekle
                 </button>
                 <button
                   type="button"
                   onClick={() => setShowTagCategories(!showTagCategories)}
                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                 >
                   📂 Kategoriler
                 </button>
               </div>
                             {blog.tags.length > 0 && (
                 <div className="flex flex-wrap gap-2">
                                      {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm shadow-sm hover:shadow-md transition-all duration-200"
                      >
                       <span className="text-blue-600">🏷️</span>
                       <span className="font-medium">{tag}</span>
                       <button
                         type="button"
                         onClick={() => handleTagRemove(tag)}
                         className="text-blue-600 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-100"
                         title="Etiketi kaldır"
                       >
                         <i className="ri-close-line"></i>
                       </button>
                     </span>
                   ))}
                                  </div>
                )}
               
                               {validationErrors.tags && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ {validationErrors.tags}
                  </p>
                )}

                {/* Etiket Önerileri */}
                {tagSuggestions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">💡 Etiket önerileri:</p>
                    <div className="flex flex-wrap gap-2">
                      {tagSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            if (blog.tags.length < 10) {
                              setBlog(prev => ({
                                ...prev,
                                tags: [...prev.tags, suggestion]
                              }));
                              setTagSuggestions([]);
                            } else {
                              alert('Maksimum 10 etiket ekleyebilirsiniz');
                            }
                          }}
                          className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-full text-sm transition-colors"
                        >
                          + {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Etiket Kategorileri */}
                {showTagCategories && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">📂 Etiket Kategorileri</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(tagCategories).map(([category, tags]) => (
                        <div key={category} className="space-y-2">
                          <h5 className="font-medium text-sm text-gray-600 capitalize">{category}</h5>
                          <div className="flex flex-wrap gap-1">
                            {tags.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                  if (blog.tags.length < 10 && !blog.tags.includes(tag)) {
                                    setBlog(prev => ({
                                      ...prev,
                                      tags: [...prev.tags, tag]
                                    }));
                                  } else if (blog.tags.includes(tag)) {
                                    alert('Bu etiket zaten ekli');
                                  } else {
                                    alert('Maksimum 10 etiket ekleyebilirsiniz');
                                  }
                                }}
                                disabled={blog.tags.includes(tag)}
                                className={`px-2 py-1 text-xs rounded-full transition-colors ${
                                  blog.tags.includes(tag)
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                                }`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                               {/* Popüler Etiket Önerileri */}
               <div className="mt-3">
                 <p className="text-sm text-gray-600 mb-2">Popüler etiketler:</p>
                 <div className="flex flex-wrap gap-2">
                   {popularTags
                     .filter(tag => !blog.tags.includes(tag))
                     .map((tag, index) => (
                       <button
                         key={tag} // index yerine tag kullan
                         type="button"
                         onClick={() => setBlog(prev => ({
                           ...prev,
                           tags: [...prev.tags, tag]
                         }))}
                         className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                       >
                         + #{tag}
                       </button>
                     )                 )}
               </div>
               
               {/* Başlık Önerileri */}
               {!blog.title && (
                 <div className="mt-3">
                   <p className="text-sm text-gray-600 mb-2">Başlık önerileri:</p>
                   <div className="flex flex-wrap gap-2">
                     {titleSuggestions.map((suggestion) => (
                       <button
                         key={suggestion}
                         type="button"
                         onClick={() => setBlog(prev => ({ ...prev, title: suggestion }))}
                         className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm transition-colors"
                       >
                         💡 {suggestion}
                       </button>
                     ))}
                   </div>
                 </div>
               )}
             </div>
            </div>

                         {/* Content */}
             <div>
               <div className="flex items-center justify-between mb-2">
                 <label className="block text-sm font-medium text-gray-700">
                   Blog İçeriği *
                 </label>
                 <div className="flex items-center gap-2">
                   <div className="w-24 bg-gray-200 rounded-full h-2">
                     <div 
                       className={`h-2 rounded-full transition-all duration-300 ${
                         characterCount >= 100 ? 'bg-green-500' : 
                         characterCount >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                       }`}
                       style={{ width: `${Math.min((characterCount / 100) * 100, 100)}%` }}
                     ></div>
                   </div>
                   <span className="text-xs text-gray-500">
                     {Math.min((characterCount / 100) * 100, 100).toFixed(0)}%
                   </span>
                 </div>
               </div>
                             <textarea
                 value={blog.content}
                 onChange={(e) => setBlog(prev => ({ ...prev, content: e.target.value }))}
                 rows={12}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                 placeholder="Blog yazınızın içeriğini buraya yazın... HTML etiketleri kullanabilirsiniz."
                 required
               />
                             <div className="mt-2 text-sm text-gray-500">
                 <div className="flex items-center justify-between">
                   <div>
                     <p>HTML etiketleri desteklenir. Örnek:</p>
                     <code className="block mt-1 p-2 bg-gray-100 rounded text-xs">
                       &lt;h2&gt;Alt Başlık&lt;/h2&gt;<br/>
                       &lt;p&gt;Paragraf metni&lt;/p&gt;<br/>
                       &lt;strong&gt;Kalın metin&lt;/strong&gt;
                     </code>
                                           {characterCount < 100 && characterCount > 0 && (
                        <p className="text-red-500 mt-2">
                          ⚠️ En az 100 karakter gerekli (şu an: {characterCount})
                        </p>
                      )}
                      {validationErrors.content && (
                        <p className="text-red-500 mt-2">
                          ⚠️ {validationErrors.content}
                        </p>
                      )}
                   </div>
                                                                                <div className="text-right">
                       <div className="text-lg font-semibold text-blue-600">
                         {characterCount.toLocaleString('tr-TR')} karakter
                       </div>
                       <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                         <div>📖 {readTime} dk okuma</div>
                         <div>💬 ~{commentEstimate} yorum</div>
                         <div>📝 {wordCount} kelime</div>
                         <div>📄 {paragraphCount} paragraf</div>
                       </div>
                       <div className="text-xs text-gray-500 mt-1">
                         🏷️ {blog.tags.length}/10 etiket
                       </div>
                     </div>
                   </div>
                 </div>
            </div>

            {/* Draft Info and Submit Button */}
            <div className="pt-4">
                             {lastSaved && (
                 <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-green-700">
                       <i className="ri-check-line"></i>
                       <div className="text-sm">
                         <div>Son kaydedilen: {lastSaved.toLocaleTimeString('tr-TR')}</div>
                         <div className="text-xs text-green-600">
                           Draft boyutu: {draftCount} kelime, {characterCount} karakter
                         </div>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button
                         type="button"
                         onClick={() => {
                           const newDraft = {
                             ...blog,
                             savedAt: new Date().toISOString()
                           };
                           localStorage.setItem('blog-draft', JSON.stringify(newDraft));
                           setLastSaved(new Date());
                         }}
                         className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                       >
                         Şimdi Kaydet
                       </button>
                       <button
                         type="button"
                         onClick={clearDraft}
                         className="text-red-600 hover:text-red-700 text-sm font-medium"
                       >
                         Draft&apos;ı Temizle
                       </button>
                     </div>
                   </div>
                 </div>
               )}
              
                             <div className="flex gap-4">
                                 <button
                  type="submit"
                  disabled={loading || Object.keys(validationErrors).length > 0 || characterCount < 100 || blog.title.length < 10}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                    loading || Object.keys(validationErrors).length > 0 || characterCount < 100 || blog.title.length < 10
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {loading ? 'Gönderiliyor...' : 'Blog Yazısını Gönder'}
                </button>
                 <Link
                   href="/blog"
                   className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center"
                 >
                   İptal
                 </Link>
               </div>
                               {(characterCount < 100 || blog.title.length < 10 || Object.keys(validationErrors).length > 0) && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 font-medium mb-2">
                      ⚠️ Blog göndermek için tüm gereksinimleri karşılamanız gerekiyor
                    </p>
                    <ul className="text-xs text-red-600 space-y-1">
                      {Object.keys(validationErrors).map(key => (
                        <li key={key}>• {validationErrors[key]}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </form>
        </div>

                                   {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-blue-600 text-xl mt-1"></i>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Önemli Bilgiler</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Blog yazınız gönderildikten sonra admin onayı bekleyecek</li>
                  <li>• Onaylandıktan sonra blog sayfasında yayınlanacak</li>
                  <li>• Reddedilirse size bilgi verilecek</li>
                  <li>• HTML etiketleri kullanarak zengin içerik oluşturabilirsiniz</li>
                  <li>• Etiketler blog yazınızın kategorize edilmesine yardımcı olur</li>
                  <li>• Başlık: 10-200 karakter, İçerik: minimum 100 karakter</li>
                  <li>• Maksimum 10 etiket ekleyebilirsiniz</li>
                  <li>• Özet boş bırakılırsa otomatik oluşturulur</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Kısayol Yardım */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mt-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <i className="ri-keyboard-line text-purple-600 text-xl mt-1"></i>
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Klavye Kısayolları</h3>
                  <div className="grid grid-cols-2 gap-4 text-purple-800 text-sm">
                    <div>
                      <p className="font-medium mb-2">Temel İşlemler:</p>
                      <ul className="space-y-1">
                        <li>• <kbd className="bg-purple-100 px-2 py-1 rounded">Ctrl/Cmd + S</kbd> Kaydet</li>
                        <li>• <kbd className="bg-purple-100 px-2 py-1 rounded">Ctrl/Cmd + Enter</kbd> Gönder</li>
                        <li>• <kbd className="bg-purple-100 px-2 py-1 rounded">Ctrl/Cmd + ?</kbd> Bu yardımı göster/gizle</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Navigasyon:</p>
                      <ul className="space-y-1">
                        <li>• <kbd className="bg-purple-100 px-2 py-1 rounded">Ctrl/Cmd + K</kbd> Kategori değiştir</li>
                        <li>• <kbd className="bg-purple-100 px-2 py-1 rounded">Ctrl/Cmd + T</kbd> Etiket alanına odaklan</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                {showShortcuts ? 'Gizle' : 'Göster'}
              </button>
            </div>
          </div>
           <div className="flex items-start gap-3">
             <i className="ri-information-line text-blue-600 text-xl mt-1"></i>
             <div>
               <h3 className="font-semibold text-blue-900 mb-2">Önemli Bilgiler</h3>
               <ul className="text-blue-800 text-sm space-y-1">
                 <li>• Blog yazınız gönderildikten sonra admin onayı bekleyecek</li>
                 <li>• Onaylandıktan sonra blog sayfasında yayınlanacak</li>
                 <li>• Reddedilirse size bilgi verilecek</li>
                 <li>• HTML etiketleri kullanarak zengin içerik oluşturabilirsiniz</li>
                 <li>• Etiketler blog yazınızın kategorize edilmesine yardımcı olur</li>
                 <li>• Başlık: 10-200 karakter, İçerik: minimum 100 karakter</li>
                 <li>• Maksimum 10 etiket ekleyebilirsiniz</li>
                 <li>• Özet boş bırakılırsa otomatik oluşturulur</li>
               </ul>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
