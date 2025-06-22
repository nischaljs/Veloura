# Admin Routes

Base path: `/admin`

## User Management Routes

### GET /admin/users
Get all users (requires admin authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `role` (string): Filter by user role
- `status` (string): Filter by user status
- `search` (string): Search by name or email
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+977-9841234567",
        "role": "CUSTOMER",
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "lastLogin": "2024-01-20T15:30:00Z",
        "orderCount": 5,
        "totalSpent": 5000.00
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "pages": 25
    }
  }
}
```

### GET /admin/users/:id
Get user details (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+977-9841234567",
      "avatar": "https://example.com/avatar.jpg",
      "role": "CUSTOMER",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-20T15:30:00Z",
      "addresses": [
        {
          "id": 1,
          "label": "Home",
          "recipientName": "John Doe",
          "street": "123 Main St",
          "city": "Kathmandu"
        }
      ],
      "orders": [
        {
          "id": 1,
          "orderNumber": "ORD-2024-001",
          "status": "DELIVERED",
          "total": 1000.00,
          "createdAt": "2024-01-15T10:30:00Z"
        }
      ],
      "reviews": [
        {
          "id": 1,
          "rating": 5,
          "title": "Great product!",
          "createdAt": "2024-01-16T10:30:00Z"
        }
      ]
    }
  }
}
```

### PUT /admin/users/:id
Update user (requires admin authentication).

**Request Body:**
```json
{
  "firstName": "Updated John",
  "lastName": "Updated Doe",
  "role": "VENDOR",
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

### DELETE /admin/users/:id
Delete user (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### PUT /admin/users/:id/activate
Activate user (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully"
}
```

### PUT /admin/users/:id/deactivate
Deactivate user (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully"
}
```

## Vendor Management Routes

### GET /admin/vendors
Get all vendors (requires admin authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by approval status
- `search` (string): Search by business name
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "vendors": [
      {
        "id": 1,
        "businessName": "My Store",
        "businessEmail": "store@example.com",
        "businessPhone": "+977-9841234567",
        "slug": "my-store",
        "isApproved": true,
        "approvedAt": "2024-01-16T10:30:00Z",
        "rating": 4.5,
        "totalReviews": 25,
        "totalProducts": 50,
        "totalSales": 100000.00,
        "createdAt": "2024-01-15T10:30:00Z",
        "user": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        }
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

### GET /admin/vendors/:id
Get vendor details (requires admin authentication).

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
      "taxId": "TAX123456",
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
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "products": [
        {
          "id": 1,
          "name": "Product Name",
          "status": "ACTIVE",
          "price": 500.00
        }
      ],
      "bankDetails": [
        {
          "id": 1,
          "bankName": "Nepal Bank",
          "accountName": "My Store",
          "accountNumber": "1234567890"
        }
      ],
      "policies": [
        {
          "id": 1,
          "policyType": "shipping",
          "title": "Shipping Policy",
          "description": "Free shipping on orders above Rs. 1000"
        }
      ]
    }
  }
}
```

### PUT /admin/vendors/:id/approve
Approve vendor (requires admin authentication).

**Request Body:**
```json
{
  "notes": "Vendor approved after review"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor approved successfully"
}
```

### PUT /admin/vendors/:id/reject
Reject vendor (requires admin authentication).

**Request Body:**
```json
{
  "reason": "Incomplete documentation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor rejected successfully"
}
```

### PUT /admin/vendors/:id/suspend
Suspend vendor (requires admin authentication).

**Request Body:**
```json
{
  "reason": "Policy violation",
  "duration": "30d"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor suspended successfully"
}
```

## Product Management Routes

### GET /admin/products
Get all products (requires admin authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by product status
- `vendor` (string): Filter by vendor
- `category` (string): Filter by category
- `search` (string): Search by product name
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

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
        "status": "ACTIVE",
        "stockQuantity": 100,
        "rating": 4.5,
        "reviewCount": 25,
        "createdAt": "2024-01-15T10:30:00Z",
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
      "limit": 20,
      "total": 1000,
      "pages": 50
    }
  }
}
```

### PUT /admin/products/:id/status
Update product status (requires admin authentication).

**Request Body:**
```json
{
  "status": "ARCHIVED",
  "reason": "Discontinued product"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product status updated successfully"
}
```

### DELETE /admin/products/:id
Delete product (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## System Settings Routes

### GET /admin/settings
Get system settings (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "site": {
        "name": "Veloura",
        "description": "Your trusted e-commerce platform",
        "logo": "https://example.com/logo.png",
        "favicon": "https://example.com/favicon.ico",
        "maintenance": false
      },
      "payment": {
        "khalti": {
          "enabled": true,
          "publicKey": "test_public_key",
          "secretKey": "test_secret_key"
        },
        "esewa": {
          "enabled": true,
          "merchantId": "test_merchant_id",
          "secretKey": "test_secret_key"
        }
      },
      "shipping": {
        "defaultFee": 100.00,
        "freeShippingThreshold": 1000.00
      },
      "commission": {
        "percentage": 10.0,
        "fixedAmount": 0.00
      }
    }
  }
}
```

