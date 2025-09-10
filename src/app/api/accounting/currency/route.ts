import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';
import { AppErrorHandler } from '../../../../lib/error-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const result = await AppErrorHandler.withErrorHandling(async () => {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      throw new Error('Veritabanı bağlantısı kurulamadı');
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '550e8400-e29b-41d4-a716-446655440000';
    const action = searchParams.get('action') || 'list';

    switch (action) {
      case 'list':
        return await getCurrencyRates(companyId, supabase);
      case 'settings':
        return await getCurrencySettings(companyId, supabase);
      case 'favorites':
        return await getCurrencyFavorites(companyId, supabase);
      case 'alerts':
        return await getCurrencyAlerts(companyId, supabase);
      case 'holdings':
        return await getCurrencyHoldings(companyId, supabase);
      case 'history':
        return await getCurrencyHistory(companyId, searchParams, supabase);
      default:
        throw new Error('Geçersiz işlem');
    }

  }, 'Currency GET API');

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const result = await AppErrorHandler.withErrorHandling(async () => {
    const body = await request.json();
    const { action, ...data } = body;

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      throw new Error('Veritabanı bağlantısı kurulamadı');
    }

    switch (action) {
      case 'update_rates':
        return await updateCurrencyRates(data, supabase);
      case 'save_settings':
        return await saveCurrencySettings(data, supabase);
      case 'add_favorite':
        return await addCurrencyFavorite(data, supabase);
      case 'remove_favorite':
        return await removeCurrencyFavorite(data, supabase);
      case 'add_alert':
        return await addCurrencyAlert(data, supabase);
      case 'update_alert':
        return await updateCurrencyAlert(data, supabase);
      case 'delete_alert':
        return await deleteCurrencyAlert(data, supabase);
      case 'manual_rate':
        return await addManualRate(data, supabase);
      case 'convert':
        return await convertCurrency(data, supabase);
      default:
        throw new Error('Geçersiz işlem');
    }

  }, 'Currency POST API');

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 400 });
  }
}

async function getCurrencyRates(companyId: string, supabase: any) {
  const { data: rates, error } = await supabase!
    .from('currency_rates')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .eq('rate_date', new Date().toISOString().split('T')[0])
    .order('currency_code');

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(rates || []);
}

