-- E-commerce Seed Data for TDC Market
-- Categories, Products, Sellers with realistic data

-- Insert main categories
INSERT INTO categories (name, slug, description, meta_description, icon, sort_order, is_active, is_demo) VALUES
('Tüm Ürünler', 'tum-urunler', 'Tüm ürünleri keşfet', 'Tüm ürünleri keşfet…', 'grid-3x3', 0, true, true),
('Figür & Koleksiyon', 'figur-koleksiyon', 'Anime figürleri, film karakterleri ve koleksiyon ürünleri', 'Anime figürleri, film karakterleri ve koleksiyon ürünleri', 'toy-brick', 1, true, true),
('Moda & Aksesuar', 'moda-aksesuar', 'Tişört, hoodie, şapka ve takı koleksiyonları', 'Tişört, hoodie, şapka ve takı koleksiyonları', 'shirt', 2, true, true),
('Elektronik', 'elektronik', 'Kulaklık, akıllı ev ürünleri ve elektronik aksesuarlar', 'Kulaklık, akıllı ev ürünleri ve elektronik aksesuarlar', 'smartphone', 3, true, true),
('Ev & Yaşam', 'ev-yasam', 'Dekorasyon, aydınlatma ve ev ürünleri', 'Dekorasyon, aydınlatma ve ev ürünleri', 'home', 4, true, true),
('Sanat & Hobi', 'sanat-hobi', 'Boya, tuval ve el sanatları malzemeleri', 'Boya, tuval ve el sanatları malzemeleri', 'palette', 5, true, true),
('Hediyelik', 'hediyelik', 'Kişiye özel hediyeler ve özel gün setleri', 'Kişiye özel hediyeler ve özel gün setleri', 'gift', 6, true, true),
('Blog', 'blog', 'TDC Market blog yazıları', 'TDC Market blog yazıları', 'book-open', 7, true, true),
('Hakkımızda', 'hakkimizda', 'TDC Market hakkında bilgiler', 'TDC Market hakkında bilgiler', 'info', 8, true, true);

-- Insert subcategories
INSERT INTO categories (name, slug, description, meta_description, icon, parent_id, sort_order, is_active, is_demo) VALUES
-- Figür & Koleksiyon subcategories
('Anime Figürleri', 'anime-figurleri', 'Naruto, One Piece, Dragon Ball ve diğer anime karakterleri', 'Naruto, One Piece, Dragon Ball ve diğer anime karakterleri', 'zap', 2, 1, true, true),
('Film/TV Figürleri', 'film-tv-figurleri', 'Marvel, DC, Star Wars ve popüler film karakterleri', 'Marvel, DC, Star Wars ve popüler film karakterleri', 'film', 2, 2, true, true),
('Dioramalar', 'dioramalar', 'Detaylı sahne ve diorama modelleri', 'Detaylı sahne ve diorama modelleri', 'layers', 2, 3, true, true),
('Koleksiyon Arabaları', 'koleksiyon-arabalari', '1:64, 1:43 ölçekli koleksiyon arabaları', '1:64, 1:43 ölçekli koleksiyon arabaları', 'car', 2, 4, true, true),
('Maket & Kitler', 'maket-kitler', 'Model uçak, gemi ve araç maketleri', 'Model uçak, gemi ve araç maketleri', 'package', 2, 5, true, true),

-- Moda & Aksesuar subcategories
('Tişört', 'tisort', 'Baskılı ve düz tişörtler', 'Baskılı ve düz tişörtler', 'shirt', 3, 1, true, true),
('Hoodie', 'hoodie', 'Kapüşonlu sweatshirtler', 'Kapüşonlu sweatshirtler', 'shirt', 3, 2, true, true),
('Şapka', 'sapka', 'Baseball şapkaları ve bere modelleri', 'Baseball şapkaları ve bere modelleri', 'hat', 3, 3, true, true),
('Takı & Bileklik', 'taki-bileklik', 'Kolye, bileklik ve yüzük koleksiyonları', 'Kolye, bileklik ve yüzük koleksiyonları', 'gem', 3, 4, true, true),

