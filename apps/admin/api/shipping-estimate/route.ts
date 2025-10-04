import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { shippingEstimateConfigSchema } from '../../schemas/shippingEstimate';
import { calculateBaseETA, generateETAPreview } from '../../lib/shipping/eta';

// GET: Shipping estimate hesaplama
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configParam = searchParams.get('config');
    const region = searchParams.get('region') || 'TR-Domestic';
    const orderDate = searchParams.get('orderDate') || new Date().toISOString();

    if (!configParam) {
      return NextResponse.json(
        { error: 'Config parametresi gerekli' },
        { status: 400 }
      );
    }

    // Config'i parse et
    const config = JSON.parse(configParam);
    const validatedConfig = shippingEstimateConfigSchema.parse(config);

    // ETA hesapla
    const eta = calculateBaseETA(validatedConfig, new Date(orderDate), region as any);
    const preview = generateETAPreview(validatedConfig, new Date(orderDate), region as any);

    return NextResponse.json({
      success: true,
      data: {
        eta,
        preview,
        region,
        orderDate: new Date(orderDate).toISOString()
      }
    });

  } catch (error) {
    console.error('Shipping estimate hesaplama hatası:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Geçersiz konfigürasyon', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// POST: Yeni shipping estimate konfigürasyonu kaydet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedConfig = shippingEstimateConfigSchema.parse(body);

    // Burada veritabanına kaydetme işlemi yapılacak
    // Şimdilik mock response döndürüyoruz
    
    const configId = `shipping_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      data: {
        id: configId,
        config: validatedConfig,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Shipping estimate kaydetme hatası:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Geçersiz konfigürasyon', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// PUT: Mevcut shipping estimate konfigürasyonunu güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, config } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { status: 400 }
      );
    }

    const validatedConfig = shippingEstimateConfigSchema.parse(config);

    // Burada veritabanında güncelleme işlemi yapılacak
    // Şimdilik mock response döndürüyoruz
    
    return NextResponse.json({
      success: true,
      data: {
        id,
        config: validatedConfig,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Shipping estimate güncelleme hatası:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Geçersiz konfigürasyon', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

// DELETE: Shipping estimate konfigürasyonunu sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parametresi gerekli' },
        { status: 400 }
      );
    }

    // Burada veritabanından silme işlemi yapılacak
    // Şimdilik mock response döndürüyoruz
    
    return NextResponse.json({
      success: true,
      data: {
        id,
        deletedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Shipping estimate silme hatası:', error);
    
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
