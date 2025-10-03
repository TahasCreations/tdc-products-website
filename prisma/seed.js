const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin kullanıcı (email benzersiz olmalı)
  const admin = await prisma.user.upsert({
    where: { email: "admin@tdc.local" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@tdc.local",
      name: "TDC Admin",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Satıcı kullanıcı
  const sellerUser = await prisma.user.upsert({
    where: { email: "seller@tdc.local" },
    update: {},
    create: { 
      email: "seller@tdc.local", 
      name: "Demo Seller",
      role: "BUYER", // Başlangıçta BUYER, onaylandıktan sonra SELLER olacak
    },
  });

  const seller = await prisma.sellerProfile.upsert({
    where: { userId: sellerUser.id },
    update: { status: "approved" },
    create: {
      userId: sellerUser.id,
      storeName: "TS Art Store",
      storeSlug: "ts-art-store",
      description: "El yapımı sanat eserleri ve koleksiyon ürünleri",
      status: "approved",
    }
  });

  // Satıcı rolünü güncelle
  await prisma.user.update({
    where: { id: sellerUser.id },
    data: { role: "SELLER" },
  });

  console.log("✅ Seller user created:", seller.storeName);

  // İkinci satıcı
  const seller2User = await prisma.user.upsert({
    where: { email: "seller2@tdc.local" },
    update: {},
    create: { 
      email: "seller2@tdc.local", 
      name: "Tech Hub",
      role: "BUYER",
    },
  });

  const seller2 = await prisma.sellerProfile.upsert({
    where: { userId: seller2User.id },
    update: { status: "approved" },
    create: {
      userId: seller2User.id,
      storeName: "Tech Hub Store",
      storeSlug: "tech-hub-store",
      description: "Teknoloji ürünleri ve elektronik aksesuarlar",
      status: "approved",
    }
  });

  await prisma.user.update({
    where: { id: seller2User.id },
    data: { role: "SELLER" },
  });

  console.log("✅ Second seller created:", seller2.storeName);

  // Normal kullanıcı
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@tdc.local" },
    update: {},
    create: { 
      email: "buyer@tdc.local", 
      name: "Demo Buyer",
      role: "BUYER",
    },
  });

  console.log("✅ Buyer user created:", buyer.email);

  // Ürünler - TS Art Store
  const tsArtProducts = [
    {
      title: "Naruto Uzumaki Figürü - Shippuden",
      slug: "naruto-uzumaki-figuru-shippuden",
      description: "Yüksek kaliteli PVC malzemeden üretilmiş, detaylı Naruto Uzumaki figürü. Shippuden serisinden ilham alınmıştır.",
      category: "figur-koleksiyon",
      subcategory: "anime-figurleri",
      price: 499.90,
      listPrice: 599.90,
      stock: 20,
      images: [
        "https://via.placeholder.com/800x800/FF6B6B/FFFFFF?text=Naruto+1",
        "https://via.placeholder.com/800x800/FF6B6B/FFFFFF?text=Naruto+2"
      ],
      attributes: {
        material: ["PVC", "ABS"],
        scale: "1/7",
        color: "Çok Renkli",
        height: "25cm"
      },
      tags: ["anime", "naruto", "figür", "shippuden", "koleksiyon"],
      sellerId: seller.id,
    },
    {
      title: "One Piece Luffy Figürü - Gear 4",
      slug: "one-piece-luffy-figuru-gear-4",
      description: "Monkey D. Luffy'nin Gear 4 formundaki detaylı figürü. Koleksiyoncular için özel tasarım.",
      category: "figur-koleksiyon",
      subcategory: "anime-figurleri",
      price: 699.90,
      stock: 15,
      images: [
        "https://via.placeholder.com/800x800/4ECDC4/FFFFFF?text=Luffy+1",
        "https://via.placeholder.com/800x800/4ECDC4/FFFFFF?text=Luffy+2"
      ],
      attributes: {
        material: ["PVC", "ABS"],
        scale: "1/6",
        color: "Çok Renkli",
        height: "30cm"
      },
      tags: ["anime", "one-piece", "luffy", "figür", "koleksiyon"],
      sellerId: seller.id,
    },
    {
      title: "El Yapımı Seramik Vazo",
      slug: "el-yapimi-seramik-vazo",
      description: "Geleneksel tekniklerle el yapımı seramik vazo. Ev dekorasyonu için mükemmel.",
      category: "ev-yasam",
      subcategory: "dekorasyon",
      price: 149.90,
      stock: 30,
      images: [
        "https://via.placeholder.com/800x800/95A5A6/FFFFFF?text=Vazo+1"
      ],
      attributes: {
        material: ["Seramik"],
        color: "Doğal",
        height: "20cm",
        width: "15cm"
      },
      tags: ["el-yapımı", "seramik", "vazo", "dekorasyon", "ev"],
      sellerId: seller.id,
    }
  ];

  // Ürünler - Tech Hub Store
  const techHubProducts = [
    {
      title: "3D Yazıcı Nozulu Seti - 0.4mm",
      slug: "3d-yazici-nozul-seti-04mm",
      description: "Farklı boyutlarda 3D yazıcı nozulu seti. PLA, ABS ve PETG filamentler için uygun.",
      category: "elektronik",
      subcategory: "3d-yazici-aksesuarlari",
      price: 89.90,
      stock: 50,
      images: [
        "https://via.placeholder.com/800x800/3498DB/FFFFFF?text=Nozul+1",
        "https://via.placeholder.com/800x800/3498DB/FFFFFF?text=Nozul+2"
      ],
      attributes: {
        material: ["Pirinc", "Paslanmaz Çelik"],
        diameter: "0.4mm",
        compatibility: ["PLA", "ABS", "PETG"],
        quantity: "5 adet"
      },
      tags: ["3d-yazıcı", "nozul", "aksesuar", "teknoloji", "maker"],
      sellerId: seller2.id,
    },
    {
      title: "Arduino Uno R3 Klon",
      slug: "arduino-uno-r3-klon",
      description: "Arduino Uno R3 uyumlu geliştirme kartı. Projeleriniz için ideal başlangıç kartı.",
      category: "elektronik",
      subcategory: "mikrokontrolorler",
      price: 45.90,
      stock: 100,
      images: [
        "https://via.placeholder.com/800x800/E74C3C/FFFFFF?text=Arduino+1"
      ],
      attributes: {
        processor: "ATmega328P",
        voltage: "5V",
        digitalPins: 14,
        analogPins: 6,
        memory: "32KB Flash"
      },
      tags: ["arduino", "mikrokontrolör", "elektronik", "proje", "maker"],
      sellerId: seller2.id,
    },
    {
      title: "Kablosuz Bluetooth Kulaklık",
      slug: "kablosuz-bluetooth-kulaklik",
      description: "Yüksek ses kalitesi ve uzun pil ömrü ile kablosuz kulaklık. Günlük kullanım için ideal.",
      category: "elektronik",
      subcategory: "ses-aksesuarlari",
      price: 199.90,
      listPrice: 249.90,
      stock: 25,
      images: [
        "https://via.placeholder.com/800x800/9B59B6/FFFFFF?text=Kulaklık+1",
        "https://via.placeholder.com/800x800/9B59B6/FFFFFF?text=Kulaklık+2"
      ],
      attributes: {
        connectivity: "Bluetooth 5.0",
        batteryLife: "8 saat",
        charging: "USB-C",
        noiseCancellation: "Aktif",
        color: "Siyah"
      },
      tags: ["kulaklık", "bluetooth", "kablosuz", "ses", "müzik"],
      sellerId: seller2.id,
    }
  ];

  // Tüm ürünleri oluştur
  const allProducts = [...tsArtProducts, ...techHubProducts];
  
  for (const product of allProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`✅ ${allProducts.length} products created`);

  // Örnek adres oluştur
  await prisma.address.upsert({
    where: { 
      userId_type: {
        userId: buyer.id,
        type: "shipping"
      }
    },
    update: {},
    create: {
      userId: buyer.id,
      type: "shipping",
      firstName: "Demo",
      lastName: "Buyer",
      address1: "Atatürk Mahallesi 123. Sokak No:45",
      city: "İzmir",
      state: "İzmir",
      postalCode: "35000",
      country: "Turkey",
      phone: "+90 555 123 4567",
      isDefault: true,
    },
  });

  console.log("✅ Sample address created");

  // Örnek sipariş oluştur
  const order = await prisma.order.create({
    data: {
      userId: buyer.id,
      orderNumber: `TDC-${Date.now()}`,
      total: 499.90 + 89.90, // Naruto figürü + 3D nozul seti
      status: "delivered",
      paymentRef: "PAY_123456789",
      shippingAddress: {
        firstName: "Demo",
        lastName: "Buyer",
        address1: "Atatürk Mahallesi 123. Sokak No:45",
        city: "İzmir",
        postalCode: "35000",
        country: "Turkey",
        phone: "+90 555 123 4567"
      },
      items: {
        create: [
          {
            productId: tsArtProducts[0].slug, // Naruto figürü
            sellerId: seller.id,
            title: tsArtProducts[0].title,
            unitPrice: tsArtProducts[0].price,
            qty: 1,
            subtotal: tsArtProducts[0].price,
          },
          {
            productId: techHubProducts[0].slug, // 3D nozul seti
            sellerId: seller2.id,
            title: techHubProducts[0].title,
            unitPrice: techHubProducts[0].price,
            qty: 1,
            subtotal: techHubProducts[0].price,
          }
        ]
      }
    },
  });

  console.log("✅ Sample order created:", order.orderNumber);

  // Satıcı paylarını oluştur
  await prisma.payout.createMany({
    data: [
      {
        sellerId: seller.id,
        amount: 499.90,
        status: "paid",
        processedAt: new Date(),
      },
      {
        sellerId: seller2.id,
        amount: 89.90,
        status: "paid",
        processedAt: new Date(),
      }
    ],
    skipDuplicates: true,
  });

  console.log("✅ Sample payouts created");

  console.log("🎉 Database seeding completed successfully!");
  console.log("📊 Summary:");
  console.log(`   - Admin: ${admin.email}`);
  console.log(`   - Sellers: ${seller.storeName}, ${seller2.storeName}`);
  console.log(`   - Buyer: ${buyer.email}`);
  console.log(`   - Products: ${allProducts.length}`);
  console.log(`   - Order: ${order.orderNumber}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
