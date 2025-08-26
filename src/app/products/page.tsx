import Image from "next/image";
import Link from "next/link";
import { products } from "../../data/products";

export default function ProductsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">Ürünler</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
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
