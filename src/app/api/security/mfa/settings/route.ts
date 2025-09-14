import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../../lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client could not be created' }, { status: 500 });
    }

    // Mock MFA settings data
    const mfaSettings = {
      methods: [
        {
          id: '1',
          type: 'totp',
          name: 'Authenticator Uygulaması',
          description: 'Google Authenticator, Authy gibi uygulamalar',
          isEnabled: true,
          isVerified: true,
          icon: 'QrCodeIcon',
          color: 'bg-blue-500'
        },
        {
          id: '2',
          type: 'sms',
          name: 'SMS Doğrulama',
          description: 'Telefon numaranıza gönderilen SMS kodu',
          isEnabled: false,
          isVerified: false,
          icon: 'DevicePhoneMobileIcon',
          color: 'bg-green-500'
        },
        {
          id: '3',
          type: 'email',
          name: 'E-posta Doğrulama',
          description: 'E-posta adresinize gönderilen doğrulama kodu',
          isEnabled: false,
          isVerified: false,
          icon: 'EnvelopeIcon',
          color: 'bg-purple-500'
        },
        {
          id: '4',
          type: 'backup_codes',
          name: 'Yedek Kodlar',
          description: 'Tek kullanımlık yedek kodlar',
          isEnabled: true,
          isVerified: true,
          icon: 'KeyIcon',
          color: 'bg-yellow-500'
        }
      ],
      backupCodes: [
        'ABC123DEF',
        'GHI456JKL',
        'MNO789PQR',
        'STU012VWX',
        'YZA345BCD',
        'EFG678HIJ',
        'KLM901NOP',
        'QRS234TUV',
        'WXY567ZAB',
        'CDE890FGH'
      ],
      isMFARequired: true,
      isMFAEnabled: true
    };

    return NextResponse.json(mfaSettings);
  } catch (error) {
    console.error('MFA settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
