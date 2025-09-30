// Theme Configuration Types
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface TypographyConfig {
  fontFamily: {
    primary: string;
    secondary: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

export interface SpacingConfig {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
}

export interface ComponentConfig {
  button: {
    borderRadius: string;
    padding: {
      sm: string;
      md: string;
      lg: string;
    };
    fontSize: {
      sm: string;
      md: string;
      lg: string;
    };
  };
  card: {
    borderRadius: string;
    padding: string;
    shadow: string;
  };
  input: {
    borderRadius: string;
    padding: string;
    borderWidth: string;
  };
  modal: {
    borderRadius: string;
    padding: string;
    backdrop: string;
  };
}

// PageBuilder Types
export interface LayoutBlock {
  id: string;
  type: 'hero' | 'banner' | 'productGrid' | 'richText' | 'gallery' | 'spacer' | 'divider';
  props: Record<string, any>;
  children?: LayoutBlock[];
  style?: Record<string, any>;
}

export interface HeroBlock extends LayoutBlock {
  type: 'hero';
  props: {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    backgroundVideo?: string;
    overlay?: boolean;
    overlayOpacity?: number;
    textAlign?: 'left' | 'center' | 'right';
    buttonText?: string;
    buttonLink?: string;
    buttonVariant?: 'primary' | 'secondary' | 'outline';
    height?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  };
}

export interface BannerBlock extends LayoutBlock {
  type: 'banner';
  props: {
    text: string;
    backgroundColor?: string;
    textColor?: string;
    link?: string;
    linkText?: string;
    dismissible?: boolean;
    position?: 'top' | 'bottom';
    animation?: 'slide' | 'fade' | 'none';
  };
}

export interface ProductGridBlock extends LayoutBlock {
  type: 'productGrid';
  props: {
    title?: string;
    products: string[]; // Product IDs
    columns?: number;
    rows?: number;
    showPrice?: boolean;
    showDescription?: boolean;
    showAddToCart?: boolean;
    layout?: 'grid' | 'carousel' | 'list';
    sortBy?: 'name' | 'price' | 'created' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    category?: string;
    tags?: string[];
  };
}

export interface RichTextBlock extends LayoutBlock {
  type: 'richText';
  props: {
    content: string; // HTML content
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    maxWidth?: string;
    padding?: string;
    backgroundColor?: string;
  };
}

export interface GalleryBlock extends LayoutBlock {
  type: 'gallery';
  props: {
    images: Array<{
      id: string;
      url: string;
      alt?: string;
      caption?: string;
    }>;
    layout?: 'grid' | 'masonry' | 'carousel' | 'lightbox';
    columns?: number;
    aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto';
    spacing?: string;
    showCaptions?: boolean;
    showThumbnails?: boolean;
  };
}

export interface SpacerBlock extends LayoutBlock {
  type: 'spacer';
  props: {
    height: string;
    backgroundColor?: string;
  };
}

export interface DividerBlock extends LayoutBlock {
  type: 'divider';
  props: {
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
    thickness?: string;
    width?: string;
    margin?: string;
  };
}

// Layout Configuration
export interface LayoutConfig {
  blocks: LayoutBlock[];
  container: {
    maxWidth: string;
    padding: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Header Configuration
export interface HeaderConfig {
  logo: {
    url?: string;
    alt?: string;
    width?: string;
    height?: string;
  };
  navigation: {
    items: Array<{
      label: string;
      href: string;
      children?: Array<{
        label: string;
        href: string;
      }>;
    }>;
    style: 'horizontal' | 'vertical' | 'dropdown';
  };
  search: {
    enabled: boolean;
    placeholder?: string;
  };
  cart: {
    enabled: boolean;
    showCount: boolean;
  };
  user: {
    enabled: boolean;
    showProfile: boolean;
  };
  style: {
    backgroundColor?: string;
    textColor?: string;
    borderBottom?: boolean;
    sticky?: boolean;
    height?: string;
  };
}

// Footer Configuration
export interface FooterConfig {
  sections: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  social: {
    enabled: boolean;
    platforms: Array<{
      name: string;
      url: string;
      icon: string;
    }>;
  };
  copyright: {
    text: string;
    year?: number;
  };
  style: {
    backgroundColor?: string;
    textColor?: string;
    borderTop?: boolean;
  };
}

// Store Theme Input/Output Types
export interface StoreThemeInput {
  tenantId: string;
  storeId: string;
  name: string;
  description?: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  components: ComponentConfig;
  logo?: string;
  favicon?: string;
  backgroundImage?: string;
  layoutJson?: LayoutConfig;
  headerConfig?: HeaderConfig;
  footerConfig?: FooterConfig;
  metadata?: Record<string, any>;
}

export interface StoreThemeOutput {
  id: string;
  tenantId: string;
  storeId: string;
  name: string;
  description?: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  components: ComponentConfig;
  logo?: string;
  favicon?: string;
  backgroundImage?: string;
  layoutJson?: LayoutConfig;
  headerConfig?: HeaderConfig;
  footerConfig?: FooterConfig;
  isActive: boolean;
  isDefault: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Theme Template Types
export interface ThemeTemplateInput {
  tenantId: string;
  name: string;
  description?: string;
  category: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  components: ComponentConfig;
  previewImage?: string;
  thumbnailImage?: string;
  layoutJson: LayoutConfig;
  headerConfig?: HeaderConfig;
  footerConfig?: FooterConfig;
  isPublic?: boolean;
  isPremium?: boolean;
  metadata?: Record<string, any>;
}

export interface ThemeTemplateOutput {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  category: string;
  colors: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  components: ComponentConfig;
  previewImage?: string;
  thumbnailImage?: string;
  layoutJson: LayoutConfig;
  headerConfig?: HeaderConfig;
  footerConfig?: FooterConfig;
  isPublic: boolean;
  isPremium: boolean;
  usageCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

