# Vendor Management Routes

Base path: `/vendors`

## POST /vendors/register
Register as a vendor (requires authentication).

**Request Body:**
```json
{
  "businessName": "My Store",
  "businessEmail": "store@example.com",
  "businessPhone": "+977-9841234567",
  "description": "Quality products at great prices",
  "website": "https://mystore.com",
  "facebook": "https://facebook.com/mystore",
  "instagram": "https://instagram.com/mystore",
  "twitter": "https://twitter.com/mystore"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor registration submitted for approval",
  "data": {
    "vendor": {
      "id": 1,
      "businessName": "My Store",
      "businessEmail": "store@example.com",
      "slug": "my-store",
      "isApproved": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## GET /vendors/profile
Get vendor profile (requires vendor authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "vendor": {
      "id": 1,
      "businessName": "My Store",
      "businessEmail": "store@example.com",
      "businessPhone": "+977-9841234567",
      "slug": "my-store",
      "description": "Quality products at great prices",
      "logo": "https://example.com/logo.jpg",
      "banner": "https://example.com/banner.jpg",
      "website": "https://mystore.com",
      "facebook": "https://facebook.com/mystore",
      "instagram": "https://instagram.com/mystore",
      "twitter": "https://twitter.com/mystore",
      "isApproved": true,
      "approvedAt": "2024-01-16T10:30:00Z",
      "rating": 4.5,
      "totalReviews": 25,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## PUT /vendors/profile
Update vendor profile (requires vendor authentication).

**Request Body:**
```json
{
  "businessName": "Updated Store Name",
  "description": "Updated description",
  "website": "https://newwebsite.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

## POST /vendors/logo
Upload vendor logo (requires vendor authentication).

**Request:** Multipart form data with image file.

**Response:**
```json
{
  "success": true,
  "message": "Logo uploaded successfully",
  "data": {
    "logo": "https://example.com/logos/vendor123.jpg"
  }
}
```

## POST /vendors/banner
Upload vendor banner (requires vendor authentication).

**Request:** Multipart form data with image file.

**Response:**
```json
{
  "success": true,
  "message": "Banner uploaded successfully",
  "data": {
    "banner": "https://example.com/banners/vendor123.jpg"
  }
}
```

## GET /vendors/:slug
Get public vendor profile.

**Response:**
```json
{
  "success": true,
  "data": {
    "vendor": {
      "id": 1,
      "businessName": "My Store",
      "slug": "my-store",
      "description": "Quality products at great prices",
      "logo": "https://example.com/logo.jpg",
      "banner": "https://example.com/banner.jpg",
      "website": "https://mystore.com",
      "facebook": "https://facebook.com/mystore",
      "instagram": "https://instagram.com/mystore",
      "twitter": "https://twitter.com/mystore",
      "rating": 4.5,
      "totalReviews": 25,
      "totalProducts": 150,
      "joinedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## GET /vendors/:slug/products
Get vendor products.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Filter by category
- `sort` (string): Sort by (price, rating, newest)
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter

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
        "price": 500.00,
        "salePrice": 450.00,
        "rating": 4.5,
        "reviewCount": 10,
        "image": "https://example.com/product.jpg",
        "status": "ACTIVE"
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

## GET /vendors/:slug/reviews
Get vendor reviews.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `rating` (number): Filter by rating

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "title": "Great service!",
        "comment": "Excellent products and fast delivery",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "product": {
          "name": "Product Name",
          "slug": "product-name"
        },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

## GET /vendors/bank-details
Get vendor bank details (requires vendor authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "bankDetails": [
      {
        "id": 1,
        "bankName": "Nepal Bank",
        "accountName": "My Store",
        "accountNumber": "1234567890",
        "branch": "Kathmandu Branch",
        "isDefault": true
      }
    ]
  }
}
```

## POST /vendors/bank-details
Add bank details (requires vendor authentication).

**Request Body:**
```json
{
  "bankName": "Nepal Bank",
  "accountName": "My Store",
  "accountNumber": "1234567890",
  "branch": "Kathmandu Branch",
  "isDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bank details added successfully"
}
```

## PUT /vendors/bank-details/:id
Update bank details (requires vendor authentication).

**Request Body:**
```json
{
  "bankName": "Updated Bank Name",
  "accountNumber": "0987654321"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bank details updated successfully"
}
```

## DELETE /vendors/bank-details/:id
Delete bank details (requires vendor authentication).

**Response:**
```json
{
  "success": true,
  "message": "Bank details deleted successfully"
}
```

## GET /vendors/policies
Get vendor policies (requires vendor authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "policies": [
      {
        "id": 1,
        "policyType": "shipping",
        "title": "Shipping Policy",
        "description": "Free shipping on orders above Rs. 1000"
      },
      {
        "id": 2,
        "policyType": "return",
        "title": "Return Policy",
        "description": "7-day return policy for unused items"
      }
    ]
  }
}
```

## POST /vendors/policies
Add vendor policy (requires vendor authentication).

**Request Body:**
```json
{
  "policyType": "shipping",
  "title": "Shipping Policy",
  "description": "Free shipping on orders above Rs. 1000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Policy added successfully"
}
```

## PUT /vendors/policies/:id
Update vendor policy (requires vendor authentication).

**Request Body:**
```json
{
  "title": "Updated Shipping Policy",
  "description": "Updated shipping policy description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Policy updated successfully"
}
```

## DELETE /vendors/policies/:id
Delete vendor policy (requires vendor authentication).

**Response:**
```json
{
  "success": true,
  "message": "Policy deleted successfully"
}
```

## GET /vendors/analytics
Get vendor analytics (requires vendor authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalSales": 150000.00,
      "totalOrders": 150,
      "averageOrderValue": 1000.00,
      "totalProducts": 50,
      "activeProducts": 45,
      "totalReviews": 25,
      "averageRating": 4.5,
      "salesChart": [
        {
          "date": "2024-01-15",
          "sales": 5000.00,
          "orders": 5
        }
      ]
    }
  }
}
``` 