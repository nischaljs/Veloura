# Coupon & Discount Routes

Base path: `/coupons`

## Public Routes

### GET /coupons
Get available coupons.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `category` (string): Filter by category
- `vendor` (string): Filter by vendor

**Response:**
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": 1,
        "code": "SAVE10",
        "description": "Save 10% on your first order",
        "discountType": "percentage",
        "discountValue": 10,
        "minOrderAmount": 1000.00,
        "maxUses": 100,
        "uses": 50,
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-12-31T23:59:59Z",
        "isActive": true,
        "applicableCategories": ["electronics", "clothing"],
        "applicableVendors": ["my-store", "tech-store"]
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

### GET /coupons/validate
Validate coupon code.

**Query Parameters:**
- `code` (string): Coupon code
- `amount` (number): Order amount
- `category` (string): Category slug
- `vendor` (string): Vendor slug

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "coupon": {
      "id": 1,
      "code": "SAVE10",
      "description": "Save 10% on your first order",
      "discountType": "percentage",
      "discountValue": 10,
      "discountAmount": 100.00,
      "minOrderAmount": 1000.00,
      "remainingUses": 50
    }
  }
}
```

## User Routes (require authentication)

### GET /coupons/user
Get user coupons.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status (active, used, expired)

**Response:**
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": 1,
        "code": "SAVE10",
        "description": "Save 10% on your first order",
        "discountType": "percentage",
        "discountValue": 10,
        "minOrderAmount": 1000.00,
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-12-31T23:59:59Z",
        "isActive": true,
        "usedAt": null,
        "orderId": null
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

### POST /coupons/claim
Claim coupon.

**Request Body:**
```json
{
  "code": "SAVE10"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon claimed successfully",
  "data": {
    "coupon": {
      "id": 1,
      "code": "SAVE10",
      "description": "Save 10% on your first order",
      "discountType": "percentage",
      "discountValue": 10,
      "minOrderAmount": 1000.00,
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-12-31T23:59:59Z"
    }
  }
}
```

## Vendor Routes (require vendor authentication)

### GET /coupons/vendors/coupons
Get vendor coupons.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status

**Response:**
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": 1,
        "code": "VENDOR10",
        "description": "Vendor specific discount",
        "discountType": "percentage",
        "discountValue": 10,
        "minOrderAmount": 500.00,
        "maxUses": 50,
        "uses": 25,
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-12-31T23:59:59Z",
        "isActive": true,
        "usageRate": 50.0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 20,
      "pages": 2
    }
  }
}
```

### POST /coupons/vendors/coupons
Create vendor coupon.

**Request Body:**
```json
{
  "code": "VENDOR20",
  "description": "Vendor discount 20%",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderAmount": 1000.00,
  "maxUses": 100,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "coupon": {
      "id": 2,
      "code": "VENDOR20"
    }
  }
}
```

### PUT /coupons/vendors/coupons/:id
Update vendor coupon.

**Request Body:**
```json
{
  "description": "Updated vendor discount",
  "discountValue": 25,
  "maxUses": 150
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon updated successfully"
}
```

### DELETE /coupons/vendors/coupons/:id
Delete vendor coupon.

**Response:**
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

