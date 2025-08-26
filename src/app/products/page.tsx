import Image from "next/image";
import Link from "next/link";

// API'den ürünleri getir
async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store' // Her zaman güncel veri al
    });
    
    if (!response.ok) {
      throw new Error('Ürünler yüklenemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
    // Fallback olarak statik veri döndür
    return [
      {
        id: "1",
        title: "Naruto Uzumaki Figürü",
        slug: "naruto-uzumaki-figur",
        price: 299,
        category: "Anime",
        image: "https://images.unsplash.com/photo-1613336026275-d6d0d1a82561?q=80&w=800&auto=format&fit=crop",
        description: "Naruto Uzumaki karakterinin detaylı 3D baskı figürü."
      },
      {
        id: "2", 
        title: "Link Zelda Figürü",
        slug: "link-zelda-figur",
        price: 349,
        category: "Oyun",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
        description: "The Legend of Zelda serisinden Link karakteri figürü."
      },
      {
        id: "3",
        title: "Spider-Man Figürü", 
        slug: "spider-man-figur",
        price: 279,
        category: "Film",
        image: "https://images.unsplash.com/photo-1601582585289-250ed79444c4?q=80&w=800&auto=format&fit=crop",
        description: "Marvel evreninden Spider-Man karakteri figürü."
      },
      {
        id: "4",
        title: "Goku Super Saiyan Figürü",
        slug: "goku-super-saiyan",
        price: 399,
        category: "Anime", 
        image: "https://images.unsplash.com/photo-1615828500058-cf2f8e6f3f6a?q=80&w=800&auto=format&fit=crop",
        description: "Dragon Ball serisinden Goku Super Saiyan formu figürü."
      }
    ];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">Ürünler</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="p-4 rounded-xl border hover:shadow-md transition-shadow block">
            <Image src={p.image} alt={p.title} width={600} height={400} className="w-full h-40 object-cover rounded-lg mb-4" />
            <div className="text-xs text-gray-500">{p.category}</div>
            <h3 className="font-semibold">{p.title}</h3>
            <div className="mt-2 font-bold">₺{p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
