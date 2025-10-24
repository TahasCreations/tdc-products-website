// Site Builder - Type Definitions

export type ComponentType = 
  | 'section'
  | 'container'
  | 'grid'
  | 'flex'
  | 'text'
  | 'heading'
  | 'image'
  | 'video'
  | 'button'
  | 'link'
  | 'form'
  | 'input'
  | 'gallery'
  | 'carousel'
  | 'hero'
  | 'tabs'
  | 'accordion'
  | 'modal'
  | 'spacer';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface StyleProps {
  // Layout
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  
  // Sizing
  width?: string;
  height?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  
  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  
  // Typography
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  
  // Colors
  color?: string;
  backgroundColor?: string;
  background?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  
  // Borders
  border?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  
  // Effects
  boxShadow?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  filter?: string;
  
  // Position
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
  
  // Other
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  cursor?: string;
}

export interface ResponsiveStyles {
  mobile?: StyleProps;
  tablet?: StyleProps;
  desktop?: StyleProps;
}

export interface ComponentProps {
  id: string;
  type: ComponentType;
  parentId?: string;
  children?: string[]; // IDs of child components
  
  // Content
  content?: {
    text?: string;
    html?: string;
    src?: string; // For images/videos
    alt?: string;
    href?: string; // For links
    placeholder?: string;
    label?: string;
    value?: any;
    options?: any[];
    items?: any[]; // For galleries, carousels
  };
  
  // Styling
  className?: string;
  styles?: StyleProps;
  responsiveStyles?: ResponsiveStyles;
  
  // Behavior
  animations?: {
    type?: 'fade' | 'slide' | 'scale' | 'bounce';
    duration?: string;
    delay?: string;
    trigger?: 'load' | 'scroll' | 'hover' | 'click';
  };
  
  // Settings
  settings?: {
    visible?: boolean;
    locked?: boolean;
    collapsed?: boolean;
    name?: string; // Custom name for layers panel
  };
  
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface PageData {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string;
  components: Record<string, ComponentProps>;
  rootComponentIds: string[]; // Top-level components
  
  // SEO
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    customMeta?: Record<string, string>;
  };
  
  // Settings
  settings?: {
    layout?: 'full-width' | 'boxed';
    maxWidth?: string;
    backgroundColor?: string;
    fontFamily?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  
  // Status
  status: 'draft' | 'published';
  publishedAt?: string;
  version?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'document' | 'other';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  tags?: string[];
  folder?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorState {
  // Current page
  currentPage: PageData | null;
  
  // Selection
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  
  // Mode
  mode: 'edit' | 'preview';
  breakpoint: Breakpoint;
  
  // History
  history: PageData[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  
  // UI State
  showLayers: boolean;
  showProperties: boolean;
  showComponentLibrary: boolean;
  
  // Clipboard
  clipboard: ComponentProps | null;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  components: Record<string, ComponentProps>;
  rootComponentIds: string[];
  createdAt: string;
}

