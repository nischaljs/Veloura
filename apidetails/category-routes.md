# Category Management Routes

Base path: `/categories`

## GET /categories
Get all categories.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `parent` (string): Parent category slug
- `featured` (boolean): Featured categories only
- `search` (string): Search by category name

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics",
        "description": "Electronic devices and gadgets",
        "image": "https://example.com/category-image.jpg",
        "parentId": null,
        "isFeatured": true,
        "featuredOrder": 1,
        "productCount": 150,
        "subcategoryCount": 5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

## GET /categories/:slug
Get category details by slug.

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets",
      "image": "https://example.com/category-image.jpg",
      "parentId": null,
      "isFeatured": true,
      "featuredOrder": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "productCount": 150,
      "subcategoryCount": 5,
      "parent": {
        "id": null,
        "name": null,
        "slug": null
      },
      "subcategories": [
        {
          "id": 2,
          "name": "Smartphones",
          "slug": "smartphones",
          "productCount": 50
        }
      ]
    }
  }
}
```

## GET /categories/:slug/products 🔴 Yet to implement
Get products by category.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `sort` (string): Sort by (price, rating, newest, popularity)
- `order` (string): Sort order (asc, desc)
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `brand` (string): Brand filter
- `vendor` (string): Vendor filter
- `rating` (number): Minimum rating

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics"
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
        "brand": {
          "name": "Brand Name",
          "slug": "brand-name"
        },
        "vendor": {
          "businessName": "My Store",
          "slug": "my-store"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 150,
      "pages": 13
    }
  }
}
```

## POST /categories
Create new category (requires admin authentication).

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description",
  "parentId": null,
  "isFeatured": false,
  "featuredOrder": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": 2,
      "name": "New Category",
      "slug": "new-category"
    }
  }
}
```

## PUT /categories/:id
Update category (requires admin authentication).

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description",
  "parentId": 1,
  "isFeatured": true,
  "featuredOrder": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category updated successfully"
}
```

## DELETE /categories/:id
Delete category (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## POST /categories/:id/image 🔴 Yet to implement
Upload category image (requires admin authentication).

**Request:** Multipart form data with image file.

**Response:**
```json
{
  "success": true,
  "message": "Category image uploaded successfully",
  "data": {
    "image": "https://example.com/categories/category123.jpg"
  }
}
```

## DELETE /categories/:id/image 🔴 Yet to implement
Remove category image (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Category image removed successfully"
}
```

## GET /categories/featured
Get featured categories.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics",
        "image": "https://example.com/category-image.jpg",
        "featuredOrder": 1,
        "productCount": 150,
        "subcategoryCount": 5
      }
    ]
  }
}
```

## PUT /categories/featured-order 🔴 Yet to implement
Update featured categories order (requires admin authentication).

**Request Body:**
```json
{
  "categories": [
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

## GET /categories/search
Search categories by name.

**Query Parameters:**
- `q` (string): Search query
- `limit` (number): Number of results

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics",
        "image": "https://example.com/category-image.jpg",
        "productCount": 150
      }
    ]
  }
}
```

## GET /categories/tree
Get category hierarchy tree.

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics",
        "productCount": 150,
        "subcategories": [
          {
            "id": 2,
            "name": "Smartphones",
            "slug": "smartphones",
            "productCount": 50,
            "subcategories": []
          }
        ]
      }
    ]
  }
}
```

## GET /categories/analytics 🔴 Yet to implement
Get category analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalCategories": 50,
      "featuredCategories": 10,
      "topCategories": [
        {
          "id": 1,
          "name": "Electronics",
          "totalSales": 500000.00,
          "totalProducts": 150,
          "averageRating": 4.5
        }
      ],
      "categoryGrowth": [
        {
          "date": "2024-01-15",
          "newCategories": 3,
          "totalCategories": 50
        }
      ]
    }
  }
}
```
 