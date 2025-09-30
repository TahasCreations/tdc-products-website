import React from 'react';
import { LayoutConfig, LayoutBlock, HeroBlock, BannerBlock, ProductGridBlock, RichTextBlock, GalleryBlock, SpacerBlock, DividerBlock } from '@tdc/domain';

interface PageBuilderProps {
  layout: LayoutConfig;
  theme?: {
    colors: any;
    typography: any;
    spacing: any;
    components: any;
  };
  products?: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    description?: string;
  }>;
  onProductClick?: (product: any) => void;
  onAddToCart?: (product: any) => void;
}

export default function PageBuilder({ 
  layout, 
  theme, 
  products = [], 
  onProductClick, 
  onAddToCart 
}: PageBuilderProps) {
  const renderBlock = (block: LayoutBlock, index: number) => {
    switch (block.type) {
      case 'hero':
        return <HeroBlockComponent key={block.id || index} block={block as HeroBlock} theme={theme} />;
      case 'banner':
        return <BannerBlockComponent key={block.id || index} block={block as BannerBlock} theme={theme} />;
      case 'productGrid':
        return (
          <ProductGridBlockComponent 
            key={block.id || index} 
            block={block as ProductGridBlock} 
            theme={theme}
            products={products}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
          />
        );
      case 'richText':
        return <RichTextBlockComponent key={block.id || index} block={block as RichTextBlock} theme={theme} />;
      case 'gallery':
        return <GalleryBlockComponent key={block.id || index} block={block as GalleryBlock} theme={theme} />;
      case 'spacer':
        return <SpacerBlockComponent key={block.id || index} block={block as SpacerBlock} theme={theme} />;
      case 'divider':
        return <DividerBlockComponent key={block.id || index} block={block as DividerBlock} theme={theme} />;
      default:
        return null;
    }
  };

  return (
    <div className="page-builder">
      <div 
        className="container mx-auto px-4"
        style={{
          maxWidth: layout.container?.maxWidth || '1200px',
          padding: layout.container?.padding || '1rem',
        }}
      >
        {layout.blocks?.map((block, index) => renderBlock(block, index))}
      </div>
    </div>
  );
}

