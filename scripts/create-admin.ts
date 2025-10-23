#!/usr/bin/env tsx
/**
 * Ana Admin Kullanıcı Oluşturma Scripti
 * 
 * Bu script ana admin kullanıcısını oluşturur
 * 
 * Kullanım: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('👤 Ana Admin Kullanıcısı Oluşturuluyor...\n');

  try {
    // Önce kontrol et
    const existing = await prisma.user.findUnique({
      where: { email: 'bentahasarii@gmail.com' }
    });

    if (existing) {
      console.log('✅ Ana admin zaten mevcut:');
      console.log(`   Email: ${existing.email}`);
      console.log(`   İsim: ${existing.name}`);
      console.log(`   Rol: ${existing.role}`);
      console.log(`   Durum: ${existing.isActive ? 'Aktif' : 'Pasif'}`);
      return;
    }

    // Oluştur
    const admin = await prisma.user.create({
      data: {
        email: 'bentahasarii@gmail.com',
        name: 'Ana Admin',
        role: 'ADMIN',
        isActive: true,
        emailVerified: new Date(),
      }
    });

    console.log('✅ Ana admin başarıyla oluşturuldu!\n');
    console.log('📋 Detaylar:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   İsim: ${admin.name}`);
    console.log(`   Rol: ${admin.role}`);
    console.log(`   Oluşturulma: ${admin.createdAt}`);
    
    console.log('\n💡 Önemli Notlar:');
    console.log('   1. NextAuth kullanıyorsanız, şifre NextAuth tarafından yönetilir');
    console.log('   2. İlk giriş için email magic link veya OAuth kullanabilirsiniz');
    console.log('   3. Admin paneline giriş için: /admin');

  } catch (error) {
    console.error('\n❌ Hata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

