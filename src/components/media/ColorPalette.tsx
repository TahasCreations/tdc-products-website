'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Copy, 
  Check, 
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  Upload
} from 'lucide-react';

interface ColorPaletteProps {
  imageUrl?: string;
  onPaletteExtract?: (palette: ColorPaletteData) => void;
  className?: string;
}

interface ColorPaletteData {
  dominant: string;
  palette: string[];
  isDark: boolean;
  contrast: {
    light: number;
    dark: number;
  };
  harmony: {
    analogous: string[];
    complementary: string[];
    triadic: string[];
  };
}

export function ColorPalette({ 
  imageUrl, 
  onPaletteExtract, 
  className = '' 
}: ColorPaletteProps) {
  const [palette, setPalette] = useState<ColorPaletteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showHex, setShowHex] = useState(true);
  const [showHarmony, setShowHarmony] = useState(true);

  // Renk paleti çıkarma
  const extractPalette = async (url: string) => {
    setLoading(true);
    try {
      // Gerçek uygulamada Canvas API veya server-side işlem kullanılacak
      const mockPalette: ColorPaletteData = {
        dominant: '#CBA135',
        palette: ['#CBA135', '#F4D03F', '#B8941F', '#9A7A1A', '#7C6115'],
        isDark: false,
        contrast: {
          light: 4.5,
          dark: 8.2
        },
        harmony: {
          analogous: ['#CBA135', '#D4A842', '#C29B2E'],
          complementary: ['#CBA135', '#4B6CB7'],
          triadic: ['#CBA135', '#B74BCB', '#4BCBA1']
        }
      };
      
      setPalette(mockPalette);
      onPaletteExtract?.(mockPalette);
    } catch (error) {
      console.error('Failed to extract palette:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageUrl) {
      extractPalette(imageUrl);
    }
  }, [imageUrl]);

  // Renk kopyalama
  const copyColor = async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (error) {
      console.error('Failed to copy color:', error);
    }
  };

  // Renk kontrast hesaplama
  const getContrastRatio = (color: string) => {
    // Basit kontrast hesaplama
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? 'dark' : 'light';
  };

  // HSL dönüşümü
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  if (!palette) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Renk Paleti
          </CardTitle>
          <CardDescription>
            Görselden renk paleti çıkarın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Henüz görsel yüklenmemiş</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Renk Paleti
            </CardTitle>
            <CardDescription>
              Görselden çıkarılan renk analizi
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHex(!showHex)}
            >
              {showHex ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHarmony(!showHarmony)}
            >
              <Palette className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => imageUrl && extractPalette(imageUrl)}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Dominant Renk */}
        <div className="space-y-3">
          <h4 className="font-medium">Dominant Renk</h4>
          <div className="flex items-center space-x-4">
            <div
              className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-lg"
              style={{ backgroundColor: palette.dominant }}
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm">{palette.dominant}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyColor(palette.dominant)}
                >
                  {copiedColor === palette.dominant ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {showHex && (
                <div className="text-sm text-gray-600">
                  HSL: {hexToHsl(palette.dominant).h}°, {hexToHsl(palette.dominant).s}%, {hexToHsl(palette.dominant).l}%
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Badge variant={palette.isDark ? 'default' : 'secondary'}>
                  {palette.isDark ? 'Koyu' : 'Açık'}
                </Badge>
                <Badge variant="outline">
                  Kontrast: {palette.contrast.light.toFixed(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Renk Paleti */}
        <div className="space-y-3">
          <h4 className="font-medium">Renk Paleti</h4>
          <div className="grid grid-cols-5 gap-3">
            {palette.palette.map((color, index) => (
              <motion.div
                key={color}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => copyColor(color)}
              >
                <div
                  className="aspect-square rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                  style={{ backgroundColor: color }}
                />
                {showHex && (
                  <div className="mt-2 text-center">
                    <div className="text-xs font-mono text-gray-600">{color}</div>
                    <div className="text-xs text-gray-500">
                      {hexToHsl(color).h}°
                    </div>
                  </div>
                )}
                {copiedColor === color && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                  >
                    <Check className="w-3 h-3" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Renk Uyumu */}
        {showHarmony && (
          <div className="space-y-4">
            <h4 className="font-medium">Renk Uyumu</h4>
            
            {/* Analogous */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Analog (Benzer)</h5>
              <div className="flex space-x-2">
                {palette.harmony.analogous.map((color, index) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Complementary */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Tamamlayıcı</h5>
              <div className="flex space-x-2">
                {palette.harmony.complementary.map((color, index) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Triadic */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Üçlü</h5>
              <div className="flex space-x-2">
                {palette.harmony.triadic.map((color, index) => (
                  <div
                    key={color}
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Kontrast Analizi */}
        <div className="space-y-3">
          <h4 className="font-medium">Kontrast Analizi</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white border rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">Açık Arka Plan</div>
              <div className="text-2xl font-bold" style={{ color: palette.dominant }}>
                Örnek Metin
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Kontrast: {palette.contrast.light.toFixed(1)}
              </div>
            </div>
            
            <div className="p-3 bg-gray-900 border rounded-lg">
              <div className="text-sm font-medium text-gray-300 mb-1">Koyu Arka Plan</div>
              <div className="text-2xl font-bold" style={{ color: palette.dominant }}>
                Örnek Metin
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Kontrast: {palette.contrast.dark.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Aksiyonlar */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {palette.palette.length} renk tespit edildi
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Paleti İndir
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Paleti Uygula
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Özel hook - Renk paleti için
export function useColorPalette() {
  const [palette, setPalette] = useState<ColorPaletteData | null>(null);
  const [loading, setLoading] = useState(false);

  const extractPalette = async (imageUrl: string) => {
    setLoading(true);
    try {
      // Gerçek uygulamada Canvas API kullanılacak
      const mockPalette: ColorPaletteData = {
        dominant: '#CBA135',
        palette: ['#CBA135', '#F4D03F', '#B8941F', '#9A7A1A', '#7C6115'],
        isDark: false,
        contrast: {
          light: 4.5,
          dark: 8.2
        },
        harmony: {
          analogous: ['#CBA135', '#D4A842', '#C29B2E'],
          complementary: ['#CBA135', '#4B6CB7'],
          triadic: ['#CBA135', '#B74BCB', '#4BCBA1']
        }
      };
      
      setPalette(mockPalette);
      return mockPalette;
    } catch (error) {
      console.error('Failed to extract palette:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    palette,
    loading,
    extractPalette
  };
}