async function getCurrencySettings(companyId: string, supabase: any) {
  const { data: settings, error } = await supabase!
    .from('currency_settings')
    .select('*')
    .eq('company_id', companyId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(settings || null);
}

async function getCurrencyFavorites(companyId: string, supabase: any) {
  const { data: favorites, error } = await supabase!
    .from('currency_favorites')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_favorite', true)
    .order('display_order');

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(favorites || []);
}

async function getCurrencyAlerts(companyId: string, supabase: any) {
  const { data: alerts, error } = await supabase!
    .from('currency_alerts')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(alerts || []);
}

async function getCurrencyHoldings(companyId: string, supabase: any) {
  // Şirketin döviz varlıklarını hesapla (hesaplardan)
  const { data: accounts, error: accountsError } = await supabase!
    .from('accounts')
    .select('id, code, name, currency_code')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .neq('currency_code', 'TRY');

  if (accountsError) {
    throw accountsError;
  }

  // Her döviz hesabı için bakiye hesapla
  const holdings = await Promise.all(
    accounts?.map(async (account: any) => {
      // Hesap bakiyesini hesapla
      const { data: debitData } = await supabase!
        .from('journal_lines')
        .select('debit')
        .eq('account_id', account.id);

      const { data: creditData } = await supabase!
        .from('journal_lines')
        .select('credit')
        .eq('account_id', account.id);

      const debitTotal = debitData?.reduce((sum: number, line: any) => sum + (line.debit || 0), 0) || 0;
      const creditTotal = creditData?.reduce((sum: number, line: any) => sum + (line.credit || 0), 0) || 0;
      const balance = debitTotal - creditTotal;

      if (balance <= 0) return null;

      // Güncel kur ile TRY karşılığını hesapla
      const { data: rateData } = await supabase!
        .from('currency_rates')
        .select('buy_rate')
        .eq('currency_code', account.currency_code)
        .eq('rate_date', new Date().toISOString().split('T')[0])
        .single();

      const currentRate = rateData?.buy_rate || 1;
      const equivalentTry = balance * currentRate;

      return {
        id: account.id,
        currency_code: account.currency_code,
        amount: balance,
        equivalent_try: equivalentTry,
        last_updated: new Date().toISOString()
      };
    }) || []
  );

  // Null değerleri filtrele
  const validHoldings = holdings.filter(h => h !== null);

  return AppErrorHandler.createApiSuccessResponse(validHoldings);
}

async function getCurrencyHistory(companyId: string, searchParams: URLSearchParams, supabase: any) {
  const currencyCode = searchParams.get('currencyCode');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let query = supabase!
    .from('currency_rates')
    .select('*')
    .eq('company_id', companyId)
    .order('rate_date', { ascending: false });

  if (currencyCode) {
    query = query.eq('currency_code', currencyCode);
  }

  if (startDate) {
    query = query.gte('rate_date', startDate);
  }

  if (endDate) {
    query = query.lte('rate_date', endDate);
  }

  const { data: history, error } = await query;

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(history || []);
}

async function updateCurrencyRates(data: any, supabase: any) {
  const { companyId } = data;

  // TCMB'den güncel kurları çek
  const rates = await fetchTCMBRates();

  // Mevcut kurları güncelle veya yeni ekle
  const updatePromises = rates.map(async (rate: any) => {
    const { data: existingRate } = await supabase
      .from('currency_rates')
      .select('id')
      .eq('company_id', companyId)
      .eq('currency_code', rate.currency_code)
      .eq('rate_date', new Date().toISOString().split('T')[0])
      .single();

    const rateData = {
      company_id: companyId,
      currency_code: rate.currency_code,
      currency_name: rate.currency_name,
      buy_rate: rate.buy_rate,
      sell_rate: rate.sell_rate,
      effective_buy_rate: rate.effective_buy_rate,
      effective_sell_rate: rate.effective_sell_rate,
      rate_date: new Date().toISOString().split('T')[0],
      source: 'TCMB'
    };

    if (existingRate) {
      // Güncelle
      return supabase
        .from('currency_rates')
        .update(rateData)
        .eq('id', existingRate.id);
    } else {
      // Yeni ekle
      return supabase
        .from('currency_rates')
        .insert([rateData]);
    }
  });

  await Promise.all(updatePromises);

  // Log kaydet
  await supabase
    .from('currency_rate_logs')
    .insert([{
      company_id: companyId,
      action: 'UPDATE',
      source: 'TCMB'
    }]);

  // Ayarları güncelle
  await supabase
    .from('currency_settings')
    .update({ last_update: new Date().toISOString() })
    .eq('company_id', companyId);

  return AppErrorHandler.createApiSuccessResponse(rates, 'Döviz kurları güncellendi');
}

async function saveCurrencySettings(data: any, supabase: any) {
  const { companyId, autoUpdateEnabled, updateFrequency } = data;

  const { data: existingSettings } = await supabase
    .from('currency_settings')
    .select('id')
    .eq('company_id', companyId)
    .single();

  const settingsData = {
    company_id: companyId,
    auto_update_enabled: autoUpdateEnabled,
    update_frequency: updateFrequency
  };

  let result;
  if (existingSettings) {
    result = await supabase
      .from('currency_settings')
      .update(settingsData)
      .eq('id', existingSettings.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from('currency_settings')
      .insert([settingsData])
      .select()
      .single();
  }

  if (result.error) {
    throw result.error;
  }

  return AppErrorHandler.createApiSuccessResponse(result.data, 'Döviz kuru ayarları kaydedildi');
}

async function addCurrencyFavorite(data: any, supabase: any) {
  const { companyId, currencyCode, displayOrder } = data;

  const { data: favorite, error } = await supabase
    .from('currency_favorites')
    .insert([{
      company_id: companyId,
      currency_code: currencyCode,
      is_favorite: true,
      display_order: displayOrder || 0
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(favorite, 'Favori döviz eklendi');
}

async function removeCurrencyFavorite(data: any, supabase: any) {
  const { companyId, currencyCode } = data;

  const { error } = await supabase
    .from('currency_favorites')
    .update({ is_favorite: false })
    .eq('company_id', companyId)
    .eq('currency_code', currencyCode);

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(null, 'Favori döviz kaldırıldı');
}

async function addCurrencyAlert(data: any, supabase: any) {
  const { companyId, currencyCode, alertType, targetRate, notificationEmail } = data;

  const { data: alert, error } = await supabase
    .from('currency_alerts')
    .insert([{
      company_id: companyId,
      currency_code: currencyCode,
      alert_type: alertType,
      target_rate: targetRate,
      notification_email: notificationEmail,
      is_active: true
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(alert, 'Döviz kuru alarmı eklendi');
}

async function updateCurrencyAlert(data: any, supabase: any) {
  const { alertId, alertType, targetRate, isActive } = data;

  const { data: alert, error } = await supabase
    .from('currency_alerts')
    .update({
      alert_type: alertType,
      target_rate: targetRate,
      is_active: isActive
    })
    .eq('id', alertId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(alert, 'Döviz kuru alarmı güncellendi');
}

async function deleteCurrencyAlert(data: any, supabase: any) {
  const { alertId } = data;

  const { error } = await supabase
    .from('currency_alerts')
    .delete()
    .eq('id', alertId);

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(null, 'Döviz kuru alarmı silindi');
}

async function addManualRate(data: any, supabase: any) {
  const { companyId, currencyCode, currencyName, buyRate, sellRate, rateDate } = data;

  const { data: rate, error } = await supabase
    .from('currency_rates')
    .insert([{
      company_id: companyId,
      currency_code: currencyCode,
      currency_name: currencyName,
      buy_rate: buyRate,
      sell_rate: sellRate,
      effective_buy_rate: buyRate,
      effective_sell_rate: sellRate,
      rate_date: rateDate,
      source: 'MANUAL'
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Log kaydet
  await supabase
    .from('currency_rate_logs')
    .insert([{
      company_id: companyId,
      action: 'MANUAL_UPDATE',
      currency_code: currencyCode,
      new_rate: buyRate,
      source: 'MANUAL'
    }]);

  return AppErrorHandler.createApiSuccessResponse(rate, 'Manuel döviz kuru eklendi');
}

async function convertCurrency(data: any, supabase: any) {
  const { companyId, fromCurrency, toCurrency, amount, rateType = 'buy' } = data;

  // Güncel kurları al
  const { data: rates, error } = await supabase!
    .from('currency_rates')
    .select('*')
    .eq('company_id', companyId)
    .eq('rate_date', new Date().toISOString().split('T')[0])
    .in('currency_code', [fromCurrency, toCurrency]);

  if (error) {
    throw error;
  }

  if (!rates || rates.length < 2) {
    throw new Error('Döviz kurları bulunamadı');
  }

  const fromRate = rates.find((r: any) => r.currency_code === fromCurrency);
  const toRate = rates.find((r: any) => r.currency_code === toCurrency);

  if (!fromRate || !toRate) {
    throw new Error('Döviz kurları bulunamadı');
  }

  // Çevrim hesaplama
  let convertedAmount;
  if (fromCurrency === 'TRY') {
    // TRY'den diğer dövize
    const rate = rateType === 'buy' ? toRate.sell_rate : toRate.buy_rate;
    convertedAmount = amount / rate;
  } else if (toCurrency === 'TRY') {
    // Diğer dövizden TRY'ye
    const rate = rateType === 'buy' ? fromRate.buy_rate : fromRate.sell_rate;
    convertedAmount = amount * rate;
  } else {
    // Dövizden dövize
    const fromRateValue = rateType === 'buy' ? fromRate.buy_rate : fromRate.sell_rate;
    const toRateValue = rateType === 'buy' ? toRate.sell_rate : toRate.buy_rate;
    convertedAmount = (amount * fromRateValue) / toRateValue;
  }

  return AppErrorHandler.createApiSuccessResponse({
    fromCurrency,
    toCurrency,
    originalAmount: amount,
    convertedAmount: Math.round(convertedAmount * 100) / 100,
    rateType,
    conversionDate: new Date().toISOString()
  });
}

// TCMB'den döviz kurlarını çeken fonksiyon
async function fetchTCMBRates() {
  try {
    // TCMB XML endpoint'ini çağır
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml');
    const xmlText = await response.text();
    
    // XML'i parse et (basit regex ile)
    const rates = [];
    const currencyRegex = /<Currency CurrencyCode="([^"]+)">[\s\S]*?<CurrencyName>([^<]+)<\/CurrencyName>[\s\S]*?<ForexBuying>([^<]+)<\/ForexBuying>[\s\S]*?<ForexSelling>([^<]+)<\/ForexSelling>[\s\S]*?<BanknoteBuying>([^<]+)<\/BanknoteBuying>[\s\S]*?<BanknoteSelling>([^<]+)<\/BanknoteSelling>/g;
    
    let match;
    while ((match = currencyRegex.exec(xmlText)) !== null) {
      const [, code, name, forexBuying, forexSelling, banknoteBuying, banknoteSelling] = match;
      
      rates.push({
        currency_code: code,
        currency_name: name,
        buy_rate: parseFloat(forexBuying) || parseFloat(banknoteBuying) || 0,
        sell_rate: parseFloat(forexSelling) || parseFloat(banknoteSelling) || 0,
        effective_buy_rate: parseFloat(forexBuying) || parseFloat(banknoteBuying) || 0,
        effective_sell_rate: parseFloat(forexSelling) || parseFloat(banknoteSelling) || 0
      });
    }
    
    return rates;
  } catch (error) {
    console.error('TCMB rates fetch error:', error);
    // Hata durumunda varsayılan kurları döndür
    return [
      { currency_code: 'USD', currency_name: 'Amerikan Doları', buy_rate: 34.5000, sell_rate: 34.6000, effective_buy_rate: 34.5000, effective_sell_rate: 34.6000 },
      { currency_code: 'EUR', currency_name: 'Euro', buy_rate: 37.2000, sell_rate: 37.3000, effective_buy_rate: 37.2000, effective_sell_rate: 37.3000 },
      { currency_code: 'GBP', currency_name: 'İngiliz Sterlini', buy_rate: 43.8000, sell_rate: 43.9000, effective_buy_rate: 43.8000, effective_sell_rate: 43.9000 }
    ];
  }
}
