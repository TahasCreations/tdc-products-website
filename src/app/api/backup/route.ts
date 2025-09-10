import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'create';

    if (action === 'create') {
      // Tüm tabloları yedekle
      const tables = [
        'products',
        'categories', 
        'users',
        'orders',
        'comments',
        'blogs',
        'accounts',
        'contacts',
        'journal_entries',
        'journal_lines',
        'currency_rates',
        'contact_payments'
      ];

      const backup: any = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        tables: {}
      };

      for (const table of tables) {
        try {
          const { data, error } = await supabase!
            .from(table)
            .select('*');

          if (!error && data) {
            backup.tables[table] = data;
          }
        } catch (error) {
          console.error(`Backup error for table ${table}:`, error);
          backup.tables[table] = [];
        }
      }

      return NextResponse.json({
        success: true,
        backup,
        message: 'Yedekleme başarıyla oluşturuldu'
      });
    }

    if (action === 'list') {
      // Yedekleme listesini getir
      const { data, error } = await supabase!
        .from('backups')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        return NextResponse.json({ error: 'Yedekleme listesi alınamadı' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        backups: data || []
      });
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });

  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json({ error: 'Yedekleme hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    const body = await request.json();
    const { action, backupData, backupId } = body;

    if (action === 'save') {
      // Yedeklemeyi veritabanına kaydet
      const { data, error } = await supabase!
        .from('backups')
        .insert([{
          name: `Backup_${new Date().toISOString().split('T')[0]}`,
          data: backupData,
          size: JSON.stringify(backupData).length,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: 'Yedekleme kaydedilemedi' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        backup: data,
        message: 'Yedekleme kaydedildi'
      });
    }

    if (action === 'restore') {
      if (!backupId) {
        return NextResponse.json({ error: 'Yedekleme ID gerekli' }, { status: 400 });
      }

      // Yedeklemeyi geri yükle
      const { data: backup, error: backupError } = await supabase!
        .from('backups')
        .select('data')
        .eq('id', backupId)
        .single();

      if (backupError || !backup) {
        return NextResponse.json({ error: 'Yedekleme bulunamadı' }, { status: 404 });
      }

      const backupData = backup.data;
      const results: any = {};

      // Her tabloyu geri yükle
      for (const [tableName, tableData] of Object.entries(backupData.tables)) {
        try {
          // Mevcut verileri temizle
          await supabase!.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
          
          // Yedeklenen verileri ekle
          if (Array.isArray(tableData) && tableData.length > 0) {
            const { data, error } = await supabase!
              .from(tableName)
              .insert(tableData);

            results[tableName] = { success: !error, error: error?.message };
          }
        } catch (error) {
          results[tableName] = { success: false, error: (error as Error).message };
        }
      }

      return NextResponse.json({
        success: true,
        results,
        message: 'Yedekleme geri yüklendi'
      });
    }

    if (action === 'delete') {
      if (!backupId) {
        return NextResponse.json({ error: 'Yedekleme ID gerekli' }, { status: 400 });
      }

      const { error } = await supabase!
        .from('backups')
        .delete()
        .eq('id', backupId);

      if (error) {
        return NextResponse.json({ error: 'Yedekleme silinemedi' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Yedekleme silindi'
      });
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });

  } catch (error) {
    console.error('Backup operation error:', error);
    return NextResponse.json({ error: 'İşlem hatası' }, { status: 500 });
  }
}
