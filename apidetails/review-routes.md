# Review & Rating Routes

Base path: `/reviews`

## POST /reviews
Create product review (requires authentication).

**Request Body:**
```json
{
  "productId": 1,
  "orderItemId": 1,
  "rating": 5,
  "title": "Great product!",
  "comment": "Excellent quality and fast delivery. Highly recommended!",
  "images": ["https://example.com/review1.jpg", "https://example.com/review2.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review submitted successfully",
  "data": {
    "review": {
      "id": 1,
      "rating": 5,
      "title": "Great product!",
      "comment": "Excellent quality and fast delivery. Highly recommended!",
      "images": ["https://example.com/review1.jpg", "https://example.com/review2.jpg"],
      "isApproved": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## GET /reviews/product/:productId
Get product reviews.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `rating` (number): Filter by rating
- `sort` (string): Sort by (newest, oldest, rating)

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "title": "Great product!",
        "comment": "Excellent quality and fast delivery. Highly recommended!",
        "images": ["https://example.com/review1.jpg"],
        "createdAt": "2024-01-15T10:30:00Z",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "variant": "Red, XL"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    },
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 25,
      "ratingDistribution": {
        "5": 15,
        "4": 7,
        "3": 2,
        "2": 1,
        "1": 0
      }
    }
  }
}
```

## GET /reviews/user
Get user reviews (requires authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "title": "Great product!",
        "comment": "Excellent quality and fast delivery. Highly recommended!",
        "images": ["https://example.com/review1.jpg"],
        "isApproved": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "product": {
          "id": 1,
          "name": "Product Name",
          "slug": "product-name",
          "image": "https://example.com/product.jpg"
        },
        "orderItem": {
          "variant": "Red, XL"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "pages": 2
    }
  }
}
```

## PUT /reviews/:id
Update review (requires authentication).

**Request Body:**
```json
{
  "rating": 4,
  "title": "Updated review title",
  "comment": "Updated review comment",
  "images": ["https://example.com/updated-review.jpg"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review updated successfully"
}
```

## DELETE /reviews/:id
Delete review (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

## POST /reviews/:id/images
Upload review images (requires authentication).

**Request:** Multipart form data with image files.

**Response:**
```json
{
  "success": true,
  "message": "Review images uploaded successfully",
  "data": {
    "images": [
      "https://example.com/review-images/review123_1.jpg",
      "https://example.com/review-images/review123_2.jpg"
    ]
  }
}
```

## GET /reviews/summary/:productId
Get product review summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 25,
      "ratingDistribution": {
        "5": 15,
        "4": 7,
        "3": 2,
        "2": 1,
        "1": 0
      },
      "recentReviews": [
        {
          "id": 1,
          "rating": 5,
          "title": "Great product!",
          "user": {
            "firstName": "John",
            "lastName": "Doe"
          },
          "createdAt": "2024-01-15T10:30:00Z"
        }
      ]
    }
  }
}
```

## Vendor Review Management Routes

### GET /vendors/reviews
Get vendor reviews (requires vendor authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `rating` (number): Filter by rating
- `productId` (number): Filter by product

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "title": "Great product!",
        "comment": "Excellent quality and fast delivery. Highly recommended!",
        "images": ["https://example.com/review1.jpg"],
        "isApproved": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        },
        "product": {
          "id": 1,
          "name": "Product Name",
          "slug": "product-name"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    },
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 50,
      "ratingDistribution": {
        "5": 30,
        "4": 15,
        "3": 3,
        "2": 2,
        "1": 0
      }
    }
  }
}
```

### GET /vendors/reviews/analytics
Get vendor review analytics (requires vendor authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalReviews": 50,
      "averageRating": 4.5,
      "recentReviews": 10,
      "ratingTrend": [
        {
          "date": "2024-01-15",
          "reviews": 5,
          "averageRating": 4.6
        }
      ],
      "topProducts": [
        {
          "productName": "Best Product",
          "reviews": 15,
          "averageRating": 4.8
        }
      ]
    }
  }
}
```

## Admin Review Management Routes

### GET /admin/reviews
Get all reviews (requires admin authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by approval status
- `rating` (number): Filter by rating
- `vendor` (string): Filter by vendor
- `product` (string): Filter by product

**Response:**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 1,
        "rating": 5,
        "title": "Great product!",
        "comment": "Excellent quality and fast delivery. Highly recommended!",
        "images": ["https://example.com/review1.jpg"],
        "isApproved": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "product": {
          "name": "Product Name",
          "slug": "product-name"
        },
        "vendor": {
          "businessName": "My Store"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 200,
      "pages": 10
    }
  }
}
```

### PUT /admin/reviews/:id/approve
Approve review (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Review approved successfully"
}
```

### PUT /admin/reviews/:id/reject
Reject review (requires admin authentication).

**Request Body:**
```json
{
  "reason": "Inappropriate content"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review rejected successfully"
}
```

### DELETE /admin/reviews/:id
Delete review (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

### GET /admin/reviews/analytics
Get admin review analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalReviews": 500,
      "averageRating": 4.3,
      "pendingReviews": 20,
      "approvedReviews": 450,
      "rejectedReviews": 30,
      "ratingDistribution": {
        "5": 250,
        "4": 150,
        "3": 60,
        "2": 25,
        "1": 15
      },
      "topVendors": [
        {
          "vendorName": "Top Store",
          "reviews": 50,
          "averageRating": 4.5
        }
      ],
      "topProducts": [
        {
          "productName": "Best Product",
          "reviews": 25,
          "averageRating": 4.8
        }
      ],
      "dailyReviews": [
        {
          "date": "2024-01-15",
          "reviews": 10,
          "averageRating": 4.4
        }
      ]
    }
  }
}
```

## Review Helpfulness Routes

### POST /reviews/:id/helpful
Mark review as helpful (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Review marked as helpful"
}
```

### POST /reviews/:id/unhelpful
Mark review as unhelpful (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Review marked as unhelpful"
}
```

### GET /reviews/:id/helpfulness
Get review helpfulness stats.

**Response:**
```json
{
  "success": true,
  "data": {
    "helpfulCount": 15,
    "unhelpfulCount": 2,
    "userVote": "helpful" // or "unhelpful" or null
  }
}
``` 