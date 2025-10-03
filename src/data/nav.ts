export type Subcat = { label: string; href: string };
export type Cat = { key: string; label: string; href: string; children: Subcat[] };

export const CATEGORIES: Cat[] = [
  {
    key: "figures",
    label: "Figür & Koleksiyon",
    href: "/categories/figur-koleksiyon",
    children: [
      { label: "Koleksiyon Figürleri", href: "/categories/figur-koleksiyon/koleksiyon-figurleri" },
      { label: "Anime / Manga", href: "/categories/figur-koleksiyon/anime" },
      { label: "Model Kit", href: "/categories/figur-koleksiyon/model-kit" },
      { label: "Aksiyon Figür", href: "/categories/figur-koleksiyon/aksiyon" },
      { label: "Funko / Nendoroid", href: "/categories/figur-koleksiyon/funko" },
    ],
  },
  {
    key: "fashion",
    label: "Moda & Aksesuar",
    href: "/categories/moda-aksesuar",
    children: [
      { label: "Tişört & Hoodie", href: "/categories/moda-aksesuar/tisort-hoodie" },
      { label: "Takı & Saat", href: "/categories/moda-aksesuar/taki-saat" },
      { label: "Çanta & Cüzdan", href: "/categories/moda-aksesuar/canta" },
      { label: "Ayakkabı", href: "/categories/moda-aksesuar/ayakkabi" },
    ],
  },
  {
    key: "electronics",
    label: "Elektronik",
    href: "/categories/elektronik",
    children: [
      { label: "Kulaklık & Ses", href: "/categories/elektronik/kulaklik" },
      { label: "Akıllı Ev", href: "/categories/elektronik/akilli-ev" },
      { label: "Bilgisayar Aksesuarları", href: "/categories/elektronik/pc-aksesuar" },
      { label: "Oyun & Konsol", href: "/categories/elektronik/oyun" },
    ],
  },
  {
    key: "home",
    label: "Ev & Yaşam",
    href: "/categories/ev-yasam",
    children: [
      { label: "Dekorasyon", href: "/categories/ev-yasam/dekorasyon" },
      { label: "Mutfak", href: "/categories/ev-yasam/mutfak" },
      { label: "Aydınlatma", href: "/categories/ev-yasam/aydinlatma" },
      { label: "Mobilya", href: "/categories/ev-yasam/mobilya" },
    ],
  },
  {
    key: "art",
    label: "Sanat & Hobi",
    href: "/categories/sanat-hobi",
    children: [
      { label: "Tablo & Poster", href: "/categories/sanat-hobi/poster" },
      { label: "El Sanatları", href: "/categories/sanat-hobi/el-sanatlari" },
      { label: "Boyama & Çizim", href: "/categories/sanat-hobi/boyama" },
      { label: "Müzik & Enstrüman", href: "/categories/sanat-hobi/muzik" },
    ],
  },
  {
    key: "gifts",
    label: "Hediyelik",
    href: "/categories/hediyelik",
    children: [
      { label: "Kişiye Özel", href: "/categories/hediyelik/kisiye-ozel" },
      { label: "Doğum Günü", href: "/categories/hediyelik/dogum-gunu" },
      { label: "Ofis & Masaüstü", href: "/categories/hediyelik/ofis" },
      { label: "Mini Setler", href: "/categories/hediyelik/mini-set" },
    ],
  },
];
