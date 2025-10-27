import { notFound } from 'next/navigation';

const mockCollections = {
  'anime-collection': {
    name: 'Anime Koleksiyonu',
    description: 'En popüler anime karakterlerinin figürleri ve aksesuarları'
  },
  'marvel-collection': {
    name: 'Marvel Koleksiyonu',
    description: 'Marvel evreninden karakterler ve özel ürünler'
  },
  'gaming-collection': {
    name: 'Gaming Koleksiyonu',
    description: 'Oyun dünyasından ürünler ve aksesuarlar'
  }
};

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = mockCollections[params.slug as keyof typeof mockCollections];
  
  if (!collection) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{collection.name}</h1>
      <p className="text-gray-600 mb-8">{collection.description}</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">Bu koleksiyondaki ürünler burada listelenecek.</p>
      </div>
    </div>
  );
}