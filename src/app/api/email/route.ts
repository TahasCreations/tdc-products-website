import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendBulkEmail } from '../../../lib/email';

// E-posta gönderme API'si
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { to, template, data, bulk = false } = await request.json();

    if (!to || !template) {
      return NextResponse.json({ 
        success: false, 
        error: 'Gerekli alanlar eksik' 
      }, { status: 400 });
    }

    let result;

    if (bulk && Array.isArray(to)) {
      // Toplu e-posta gönderme
      result = await sendBulkEmail(to, template, data);
    } else if (!bulk && typeof to === 'string') {
      // Tek e-posta gönderme
      result = await sendEmail(to, template, data);
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz parametreler' 
      }, { status: 400 });
    }

    if (bulk && Array.isArray(result)) {
      // Toplu e-posta sonucu
      const successCount = result.filter(r => r.success).length;
      const failedCount = result.length - successCount;
      
      return NextResponse.json({
        success: true,
        message: `${successCount} e-posta başarıyla gönderildi, ${failedCount} başarısız`,
        data: result
      });
    } else if (!bulk && typeof result === 'object' && 'success' in result) {
      // Tek e-posta sonucu
      if (result.success) {
        return NextResponse.json({
          success: true,
          message: 'E-posta başarıyla gönderildi',
          data: result
        });
      } else {
        return NextResponse.json({
          success: false,
          error: 'E-posta gönderilemedi',
          details: result.error
        }, { status: 500 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: 'Beklenmeyen sonuç formatı'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('E-posta API hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Test e-postası gönderme
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');

    if (!testEmail) {
      return NextResponse.json({ 
        success: false, 
        error: 'Test e-posta adresi gerekli' 
      }, { status: 400 });
    }

    // Test e-postası gönder
    const result = await sendEmail(testEmail, 'welcome', 'Test Kullanıcı');

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test e-postası başarıyla gönderildi',
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Test e-postası gönderilemedi',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test e-posta hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