// Hero Block Component
function HeroBlockComponent({ block, theme }: { block: HeroBlock; theme?: any }) {
  const {
    title,
    subtitle,
    description,
    backgroundImage,
    backgroundVideo,
    overlay,
    overlayOpacity = 0.5,
    textAlign = 'center',
    buttonText,
    buttonLink,
    buttonVariant = 'primary',
    height = 'lg'
  } = block.props;

  const heightClasses = {
    sm: 'h-64',
    md: 'h-96',
    lg: 'h-[500px]',
    xl: 'h-[600px]',
    full: 'h-screen'
  };

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  const buttonClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
  };

  return (
    <section 
      className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      <div className={`relative z-10 max-w-4xl px-4 ${textAlignClasses[textAlign]}`}>
        <h1 
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{ color: theme?.colors?.text?.primary || '#111827' }}
        >
          {title}
        </h1>
        
        {subtitle && (
          <h2 
            className="text-xl md:text-2xl mb-4"
            style={{ color: theme?.colors?.text?.secondary || '#6B7280' }}
          >
            {subtitle}
          </h2>
        )}
        
        {description && (
          <p 
            className="text-lg mb-8"
            style={{ color: theme?.colors?.text?.secondary || '#6B7280' }}
          >
            {description}
          </p>
        )}
        
        {buttonText && (
          <a
            href={buttonLink || '#'}
            className={`inline-block px-8 py-3 rounded-lg font-semibold transition-colors ${buttonClasses[buttonVariant]}`}
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

// Banner Block Component
function BannerBlockComponent({ block, theme }: { block: BannerBlock; theme?: any }) {
  const {
    text,
    backgroundColor = '#3B82F6',
    textColor = '#FFFFFF',
    link,
    linkText,
    dismissible = false,
    position = 'top',
    animation = 'slide'
  } = block.props;

  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div 
      className={`w-full py-3 px-4 ${position === 'top' ? 'order-first' : 'order-last'}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm font-medium">{text}</p>
          {link && linkText && (
            <a 
              href={link}
              className="ml-4 text-sm underline hover:no-underline"
            >
              {linkText}
            </a>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 text-sm hover:opacity-75"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// Product Grid Block Component
function ProductGridBlockComponent({ 
  block, 
  theme, 
  products, 
  onProductClick, 
  onAddToCart 
}: { 
  block: ProductGridBlock; 
  theme?: any; 
  products: any[];
  onProductClick?: (product: any) => void;
  onAddToCart?: (product: any) => void;
}) {
  const {
    title,
    products: productIds = [],
    columns = 4,
    rows,
    showPrice = true,
    showDescription = true,
    showAddToCart = true,
    layout = 'grid',
    sortBy = 'name',
    sortOrder = 'asc',
    category,
    tags = []
  } = block.props;

  // Filter and sort products
  let filteredProducts = products.filter(product => 
    productIds.length === 0 || productIds.includes(product.id)
  );

  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === category
    );
  }

  if (tags.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.tags?.some((tag: string) => tags.includes(tag))
    );
  }

  // Sort products
  filteredProducts.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'price') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Limit products if rows is specified
  if (rows) {
    filteredProducts = filteredProducts.slice(0, columns * rows);
  }

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        {title && (
          <h2 
            className="text-3xl font-bold mb-8 text-center"
            style={{ color: theme?.colors?.text?.primary || '#111827' }}
          >
            {title}
          </h2>
        )}
        
        <div className={`grid ${gridClasses[columns as keyof typeof gridClasses] || 'grid-cols-4'} gap-6`}>
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              style={{
                borderRadius: theme?.components?.card?.borderRadius || '0.5rem',
                padding: theme?.components?.card?.padding || '1rem',
                boxShadow: theme?.components?.card?.shadow || '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              }}
            >
              {product.images && product.images.length > 0 && (
                <img 
                  src={product.images[0]} 
                  alt={product.title}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => onProductClick?.(product)}
                />
              )}
              
              <div className="p-4">
                <h3 
                  className="text-lg font-semibold mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => onProductClick?.(product)}
                  style={{ color: theme?.colors?.text?.primary || '#111827' }}
                >
                  {product.title}
                </h3>
                
                {showDescription && product.description && (
                  <p 
                    className="text-sm mb-3 line-clamp-2"
                    style={{ color: theme?.colors?.text?.secondary || '#6B7280' }}
                  >
                    {product.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  {showPrice && (
                    <span 
                      className="text-xl font-bold"
                      style={{ color: theme?.colors?.primary || '#3B82F6' }}
                    >
                      ${product.price}
                    </span>
                  )}
                  
                  {showAddToCart && (
                    <button
                      onClick={() => onAddToCart?.(product)}
                      className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: theme?.colors?.primary || '#3B82F6',
                        color: '#FFFFFF',
                        borderRadius: theme?.components?.button?.borderRadius || '0.375rem',
                      }}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Rich Text Block Component
function RichTextBlockComponent({ block, theme }: { block: RichTextBlock; theme?: any }) {
  const {
    content,
    textAlign = 'left',
    maxWidth,
    padding = '1rem',
    backgroundColor
  } = block.props;

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  return (
    <section 
      className="py-8"
      style={{ 
        backgroundColor: backgroundColor || theme?.colors?.background || '#FFFFFF',
        padding: padding
      }}
    >
      <div 
        className={`max-w-7xl mx-auto px-4 ${textAlignClasses[textAlign]}`}
        style={{ maxWidth: maxWidth || '1200px' }}
      >
        <div 
          dangerouslySetInnerHTML={{ __html: content }}
          style={{ color: theme?.colors?.text?.primary || '#111827' }}
        />
      </div>
    </section>
  );
}

// Gallery Block Component
function GalleryBlockComponent({ block, theme }: { block: GalleryBlock; theme?: any }) {
  const {
    images = [],
    layout = 'grid',
    columns = 3,
    aspectRatio = 'square',
    spacing = '1rem',
    showCaptions = false,
    showThumbnails = false
  } = block.props;

  const aspectRatioClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: 'aspect-auto'
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  if (layout === 'carousel') {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative">
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {images.map((image, index) => (
                <div 
                  key={image.id || index}
                  className="flex-shrink-0"
                  style={{ width: '300px' }}
                >
                  <img 
                    src={image.url} 
                    alt={image.alt || `Gallery image ${index + 1}`}
                    className={`w-full object-cover rounded-lg ${aspectRatioClasses[aspectRatio]}`}
                  />
                  {showCaptions && image.caption && (
                    <p className="mt-2 text-sm text-center text-gray-600">
                      {image.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div 
          className={`grid ${gridClasses[columns as keyof typeof gridClasses] || 'grid-cols-3'} gap-4`}
          style={{ gap: spacing }}
        >
          {images.map((image, index) => (
            <div key={image.id || index} className="relative group">
              <img 
                src={image.url} 
                alt={image.alt || `Gallery image ${index + 1}`}
                className={`w-full object-cover rounded-lg ${aspectRatioClasses[aspectRatio]} group-hover:opacity-75 transition-opacity`}
              />
              {showCaptions && image.caption && (
                <p className="mt-2 text-sm text-center text-gray-600">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Spacer Block Component
function SpacerBlockComponent({ block, theme }: { block: SpacerBlock; theme?: any }) {
  const { height = '2rem', backgroundColor } = block.props;

  return (
    <div 
      style={{ 
        height: height,
        backgroundColor: backgroundColor || 'transparent'
      }}
    />
  );
}

// Divider Block Component
function DividerBlockComponent({ block, theme }: { block: DividerBlock; theme?: any }) {
  const {
    style = 'solid',
    color = '#E5E7EB',
    thickness = '1px',
    width = '100%',
    margin = '2rem 0'
  } = block.props;

  const borderStyles = {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted'
  };

  return (
    <div 
      className="w-full"
      style={{ 
        borderTop: `${thickness} ${borderStyles[style]} ${color}`,
        width: width,
        margin: margin
      }}
    />
  );
}