-- Elektronik subcategories
('Kulaklık', 'kulaklik', 'Kablosuz ve kablolu kulaklıklar', 'Kablosuz ve kablolu kulaklıklar', 'headphones', 4, 1, true, true),
('Akıllı Ev', 'akilli-ev', 'Akıllı ev otomasyon ürünleri', 'Akıllı ev otomasyon ürünleri', 'home', 4, 2, true, true),
('Aydınlatma', 'aydinlatma', 'LED ışık ve aydınlatma sistemleri', 'LED ışık ve aydınlatma sistemleri', 'lightbulb', 4, 3, true, true),
('Hobi Elektroniği', 'hobi-elektronigi', 'Arduino, Raspberry Pi ve elektronik kitler', 'Arduino, Raspberry Pi ve elektronik kitler', 'cpu', 4, 4, true, true),
('3D Yazıcı Aksesuarları', '3d-yazici-aksesuarlari', '3D yazıcı filament ve aksesuarları', '3D yazıcı filament ve aksesuarları', 'printer', 4, 5, true, true),

-- Ev & Yaşam subcategories
('Dekor', 'dekor', 'Ev dekorasyon ürünleri', 'Ev dekorasyon ürünleri', 'sparkles', 5, 1, true, true),
('Mutfak', 'mutfak', 'Mutfak aletleri ve aksesuarları', 'Mutfak aletleri ve aksesuarları', 'utensils', 5, 2, true, true),
('Düzenleme', 'duzenleme', 'Saklama ve düzenleme çözümleri', 'Saklama ve düzenleme çözümleri', 'box', 5, 3, true, true),

-- Sanat & Hobi subcategories
('Boya & Fırça', 'boya-firca', 'Akrilik, yağlı boya ve fırça setleri', 'Akrilik, yağlı boya ve fırça setleri', 'brush', 6, 1, true, true),
('Tuval', 'tuval', 'Çeşitli boyutlarda tuval ve resim malzemeleri', 'Çeşitli boyutlarda tuval ve resim malzemeleri', 'square', 6, 2, true, true),
('3D Baskı Malzemeleri', '3d-baski-malzemeleri', 'PLA, ABS filament ve 3D baskı malzemeleri', 'PLA, ABS filament ve 3D baskı malzemeleri', 'package', 6, 3, true, true),
('El Sanatları', 'el-sanatlari', 'El sanatları malzemeleri ve kitler', 'El sanatları malzemeleri ve kitler', 'scissors', 6, 4, true, true),

-- Hediyelik subcategories
('Kişiye Özel', 'kisiye-ozel', 'Kişiselleştirilebilir hediyeler', 'Kişiselleştirilebilir hediyeler', 'user', 7, 1, true, true),
('Doğum Günü', 'dogum-gunu', 'Doğum günü hediyeleri ve setleri', 'Doğum günü hediyeleri ve setleri', 'cake', 7, 2, true, true),
('Özel Gün Setleri', 'ozel-gun-setleri', 'Özel günler için hazırlanmış setler', 'Özel günler için hazırlanmış setler', 'gift', 7, 3, true, true);

