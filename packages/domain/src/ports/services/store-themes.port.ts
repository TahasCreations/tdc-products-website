import { z } from 'zod';
import { 
  StoreThemeInput, 
  StoreThemeOutput, 
  ThemeTemplateInput, 
  ThemeTemplateOutput,
  ColorPalette,
  TypographyConfig,
  SpacingConfig,
  ComponentConfig,
  LayoutConfig,
  HeaderConfig,
  FooterConfig
} from '../../types/theme.types.js';

// Validation schemas
export const ColorPaletteSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  surface: z.string(),
  text: z.object({
    primary: z.string(),
    secondary: z.string(),
    disabled: z.string(),
  }),
  error: z.string(),
  warning: z.string(),
  success: z.string(),
  info: z.string(),
});

export const TypographyConfigSchema = z.object({
  fontFamily: z.object({
    primary: z.string(),
    secondary: z.string(),
    mono: z.string(),
  }),
  fontSize: z.object({
    xs: z.string(),
    sm: z.string(),
    base: z.string(),
    lg: z.string(),
    xl: z.string(),
    '2xl': z.string(),
    '3xl': z.string(),
    '4xl': z.string(),
    '5xl': z.string(),
    '6xl': z.string(),
  }),
  fontWeight: z.object({
    light: z.number(),
    normal: z.number(),
    medium: z.number(),
    semibold: z.number(),
    bold: z.number(),
    extrabold: z.number(),
  }),
  lineHeight: z.object({
    tight: z.number(),
    snug: z.number(),
    normal: z.number(),
    relaxed: z.number(),
    loose: z.number(),
  }),
});

export const SpacingConfigSchema = z.object({
  xs: z.string(),
  sm: z.string(),
  md: z.string(),
  lg: z.string(),
  xl: z.string(),
  '2xl': z.string(),
  '3xl': z.string(),
  '4xl': z.string(),
  '5xl': z.string(),
  '6xl': z.string(),
});

export const ComponentConfigSchema = z.object({
  button: z.object({
    borderRadius: z.string(),
    padding: z.object({
      sm: z.string(),
      md: z.string(),
      lg: z.string(),
    }),
    fontSize: z.object({
      sm: z.string(),
      md: z.string(),
      lg: z.string(),
    }),
  }),
  card: z.object({
    borderRadius: z.string(),
    padding: z.string(),
    shadow: z.string(),
  }),
  input: z.object({
    borderRadius: z.string(),
    padding: z.string(),
    borderWidth: z.string(),
  }),
  modal: z.object({
    borderRadius: z.string(),
    padding: z.string(),
    backdrop: z.string(),
  }),
});

export const LayoutConfigSchema = z.object({
  blocks: z.array(z.any()), // Will be validated by individual block schemas
  container: z.object({
    maxWidth: z.string(),
    padding: z.string(),
  }),
  breakpoints: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
  }),
});

export const HeaderConfigSchema = z.object({
  logo: z.object({
    url: z.string().optional(),
    alt: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
  }),
  navigation: z.object({
    items: z.array(z.object({
      label: z.string(),
      href: z.string(),
      children: z.array(z.object({
        label: z.string(),
        href: z.string(),
      })).optional(),
    })),
    style: z.enum(['horizontal', 'vertical', 'dropdown']),
  }),
  search: z.object({
    enabled: z.boolean(),
    placeholder: z.string().optional(),
  }),
  cart: z.object({
    enabled: z.boolean(),
    showCount: z.boolean(),
  }),
  user: z.object({
    enabled: z.boolean(),
    showProfile: z.boolean(),
  }),
  style: z.object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    borderBottom: z.boolean().optional(),
    sticky: z.boolean().optional(),
    height: z.string().optional(),
  }),
});

export const FooterConfigSchema = z.object({
  sections: z.array(z.object({
    title: z.string(),
    links: z.array(z.object({
      label: z.string(),
      href: z.string(),
    })),
  })),
  social: z.object({
    enabled: z.boolean(),
    platforms: z.array(z.object({
      name: z.string(),
      url: z.string(),
      icon: z.string(),
    })),
  }),
  copyright: z.object({
    text: z.string(),
    year: z.number().optional(),
  }),
  style: z.object({
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    borderTop: z.boolean().optional(),
  }),
});

export const StoreThemeInputSchema = z.object({
  tenantId: z.string(),
  storeId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  colors: ColorPaletteSchema,
  typography: TypographyConfigSchema,
  spacing: SpacingConfigSchema,
  components: ComponentConfigSchema,
  logo: z.string().optional(),
  favicon: z.string().optional(),
  backgroundImage: z.string().optional(),
  layoutJson: LayoutConfigSchema.optional(),
  headerConfig: HeaderConfigSchema.optional(),
  footerConfig: FooterConfigSchema.optional(),
  metadata: z.record(z.any()).optional(),
});

