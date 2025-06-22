# Brand Management Routes

Base path: `/brands`

## GET /brands
Get all brands.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `featured` (boolean): Featured brands only
- `search` (string): Search by brand name

**Response:**
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

## GET /brands/:slug
Get brand details by slug.

**Response:**
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

## GET /brands/:slug/products
Get products by brand.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `sort` (string): Sort by (price, rating, newest, popularity)
- `order` (string): Sort order (asc, desc)
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `category` (string): Category filter
- `vendor` (string): Vendor filter
- `rating` (number): Minimum rating

**Response:**
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

## POST /brands
Create new brand (requires admin authentication).

**Request Body:**
```json
{
  "name": "New Brand",
  "description": "Brand description",
  "website": "https://newbrand.com",
  "isFeatured": false,
  "featuredOrder": null
}
```

**Response:**
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

## PUT /brands/:id
Update brand (requires admin authentication).

**Request Body:**
```json
{
  "name": "Updated Brand Name",
  "description": "Updated description",
  "website": "https://updatedbrand.com",
  "isFeatured": true,
  "featuredOrder": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Brand updated successfully"
}
```

## DELETE /brands/:id
Delete brand (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Brand deleted successfully"
}
```

## POST /brands/:id/logo
Upload brand logo (requires admin authentication).

**Request:** Multipart form data with image file.

**Response:**
```json
{
  "success": true,
  "message": "Brand logo uploaded successfully",
  "data": {
    "logo": "https://example.com/brands/brand123.jpg"
  }
}
```

## DELETE /brands/:id/logo
Remove brand logo (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Brand logo removed successfully"
}
```

## GET /brands/featured
Get featured brands.

**Response:**
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

## PUT /brands/featured-order
Update featured brands order (requires admin authentication).

**Request Body:**
```json
{
  "brands": [
    {
      "id": 1,
      "featuredOrder": 1
    },
    {
      "id": 2,
      "featuredOrder": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Featured order updated successfully"
}
```

## GET /brands/search
Search brands by name.

**Query Parameters:**
- `q` (string): Search query
- `limit` (number): Number of results

**Response:**
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
        "productCount": 50
      }
    ]
  }
}
```

## GET /brands/analytics
Get brand analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
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