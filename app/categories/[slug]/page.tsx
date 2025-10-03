import { notFound } from 'next/navigation';

const mockCategories = {
  'figur-koleksiyon': {
    name: 'Figür & Koleksiyon',
    description: 'Anime figürleri, film karakterleri ve koleksiyon ürünleri'
  },
  'moda-aksesuar': {
    name: 'Moda & Aksesuar',
    description: 'Tişört, hoodie, şapka ve takı koleksiyonları'
  },
  'elektronik': {
    name: 'Elektronik',
    description: 'Kulaklık, akıllı ev ürünleri ve elektronik aksesuarlar'
  },
  'ev-yasam': {
    name: 'Ev & Yaşam',
    description: 'Dekorasyon, aydınlatma ve ev ürünleri'
  },
  'sanat-hobi': {
    name: 'Sanat & Hobi',
    description: 'Boya, tuval ve el sanatları malzemeleri'
  },
  'hediyelik': {
    name: 'Hediyelik',
    description: 'Kişiye özel hediyeler ve özel gün setleri'
  }
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = mockCategories[params.slug as keyof typeof mockCategories];
  
  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
      <p className="text-gray-600 mb-8">{category.description}</p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700">Bu kategorideki ürünler burada listelenecek.</p>
      </div>
    </div>
  );
}