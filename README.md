# TDC Products Website

<!-- Deploy trigger -->

Modern ve kullanıcı dostu bir e-ticaret web sitesi. Anime, oyun ve film karakterlerinin yüksek kaliteli 3D baskı figürlerini satan platform.

## 🚀 Özellikler

### 🔐 Kullanıcı Yönetimi
- **Kayıt Olma**: E-posta ve şifre ile kolay kayıt
- **Giriş Yapma**: Güvenli kimlik doğrulama
- **Profil Yönetimi**: Kişisel bilgileri güncelleme
- **Şifre Sıfırlama**: E-posta ile şifre sıfırlama
- **Oturum Yönetimi**: Güvenli çıkış yapma

### 🛍️ E-ticaret Özellikleri
- **Ürün Kataloğu**: Kategorilere göre ürün listesi
- **Arama Sistemi**: Gelişmiş ürün arama
- **Sepet Yönetimi**: Ürün ekleme/çıkarma
- **Favori Listesi**: Beğenilen ürünleri kaydetme
- **Sipariş Takibi**: Sipariş geçmişi ve durumu

### ✍️ Blog Sistemi
- **Blog Yazma**: Zengin metin editörü
- **Otomatik Kaydetme**: Draft otomatik kaydetme
- **Klavye Kısayolları**: Hızlı işlemler
- **Etiket Sistemi**: Kategorilere göre etiketleme
- **Validasyon**: Form doğrulama sistemi

### 🎨 Kullanıcı Arayüzü
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu
- **Dark Mode**: Karanlık tema desteği
- **Modern UI**: Tailwind CSS ile tasarım
- **Animasyonlar**: Smooth geçişler ve efektler
- **Toast Bildirimleri**: Kullanıcı geri bildirimleri

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: React Context API
- **Icons**: Remix Icons
- **Deployment**: Vercel

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Kimlik doğrulama sayfaları
│   ├── blog/              # Blog sistemi
│   ├── products/          # Ürün sayfaları
│   ├── profile/           # Kullanıcı profili
│   └── ...
├── components/             # Yeniden kullanılabilir bileşenler
│   ├── Header.tsx         # Site başlığı
│   ├── Footer.tsx         # Site alt bilgisi
│   ├── Toast.tsx          # Bildirim sistemi
│   └── ...
├── contexts/               # React Context'ler
│   ├── AuthContext.tsx    # Kimlik doğrulama
│   ├── CartContext.tsx    # Sepet yönetimi
│   └── ...
└── ...
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Supabase hesabı

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/username/tdc-products-website.git
cd tdc-products-website
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
# veya
yarn install
```

3. **Environment variables oluşturun**
```bash
cp .env.example .env.local
```

4. **Supabase bilgilerini ekleyin**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
# veya
yarn dev
```

6. **Tarayıcıda açın**
```
http://localhost:3000
```

## 🔧 Geliştirme

### Scripts

```bash
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucusu
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript kontrolü
```

### Kod Standartları

- **TypeScript**: Strict mode kullanımı
- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatlaması
- **Husky**: Git hooks

## 📱 Responsive Tasarım

- **Mobile First**: Mobil öncelikli tasarım
- **Breakpoints**: sm, md, lg, xl
- **Touch Friendly**: Dokunmatik cihaz uyumlu
- **Performance**: Optimize edilmiş görüntüler

## 🔐 Güvenlik

- **Supabase Auth**: Güvenli kimlik doğrulama
- **JWT Tokens**: Güvenli oturum yönetimi
- **Input Validation**: Form doğrulama
- **XSS Protection**: Güvenlik önlemleri

## 🚀 Deployment

### Vercel (Önerilen)

1. **Vercel'e bağlayın**
```bash
npm i -g vercel
vercel
```

2. **Environment variables ekleyin**
3. **Deploy edin**

### Diğer Platformlar

- **Netlify**: Static site hosting
- **AWS Amplify**: Full-stack hosting
- **Docker**: Container deployment

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Website**: [tdc-products.com](https://tdc-products.com)
- **Email**: info@tdc-products.com
- **GitHub**: [@username](https://github.com/username)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Remix Icons](https://remixicon.com/) - Icon library

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
