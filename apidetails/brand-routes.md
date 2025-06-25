# Brand Management Routes

Base path: `/brands`

## Public Routes

### GET /brands
Get all brands.

### GET /brands/featured
Get featured brands.

### GET /brands/search
Search brands.

### GET /brands/:slug
Get brand details by slug.

### GET /brands/:slug/products
Get products by brand slug.

## Authenticated/Admin-only Routes (require authentication)

### POST /brands
Create new brand.

### PUT /brands/:id
Update brand.

### DELETE /brands/:id
Delete brand.

### POST /brands/:id/logo
Upload brand logo (multipart form data, field: logo).

### DELETE /brands/:id/logo
Remove brand logo.

### PUT /brands/featured-order
Update featured order for brands.

### GET /brands/analytics
Get brand analytics.

---

> **Note:**
> - All authenticated routes require a valid JWT in the Authorization header.
> - All public routes are accessible without authentication.
> - If a route is not listed here but present in previous documentation, it is not implemented in the current codebase.

```json
{
  "success": true,
  "data": {
    "brands": [
      {
        "id": 1,
        "name": "Brand Name",
        "slug": "brand-name",
        "description": "Brand description",
        "logo": "https://example.com/brand-logo.jpg",
        "website": "https://brandwebsite.com",
        "isFeatured": true,
        "featuredOrder": 1,
        "productCount": 50
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

```json
{
  "success": true,
  "data": {
    "brand": {
      "id": 1,
      "name": "Brand Name",
      "slug": "brand-name",
      "description": "Brand description",
      "logo": "https://example.com/brand-logo.jpg",
      "website": "https://brandwebsite.com",
      "isFeatured": true,
      "featuredOrder": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "productCount": 50
    }
  }
}
```

```json
{
  "success": true,
  "data": {
    "brand": {
      "id": 1,
      "name": "Brand Name",
      "slug": "brand-name"
    },
    "products": [
      {
        "id": 1,
        "name": "Product Name",
        "slug": "product-name",
        "price": 500.00,
        "salePrice": 450.00,
        "rating": 4.5,
        "reviewCount": 25,
        "image": "https://example.com/product.jpg",
        "vendor": {
          "businessName": "My Store",
          "slug": "my-store"
        },
        "category": {
          "name": "Electronics",
          "slug": "electronics"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "pages": 5
    }
  }
}
```

```json
{
  "success": true,
  "message": "Brand created successfully",
  "data": {
    "brand": {
      "id": 2,
      "name": "New Brand",
      "slug": "new-brand"
    }
  }
}
```

```json
{
  "success": true,
  "message": "Brand updated successfully"
}
```

```json
{
  "success": true,
  "message": "Brand deleted successfully"
}
```

```json
{
  "success": true,
  "message": "Brand logo uploaded successfully",
  "data": {
    "logo": "/images/brands/brand-1-logo.jpg"
  }
}
```

```json
{
  "success": false,
  "message": "No image file provided"
}
```

```json
{
  "success": false,
  "message": "Invalid file type. Only JPEG, PNG, WebP, and SVG files are allowed"
}
```

```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB"
}
```

```json
{
  "success": true,
  "message": "Brand logo removed successfully"
}
```

```json
{
  "success": false,
  "message": "Brand has no logo to remove"
}
```

```json
{
  "success": true,
  "data": {
    "brands": [
      {
        "id": 1,
        "name": "Brand Name",
        "slug": "brand-name",
        "logo": "https://example.com/brand-logo.jpg",
        "featuredOrder": 1,
        "productCount": 50
      }
    ]
  }
}
```

```json
{
  "success": true,
  "data": {
    "brands": [
      {
        "id": 1,
        "name": "Brand Name",
        "slug": "brand-name",
        "logo": "https://example.com/brand-logo.jpg",
        "featuredOrder": 1,
        "productCount": 50
      }
    ]
  }
}
```

```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalBrands": 100,
      "featuredBrands": 10,
      "topBrands": [
        {
          "id": 1,
          "name": "Top Brand",
          "totalSales": 500000.00,
          "totalProducts": 50,
          "averageRating": 4.5
        }
      ],
      "brandGrowth": [
        {
          "date": "2024-01-15",
          "newBrands": 5,
          "totalBrands": 100
        }
      ]
    }
  }
}
``` 