#!/usr/bin/env node

/**
 * Create Admin User Script
 * 
 * Bu script admin kullanıcısı oluşturur
 * Email: bentahasarii@gmail.com
 * Password: 35Sandalye
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('🔐 Admin Kullanıcısı Oluşturuluyor...\n');

  const adminEmail = 'bentahasarii@gmail.com';
  const adminPassword = '35Sandalye';
  const adminName = 'Admin';

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin kullanıcısı zaten mevcut!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   ID: ${existingAdmin.id}`);
      
      // Update password if needed
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          roles: JSON.stringify(['ADMIN', 'BUYER']),
        }
      });
      
      console.log('✅ Admin şifresi güncellendi!');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        roles: JSON.stringify(['ADMIN', 'BUYER']),
        emailVerified: new Date(),
        isActive: true,
      }
    });

    console.log('✅ Admin kullanıcısı oluşturuldu!\n');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Şifre: 35Sandalye');
    console.log('👤 ID:', admin.id);
    console.log('🎯 Role: ADMIN');
    console.log('\n🚀 Admin paneline giriş yapabilirsiniz!');
    console.log('   URL: https://www.tdcproductsonline.com/admin');

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();

