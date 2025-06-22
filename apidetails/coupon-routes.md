# Coupon & Discount Routes

Base path: `/coupons`

## GET /coupons
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

## GET /coupons/validate
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

## GET /coupons/user
Get user coupons (requires authentication).

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

## POST /coupons/claim
Claim coupon (requires authentication).

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

## Admin Coupon Management Routes

### GET /admin/coupons
Get all coupons (requires admin authentication).

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

### POST /admin/coupons
Create new coupon (requires admin authentication).

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

### PUT /admin/coupons/:id
Update coupon (requires admin authentication).

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

### DELETE /admin/coupons/:id
Delete coupon (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

### PUT /admin/coupons/:id/activate
Activate coupon (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Coupon activated successfully"
}
```

### PUT /admin/coupons/:id/deactivate
Deactivate coupon (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Coupon deactivated successfully"
}
```

### GET /admin/coupons/:id/usage
Get coupon usage details (requires admin authentication).

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

## Vendor Coupon Routes

### GET /vendors/coupons
Get vendor coupons (requires vendor authentication).

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

### POST /vendors/coupons
Create vendor coupon (requires vendor authentication).

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

### PUT /vendors/coupons/:id
Update vendor coupon (requires vendor authentication).

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

### DELETE /vendors/coupons/:id
Delete vendor coupon (requires vendor authentication).

**Response:**
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

## Coupon Analytics Routes

### GET /admin/coupons/analytics
Get coupon analytics (requires admin authentication).

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

### GET /vendors/coupons/analytics
Get vendor coupon analytics (requires vendor authentication).

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

## Bulk Coupon Operations

### POST /admin/coupons/bulk-create
Create multiple coupons (requires admin authentication).

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

### POST /admin/coupons/bulk-deactivate
Deactivate multiple coupons (requires admin authentication).

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