-- Insert sellers
INSERT INTO sellers (name, slug, email, phone, description, logo_url, rating, review_count, policies, badges, is_active, is_verified, is_demo) VALUES
('AnimeWorld Store', 'animeworld-store', 'info@animeworld.com', '+90 212 555 0101', 'Anime figürleri ve koleksiyon ürünleri konusunda uzman mağaza. Orijinal lisanslı ürünler.', 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=AW', 4.8, 1247, '{"shipping": "Ücretsiz kargo (150 TL üzeri)", "returns": "14 gün iade garantisi", "warranty": "2 yıl garanti"}', '{"verified", "premium", "fast-shipping"}', true, true, true),

('TechGear Pro', 'techgear-pro', 'sales@techgear.com', '+90 216 555 0202', 'Elektronik ürünler ve teknoloji aksesuarları. Kaliteli markalar, uygun fiyatlar.', 'https://via.placeholder.com/100x100/059669/FFFFFF?text=TG', 4.6, 892, '{"shipping": "Hızlı kargo (1-2 gün)", "returns": "30 gün iade garantisi", "warranty": "Resmi garanti"}', '{"verified", "tech-expert", "warranty"}', true, true, true),

('ArtCraft Studio', 'artcraft-studio', 'hello@artcraft.com', '+90 312 555 0303', 'Sanat malzemeleri ve hobi ürünleri. Profesyonel kalitede malzemeler.', 'https://via.placeholder.com/100x100/DC2626/FFFFFF?text=AC', 4.7, 634, '{"shipping": "Standart kargo (3-5 gün)", "returns": "7 gün iade garantisi", "warranty": "Kalite garantisi"}', '{"verified", "art-specialist", "quality"}', true, true, true),

('FashionHub', 'fashionhub', 'contact@fashionhub.com', '+90 232 555 0404', 'Moda ve aksesuar ürünleri. Trend tasarımlar, kaliteli malzemeler.', 'https://via.placeholder.com/100x100/7C3AED/FFFFFF?text=FH', 4.5, 445, '{"shipping": "Ücretsiz kargo (100 TL üzeri)", "returns": "14 gün iade garantisi", "warranty": "Kalite garantisi"}', '{"verified", "fashion", "trendy"}', true, false, true),

('HomeDecor Plus', 'homedecor-plus', 'info@homedecor.com', '+90 242 555 0505', 'Ev dekorasyonu ve yaşam ürünleri. Modern tasarımlar, uygun fiyatlar.', 'https://via.placeholder.com/100x100/EA580C/FFFFFF?text=HD', 4.4, 378, '{"shipping": "Standart kargo", "returns": "14 gün iade garantisi", "warranty": "Kalite garantisi"}', '{"verified", "home-specialist"}', true, true, true);

-- Insert products
INSERT INTO products (title, slug, description, short_description, category_id, seller_id, brand, price, list_price, currency, rating, review_count, stock, sku, images, tags, attributes, variants, weight, dimensions, is_active, is_featured, is_demo) VALUES
-- Anime Figürleri
('Naruto Uzumaki Figürü - Shippuden', 'naruto-uzumaki-figuru-shippuden', 'Naruto Uzumaki''nin Shippuden serisindeki görünümüyle tasarlanmış detaylı figür. PVC malzemeden üretilmiştir.', 'Naruto Uzumaki Shippuden figürü', 10, 1, 'Bandai', 299.99, 399.99, 'TRY', 4.8, 156, 25, 'NAR-SHIP-001', '{"https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Naruto", "https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Naruto+2"}', '{"anime", "naruto", "figür", "shippuden"}', '{"scale": "1:8", "material": "PVC", "height": "25cm", "color": "Orange"}', '{"scale": ["1:8", "1:12"], "color": ["Orange", "Blue"]}', 0.5, '{"length": 15, "width": 10, "height": 25}', true, true, true),

('One Piece Luffy Figürü - Gear 4', 'one-piece-luffy-figuru-gear-4', 'Monkey D. Luffy''nin Gear 4 Boundman formundaki görünümüyle tasarlanmış premium figür.', 'Luffy Gear 4 figürü', 10, 1, 'MegaHouse', 459.99, 599.99, 'TRY', 4.9, 89, 15, 'OP-LUFFY-G4-001', '{"https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Luffy", "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Luffy+2"}', '{"anime", "one-piece", "luffy", "gear-4"}', '{"scale": "1:7", "material": "PVC", "height": "30cm", "color": "Red"}', '{"scale": ["1:7", "1:10"], "color": ["Red", "Blue"]}', 0.8, '{"length": 20, "width": 15, "height": 30}', true, true, true),

-- Film/TV Figürleri
('Iron Man Mark 85 Figürü', 'iron-man-mark-85-figuru', 'Marvel''in Iron Man Mark 85 armor''uyla tasarlanmış detaylı figür. LED ışık efektleri dahil.', 'Iron Man Mark 85 figürü', 11, 1, 'Hot Toys', 1299.99, 1599.99, 'TRY', 4.7, 234, 8, 'IM-MK85-001', '{"https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Iron+Man", "https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=Iron+Man+2"}', '{"marvel", "iron-man", "figür", "led"}', '{"scale": "1:6", "material": "ABS/PVC", "height": "30cm", "features": "LED"}', '{"scale": ["1:6"], "color": ["Red/Gold"]}', 1.2, '{"length": 25, "width": 20, "height": 30}', true, true, true),

-- Moda & Aksesuar
('Anime Tişört - Naruto Collection', 'anime-tisort-naruto-collection', 'Naruto serisinden karakterlerle tasarlanmış %100 pamuklu tişört. Yüksek kaliteli baskı.', 'Naruto karakterli tişört', 15, 4, 'AnimeWear', 89.99, 129.99, 'TRY', 4.5, 67, 50, 'T-NAR-001', '{"https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Naruto+T", "https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Naruto+T+2"}', '{"tişört", "naruto", "anime", "pamuklu"}', '{"material": "100% Cotton", "sizes": "S-XXL", "color": "Black"}', '{"size": ["S", "M", "L", "XL", "XXL"], "color": ["Black", "White", "Navy"]}', 0.2, '{"length": 70, "width": 50, "height": 1}', true, false, true),

-- Elektronik
('Kablosuz Kulaklık - Noise Cancelling', 'kablosuz-kulaklik-noise-cancelling', 'Aktif gürültü engelleme özellikli kablosuz kulaklık. 30 saat pil ömrü, hızlı şarj.', 'Gürültü engelleyici kablosuz kulaklık', 19, 2, 'Sony', 899.99, 1199.99, 'TRY', 4.6, 189, 30, 'KUL-SONY-001', '{"https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Headphones", "https://via.placeholder.com/400x400/34495E/FFFFFF?text=Headphones+2"}', '{"kulaklık", "kablosuz", "gürültü-engelleyici", "bluetooth"}', '{"connection": "Bluetooth 5.0", "battery": "30h", "features": "ANC"}', '{"color": ["Black", "White", "Blue"]}', 0.3, '{"length": 20, "width": 18, "height": 8}', true, true, true),

-- Ev & Yaşam
('LED Aydınlatma Seti - RGB', 'led-aydinlatma-seti-rgb', '16 milyon renk seçeneği sunan LED şerit aydınlatma seti. Uzaktan kumanda ile kontrol.', 'RGB LED aydınlatma seti', 23, 5, 'Philips', 149.99, 199.99, 'TRY', 4.4, 92, 40, 'LED-PHIL-001', '{"https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=LED", "https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=LED+2"}', '{"led", "aydınlatma", "rgb", "uzaktan-kumanda"}', '{"length": "5m", "colors": "16M", "control": "Remote"}', '{"color": ["RGB", "White", "Warm White"]}', 0.4, '{"length": 500, "width": 1, "height": 1}', true, false, true),

-- Sanat & Hobi
('Akrilik Boya Seti - 24 Renk', 'akrilik-boya-seti-24-renk', 'Profesyonel kalitede akrilik boya seti. 24 farklı renk, 12ml tüpler.', '24 renkli akrilik boya seti', 26, 3, 'Winsor & Newton', 199.99, 249.99, 'TRY', 4.7, 145, 25, 'BOYA-WN-001', '{"https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Paint", "https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Paint+2"}', '{"akrilik", "boya", "sanat", "profesyonel"}', '{"colors": 24, "volume": "12ml", "type": "Acrylic"}', '{"type": ["Acrylic", "Oil", "Watercolor"]}', 0.6, '{"length": 30, "width": 20, "height": 5}', true, false, true),

-- Hediyelik
('Kişiye Özel Fotoğraf Çerçevesi', 'kisiye-ozel-fotograf-cercevesi', 'Sevdikleriniz için özelleştirilebilir fotoğraf çerçevesi. Ahşap malzeme, lazer gravür.', 'Özelleştirilebilir fotoğraf çerçevesi', 29, 5, 'CustomCraft', 79.99, 99.99, 'TRY', 4.8, 78, 60, 'CER-CUS-001', '{"https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Frame", "https://via.placeholder.com/400x400/9B59B6/FFFFFF?text=Frame+2"}', '{"çerçeve", "kişiye-özel", "ahşap", "gravür"}', '{"material": "Wood", "size": "15x20cm", "customization": "Laser Engraving"}', '{"size": ["10x15cm", "15x20cm", "20x25cm"], "material": ["Wood", "Metal"]}', 0.3, '{"length": 20, "width": 15, "height": 2}', true, false, true),

('Doğum Günü Hediyelik Seti', 'dogum-gunu-hediyelik-seti', 'Doğum günü için özel hazırlanmış hediye seti. Kart, çerçeve ve küçük hediyeler dahil.', 'Doğum günü hediye seti', 30, 5, 'GiftBox', 149.99, 179.99, 'TRY', 4.6, 56, 35, 'SET-GIFT-001', '{"https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Gift+Set", "https://via.placeholder.com/400x400/C0392B/FFFFFF?text=Gift+Set+2"}', '{"hediye", "doğum-günü", "set", "özel"}', '{"items": 5, "box": "Gift Box", "card": "Personalized"}', '{"theme": ["Birthday", "Anniversary", "Graduation"]}', 0.8, '{"length": 25, "width": 20, "height": 8}', true, false, true);

-- Insert product filters
INSERT INTO product_filters (category_id, filter_key, filter_type, filter_label, filter_options, sort_order, is_active) VALUES
-- Figür & Koleksiyon filters
(2, 'brand', 'select', 'Marka', '{"options": ["Bandai", "MegaHouse", "Hot Toys", "Good Smile Company", "Kotobukiya"]}', 1, true),
(2, 'scale', 'multi', 'Ölçek', '{"options": ["1:64", "1:43", "1:18", "1:12", "1:8", "1:7", "1:6"]}', 2, true),
(2, 'material', 'multi', 'Materyal', '{"options": ["PLA", "ABS", "Resin", "Metal", "PVC"]}', 3, true),
(2, 'price', 'range', 'Fiyat', '{"min": 50, "max": 2000, "step": 50}', 4, true),
(2, 'stock', 'toggle', 'Stokta Var', '{"default": false}', 5, true),
(2, 'seller', 'multi', 'Satıcı', '{"options": ["AnimeWorld Store", "TechGear Pro", "ArtCraft Studio"]}', 6, true),
(2, 'color', 'multi', 'Renk', '{"options": ["Orange", "Blue", "Red", "Black", "White", "Gold"]}', 7, true),

-- Moda & Aksesuar filters
(3, 'size', 'multi', 'Beden', '{"options": ["S", "M", "L", "XL", "XXL"]}', 1, true),
(3, 'gender', 'select', 'Cinsiyet', '{"options": ["Unisex", "Erkek", "Kadın"]}', 2, true),
(3, 'color', 'multi', 'Renk', '{"options": ["Black", "White", "Navy", "Red", "Blue", "Green"]}', 3, true),
(3, 'material', 'multi', 'Materyal', '{"options": ["Cotton", "Polyester", "Wool", "Leather"]}', 4, true),
(3, 'price', 'range', 'Fiyat', '{"min": 20, "max": 500, "step": 10}', 5, true),
(3, 'seller', 'multi', 'Satıcı', '{"options": ["FashionHub", "AnimeWorld Store"]}', 6, true),

-- Elektronik filters
(4, 'brand', 'select', 'Marka', '{"options": ["Sony", "Philips", "Samsung", "Apple", "Bose"]}', 1, true),
(4, 'connection', 'multi', 'Bağlantı', '{"options": ["Bluetooth", "Kablolu", "WiFi"]}', 2, true),
(4, 'power', 'range', 'Güç', '{"min": 1, "max": 100, "step": 1, "unit": "W"}', 3, true),
(4, 'warranty', 'toggle', 'Garanti', '{"default": false}', 4, true),
(4, 'price', 'range', 'Fiyat', '{"min": 100, "max": 2000, "step": 50}', 5, true),
(4, 'seller', 'multi', 'Satıcı', '{"options": ["TechGear Pro", "AnimeWorld Store"]}', 6, true),

-- Ev & Yaşam filters
(5, 'material', 'multi', 'Materyal', '{"options": ["Wood", "Metal", "Glass", "Plastic", "Fabric"]}', 1, true),
(5, 'color', 'multi', 'Renk', '{"options": ["White", "Black", "Brown", "Gray", "Blue", "Green"]}', 2, true),
(5, 'room', 'multi', 'Oda', '{"options": ["Salon", "Yatak Odası", "Mutfak", "Banyo", "Çalışma Odası"]}', 3, true),
(5, 'price', 'range', 'Fiyat', '{"min": 50, "max": 1000, "step": 25}', 4, true),
(5, 'seller', 'multi', 'Satıcı', '{"options": ["HomeDecor Plus", "TechGear Pro"]}', 5, true),

-- Sanat & Hobi filters
(6, 'material', 'multi', 'Materyal', '{"options": ["Acrylic", "Oil", "Watercolor", "Canvas", "Brush"]}', 1, true),
(6, 'color', 'multi', 'Renk', '{"options": ["Red", "Blue", "Yellow", "Green", "Black", "White", "Mixed"]}', 2, true),
(6, 'type', 'multi', 'Alt Tür', '{"options": ["Boya", "Fırça", "Tuval", "Kit", "Malzeme"]}', 3, true),
(6, 'price', 'range', 'Fiyat', '{"min": 25, "max": 500, "step": 25}', 4, true),
(6, 'seller', 'multi', 'Satıcı', '{"options": ["ArtCraft Studio", "HomeDecor Plus"]}', 5, true),

-- Hediyelik filters
(7, 'material', 'multi', 'Materyal', '{"options": ["Wood", "Metal", "Glass", "Fabric", "Paper"]}', 1, true),
(7, 'color', 'multi', 'Renk', '{"options": ["Red", "Blue", "Green", "Gold", "Silver", "Multi"]}', 2, true),
(7, 'occasion', 'multi', 'Özel Gün', '{"options": ["Doğum Günü", "Yıldönümü", "Mezuniyet", "Bayram", "Genel"]}', 3, true),
(7, 'price', 'range', 'Fiyat', '{"min": 30, "max": 300, "step": 25}', 4, true),
(7, 'seller', 'multi', 'Satıcı', '{"options": ["HomeDecor Plus", "ArtCraft Studio"]}', 5, true);

-- Insert some product reviews
INSERT INTO product_reviews (product_id, user_name, user_email, rating, title, comment, is_verified_purchase, is_approved, helpful_count, is_demo) VALUES
(1, 'Ahmet Yılmaz', 'ahmet@example.com', 5, 'Mükemmel kalite!', 'Naruto figürü gerçekten çok detaylı ve kaliteli. Paketleme de çok iyiydi.', true, true, 12, true),
(1, 'Ayşe Demir', 'ayse@example.com', 4, 'Çok güzel ama küçük', 'Figür çok güzel ama beklediğimden biraz küçük geldi. Yine de kalitesi iyi.', true, true, 8, true),
(2, 'Mehmet Can', 'mehmet@example.com', 5, 'Harika detaylar!', 'Luffy figürü gerçekten muhteşem. Gear 4 formundaki detaylar çok güzel işlenmiş.', true, true, 15, true),
(3, 'Fatma Özkan', 'fatma@example.com', 5, 'LED efektleri süper!', 'Iron Man figürü çok etkileyici. LED ışıklar gerçekten filmdeki gibi görünüyor.', true, true, 23, true),
(4, 'Ali Kaya', 'ali@example.com', 4, 'Rahat ve kaliteli', 'Tişört çok rahat ve kaliteli. Baskı da çok net. Sadece biraz küçük geldi.', true, true, 6, true),
(5, 'Zeynep Arslan', 'zeynep@example.com', 5, 'Mükemmel ses kalitesi!', 'Kulaklık gerçekten çok iyi. Gürültü engelleme özelliği harika çalışıyor.', true, true, 18, true);
