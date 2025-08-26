import Image from "next/image";
import Link from "next/link";
import { findProductBySlug, products } from "../../../data/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">Ürün bulunamadı</div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <div>
          <Image src={product.image} alt={product.title} width={800} height={600} className="w-full h-auto rounded-xl object-cover" sizes="(min-width: 768px) 50vw, 100vw" priority />
        </div>
        <div>
          <div className="text-xs text-gray-500">{product.category}</div>
          <h1 className="text-3xl font-bold mt-1">{product.title}</h1>
          <div className="text-2xl font-extrabold mt-3">₺{product.price}</div>
          <p className="text-gray-700 mt-4">{product.description}</p>
          <div className="mt-6 flex gap-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg">Sepete Ekle</button>
            <Link href="/products" className="px-5 py-3 rounded-lg border font-semibold">Diğer Ürünler</Link>
          </div>
        </div>
      </div>
    </>
  );
}
