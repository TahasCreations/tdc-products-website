import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

// Font yükleme
async function getFont() {
  const response = await fetch(
    new URL('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap')
  );
  
  if (!response.ok) {
    throw new Error('Failed to load font');
  }
  
  return response.arrayBuffer();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parametreleri al
    const title = searchParams.get('title') || 'TDC Market';
    const subtitle = searchParams.get('subtitle') || '';
    const category = searchParams.get('category') || '';
    const width = parseInt(searchParams.get('width') || '1200');
    const height = parseInt(searchParams.get('height') || '630');
    const type = searchParams.get('type') || 'og';

    // Font yükle
    const fontData = await getFont();

    // Kategoriye göre tema
    const theme = getThemeForCategory(category);
    
    // Görsel oluştur
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.background,
            position: 'relative',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Arka plan pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: theme.pattern,
              opacity: 0.1,
            }}
          />

          {/* Ana içerik */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '80px',
              maxWidth: '90%',
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: theme.accent,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                }}
              >
                <span
                  style={{
                    color: '#0B0B0B',
                    fontSize: '28px',
                    fontWeight: '800',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  TDC
                </span>
              </div>
              <span
                style={{
                  color: theme.text.primary,
                  fontSize: '32px',
                  fontWeight: '700',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Market
              </span>
            </div>

            {/* Başlık */}
            <h1
              style={{
                fontSize: title.length > 30 ? '48px' : '64px',
                fontWeight: '800',
                color: theme.text.primary,
                margin: '0 0 20px 0',
                lineHeight: 1.2,
                textAlign: 'center',
                maxWidth: '100%',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>

            {/* Alt başlık */}
            {subtitle && (
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: '400',
                  color: theme.text.secondary,
                  margin: '0 0 40px 0',
                  lineHeight: 1.4,
                  textAlign: 'center',
                  maxWidth: '80%',
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Kategori badge */}
            {category && (
              <div
                style={{
                  background: theme.accent,
                  color: '#0B0B0B',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginTop: '20px',
                }}
              >
                {getCategoryLabel(category)}
              </div>
            )}
          </div>

          {/* Alt watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '40px',
              color: theme.text.secondary,
              fontSize: '16px',
              opacity: 0.6,
            }}
          >
            tdcmarket.com
          </div>
        </div>
      ),
      {
        width,
        height,
        fonts: [
          {
            name: 'Inter',
            data: fontData,
            style: 'normal',
            weight: 400,
          },
        ],
      }
    );
  } catch (error) {
    console.error('OG Image generation error:', error);
    
    // Fallback görsel
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a1a 100%)',
            color: '#F6F6F6',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          TDC Market
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}

// Kategoriye göre tema
function getThemeForCategory(category: string) {
  const themes = {
    'figur-koleksiyon': {
      background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a2e 100%)',
      pattern: 'radial-gradient(circle at 20% 80%, #CBA135 0%, transparent 50%), radial-gradient(circle at 80% 20%, #F4D03F 0%, transparent 50%)',
      accent: '#CBA135',
      text: {
        primary: '#F6F6F6',
        secondary: '#B0B0B0'
      }
    },
    'moda-aksesuar': {
      background: 'linear-gradient(135deg, #F6F6F6 0%, #E5E5E5 100%)',
      pattern: 'linear-gradient(45deg, #CBA135 0%, transparent 50%), linear-gradient(-45deg, #F4D03F 0%, transparent 50%)',
      accent: '#CBA135',
      text: {
        primary: '#0B0B0B',
        secondary: '#404040'
      }
    },
    'elektronik': {
      background: 'linear-gradient(135deg, #0B0B0B 0%, #1a1a2e 100%)',
      pattern: 'linear-gradient(90deg, #CBA135 0%, transparent 50%), linear-gradient(0deg, #F4D03F 0%, transparent 50%)',
      accent: '#CBA135',
      text: {
        primary: '#F6F6F6',
        secondary: '#B0B0B0'
      }
    },
    'ev-yasam': {
      background: 'linear-gradient(135deg, #FEF7E0 0%, #F5E6D3 100%)',
      pattern: 'radial-gradient(circle at 30% 70%, #CBA135 0%, transparent 50%), radial-gradient(circle at 70% 30%, #F4D03F 0%, transparent 50%)',
      accent: '#CBA135',
      text: {
        primary: '#0B0B0B',
        secondary: '#404040'
      }
    },
    'sanat-hobi': {
      background: 'linear-gradient(135deg, #F0F0F0 0%, #E0E0E0 100%)',
      pattern: 'linear-gradient(30deg, #CBA135 0%, transparent 50%), linear-gradient(-30deg, #F4D03F 0%, transparent 50%)',
      accent: '#CBA135',
      text: {
        primary: '#0B0B0B',
        secondary: '#404040'
      }
    },
    'hediyelik': {
      background: 'linear-gradient(135deg, #FFF5E6 0%, #FFE4B5 100%)',
      pattern: 'radial-gradient(circle at 25% 75%, #CBA135 0%, transparent 50%), radial-gradient(circle at 75% 25%, #F4D03F 0%, transparent 50%)',
      accent: '#CBA135',
      text: {
        primary: '#0B0B0B',
        secondary: '#404040'
      }
    }
  };

  return themes[category as keyof typeof themes] || themes['figur-koleksiyon'];
}

// Kategori etiketleri
function getCategoryLabel(category: string): string {
  const labels = {
    'figur-koleksiyon': 'Figür & Koleksiyon',
    'moda-aksesuar': 'Moda & Aksesuar',
    'elektronik': 'Elektronik',
    'ev-yasam': 'Ev & Yaşam',
    'sanat-hobi': 'Sanat & Hobi',
    'hediyelik': 'Hediyelik'
  };

  return labels[category as keyof typeof labels] || category;
}