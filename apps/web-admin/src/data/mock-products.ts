export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  brand?: string;
  price?: number;
  cost?: number;
  color?: string;
  size?: string;
  material?: string;
  targetAudience?: 'MEN' | 'WOMEN' | 'CHILDREN' | 'UNISEX' | 'ALL';
  occasion?: 'CASUAL' | 'FORMAL' | 'SPORTS' | 'PARTY' | 'WORK' | 'HOME';
  season?: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'ALL_SEASON';
  tags?: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'En yeni Samsung Galaxy S24 Ultra akıllı telefon. 200MP kamera, S Pen desteği ve güçlü performans.',
    category: 'electronics',
    brand: 'Samsung',
    price: 45000,
    cost: 35000,
    color: 'Siyah',
    material: 'Metal',
    targetAudience: 'ALL',
    occasion: 'ALL',
    season: 'ALL_SEASON',
    tags: ['telefon', 'samsung', 'android', 'akıllı'],
    status: 'ACTIVE',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Nike Air Max 270 Erkek Spor Ayakkabı',
    description: 'Rahat ve şık Nike Air Max 270 erkek spor ayakkabısı. Günlük kullanım için ideal.',
    category: 'clothing',
    brand: 'Nike',
    price: 2500,
    cost: 1800,
    color: 'Beyaz',
    size: '42',
    material: 'Kumaş',
    targetAudience: 'MEN',
    occasion: 'SPORTS',
    season: 'ALL_SEASON',
    tags: ['ayakkabı', 'nike', 'spor', 'erkek'],
    status: 'ACTIVE',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z'
  },
  {
    id: '3',
    title: 'Zara Kadın Kış Montu',
    description: 'Şık ve sıcak Zara kadın kış montu. Soğuk havalarda mükemmel koruma sağlar.',
    category: 'clothing',
    brand: 'Zara',
    price: 1200,
    cost: 800,
    color: 'Koyu Mavi',
    size: 'M',
    material: 'Polyester',
    targetAudience: 'WOMEN',
    occasion: 'CASUAL',
    season: 'WINTER',
    tags: ['mont', 'kadın', 'kış', 'zara'],
    status: 'ACTIVE',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Apple MacBook Pro 14" M3',
    description: 'Güçlü M3 işlemcili Apple MacBook Pro 14 inç laptop. Profesyonel kullanım için ideal.',
    category: 'electronics',
    brand: 'Apple',
    price: 55000,
    cost: 45000,
    color: 'Gümüş',
    material: 'Alüminyum',
    targetAudience: 'ALL',
    occasion: 'WORK',
    season: 'ALL_SEASON',
    tags: ['laptop', 'apple', 'macbook', 'profesyonel'],
    status: 'ACTIVE',
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z'
  },
  {
    id: '5',
    title: 'IKEA Malm Yatak Odası Takımı',
    description: 'Modern ve minimal IKEA Malm yatak odası takımı. 3 parçalı set.',
    category: 'home-garden',
    brand: 'IKEA',
    price: 3500,
    cost: 2500,
    color: 'Beyaz',
    material: 'Ahşap',
    targetAudience: 'ALL',
    occasion: 'HOME',
    season: 'ALL_SEASON',
    tags: ['mobilya', 'yatak odası', 'ikea', 'modern'],
    status: 'ACTIVE',
    createdAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z'
  },
  {
    id: '6',
    title: 'L\'Oréal Paris Revitalift Krem',
    description: 'Anti-aging L\'Oréal Paris Revitalift yüz kremi. 50ml.',
    category: 'beauty-health',
    brand: 'L\'Oréal',
    price: 180,
    cost: 120,
    color: 'Şeffaf',
    material: 'Krem',
    targetAudience: 'WOMEN',
    occasion: 'HOME',
    season: 'ALL_SEASON',
    tags: ['krem', 'cilt bakımı', 'anti-aging', 'loreal'],
    status: 'ACTIVE',
    createdAt: '2024-01-10T16:30:00Z',
    updatedAt: '2024-01-10T16:30:00Z'
  },
  {
    id: '7',
    title: 'Adidas Erkek T-Shirt',
    description: 'Rahat ve nefes alabilir Adidas erkek t-shirt. %100 pamuk.',
    category: 'clothing',
    brand: 'Adidas',
    price: 350,
    cost: 250,
    color: 'Siyah',
    size: 'L',
    material: 'Pamuk',
    targetAudience: 'MEN',
    occasion: 'SPORTS',
    season: 'SUMMER',
    tags: ['tişört', 'erkek', 'adidas', 'pamuk'],
    status: 'ACTIVE',
    createdAt: '2024-01-09T13:20:00Z',
    updatedAt: '2024-01-09T13:20:00Z'
  },
  {
    id: '8',
    title: 'Sony WH-1000XM5 Kulaklık',
    description: 'Gürültü önleyici Sony WH-1000XM5 kablosuz kulaklık. Premium ses kalitesi.',
    category: 'electronics',
    brand: 'Sony',
    price: 8500,
    cost: 6500,
    color: 'Siyah',
    material: 'Plastik',
    targetAudience: 'ALL',
    occasion: 'ALL',
    season: 'ALL_SEASON',
    tags: ['kulaklık', 'sony', 'kablosuz', 'gürültü önleyici'],
    status: 'ACTIVE',
    createdAt: '2024-01-08T10:15:00Z',
    updatedAt: '2024-01-08T10:15:00Z'
  },
  {
    id: '9',
    title: 'H&M Kadın Elbise',
    description: 'Şık ve zarif H&M kadın elbise. Parti ve özel günler için ideal.',
    category: 'clothing',
    brand: 'H&M',
    price: 450,
    cost: 300,
    color: 'Kırmızı',
    size: 'S',
    material: 'Polyester',
    targetAudience: 'WOMEN',
    occasion: 'PARTY',
    season: 'ALL_SEASON',
    tags: ['elbise', 'kadın', 'parti', 'h&m'],
    status: 'ACTIVE',
    createdAt: '2024-01-07T12:00:00Z',
    updatedAt: '2024-01-07T12:00:00Z'
  },
  {
    id: '10',
    title: 'Philips Airfryer XXL',
    description: 'Büyük kapasiteli Philips Airfryer XXL. Sağlıklı kızartma için ideal.',
    category: 'home-garden',
    brand: 'Philips',
    price: 2200,
    cost: 1600,
    color: 'Siyah',
    material: 'Plastik',
    targetAudience: 'ALL',
    occasion: 'HOME',
    season: 'ALL_SEASON',
    tags: ['airfryer', 'mutfak', 'sağlıklı', 'philips'],
    status: 'ACTIVE',
    createdAt: '2024-01-06T08:30:00Z',
    updatedAt: '2024-01-06T08:30:00Z'
  }
];

export const categories = [
  { id: 'electronics', name: 'Elektronik', count: 3 },
  { id: 'clothing', name: 'Giyim', count: 4 },
  { id: 'home-garden', name: 'Ev & Bahçe', count: 2 },
  { id: 'beauty-health', name: 'Güzellik & Sağlık', count: 1 }
];

export const brands = [
  { id: 'samsung', name: 'Samsung', count: 1 },
  { id: 'nike', name: 'Nike', count: 1 },
  { id: 'zara', name: 'Zara', count: 1 },
  { id: 'apple', name: 'Apple', count: 1 },
  { id: 'ikea', name: 'IKEA', count: 1 },
  { id: 'loreal', name: 'L\'Oréal', count: 1 },
  { id: 'adidas', name: 'Adidas', count: 1 },
  { id: 'sony', name: 'Sony', count: 1 },
  { id: 'hm', name: 'H&M', count: 1 },
  { id: 'philips', name: 'Philips', count: 1 }
];

