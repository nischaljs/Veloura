# Category Management Routes

Base path: `/categories`

## Public Routes

### GET /categories
Get all categories.

### GET /categories/featured
Get featured categories.

### GET /categories/search
Search categories.

### GET /categories/tree
Get category tree.

### GET /categories/:slug
Get category details by slug.

### GET /categories/:slug/products
Get products by category slug.

## Admin-only Routes (require admin authentication)

### POST /categories
Create new category.

### PUT /categories/:id
Update category.

### DELETE /categories/:id
Delete category.

### POST /categories/:id/image
Upload category image (multipart form data, field: image).

### DELETE /categories/:id/image
Remove category image.

### PUT /categories/featured-order
Update featured order for categories.

### GET /categories/analytics
Get category analytics.

---

> **Note:**
> - All admin routes require a valid admin JWT in the Authorization header.
> - All public routes are accessible without authentication.
> - If a route is not listed here but present in previous documentation, it is not implemented in the current codebase.

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

```json
{
  "success": true,
  "message": "Category updated successfully"
}
```

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

```json
{
  "success": true,
  "message": "Category image uploaded successfully",
  "data": {
    "image": "/images/categories/category-1-image.jpg"
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
  "message": "Invalid file type. Only JPEG, PNG, and WebP files are allowed"
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
  "message": "Category image removed successfully"
}
```

```json
{
  "success": false,
  "message": "Category has no image to remove"
}
```

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
 