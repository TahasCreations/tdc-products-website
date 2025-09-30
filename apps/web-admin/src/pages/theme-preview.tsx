import React, { useState, useEffect } from 'react';
import { ColorPalette, TypographyConfig, SpacingConfig, ComponentConfig, LayoutConfig } from '@tdc/domain';

interface ThemePreviewPageProps {
  tenantId: string;
  storeId: string;
}

export default function ThemePreviewPage({ tenantId, storeId }: ThemePreviewPageProps) {
  const [theme, setTheme] = useState<any>(null);
  const [layout, setLayout] = useState<LayoutConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLiveEditing, setIsLiveEditing] = useState(false);

  useEffect(() => {
    loadTheme();
  }, [tenantId, storeId]);

  const loadTheme = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/store-themes/themes?tenantId=${tenantId}&storeId=${storeId}&isActive=true`);
      const themes = await response.json();
      
      if (themes.length > 0) {
        setTheme(themes[0]);
        setLayout(themes[0].layoutJson);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setError('Failed to load theme');
    } finally {
      setLoading(false);
    }
  };

  const generateCSS = (theme: any) => {
    if (!theme) return '';

    const { colors, typography, spacing, components } = theme;

    return `
      :root {
        /* Colors */
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-background: ${colors.background};
        --color-surface: ${colors.surface};
        --color-text-primary: ${colors.text.primary};
        --color-text-secondary: ${colors.text.secondary};
        --color-text-disabled: ${colors.text.disabled};
        --color-error: ${colors.error};
        --color-warning: ${colors.warning};
        --color-success: ${colors.success};
        --color-info: ${colors.info};

        /* Typography */
        --font-family-primary: ${typography.fontFamily.primary};
        --font-family-secondary: ${typography.fontFamily.secondary};
        --font-family-mono: ${typography.fontFamily.mono};

        /* Spacing */
        --spacing-xs: ${spacing.xs};
        --spacing-sm: ${spacing.sm};
        --spacing-md: ${spacing.md};
        --spacing-lg: ${spacing.lg};
        --spacing-xl: ${spacing.xl};
        --spacing-2xl: ${spacing['2xl']};
        --spacing-3xl: ${spacing['3xl']};
        --spacing-4xl: ${spacing['4xl']};
        --spacing-5xl: ${spacing['5xl']};
        --spacing-6xl: ${spacing['6xl']};

        /* Components */
        --button-border-radius: ${components.button.borderRadius};
        --card-border-radius: ${components.card.borderRadius};
        --input-border-radius: ${components.input.borderRadius};
        --modal-border-radius: ${components.modal.borderRadius};
      }

      body {
        font-family: var(--font-family-primary), sans-serif;
        background-color: var(--color-background);
        color: var(--color-text-primary);
        line-height: 1.6;
      }

      .btn {
        border-radius: var(--button-border-radius);
        font-family: var(--font-family-primary);
        transition: all 0.2s ease;
      }

      .btn-primary {
        background-color: var(--color-primary);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
      }

      .btn-primary:hover {
        background-color: color-mix(in srgb, var(--color-primary) 85%, black);
      }

      .card {
        background-color: var(--color-surface);
        border-radius: var(--card-border-radius);
        padding: var(--spacing-lg);
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      }

      .input {
        border-radius: var(--input-border-radius);
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        font-family: var(--font-family-primary);
      }

      .input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
      }

      .text-primary {
        color: var(--color-text-primary);
      }

      .text-secondary {
        color: var(--color-text-secondary);
      }

      .bg-primary {
        background-color: var(--color-primary);
      }

      .bg-secondary {
        background-color: var(--color-secondary);
      }

      .bg-surface {
        background-color: var(--color-surface);
      }
    `;
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'desktop':
      default:
        return { width: '1200px', height: '800px' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const dimensions = getPreviewDimensions();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Theme Preview</h1>
              <p className="text-sm text-gray-500">Preview your theme changes in real-time</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Preview Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'desktop', label: 'Desktop', icon: '🖥️' },
                  { id: 'tablet', label: 'Tablet', icon: '📱' },
                  { id: 'mobile', label: 'Mobile', icon: '📱' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setPreviewMode(mode.id as any)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      previewMode === mode.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-1">{mode.icon}</span>
                    {mode.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsLiveEditing(!isLiveEditing)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  isLiveEditing
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {isLiveEditing ? 'Exit Live Edit' : 'Live Edit'}
              </button>

              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Save Theme
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Edit Mode Banner */}
      {isLiveEditing && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Live Edit Mode: Changes are applied in real-time
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Preview Container */}
      <div className="p-8">
        <div className="flex justify-center">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            style={{
              width: dimensions.width,
              height: dimensions.height,
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            {/* Preview Content */}
            <div className="h-full">
              {/* Inject CSS */}
              <style dangerouslySetInnerHTML={{ __html: generateCSS(theme) }} />
              
              {/* Preview Header */}
              <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {theme?.logo && (
                      <img 
                        src={theme.logo} 
                        alt="Store Logo"
                        className="h-8 w-8 rounded-full mr-3"
                      />
                    )}
                    <h1 className="text-xl font-semibold text-primary">Store Name</h1>
                  </div>
                  <nav className="hidden md:flex space-x-6">
                    <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Products</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
                  </nav>
                </div>
              </header>

              {/* Preview Content */}
              <main className="p-6">
                {/* Hero Section */}
                <section className="bg-primary text-white rounded-lg p-8 mb-8 text-center">
                  <h2 className="text-4xl font-bold mb-4">Welcome to Our Store</h2>
                  <p className="text-xl mb-6">Discover amazing products at great prices</p>
                  <button className="btn btn-primary">Shop Now</button>
                </section>

                {/* Product Grid */}
                <section className="mb-8">
                  <h3 className="text-2xl font-bold text-primary mb-6">Featured Products</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="card">
                        <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                        <h4 className="text-lg font-semibold text-primary mb-2">Product {i}</h4>
                        <p className="text-secondary mb-4">Product description goes here</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary">$99.99</span>
                          <button className="btn btn-primary">Add to Cart</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Rich Text Section */}
                <section className="mb-8">
                  <div className="card">
                    <h3 className="text-2xl font-bold text-primary mb-4">About Us</h3>
                    <p className="text-secondary leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </section>

                {/* Form Example */}
                <section className="mb-8">
                  <div className="card">
                    <h3 className="text-2xl font-bold text-primary mb-4">Contact Us</h3>
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Name</label>
                        <input type="text" className="input w-full" placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Email</label>
                        <input type="email" className="input w-full" placeholder="your@email.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">Message</label>
                        <textarea className="input w-full h-24" placeholder="Your message"></textarea>
                      </div>
                      <button type="submit" className="btn btn-primary">Send Message</button>
                    </form>
                  </div>
                </section>
              </main>

              {/* Preview Footer */}
              <footer className="bg-gray-800 text-white py-6 px-6">
                <div className="text-center">
                  <p className="text-sm">&copy; 2024 Store Name. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Configuration Panel (Live Edit Mode) */}
      {isLiveEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Theme Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={theme?.colors?.primary || '#3B82F6'}
                  onChange={(e) => {
                    setTheme(prev => ({
                      ...prev,
                      colors: { ...prev.colors, primary: e.target.value }
                    }));
                  }}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={theme?.colors?.secondary || '#6B7280'}
                  onChange={(e) => {
                    setTheme(prev => ({
                      ...prev,
                      colors: { ...prev.colors, secondary: e.target.value }
                    }));
                  }}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <input
                  type="color"
                  value={theme?.colors?.background || '#FFFFFF'}
                  onChange={(e) => {
                    setTheme(prev => ({
                      ...prev,
                      colors: { ...prev.colors, background: e.target.value }
                    }));
                  }}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  value={theme?.typography?.fontFamily?.primary || 'Inter'}
                  onChange={(e) => {
                    setTheme(prev => ({
                      ...prev,
                      typography: { 
                        ...prev.typography, 
                        fontFamily: { ...prev.typography.fontFamily, primary: e.target.value }
                      }
                    }));
                  }}
                  className="w-full h-10 rounded border border-gray-300"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

