import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const stockItemId = searchParams.get('stockItemId');

    // Stok hareketlerini çek
    let query = supabase!
      .from('inventory_txns')
      .select(`
        *,
        stock_items (
          id,
          code,
          name,
          unit
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (stockItemId) {
      query = query.eq('stock_item_id', stockItemId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Stock transactions GET error:', error);
    return NextResponse.json(
      { error: 'Stok hareketleri alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.date || !body.type || !body.quantity || !body.unit_cost || !body.stock_item_id) {
      return NextResponse.json(
        { error: 'Tarih, tür, miktar, birim maliyet ve stok kartı gerekli' },
        { status: 400 }
      );
    }

    // Stok kartını kontrol et
    const { data: stockItem, error: stockError } = await supabase!
      .from('stock_items')
      .select('*')
      .eq('id', body.stock_item_id)
      .single();

    if (stockError || !stockItem) {
      return NextResponse.json(
        { error: 'Stok kartı bulunamadı' },
        { status: 404 }
      );
    }

    // Yeni stok hareketi ekle
    const { data, error } = await supabase!
      .from('inventory_txns')
      .insert([{
        date: body.date,
        type: body.type,
        quantity: body.quantity,
        unit_cost: body.unit_cost,
        total_cost: body.quantity * body.unit_cost,
        reference: body.reference || null,
        description: body.description || null,
        stock_item_id: body.stock_item_id,
        company_id: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan şirket
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Stok miktarını güncelle
    await updateStockQuantity(stockItem, body, supabase);

    // Otomatik yevmiye fişi oluştur
    await createJournalEntryForStockTransaction(data, stockItem, supabase);

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Stock transactions POST error:', error);
    return NextResponse.json(
      { error: 'Stok hareketi eklenemedi' },
      { status: 500 }
    );
  }
}

// Stok miktarını güncelle
async function updateStockQuantity(stockItem: any, transaction: any, supabase: any) {
  try {
    let newQuantity = stockItem.current_stock;
    let newAvgCost = stockItem.avg_cost;

    if (transaction.type === 'IN') {
      // Giriş: Miktar artır, ortalama maliyet güncelle
      newQuantity += transaction.quantity;
      if (newQuantity > 0) {
        newAvgCost = ((stockItem.current_stock * stockItem.avg_cost) + (transaction.quantity * transaction.unit_cost)) / newQuantity;
      }
    } else if (transaction.type === 'OUT') {
      // Çıkış: Miktar azalt
      newQuantity -= transaction.quantity;
      if (newQuantity < 0) newQuantity = 0;
    } else if (transaction.type === 'ADJUSTMENT') {
      // Düzeltme: Miktarı ayarla
      newQuantity = transaction.quantity;
    } else if (transaction.type === 'COUNT') {
      // Sayım: Fiziki miktarı ayarla
      newQuantity = transaction.quantity;
    }

    // Stok kartını güncelle
    await supabase
      .from('stock_items')
      .update({
        current_stock: newQuantity,
        avg_cost: newAvgCost,
        last_cost: transaction.unit_cost,
        updated_at: new Date().toISOString()
      })
      .eq('id', stockItem.id);

  } catch (error) {
    console.error('Stock quantity update error:', error);
  }
}

// Stok hareketi için otomatik yevmiye fişi oluştur
async function createJournalEntryForStockTransaction(transaction: any, stockItem: any, supabase: any) {
  try {
    // Yevmiye fişi oluştur
    const { data: journalEntry } = await supabase
      .from('journal_entries')
      .insert([{
        date: transaction.date,
        description: `Stok Hareketi: ${transaction.description || stockItem.name}`,
        reference: transaction.reference || `STK-${transaction.id}`,
        status: 'POSTED',
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      }])
      .select()
      .single();

    if (!journalEntry) return;

    // Yevmiye fişi satırları oluştur
    const lines = [];

    if (transaction.type === 'IN') {
      // Stok Girişi: 153 Stok Hesabı Borç, 320 Satıcı Hesabı Alacak
      lines.push({
        account_id: 'a1530000-0000-0000-0000-000000000001', // Stok hesabı
        debit: transaction.total_cost,
        credit: 0,
        description: transaction.description || `Stok girişi: ${stockItem.name}`,
        journal_entry_id: journalEntry.id
      });
      lines.push({
        account_id: 'a3200000-0000-0000-0000-000000000001', // Satıcı hesabı
        debit: 0,
        credit: transaction.total_cost,
        description: transaction.description || `Stok girişi: ${stockItem.name}`,
        journal_entry_id: journalEntry.id
      });
    } else if (transaction.type === 'OUT') {
      // Stok Çıkışı: 621 Satılan Malın Maliyeti Borç, 153 Stok Hesabı Alacak
      lines.push({
        account_id: 'a6210000-0000-0000-0000-000000000001', // Satılan malın maliyeti
        debit: transaction.total_cost,
        credit: 0,
        description: transaction.description || `Stok çıkışı: ${stockItem.name}`,
        journal_entry_id: journalEntry.id
      });
      lines.push({
        account_id: 'a1530000-0000-0000-0000-000000000001', // Stok hesabı
        debit: 0,
        credit: transaction.total_cost,
        description: transaction.description || `Stok çıkışı: ${stockItem.name}`,
        journal_entry_id: journalEntry.id
      });
    } else {
      // Düzeltme/Sayım: 153 Stok Hesabı Borç/Alacak, 690 Dönem Kar/Zarar Alacak/Borç
      const isDebit = transaction.type === 'ADJUSTMENT' && transaction.quantity > stockItem.current_stock;
      lines.push({
        account_id: 'a1530000-0000-0000-0000-000000000001', // Stok hesabı
        debit: isDebit ? transaction.total_cost : 0,
        credit: isDebit ? 0 : transaction.total_cost,
        description: transaction.description || `Stok ${transaction.type.toLowerCase()}: ${stockItem.name}`,
        journal_entry_id: journalEntry.id
      });
      lines.push({
        account_id: 'a6900000-0000-0000-0000-000000000001', // Dönem kar/zarar
        debit: isDebit ? 0 : transaction.total_cost,
        credit: isDebit ? transaction.total_cost : 0,
        description: transaction.description || `Stok ${transaction.type.toLowerCase()}: ${stockItem.name}`,
        journal_entry_id: journalEntry.id
      });
    }

    // Yevmiye fişi satırlarını ekle
    await supabase
      .from('journal_lines')
      .insert(lines);

  } catch (error) {
    console.error('Journal entry creation error:', error);
  }
}
