# Product Management Routes

Base path: `/products`

## Public Routes

### GET /products
Get all products with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Category slug
- `brand` (string): Brand slug
- `vendor` (string): Vendor slug
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `rating` (number): Minimum rating
- `sort` (string): Sort by (price, rating, newest, popularity)
- `order` (string): Sort order (asc, desc)
- `status` (string): Product status
- `featured` (boolean): Featured products only
- `inStock` (boolean): In stock products only

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Product Name",
        "slug": "product-name",
        "description": "Product description",
        "shortDescription": "Short description",
        "price": 500.00,
        "salePrice": 450.00,
        "sku": "PROD-001",
        "stockQuantity": 100,
        "status": "ACTIVE",
        "isFeatured": true,
        "hasVariants": true,
        "rating": 4.5,
        "reviewCount": 25,
        "image": "https://example.com/product.jpg",
        "vendor": {
          "id": 1,
          "businessName": "My Store",
          "slug": "my-store"
        },
        "category": {
          "id": 1,
          "name": "Electronics",
          "slug": "electronics"
        },
        "brand": {
          "id": 1,
          "name": "Brand Name",
          "slug": "brand-name"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 500,
      "pages": 42
    },
    "filters": {
      "categories": [
        {
          "id": 1,
          "name": "Electronics",
          "count": 150
        }
      ],
      "brands": [
        {
          "id": 1,
          "name": "Brand Name",
          "count": 50
        }
      ],
      "priceRange": {
        "min": 100,
        "max": 5000
      }
    }
  }
}
```

### GET /products/featured
Get featured products.

**Query Parameters:**
- `limit` (number): Number of products to return

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Featured Product",
        "slug": "featured-product",
        "price": 500.00,
        "salePrice": 450.00,
        "rating": 4.5,
        "image": "https://example.com/product.jpg"
      }
    ]
  }
}
```

### GET /products/trending
Get trending products.

**Query Parameters:**
- `limit` (number): Number of products to return
- `period` (string): Period (7d, 30d, 90d)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Trending Product",
        "slug": "trending-product",
        "price": 500.00,
        "salesCount": 150,
        "rating": 4.5,
        "image": "https://example.com/product.jpg"
      }
    ]
  }
}
```

### GET /products/similar/:productId
Get similar products by product ID.

**Query Parameters:**
- `limit` (number): Number of products to return

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 2,
        "name": "Similar Product",
        "slug": "similar-product",
        "price": 480.00,
        "rating": 4.3,
        "image": "https://example.com/similar.jpg"
      }
    ]
  }
}
```

### GET /products/:slug
Get product details by slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "name": "Product Name",
      "slug": "product-name",
      "description": "Detailed product description",
      "shortDescription": "Short description",
      "price": 500.00,
      "salePrice": 450.00,
      "costPrice": 300.00,
      "sku": "PROD-001",
      "stockQuantity": 100,
      "status": "ACTIVE",
      "isFeatured": true,
      "hasVariants": true,
      "weight": 0.5,
      "length": 10,
      "width": 5,
      "height": 2,
      "rating": 4.5,
      "reviewCount": 25,
      "createdAt": "2024-01-15T10:30:00Z",
      "vendor": {
        "id": 1,
        "businessName": "My Store",
        "slug": "my-store",
        "rating": 4.5
      },
      "category": {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics"
      },
      "brand": {
        "id": 1,
        "name": "Brand Name",
        "slug": "brand-name"
      },
      "images": [
        {
          "id": 1,
          "url": "https://example.com/product1.jpg",
          "altText": "Product Image 1",
          "isPrimary": true,
          "order": 1
        }
      ],
      "variants": [
        {
          "id": 1,
          "name": "Color",
          "value": "Red",
          "priceDifference": 0,
          "stockQuantity": 50,
          "sku": "PROD-001-RED",
          "image": "https://example.com/red-variant.jpg"
        }
      ],
      "attributes": [
        {
          "id": 1,
          "name": "Material",
          "value": "Cotton"
        }
      ],
      "tags": [
        {
          "id": 1,
          "name": "trending"
        }
      ]
    }
  }
}
```

## Vendor-only Routes (require vendor authentication)

### POST /products
Create new product.

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "shortDescription": "Short description",
  "price": 500.00,
  "salePrice": 450.00,
  "costPrice": 300.00,
  "sku": "PROD-002",
  "stockQuantity": 100,
  "categoryId": 1,
  "brandId": 1,
  "weight": 0.5,
  "length": 10,
  "width": 5,
  "height": 2,
  "hasVariants": false,
  "attributes": [
    {
      "name": "Material",
      "value": "Cotton"
    }
  ],
  "tags": ["trending", "new"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": 2,
      "name": "New Product",
      "slug": "new-product",
      "price": 500.00
    }
  }
}
```

### PUT /products/:id
Update product.

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 550.00,
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

### DELETE /products/:id
Delete product.

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### POST /products/:id/images
Upload product images (multipart form data, field: images[]).

**Request:** Multipart form data with image files.

**Response:**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "images": [
      {
        "id": 1,
        "url": "https://example.com/product1.jpg",
        "isPrimary": true
      }
    ]
  }
}
```

### PUT /products/:id/images/:imageId
Update a specific product image.

**Request Body:**
```json
{
  "altText": "Updated alt text",
  "isPrimary": true,
  "order": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Image updated successfully"
}
```

### DELETE /products/:id/images/:imageId
Delete a specific product image.

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### POST /products/:id/variants
Add a product variant.

**Request Body:**
```json
{
  "name": "Size",
  "value": "XL",
  "priceDifference": 50.00,
  "stockQuantity": 25,
  "sku": "PROD-001-XL",
  "image": "https://example.com/xl-variant.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Variant added successfully"
}
```

### PUT /products/:id/variants/:variantId
Update a product variant.

**Request Body:**
```json
{
  "value": "XXL",
  "priceDifference": 75.00,
  "stockQuantity": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "Variant updated successfully"
}
```

### DELETE /products/:id/variants/:variantId
Delete a product variant.

**Response:**
```json
{
  "success": true,
  "message": "Variant deleted successfully"
}
```

### POST /products/:id/stock
Update product stock.

**Request Body:**
```json
{
  "stockQuantity": 150,
  "reason": "Restocked inventory"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stock updated successfully"
}
```

### GET /products/:id/analytics
Get product analytics.

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalSales": 50000.00,
      "totalOrders": 100,
      "averageOrderValue": 500.00,
      "totalViews": 1000,
      "conversionRate": 10.0,
      "salesChart": [
        {
          "date": "2024-01-15",
          "sales": 5000.00,
          "orders": 10
        }
      ]
    }
  }
}
```

---

> **Note:**
> - All vendor routes require a valid vendor JWT in the Authorization header.
> - All public routes are accessible without authentication.
> - If a route is not listed here but present in previous documentation, it is not implemented in the current codebase. 