export const StoreThemeUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  colors: ColorPaletteSchema.optional(),
  typography: TypographyConfigSchema.optional(),
  spacing: SpacingConfigSchema.optional(),
  components: ComponentConfigSchema.optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  backgroundImage: z.string().optional(),
  layoutJson: LayoutConfigSchema.optional(),
  headerConfig: HeaderConfigSchema.optional(),
  footerConfig: FooterConfigSchema.optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

export const ThemeTemplateInputSchema = z.object({
  tenantId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  colors: ColorPaletteSchema,
  typography: TypographyConfigSchema,
  spacing: SpacingConfigSchema,
  components: ComponentConfigSchema,
  previewImage: z.string().optional(),
  thumbnailImage: z.string().optional(),
  layoutJson: LayoutConfigSchema,
  headerConfig: HeaderConfigSchema.optional(),
  footerConfig: FooterConfigSchema.optional(),
  isPublic: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

// Store Themes Port Interface
export interface StoreThemesPort {
  // Store Theme Management
  createTheme(input: StoreThemeInput): Promise<StoreThemeOutput>;
  getTheme(id: string, tenantId: string): Promise<StoreThemeOutput | null>;
  getActiveTheme(storeId: string, tenantId: string): Promise<StoreThemeOutput | null>;
  getThemes(tenantId: string, filters?: {
    storeId?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<StoreThemeOutput[]>;
  updateTheme(id: string, tenantId: string, input: Partial<StoreThemeInput>): Promise<StoreThemeOutput>;
  deleteTheme(id: string, tenantId: string): Promise<boolean>;
  activateTheme(id: string, tenantId: string): Promise<StoreThemeOutput>;
  duplicateTheme(id: string, tenantId: string, newName: string): Promise<StoreThemeOutput>;

  // Theme Template Management
  createTemplate(input: ThemeTemplateInput): Promise<ThemeTemplateOutput>;
  getTemplate(id: string, tenantId: string): Promise<ThemeTemplateOutput | null>;
  getTemplates(tenantId: string, filters?: {
    category?: string;
    isPublic?: boolean;
    isPremium?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ThemeTemplateOutput[]>;
  updateTemplate(id: string, tenantId: string, input: Partial<ThemeTemplateInput>): Promise<ThemeTemplateOutput>;
  deleteTemplate(id: string, tenantId: string): Promise<boolean>;
  applyTemplate(templateId: string, storeId: string, tenantId: string): Promise<StoreThemeOutput>;

  // Theme Configuration
  updateColors(themeId: string, tenantId: string, colors: ColorPalette): Promise<StoreThemeOutput>;
  updateTypography(themeId: string, tenantId: string, typography: TypographyConfig): Promise<StoreThemeOutput>;
  updateSpacing(themeId: string, tenantId: string, spacing: SpacingConfig): Promise<StoreThemeOutput>;
  updateComponents(themeId: string, tenantId: string, components: ComponentConfig): Promise<StoreThemeOutput>;
  updateLayout(themeId: string, tenantId: string, layout: LayoutConfig): Promise<StoreThemeOutput>;
  updateHeader(themeId: string, tenantId: string, header: HeaderConfig): Promise<StoreThemeOutput>;
  updateFooter(themeId: string, tenantId: string, footer: FooterConfig): Promise<StoreThemeOutput>;

  // Branding
  updateLogo(themeId: string, tenantId: string, logoUrl: string): Promise<StoreThemeOutput>;
  updateFavicon(themeId: string, tenantId: string, faviconUrl: string): Promise<StoreThemeOutput>;
  updateBackgroundImage(themeId: string, tenantId: string, backgroundUrl: string): Promise<StoreThemeOutput>;

  // Theme Preview
  generatePreview(themeId: string, tenantId: string): Promise<{
    css: string;
    html: string;
    assets: string[];
  }>;
  exportTheme(themeId: string, tenantId: string): Promise<{
    theme: StoreThemeOutput;
    css: string;
    assets: string[];
  }>;
  importTheme(tenantId: string, storeId: string, themeData: any): Promise<StoreThemeOutput>;

  // Analytics
  getThemeStats(tenantId: string): Promise<{
    totalThemes: number;
    activeThemes: number;
    totalTemplates: number;
    publicTemplates: number;
    premiumTemplates: number;
    mostUsedTemplate: string | null;
  }>;
  getTemplateStats(templateId: string, tenantId: string): Promise<{
    usageCount: number;
    lastUsed: Date | null;
    stores: string[];
  }>;
}

