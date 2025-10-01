# 📡 TDC Market API Referansı

## 🔐 Authentication

### POST /api/auth/login
Kullanıcı girişi yapar.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER",
    "avatar": "https://example.com/avatar.jpg"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /api/auth/logout
Kullanıcı çıkışı yapar.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
Mevcut kullanıcı bilgilerini getirir.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
}
```

## 📝 Blog API

### GET /api/blog
Blog yazılarını listeler.

**Query Parameters:**
- `topic` (string, optional) - Konu filtresi
- `sort` (string, optional) - Sıralama (trend, newest, popular)
- `page` (number, optional) - Sayfa numarası (default: 1)
- `limit` (number, optional) - Sayfa başına yazı sayısı (default: 10)
- `search` (string, optional) - Arama terimi

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "post_123",
        "title": "Blog Post Title",
        "slug": "blog-post-title",
        "excerpt": "Post excerpt...",
        "coverUrl": "https://example.com/cover.jpg",
        "readingTime": 5,
        "author": {
          "id": "author_123",
          "name": "Author Name",
          "avatar": "https://example.com/avatar.jpg"
        },
        "topic": {
          "id": "topic_123",
          "name": "Technology",
          "slug": "technology"
        },
        "tags": ["tech", "web"],
        "likesCount": 42,
        "savesCount": 15,
        "viewsCount": 1200,
        "createdAt": "2024-01-15T10:30:00Z",
        "publishedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### GET /api/blog/[slug]
Belirli bir blog yazısını getirir.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "post_123",
    "title": "Blog Post Title",
    "slug": "blog-post-title",
    "content": "<p>Full blog post content...</p>",
    "coverUrl": "https://example.com/cover.jpg",
    "readingTime": 5,
    "author": {
      "id": "author_123",
      "name": "Author Name",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Author bio...",
      "followersCount": 150
    },
    "topic": {
      "id": "topic_123",
      "name": "Technology",
      "slug": "technology"
    },
    "tags": ["tech", "web"],
    "likesCount": 42,
    "savesCount": 15,
    "viewsCount": 1200,
    "isLiked": false,
    "isSaved": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "publishedAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /api/blog
Yeni blog yazısı oluşturur.

**Request Body:**
```json
{
  "title": "New Blog Post",
  "content": "Blog post content...",
  "topicId": "topic_123",
  "tags": ["tech", "web"],
  "coverUrl": "https://example.com/cover.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "post_123",
    "slug": "new-blog-post",
    "status": "DRAFT"
  }
}
```

### POST /api/blog/[id]/like
Blog yazısını beğenir/beğenmeyi kaldırır.

**Response:**
```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "likesCount": 43
  }
}
```

### POST /api/blog/[id]/save
Blog yazısını kaydeder/kaydetmeyi kaldırır.

**Response:**
```json
{
  "success": true,
  "data": {
    "isSaved": true,
    "savesCount": 16
  }
}
```

### POST /api/blog/[id]/comment
Blog yazısına yorum ekler.

**Request Body:**
```json
{
  "content": "Great post!",
  "parentId": "comment_123" // Optional, for replies
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "comment_456",
    "content": "Great post!",
    "author": {
      "id": "user_123",
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg"
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

## 🛒 E-commerce API

### GET /api/products
Ürünleri listeler.

**Query Parameters:**
- `category` (string, optional) - Kategori filtresi
- `search` (string, optional) - Arama terimi
- `minPrice` (number, optional) - Minimum fiyat
- `maxPrice` (number, optional) - Maksimum fiyat
- `sort` (string, optional) - Sıralama (price, name, newest)
- `page` (number, optional) - Sayfa numarası
- `limit` (number, optional) - Sayfa başına ürün sayısı

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product_123",
        "name": "Product Name",
        "slug": "product-name",
        "description": "Product description...",
        "price": 99.99,
        "comparePrice": 129.99,
        "images": [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        "category": {
          "id": "category_123",
          "name": "Electronics",
          "slug": "electronics"
        },
        "seller": {
          "id": "seller_123",
          "name": "Seller Name",
          "rating": 4.5
        },
        "rating": 4.2,
        "reviewsCount": 25,
        "stock": 10,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "totalPages": 25
    }
  }
}
```

### GET /api/products/[id]
Belirli bir ürünü getirir.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "product_123",
    "name": "Product Name",
    "slug": "product-name",
    "description": "Detailed product description...",
    "price": 99.99,
    "comparePrice": 129.99,
    "images": [
      {
        "url": "https://example.com/image1.jpg",
        "alt": "Product image 1"
      }
    ],
    "variants": [
      {
        "id": "variant_123",
        "name": "Small",
        "price": 89.99,
        "stock": 5,
        "attributes": {
          "size": "S",
          "color": "Red"
        }
      }
    ],
    "category": {
      "id": "category_123",
      "name": "Electronics",
      "slug": "electronics"
    },
    "seller": {
      "id": "seller_123",
      "name": "Seller Name",
      "rating": 4.5,
      "reviewsCount": 150
    },
    "rating": 4.2,
    "reviewsCount": 25,
    "stock": 10,
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /api/cart
Sepete ürün ekler.

**Request Body:**
```json
{
  "productId": "product_123",
  "quantity": 2,
  "variantId": "variant_123" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart_item_123",
    "product": {
      "id": "product_123",
      "name": "Product Name",
      "price": 99.99,
      "image": "https://example.com/image.jpg"
    },
    "quantity": 2,
    "total": 199.98
  }
}
```

### GET /api/cart
Sepet içeriğini getirir.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cart_item_123",
        "product": {
          "id": "product_123",
          "name": "Product Name",
          "price": 99.99,
          "image": "https://example.com/image.jpg"
        },
        "quantity": 2,
        "total": 199.98
      }
    ],
    "subtotal": 199.98,
    "tax": 19.99,
    "shipping": 9.99,
    "total": 229.96
  }
}
```

