import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Demo veri üretimi tamamen devre dışı bırakıldı
  // Projeyi canlıya almadan önce demo veriler temizlendi
  console.log('ℹ️  Demo veri üretimi devre dışı - Projeyi canlıya hazırlamak için')
  console.log('💡 Sadece gerekli admin kullanıcısı oluşturulacak')
  
  // Demo veri üretimini kontrol et
  if (process.env.SEED_DEMO === 'true') {
    console.log('⚠️  Demo veri üretimi için SEED_DEMO=true kullanıldı')
    console.log('❌ Güvenlik nedeniyle demo veri üretimi devre dışı bırakıldı')
    return
  }

  console.log('⚠️  DEMO VERİ ÜRETİMİ AKTİF - Bu işlem demo verileri oluşturacak!')

  // Admin kullanıcısı oluştur
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@site.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  // Mevcut admin kullanıcısını kontrol et
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log('✅ Admin kullanıcısı zaten mevcut')
    return
  }

  // NextAuth kullanılıyor, şifre gerekmiyor

  // Admin kullanıcısını oluştur
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      role: 'ADMIN',
      name: 'Admin User'
    }
  })

  console.log('✅ Admin kullanıcısı oluşturuldu:', {
    id: admin.id,
    email: admin.email,
    role: admin.role
  })

  // Örnek kategoriler oluştur (sadece demo modunda)
  // Category modeli mevcut değil, Product.category alanı kullanılıyor
  console.log('ℹ️  Kategoriler Product.category alanında string olarak saklanıyor')

  console.log('🎉 Demo seeding tamamlandı!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