### GET /coupons/vendors/coupons/analytics
Get vendor coupon analytics.

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalCoupons": 20,
      "activeCoupons": 10,
      "totalUses": 500,
      "totalDiscount": 50000.00,
      "averageUsageRate": 40.0,
      "topCoupons": [
        {
          "code": "VENDOR10",
          "uses": 100,
          "discount": 10000.00,
          "usageRate": 50.0
        }
      ],
      "couponPerformance": [
        {
          "date": "2024-01-15",
          "uses": 10,
          "discount": 1000.00
        }
      ]
    }
  }
}
```

## Admin Routes (require admin authentication)

### GET /coupons/admin/coupons
Get all admin coupons.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `search` (string): Search by code
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "coupons": [
      {
        "id": 1,
        "code": "SAVE10",
        "description": "Save 10% on your first order",
        "discountType": "percentage",
        "discountValue": 10,
        "minOrderAmount": 1000.00,
        "maxUses": 100,
        "uses": 50,
        "startDate": "2024-01-01T00:00:00Z",
        "endDate": "2024-12-31T23:59:59Z",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "usageRate": 50.0
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

### POST /coupons/admin/coupons
Create admin coupon.

**Request Body:**
```json
{
  "code": "NEW20",
  "description": "Save 20% on all orders",
  "discountType": "percentage",
  "discountValue": 20,
  "minOrderAmount": 500.00,
  "maxUses": 200,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "applicableCategories": ["electronics", "clothing"],
  "applicableVendors": ["my-store"],
  "userRestrictions": {
    "newUsersOnly": true,
    "specificUsers": []
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "coupon": {
      "id": 2,
      "code": "NEW20",
      "description": "Save 20% on all orders"
    }
  }
}
```

### PUT /coupons/admin/coupons/:id
Update admin coupon.

**Request Body:**
```json
{
  "description": "Updated description",
  "discountValue": 25,
  "maxUses": 300,
  "endDate": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon updated successfully"
}
```

### DELETE /coupons/admin/coupons/:id
Delete admin coupon.

**Response:**
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

### PUT /coupons/admin/coupons/:id/activate
Activate admin coupon.

**Response:**
```json
{
  "success": true,
  "message": "Coupon activated successfully"
}
```

### PUT /coupons/admin/coupons/:id/deactivate
Deactivate admin coupon.

**Response:**
```json
{
  "success": true,
  "message": "Coupon deactivated successfully"
}
```

### GET /coupons/admin/coupons/:id/usage
Get coupon usage.

**Response:**
```json
{
  "success": true,
  "data": {
    "coupon": {
      "id": 1,
      "code": "SAVE10",
      "totalUses": 50,
      "totalDiscount": 5000.00,
      "usageRate": 50.0
    },
    "usage": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "user": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "orderAmount": 1000.00,
        "discountAmount": 100.00,
        "usedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### GET /coupons/admin/coupons/analytics
Get admin coupon analytics.

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalCoupons": 100,
      "activeCoupons": 50,
      "totalUses": 5000,
      "totalDiscount": 500000.00,
      "averageUsageRate": 45.5,
      "topCoupons": [
        {
          "code": "SAVE10",
          "uses": 500,
          "discount": 50000.00,
          "usageRate": 50.0
        }
      ],
      "couponPerformance": [
        {
          "date": "2024-01-15",
          "uses": 50,
          "discount": 5000.00
        }
      ]
    }
  }
}
```

### POST /coupons/admin/coupons/bulk-create
Bulk create admin coupons.

**Request Body:**
```json
{
  "coupons": [
    {
      "code": "BULK1",
      "description": "Bulk coupon 1",
      "discountType": "percentage",
      "discountValue": 10,
      "maxUses": 50
    },
    {
      "code": "BULK2",
      "description": "Bulk coupon 2",
      "discountType": "fixed",
      "discountValue": 100,
      "maxUses": 30
    }
  ],
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk coupons created successfully",
  "data": {
    "created": 2,
    "failed": 0,
    "coupons": [
      {
        "id": 3,
        "code": "BULK1"
      },
      {
        "id": 4,
        "code": "BULK2"
      }
    ]
  }
}
```

### POST /coupons/admin/coupons/bulk-deactivate
Bulk deactivate admin coupons.

**Request Body:**
```json
{
  "couponIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk deactivation completed",
  "data": {
    "deactivated": 3,
    "failed": 0
  }
}
```

---

> **Note:**
> - All user, vendor, and admin routes require a valid JWT in the Authorization header.
> - All public routes are accessible without authentication.
> - If a route is not listed here but present in previous documentation, it is not implemented in the current codebase. 