### POST /api/orders
Yeni sipariş oluşturur.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "product_123",
      "quantity": 2,
      "variantId": "variant_123"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Istanbul",
    "zipCode": "34000",
    "country": "Turkey",
    "phone": "+905551234567"
  },
  "paymentMethod": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_123",
    "orderNumber": "ORD-2024-001",
    "status": "PENDING",
    "total": 229.96,
    "paymentIntent": {
      "clientSecret": "pi_123_secret_456"
    }
  }
}
```

## 🔧 Admin API

### GET /api/admin/blog/pending
Bekleyen blog yazılarını getirir.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "post_123",
      "title": "Blog Post Title",
      "author": {
        "id": "author_123",
        "name": "Author Name"
      },
      "topic": {
        "name": "Technology"
      },
      "status": "PENDING",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/admin/blog/[id]/approve
Blog yazısını onaylar.

**Response:**
```json
{
  "success": true,
  "message": "Blog post approved successfully"
}
```

### POST /api/admin/blog/[id]/reject
Blog yazısını reddeder.

**Request Body:**
```json
{
  "reason": "Content violates community guidelines"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog post rejected successfully"
}
```

## 🤖 AI API

### POST /api/ai/generate-content
AI ile içerik oluşturur.

**Request Body:**
```json
{
  "topic": "Technology",
  "keywords": ["AI", "machine learning", "automation"],
  "type": "blog_post"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "The Future of AI in Technology",
    "content": "<p>Generated content...</p>",
    "tags": ["AI", "technology", "future"],
    "readingTime": 8
  }
}
```

### POST /api/ai/optimize-seo
SEO optimizasyonu yapar.

**Request Body:**
```json
{
  "title": "Blog Post Title",
  "content": "Blog post content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "optimizedTitle": "Optimized Blog Post Title",
    "metaDescription": "SEO optimized description...",
    "keywords": ["keyword1", "keyword2"],
    "suggestions": ["Add more internal links", "Optimize images"]
  }
}
```

## 📊 Analytics API

### POST /api/analytics/track
Analytics event'i kaydeder.

**Request Body:**
```json
{
  "action": "page_view",
  "category": "engagement",
  "label": "/blog",
  "value": 1
}
```

**Response:**
```json
{
  "success": true
}
```

### GET /api/analytics/dashboard
Dashboard verilerini getirir.

**Response:**
```json
{
  "success": true,
  "data": {
    "revenue": {
      "total": 50000,
      "growth": 15.5,
      "period": "month"
    },
    "users": {
      "total": 1000,
      "active": 750,
      "growth": 8.2
    },
    "orders": {
      "total": 500,
      "pending": 25,
      "completed": 450
    },
    "blog": {
      "totalPosts": 100,
      "pendingPosts": 5,
      "totalViews": 10000
    }
  }
}
```

## 🔔 Notifications API

### POST /api/notifications/subscribe
Push notification aboneliği.

**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "key1",
    "auth": "key2"
  }
}
```

**Response:**
```json
{
  "success": true,
  "subscriptionId": "sub_123"
}
```

### POST /api/notifications/send
Bildirim gönderir.

**Request Body:**
```json
{
  "title": "Notification Title",
  "body": "Notification body",
  "data": {
    "url": "/blog/post-123"
  },
  "userId": "user_123" // Optional, for specific user
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "msg_123"
}
```

## ❌ Error Responses

Tüm API endpoint'leri aşağıdaki error formatını kullanır:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific field error"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Input validation hatası
- `UNAUTHORIZED` - Yetkisiz erişim
- `FORBIDDEN` - Erişim reddedildi
- `NOT_FOUND` - Kaynak bulunamadı
- `RATE_LIMITED` - Rate limit aşıldı
- `INTERNAL_ERROR` - Sunucu hatası

## 🔒 Authentication

API'ye erişim için JWT token kullanılır. Token'ı `Authorization` header'ında gönderin:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📝 Rate Limiting

API rate limiting uygulanır:

- **Genel API**: 100 request/dakika
- **Blog yazma**: 3 yazı/saat
- **Dosya yükleme**: 10 dosya/gün

Rate limit aşıldığında `429 Too Many Requests` status code döner.

## 🔄 Pagination

Liste endpoint'leri pagination destekler:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1000,
    "totalPages": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📱 Webhook Events

Sistem aşağıdaki webhook event'lerini gönderir:

- `blog.post.published` - Blog yazısı yayınlandı
- `order.created` - Yeni sipariş oluşturuldu
- `order.updated` - Sipariş güncellendi
- `payment.completed` - Ödeme tamamlandı
- `user.registered` - Yeni kullanıcı kaydoldu

Webhook payload formatı:

```json
{
  "event": "blog.post.published",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "postId": "post_123",
    "title": "Blog Post Title",
    "authorId": "author_123"
  }
}
```
