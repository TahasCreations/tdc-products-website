export type Subcat = { label: string; href: string };
export type Cat = { key: string; label: string; href: string; children: Subcat[] };

export const CATEGORIES: Cat[] = [
  {
    key: "figures",
    label: "Figür & Koleksiyon",
    href: "/products?category=figur-koleksiyon",
    children: [
      { label: "Koleksiyon Figürleri", href: "/products?category=koleksiyon-figurleri" },
      { label: "Anime / Manga", href: "/products?category=anime" },
      { label: "Model Kit", href: "/products?category=model-kit" },
      { label: "Aksiyon Figür", href: "/products?category=aksiyon-figur" },
      { label: "Funko / Nendoroid", href: "/products?category=funko" },
    ],
  },
  {
    key: "fashion",
    label: "Moda & Aksesuar",
    href: "/products?category=moda-aksesuar",
    children: [
      { label: "Tişört & Hoodie", href: "/products?category=tisort-hoodie" },
      { label: "Takı & Saat", href: "/products?category=taki-saat" },
      { label: "Çanta & Cüzdan", href: "/products?category=canta" },
      { label: "Ayakkabı", href: "/products?category=ayakkabi" },
    ],
  },
  {
    key: "electronics",
    label: "Elektronik",
    href: "/products?category=elektronik",
    children: [
      { label: "Kulaklık & Ses", href: "/products?category=kulaklik" },
      { label: "Akıllı Ev", href: "/products?category=akilli-ev" },
      { label: "Bilgisayar Aksesuarları", href: "/products?category=pc-aksesuar" },
      { label: "Oyun & Konsol", href: "/products?category=oyun" },
    ],
  },
  {
    key: "home",
    label: "Ev & Yaşam",
    href: "/products?category=ev-yasam",
    children: [
      { label: "Dekorasyon", href: "/products?category=dekorasyon" },
      { label: "Mutfak", href: "/products?category=mutfak" },
      { label: "Aydınlatma", href: "/products?category=aydinlatma" },
      { label: "Mobilya", href: "/products?category=mobilya" },
    ],
  },
  {
    key: "art",
    label: "Sanat & Hobi",
    href: "/products?category=sanat-hobi",
    children: [
      { label: "Tablo & Poster", href: "/products?category=poster" },
      { label: "El Sanatları", href: "/products?category=el-sanatlari" },
      { label: "Boyama & Çizim", href: "/products?category=boyama" },
      { label: "Müzik & Enstrüman", href: "/products?category=muzik" },
    ],
  },
  {
    key: "gifts",
    label: "Hediyelik",
    href: "/products?category=hediyelik",
    children: [
      { label: "Kişiye Özel", href: "/products?category=kisiye-ozel" },
      { label: "Doğum Günü", href: "/products?category=dogum-gunu" },
      { label: "Ofis & Masaüstü", href: "/products?category=ofis" },
      { label: "Mini Setler", href: "/products?category=mini-set" },
    ],
  },
];
