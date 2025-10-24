import { ComponentProps, StyleProps } from './types';

// Generate unique IDs
export const generateId = (): string => {
  return `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Convert StyleProps to CSS string
export const styleToCss = (styles: StyleProps): React.CSSProperties => {
  const cssProps: any = {};
  
  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      cssProps[key] = value;
    }
  });
  
  return cssProps;
};

// Get responsive styles for current breakpoint
export const getResponsiveStyles = (
  component: ComponentProps,
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): StyleProps => {
  const baseStyles = component.styles || {};
  const responsiveStyles = component.responsiveStyles?.[breakpoint] || {};
  
  return { ...baseStyles, ...responsiveStyles };
};

// Generate Tailwind classes from styles
export const stylesToTailwind = (styles: StyleProps): string => {
  const classes: string[] = [];
  
  // This is a simplified version - in production you'd have a complete mapping
  if (styles.display === 'flex') classes.push('flex');
  if (styles.display === 'grid') classes.push('grid');
  if (styles.flexDirection === 'column') classes.push('flex-col');
  if (styles.justifyContent === 'center') classes.push('justify-center');
  if (styles.alignItems === 'center') classes.push('items-center');
  
  return classes.join(' ');
};

// Create default component
export const createDefaultComponent = (type: ComponentProps['type']): Partial<ComponentProps> => {
  const base = {
    type,
    settings: { visible: true, locked: false },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  switch (type) {
    case 'section':
      return {
        ...base,
        styles: {
          padding: '4rem 1rem',
          backgroundColor: '#ffffff',
        },
        settings: { ...base.settings, name: 'Section' },
      };
    
    case 'container':
      return {
        ...base,
        styles: {
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
        },
        settings: { ...base.settings, name: 'Container' },
      };
    
    case 'grid':
      return {
        ...base,
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
        },
        settings: { ...base.settings, name: 'Grid' },
      };
    
    case 'heading':
      return {
        ...base,
        content: { text: 'Başlık' },
        styles: {
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '1rem',
        },
        settings: { ...base.settings, name: 'Heading' },
      };
    
    case 'text':
      return {
        ...base,
        content: { text: 'Metin içeriği buraya gelecek...' },
        styles: {
          fontSize: '1rem',
          lineHeight: '1.6',
          color: '#4a4a4a',
        },
        settings: { ...base.settings, name: 'Text' },
      };
    
    case 'image':
      return {
        ...base,
        content: {
          src: '/placeholder-image.jpg',
          alt: 'Görsel',
        },
        styles: {
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
        },
        settings: { ...base.settings, name: 'Image' },
      };
    
    case 'button':
      return {
        ...base,
        content: { text: 'Buton', href: '#' },
        styles: {
          padding: '0.75rem 1.5rem',
          backgroundColor: '#6366f1',
          color: '#ffffff',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
        },
        settings: { ...base.settings, name: 'Button' },
      };
    
    case 'hero':
      return {
        ...base,
        content: {
          text: 'Hero Section',
        },
        styles: {
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center',
          minHeight: '500px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        settings: { ...base.settings, name: 'Hero' },
      };
    
    default:
      return base;
  }
};

// Validate component tree
export const validateComponentTree = (
  components: Record<string, ComponentProps>,
  rootIds: string[]
): boolean => {
  const visited = new Set<string>();
  
  const visit = (id: string): boolean => {
    if (visited.has(id)) return false; // Circular reference
    visited.add(id);
    
    const comp = components[id];
    if (!comp) return false;
    
    if (comp.children) {
      for (const childId of comp.children) {
        if (!visit(childId)) return false;
      }
    }
    
    return true;
  };
  
  for (const rootId of rootIds) {
    if (!visit(rootId)) return false;
  }
  
  return true;
};

// Export page as JSON
export const exportPage = (page: PageData): string => {
  return JSON.stringify(page, null, 2);
};

// Import page from JSON
export const importPage = (json: string): PageData => {
  return JSON.parse(json);
};