### PUT /admin/settings
Update system settings (requires admin authentication).

**Request Body:**
```json
{
  "site": {
    "name": "Updated Veloura",
    "description": "Updated description"
  },
  "payment": {
    "khalti": {
      "enabled": true,
      "publicKey": "new_public_key"
    }
  },
  "shipping": {
    "defaultFee": 150.00,
    "freeShippingThreshold": 1500.00
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

## Analytics Routes

### GET /admin/analytics/dashboard
Get admin dashboard analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "overview": {
        "totalUsers": 5000,
        "totalVendors": 100,
        "totalProducts": 5000,
        "totalOrders": 10000,
        "totalRevenue": 5000000.00
      },
      "recentActivity": {
        "newUsers": 50,
        "newVendors": 5,
        "newProducts": 100,
        "newOrders": 200
      },
      "sales": {
        "totalSales": 5000000.00,
        "averageOrderValue": 500.00,
        "conversionRate": 3.5,
        "salesChart": [
          {
            "date": "2024-01-15",
            "sales": 50000.00,
            "orders": 100
          }
        ]
      },
      "topVendors": [
        {
          "vendorName": "Top Store",
          "sales": 500000.00,
          "orders": 1000
        }
      ],
      "topProducts": [
        {
          "productName": "Best Product",
          "sales": 100000.00,
          "orders": 200
        }
      ],
      "topCategories": [
        {
          "categoryName": "Electronics",
          "sales": 1000000.00,
          "orders": 2000
        }
      ]
    }
  }
}
```

### GET /admin/analytics/users
Get user analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalUsers": 5000,
      "activeUsers": 3500,
      "newUsers": 500,
      "userGrowth": [
        {
          "date": "2024-01-15",
          "newUsers": 25,
          "totalUsers": 5000
        }
      ],
      "userRoles": {
        "CUSTOMER": 4500,
        "VENDOR": 450,
        "ADMIN": 50
      },
      "topCustomers": [
        {
          "userName": "John Doe",
          "totalSpent": 50000.00,
          "orderCount": 50
        }
      ]
    }
  }
}
```

### GET /admin/analytics/vendors
Get vendor analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalVendors": 100,
      "activeVendors": 80,
      "pendingVendors": 10,
      "approvedVendors": 90,
      "vendorGrowth": [
        {
          "date": "2024-01-15",
          "newVendors": 2,
          "totalVendors": 100
        }
      ],
      "topVendors": [
        {
          "vendorName": "Top Store",
          "sales": 500000.00,
          "products": 100,
          "rating": 4.8
        }
      ]
    }
  }
}
```

## Activity Log Routes

### GET /admin/activities
Get admin activity logs (requires admin authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `user` (string): Filter by user
- `action` (string): Filter by action
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": 1,
        "action": "USER_UPDATED",
        "entityType": "User",
        "entityId": 1,
        "details": {
          "userId": 1,
          "changes": {
            "role": "CUSTOMER -> VENDOR"
          }
        },
        "ipAddress": "192.168.1.1",
        "createdAt": "2024-01-15T10:30:00Z",
        "user": {
          "firstName": "Admin",
          "lastName": "User",
          "email": "admin@example.com"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500,
      "pages": 25
    }
  }
}
```

## Backup & Export Routes

### POST /admin/backup/create
Create system backup (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "message": "Backup created successfully",
  "data": {
    "backupId": "backup_123456",
    "downloadUrl": "https://example.com/backups/backup_123456.zip"
  }
}
```

### GET /admin/backup/list
Get backup list (requires admin authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "backups": [
      {
        "id": "backup_123456",
        "filename": "backup_2024_01_15.zip",
        "size": "50MB",
        "createdAt": "2024-01-15T10:30:00Z",
        "downloadUrl": "https://example.com/backups/backup_123456.zip"
      }
    ]
  }
}
```

### POST /admin/export/users
Export users data (requires admin authentication).

**Request Body:**
```json
{
  "format": "csv",
  "filters": {
    "role": "CUSTOMER",
    "dateFrom": "2024-01-01",
    "dateTo": "2024-01-31"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Export started successfully",
  "data": {
    "exportId": "export_123456",
    "downloadUrl": "https://example.com/exports/export_123456.csv"
  }
}
``` 