export const runtime = 'nodejs';

import { NextRequest } from 'next/server';

// Lightweight, in-memory demo suggestions
const CATEGORIES = [
  'Anime Figürleri','Film/TV Figürleri','Dioramalar','Koleksiyon Arabaları','Maket & Kitler',
  'Tişört','Hoodie','Şapka','Takı & Bileklik','Çanta & Cüzdan','Ayakkabı',
  'Kulaklık','Akıllı Ev','Aydınlatma','Hobi Elektroniği','3D Yazıcı Aksesuarları',
  'Dekor','Mutfak','Düzenleme','Banyo','Tekstil',
  'Boya & Fırça','Tuval','3D Baskı Malzemeleri','El Sanatları','Kırtasiye','Model & Maket',
  'Kişiye Özel','Doğum Günü','Özel Gün Setleri','Kurumsal Hediyeler'
];

const BRANDS = ['AnimeWorld','FashionHub','TechGear','HomeDecor','ArtCraft','TDC Products'];
const KEYWORDS = ['Naruto','Luffy','Goku','LED aydınlatma','kablosuz kulaklık','hediye seti','çerçeve','kupa'];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();
  const limit = Number(searchParams.get('limit') || 6);
  if (!q) return Response.json({ items: [] });

  const source = [
    ...CATEGORIES.map((v) => ({ type: 'category', label: v })),
    ...BRANDS.map((v) => ({ type: 'brand', label: v })),
    ...KEYWORDS.map((v) => ({ type: 'keyword', label: v })),
  ];

  const items = source.filter((s) => s.label.toLowerCase().includes(q)).slice(0, limit);
  return Response.json({ items });
}


