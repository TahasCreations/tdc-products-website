import Header from "@components/Header";
import Footer from "@components/Footer";
import WhatsAppButton from "@components/WhatsAppButton";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-orange-50 to-white">
          <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-orange-600 font-semibold">TDC Products</p>
              <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Hayalinizdeki
                <span className="text-orange-600"> 3D Figürler</span>
              </h1>
              <p className="mt-4 text-gray-600">
                Anime, oyun ve film karakterlerinizi yüksek kaliteli 3D baskı teknolojisi ile gerçeğe
                dönüştürüyoruz. Her detay özenle işlenmiş, kusursuz kalite.
              </p>
              <div className="mt-6 flex gap-3">
                <Link href="/products" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg">Ürünleri Keşfet</Link>
                <Link href="/about" className="bg-gray-900 hover:bg-black text-white font-semibold px-5 py-3 rounded-lg">Hikayemizi Öğren</Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1601582585289-250ed79444c4?q=80&w=1600&auto=format&fit=crop"
                alt="3D baskı figür görseli"
                width={800}
                height={450}
                className="w-full h-auto rounded-2xl object-cover"
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          </div>
        </section>

        {/* Popüler Kategoriler */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold">Popüler Kategoriler</h2>
            <p className="text-gray-600 mt-1">En sevilen karakterlerin yüksek kaliteli 3D baskı versiyonlarını keşfedin</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Anime Figürleri", desc: "Favori anime karakterlerinizin detaylı 3D baskı versiyonları", img: "https://images.unsplash.com/photo-1615828500058-cf2f8e6f3f6a?q=80&w=1200&auto=format&fit=crop" },
                { title: "Oyun Karakterleri", desc: "Popüler oyunların ikonik karakterlerinin koleksiyonu", img: "https://images.unsplash.com/photo-1605901309584-818e25960a8b?q=80&w=1200&auto=format&fit=crop" },
                { title: "Film Karakterleri", desc: "Unutulmaz film karakterlerinin özel koleksiyonu", img: "https://images.unsplash.com/photo-1612036782180-6f0b6b820d4c?q=80&w=1200&auto=format&fit=crop" },
              ].map((c) => (
                <div key={c.title} className="p-6 rounded-xl border hover:shadow-md transition-shadow">
                  <Image
                    src={c.img}
                    alt={c.title}
                    width={600}
                    height={400}
                    className="w-full h-36 object-cover rounded-lg mb-4"
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <h3 className="font-semibold text-lg">{c.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                  <Link href="/products" className="inline-block mt-4 text-orange-600 font-medium">Keşfet</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Öne Çıkan Ürünler */}
        <section className="py-4">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600 mt-1">En popüler ve yeni eklenen ürünlerimizi keşfedin</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className="p-4 rounded-xl border hover:shadow-md transition-shadow block">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={600}
                    height={400}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                  />
                  <div className="text-xs text-gray-500">{p.category}</div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <div className="mt-2 font-bold">₺{p.price}</div>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link href="/products" className="inline-block bg-gray-900 hover:bg-black text-white font-semibold px-5 py-3 rounded-lg">Tüm Ürünleri Gör</Link>
            </div>
          </div>
        </section>

        {/* Özellikler */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
            {[
              { title: "Yüksek Kalite", desc: "En son 3D baskı teknolojisi ile mükemmel detaylar" },
              { title: "Hızlı Kargo", desc: "Türkiye geneline ücretsiz ve hızlı teslimat" },
              { title: "7/24 Destek", desc: "Her zaman yanınızdayız, sorularınız için bize yazın" },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-xl border">
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
