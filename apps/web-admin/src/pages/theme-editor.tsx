import React, { useState, useEffect } from 'react';
import { ColorPalette, TypographyConfig, SpacingConfig, ComponentConfig, LayoutConfig } from '@tdc/domain';

interface ThemeEditorPageProps {
  tenantId: string;
  storeId: string;
}

export default function ThemeEditorPage({ tenantId, storeId }: ThemeEditorPageProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'spacing' | 'components' | 'layout' | 'branding'>('colors');
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Default theme configuration
  const defaultColors: ColorPalette = {
    primary: '#3B82F6',
    secondary: '#6B7280',
    accent: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  };

  const defaultTypography: TypographyConfig = {
    fontFamily: {
      primary: 'Inter',
      secondary: 'Georgia',
      mono: 'JetBrains Mono',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  };

  const defaultSpacing: SpacingConfig = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
    '6xl': '12rem',
  };

  const defaultComponents: ComponentConfig = {
    button: {
      borderRadius: '0.375rem',
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      },
      fontSize: {
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
      },
    },
    card: {
      borderRadius: '0.5rem',
      padding: '1.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    input: {
      borderRadius: '0.375rem',
      padding: '0.75rem 1rem',
      borderWidth: '1px',
    },
    modal: {
      borderRadius: '0.5rem',
      padding: '1.5rem',
      backdrop: 'rgba(0, 0, 0, 0.5)',
    },
  };

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
      } else {
        // Create default theme
        const defaultTheme = {
          tenantId,
          storeId,
          name: 'Default Theme',
          colors: defaultColors,
          typography: defaultTypography,
          spacing: defaultSpacing,
          components: defaultComponents,
        };
        setTheme(defaultTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      setError('Failed to load theme');
    } finally {
      setLoading(false);
    }
  };

  const saveTheme = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch('/api/store-themes/themes', {
        method: theme?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...theme,
          tenantId,
          storeId,
        }),
      });

      if (response.ok) {
        const savedTheme = await response.json();
        setTheme(savedTheme);
        setSuccess('Theme saved successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save theme');
      }
    } catch (error) {
      setError('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const updateColors = (newColors: Partial<ColorPalette>) => {
    setTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, ...newColors }
    }));
  };

  const updateTypography = (newTypography: Partial<TypographyConfig>) => {
    setTheme(prev => ({
      ...prev,
      typography: { ...prev.typography, ...newTypography }
    }));
  };

  const updateSpacing = (newSpacing: Partial<SpacingConfig>) => {
    setTheme(prev => ({
      ...prev,
      spacing: { ...prev.spacing, ...newSpacing }
    }));
  };

  const updateComponents = (newComponents: Partial<ComponentConfig>) => {
    setTheme(prev => ({
      ...prev,
      components: { ...prev.components, ...newComponents }
    }));
  };

  const updateBranding = (field: string, value: string) => {
    setTheme(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Theme Editor</h1>
              <p className="text-sm text-gray-500">Customize your store's appearance</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  previewMode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {previewMode ? 'Exit Preview' : 'Preview'}
              </button>
              <button
                onClick={saveTheme}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Theme'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Theme Settings</h3>
              </div>
              <nav className="p-4 space-y-2">
                {[
                  { id: 'colors', label: 'Colors', icon: '🎨' },
                  { id: 'typography', label: 'Typography', icon: '📝' },
                  { id: 'spacing', label: 'Spacing', icon: '📏' },
                  { id: 'components', label: 'Components', icon: '🧩' },
                  { id: 'layout', label: 'Layout', icon: '📐' },
                  { id: 'branding', label: 'Branding', icon: '🏷️' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                {activeTab === 'colors' && (
                  <ColorsTab colors={theme?.colors || defaultColors} onUpdate={updateColors} />
                )}
                {activeTab === 'typography' && (
                  <TypographyTab typography={theme?.typography || defaultTypography} onUpdate={updateTypography} />
                )}
                {activeTab === 'spacing' && (
                  <SpacingTab spacing={theme?.spacing || defaultSpacing} onUpdate={updateSpacing} />
                )}
                {activeTab === 'components' && (
                  <ComponentsTab components={theme?.components || defaultComponents} onUpdate={updateComponents} />
                )}
                {activeTab === 'layout' && (
                  <LayoutTab layout={theme?.layoutJson} onUpdate={(layout) => setTheme(prev => ({ ...prev, layoutJson: layout }))} />
                )}
                {activeTab === 'branding' && (
                  <BrandingTab 
                    logo={theme?.logo} 
                    favicon={theme?.favicon} 
                    backgroundImage={theme?.backgroundImage}
                    onUpdate={updateBranding} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Colors Tab Component
function ColorsTab({ colors, onUpdate }: { colors: ColorPalette; onUpdate: (colors: Partial<ColorPalette>) => void }) {
  const colorFields = [
    { key: 'primary', label: 'Primary', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary', description: 'Secondary brand color' },
    { key: 'accent', label: 'Accent', description: 'Accent color for highlights' },
    { key: 'background', label: 'Background', description: 'Main background color' },
    { key: 'surface', label: 'Surface', description: 'Card and surface color' },
    { key: 'error', label: 'Error', description: 'Error state color' },
    { key: 'warning', label: 'Warning', description: 'Warning state color' },
    { key: 'success', label: 'Success', description: 'Success state color' },
    { key: 'info', label: 'Info', description: 'Info state color' },
  ];

  const textColorFields = [
    { key: 'primary', label: 'Primary Text' },
    { key: 'secondary', label: 'Secondary Text' },
    { key: 'disabled', label: 'Disabled Text' },
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Color Palette</h3>
      
      <div className="space-y-6">
        {/* Main Colors */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Main Colors</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={colors[field.key as keyof ColorPalette] as string}
                    onChange={(e) => onUpdate({ [field.key]: e.target.value })}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={colors[field.key as keyof ColorPalette] as string}
                    onChange={(e) => onUpdate({ [field.key]: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{field.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Text Colors */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Text Colors</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {textColorFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={colors.text[field.key as keyof typeof colors.text]}
                    onChange={(e) => onUpdate({ text: { ...colors.text, [field.key]: e.target.value } })}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={colors.text[field.key as keyof typeof colors.text]}
                    onChange={(e) => onUpdate({ text: { ...colors.text, [field.key]: e.target.value } })}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Typography Tab Component
function TypographyTab({ typography, onUpdate }: { typography: TypographyConfig; onUpdate: (typography: Partial<TypographyConfig>) => void }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Typography Settings</h3>
      
      <div className="space-y-6">
        {/* Font Families */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Font Families</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Font</label>
              <input
                type="text"
                value={typography.fontFamily.primary}
                onChange={(e) => onUpdate({ fontFamily: { ...typography.fontFamily, primary: e.target.value } })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Font</label>
              <input
                type="text"
                value={typography.fontFamily.secondary}
                onChange={(e) => onUpdate({ fontFamily: { ...typography.fontFamily, secondary: e.target.value } })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monospace Font</label>
              <input
                type="text"
                value={typography.fontFamily.mono}
                onChange={(e) => onUpdate({ fontFamily: { ...typography.fontFamily, mono: e.target.value } })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Font Sizes */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Font Sizes</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(typography.fontSize).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{key}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onUpdate({ fontSize: { ...typography.fontSize, [key]: e.target.value } })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Spacing Tab Component
function SpacingTab({ spacing, onUpdate }: { spacing: SpacingConfig; onUpdate: (spacing: Partial<SpacingConfig>) => void }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Spacing Settings</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(spacing).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{key}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => onUpdate({ [key]: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Components Tab Component
function ComponentsTab({ components, onUpdate }: { components: ComponentConfig; onUpdate: (components: Partial<ComponentConfig>) => void }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Component Settings</h3>
      
      <div className="space-y-6">
        {/* Button Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Button</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
              <input
                type="text"
                value={components.button.borderRadius}
                onChange={(e) => onUpdate({ button: { ...components.button, borderRadius: e.target.value } })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Small Padding</label>
              <input
                type="text"
                value={components.button.padding.sm}
                onChange={(e) => onUpdate({ button: { ...components.button, padding: { ...components.button.padding, sm: e.target.value } } })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Card Settings */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Card</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
              <input
                type="text"
                value={components.card.borderRadius}
                onChange={(e) => onUpdate({ card: { ...components.card, borderRadius: e.target.value } })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
              <input
                type="text"
                value={components.card.padding}
                onChange={(e) => onUpdate({ card: { ...components.card, padding: e.target.value } })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Layout Tab Component
function LayoutTab({ layout, onUpdate }: { layout?: LayoutConfig; onUpdate: (layout: LayoutConfig) => void }) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Layout Settings</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Container</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Width</label>
              <input
                type="text"
                value={layout?.container?.maxWidth || '1200px'}
                onChange={(e) => onUpdate({ 
                  ...layout, 
                  container: { ...layout?.container, maxWidth: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Padding</label>
              <input
                type="text"
                value={layout?.container?.padding || '1rem'}
                onChange={(e) => onUpdate({ 
                  ...layout, 
                  container: { ...layout?.container, padding: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Breakpoints</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Small</label>
              <input
                type="text"
                value={layout?.breakpoints?.sm || '640px'}
                onChange={(e) => onUpdate({ 
                  ...layout, 
                  breakpoints: { ...layout?.breakpoints, sm: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medium</label>
              <input
                type="text"
                value={layout?.breakpoints?.md || '768px'}
                onChange={(e) => onUpdate({ 
                  ...layout, 
                  breakpoints: { ...layout?.breakpoints, md: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Large</label>
              <input
                type="text"
                value={layout?.breakpoints?.lg || '1024px'}
                onChange={(e) => onUpdate({ 
                  ...layout, 
                  breakpoints: { ...layout?.breakpoints, lg: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extra Large</label>
              <input
                type="text"
                value={layout?.breakpoints?.xl || '1280px'}
                onChange={(e) => onUpdate({ 
                  ...layout, 
                  breakpoints: { ...layout?.breakpoints, xl: e.target.value } 
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Branding Tab Component
function BrandingTab({ 
  logo, 
  favicon, 
  backgroundImage, 
  onUpdate 
}: { 
  logo?: string; 
  favicon?: string; 
  backgroundImage?: string; 
  onUpdate: (field: string, value: string) => void; 
}) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Branding</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
          <input
            type="url"
            value={logo || ''}
            onChange={(e) => onUpdate('logo', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com/logo.png"
          />
          {logo && (
            <div className="mt-2">
              <img src={logo} alt="Logo preview" className="h-16 w-auto" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
          <input
            type="url"
            value={favicon || ''}
            onChange={(e) => onUpdate('favicon', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com/favicon.ico"
          />
          {favicon && (
            <div className="mt-2">
              <img src={favicon} alt="Favicon preview" className="h-8 w-8" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
          <input
            type="url"
            value={backgroundImage || ''}
            onChange={(e) => onUpdate('backgroundImage', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com/background.jpg"
          />
          {backgroundImage && (
            <div className="mt-2">
              <img src={backgroundImage} alt="Background preview" className="h-32 w-full object-cover rounded" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

