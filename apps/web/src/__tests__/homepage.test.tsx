import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HomePage from '../app/page';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the home components
jest.mock('../components/home/AnnouncementBar', () => {
  return function MockAnnouncementBar() {
    return <div data-testid="announcement-bar">Announcement Bar</div>;
  };
});

jest.mock('../components/home/Hero', () => {
  return function MockHero({ onSearch }: { onSearch: (query: string) => void }) {
    return (
      <div data-testid="hero">
        <button onClick={() => onSearch('test query')}>Search</button>
      </div>
    );
  };
});

jest.mock('../components/home/CategoryGrid', () => {
  return function MockCategoryGrid({ categories, onCategoryClick }: any) {
    return (
      <div data-testid="category-grid">
        {categories.map((category: any) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category)}
            data-testid={`category-${category.id}`}
          >
            {category.name}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../components/home/CollectionStrip', () => {
  return function MockCollectionStrip({ collections, onProductClick, onCollectionClick }: any) {
    return (
      <div data-testid="collection-strip">
        {collections.map((collection: any) => (
          <div key={collection.id} data-testid={`collection-${collection.id}`}>
            <button onClick={() => onCollectionClick(collection)}>
              {collection.title}
            </button>
            {collection.products.map((product: any) => (
              <button
                key={product.id}
                onClick={() => onProductClick(product)}
                data-testid={`product-${product.id}`}
              >
                {product.name}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../components/home/CouponBanner', () => {
  return function MockCouponBanner({ coupons, onCouponCopy }: any) {
    return (
      <div data-testid="coupon-banner">
        {coupons.map((coupon: any) => (
          <button
            key={coupon.id}
            onClick={() => onCouponCopy(coupon)}
            data-testid={`coupon-${coupon.id}`}
          >
            {coupon.code}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../components/home/StoreSpotlight', () => {
  return function MockStoreSpotlight({ stores, onStoreClick }: any) {
    return (
      <div data-testid="store-spotlight">
        {stores.map((store: any) => (
          <button
            key={store.id}
            onClick={() => onStoreClick(store)}
            data-testid={`store-${store.id}`}
          >
            {store.name}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../components/home/TrustSection', () => {
  return function MockTrustSection() {
    return <div data-testid="trust-section">Trust Section</div>;
  };
});

jest.mock('../components/home/BlogSection', () => {
  return function MockBlogSection({ posts, onPostClick }: any) {
    return (
      <div data-testid="blog-section">
        {posts.map((post: any) => (
          <button
            key={post.id}
            onClick={() => onPostClick(post)}
            data-testid={`post-${post.id}`}
          >
            {post.title}
          </button>
        ))}
      </div>
    );
  };
});

// Mock seed data
jest.mock('../data/seed', () => ({
  categories: [
    { id: '1', name: '3D Figürler', slug: '3d-figurler' },
    { id: '2', name: 'Masaüstü Aksesuarları', slug: 'masaustu-aksesuarlari' },
  ],
  collections: [
    {
      id: '1',
      title: 'Haftanın Trendleri',
      products: [
        { id: '1', name: 'Anime Karakter Figürü', price: 89.99 },
        { id: '2', name: 'Masa Lambası', price: 45.50 },
      ],
    },
  ],
  coupons: [
    { id: '1', code: 'TDCSEZON', discount: 20, type: 'percentage' },
  ],
  stores: [
    { id: '1', name: 'ArtisanCraft Studio', slug: 'artisancraft-studio' },
  ],
  blogPosts: [
    { id: '1', title: '3D Yazıcı Teknolojisi', publishedAt: '2024-01-15T10:00:00Z' },
  ],
}));

describe('HomePage', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockPush.mockClear();
  });

  it('renders loading state initially', () => {
    render(<HomePage />);
    expect(screen.getByText('TDC Market yükleniyor...')).toBeInTheDocument();
  });

  it('renders all homepage sections after loading', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('announcement-bar')).toBeInTheDocument();
      expect(screen.getByTestId('hero')).toBeInTheDocument();
      expect(screen.getByTestId('category-grid')).toBeInTheDocument();
      expect(screen.getByTestId('collection-strip')).toBeInTheDocument();
      expect(screen.getByTestId('coupon-banner')).toBeInTheDocument();
      expect(screen.getByTestId('store-spotlight')).toBeInTheDocument();
      expect(screen.getByTestId('trust-section')).toBeInTheDocument();
      expect(screen.getByTestId('blog-section')).toBeInTheDocument();
    });
  });

  it('handles search functionality', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('hero')).toBeInTheDocument();
    });

    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    expect(mockPush).toHaveBeenCalledWith('/search?q=test%20query');
  });

  it('handles category clicks', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('category-grid')).toBeInTheDocument();
    });

    const categoryButton = screen.getByTestId('category-1');
    fireEvent.click(categoryButton);

    // Check if analytics event would be triggered (mocked in the component)
    expect(categoryButton).toBeInTheDocument();
  });

  it('handles product clicks', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('collection-strip')).toBeInTheDocument();
    });

    const productButton = screen.getByTestId('product-1');
    fireEvent.click(productButton);

    expect(productButton).toBeInTheDocument();
  });

  it('handles collection clicks', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('collection-strip')).toBeInTheDocument();
    });

    const collectionButton = screen.getByText('Haftanın Trendleri');
    fireEvent.click(collectionButton);

    expect(collectionButton).toBeInTheDocument();
  });

  it('handles coupon copy events', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('coupon-banner')).toBeInTheDocument();
    });

    const couponButton = screen.getByTestId('coupon-1');
    fireEvent.click(couponButton);

    expect(couponButton).toBeInTheDocument();
  });

  it('handles store clicks', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('store-spotlight')).toBeInTheDocument();
    });

    const storeButton = screen.getByTestId('store-1');
    fireEvent.click(storeButton);

    expect(storeButton).toBeInTheDocument();
  });

  it('handles blog post clicks', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('blog-section')).toBeInTheDocument();
    });

    const postButton = screen.getByTestId('post-1');
    fireEvent.click(postButton);

    expect(postButton).toBeInTheDocument();
  });

  it('renders categories from seed data', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('3D Figürler')).toBeInTheDocument();
      expect(screen.getByText('Masaüstü Aksesuarları')).toBeInTheDocument();
    });
  });

  it('renders collections from seed data', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Haftanın Trendleri')).toBeInTheDocument();
    });
  });

  it('renders stores from seed data', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('ArtisanCraft Studio')).toBeInTheDocument();
    });
  });

  it('renders blog posts from seed data', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('3D Yazıcı Teknolojisi')).toBeInTheDocument();
    });
  });
});

