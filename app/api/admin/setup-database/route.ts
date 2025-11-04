/**
 * Database Setup API
 * Bu endpoint tablolarıı oluşturur
 * Sadece 1 kez çalıştırın!
 */

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 saniye timeout

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { confirmKey } = body;

    // Güvenlik kontrolü
    if (confirmKey !== 'SETUP_DATABASE_TDC_2024') {
      return NextResponse.json(
        { error: 'Invalid confirmation key' },
        { status: 403 }
      );
    }

    console.log('🚀 Database setup başlıyor...');

    // Prisma migrate deploy çalıştır
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');

    console.log('✅ Migration çıktısı:', stdout);
    if (stderr) {
      console.log('⚠️ Uyarılar:', stderr);
    }

    return NextResponse.json({
      success: true,
      message: 'Database tabloları başarıyla oluşturuldu!',
      output: stdout,
      warnings: stderr,
    });

  } catch (error: any) {
    console.error('❌ Database setup hatası:', error);
    
    return NextResponse.json(
      {
        error: 'Database setup başarısız',
        message: error.message,
        details: error.stderr || error.stdout,
      },
      { status: 500 }
    );
  }
}

