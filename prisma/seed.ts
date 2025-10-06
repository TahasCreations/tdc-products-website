import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Demo veri üretimini kontrol et
  if (process.env.SEED_DEMO !== 'true') {
    console.log('ℹ️  Demo veri üretimi devre dışı (SEED_DEMO != true)')
    console.log('💡 Demo veri üretmek için SEED_DEMO=true environment variable kullanın')
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

  // Şifreyi hash'le
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  // Admin kullanıcısını oluştur
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
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
  const categories = [
    { name: 'Elektronik', slug: 'elektronik' },
    { name: 'Giyim', slug: 'giyim' },
    { name: 'Ev & Yaşam', slug: 'ev-yasam' }
  ]

  for (const category of categories) {
    const existing = await prisma.category.findUnique({
      where: { slug: category.slug }
    })

    if (!existing) {
      await prisma.category.create({
        data: category
      })
      console.log(`✅ Kategori oluşturuldu: ${category.name}`)
    }
  }

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
