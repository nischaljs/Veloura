# Order Management Routes

Base path: `/orders`

## POST /orders
Create new order (requires authentication).

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "variantId": 1,
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "label": "Home",
    "recipientName": "John Doe",
    "street": "123 Main St",
    "city": "Kathmandu",
    "state": "Bagmati",
    "postalCode": "44600",
    "country": "Nepal",
    "phone": "+977-9841234567"
  },
  "paymentMethod": "KHALTI",
  "customerNote": "Please deliver in the morning"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-2024-001",
      "status": "PENDING",
      "paymentStatus": "PENDING",
      "subtotal": 1000.00,
      "shippingFee": 100.00,
      "taxAmount": 0.00,
      "discountAmount": 0.00,
      "total": 1100.00,
      "paymentUrl": "https://khalti.com/pay/pidx123"
    }
  }
}
```

## GET /orders
Get user orders (requires authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status
- `paymentStatus` (string): Filter by payment status

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "status": "DELIVERED",
        "paymentStatus": "COMPLETED",
        "total": 1100.00,
        "createdAt": "2024-01-15T10:30:00Z",
        "estimatedDelivery": "2024-01-20T00:00:00Z",
        "items": [
          {
            "id": 1,
            "productName": "Product Name",
            "quantity": 2,
            "price": 500.00,
            "variant": "Red, XL"
          }
        ]
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

## GET /orders/:id
Get order details (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 1,
      "orderNumber": "ORD-2024-001",
      "status": "DELIVERED",
      "paymentMethod": "KHALTI",
      "paymentStatus": "COMPLETED",
      "subtotal": 1000.00,
      "shippingFee": 100.00,
      "taxAmount": 0.00,
      "discountAmount": 0.00,
      "total": 1100.00,
      "shippingAddress": {
        "label": "Home",
        "recipientName": "John Doe",
        "street": "123 Main St",
        "city": "Kathmandu",
        "state": "Bagmati",
        "postalCode": "44600",
        "country": "Nepal",
        "phone": "+977-9841234567"
      },
      "customerNote": "Please deliver in the morning",
      "trackingNumber": "TRK123456789",
      "trackingCompany": "Nepal Post",
      "estimatedDelivery": "2024-01-20T00:00:00Z",
      "completedAt": "2024-01-19T15:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "items": [
        {
          "id": 1,
          "productName": "Product Name",
          "productSlug": "product-name",
          "quantity": 2,
          "price": 500.00,
          "salePrice": 450.00,
          "variant": "Red, XL",
          "productSnapshot": {
            "name": "Product Name",
            "image": "https://example.com/product.jpg"
          }
        }
      ],
      "payments": [
        {
          "id": 1,
          "amount": 1100.00,
          "method": "KHALTI",
          "status": "COMPLETED",
          "transactionId": "TXN123456",
          "processedAt": "2024-01-15T10:35:00Z"
        }
      ],
      "shipments": [
        {
          "id": 1,
          "trackingNumber": "TRK123456789",
          "carrier": "Nepal Post",
          "status": "delivered",
          "shippedAt": "2024-01-16T10:30:00Z",
          "deliveredAt": "2024-01-19T15:30:00Z"
        }
      ]
    }
  }
}
```

## PUT /orders/:id/cancel
Cancel order (requires authentication).

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully"
}
```

## POST /orders/:id/return
Request order return (requires authentication).

**Request Body:**
```json
{
  "items": [
    {
      "orderItemId": 1,
      "quantity": 1,
      "reason": "Defective product"
    }
  ],
  "returnReason": "Product quality issues"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Return request submitted successfully"
}
```

## GET /orders/:id/tracking
Get order tracking information (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "tracking": {
      "orderNumber": "ORD-2024-001",
      "status": "delivered",
      "trackingNumber": "TRK123456789",
      "carrier": "Nepal Post",
      "estimatedDelivery": "2024-01-20T00:00:00Z",
      "events": [
        {
          "date": "2024-01-19T15:30:00Z",
          "status": "delivered",
          "location": "Kathmandu, Nepal",
          "description": "Package delivered to recipient"
        },
        {
          "date": "2024-01-18T10:30:00Z",
          "status": "in_transit",
          "location": "Kathmandu, Nepal",
          "description": "Package out for delivery"
        }
      ]
    }
  }
}
```

## GET /orders/invoice/:id
Get order invoice (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "invoice": {
      "invoiceNumber": "INV-2024-001",
      "orderNumber": "ORD-2024-001",
      "date": "2024-01-15T10:30:00Z",
      "customer": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+977-9841234567"
      },
      "billingAddress": {
        "recipientName": "John Doe",
        "street": "123 Main St",
        "city": "Kathmandu",
        "state": "Bagmati",
        "postalCode": "44600",
        "country": "Nepal"
      },
      "items": [
        {
          "name": "Product Name",
          "quantity": 2,
          "unitPrice": 500.00,
          "total": 1000.00
        }
      ],
      "subtotal": 1000.00,
      "shippingFee": 100.00,
      "taxAmount": 0.00,
      "discountAmount": 0.00,
      "total": 1100.00,
      "paymentMethod": "KHALTI",
      "paymentStatus": "COMPLETED"
    }
  }
}
```

## Vendor Order Management Routes

### GET /vendors/orders
Get vendor orders (requires vendor authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "status": "PROCESSING",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "total": 1000.00,
        "createdAt": "2024-01-15T10:30:00Z",
        "items": [
          {
            "id": 1,
            "productName": "Product Name",
            "quantity": 2,
            "price": 500.00
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

### PUT /vendors/orders/:id/status
Update order status (requires vendor authentication).

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "TRK123456789",
  "trackingCompany": "Nepal Post"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

### GET /vendors/orders/analytics
Get vendor order analytics (requires vendor authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalOrders": 150,
      "totalRevenue": 150000.00,
      "averageOrderValue": 1000.00,
      "pendingOrders": 10,
      "processingOrders": 5,
      "shippedOrders": 20,
      "deliveredOrders": 115,
      "orderStatusDistribution": {
        "PENDING": 10,
        "PROCESSING": 5,
        "SHIPPED": 20,
        "DELIVERED": 115
      },
      "dailyOrders": [
        {
          "date": "2024-01-15",
          "orders": 5,
          "revenue": 5000.00
        }
      ]
    }
  }
}
```

## Admin Order Management Routes

### GET /admin/orders
Get all orders (requires admin authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status
- `paymentStatus` (string): Filter by payment status
- `vendor` (string): Filter by vendor
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "status": "DELIVERED",
        "paymentStatus": "COMPLETED",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "vendor": {
          "businessName": "My Store"
        },
        "total": 1100.00,
        "createdAt": "2024-01-15T10:30:00Z"
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

### PUT /admin/orders/:id/status
Update order status (requires admin authentication).

**Request Body:**
```json
{
  "status": "CANCELLED",
  "reason": "Customer request"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully"
}
```

### GET /admin/orders/analytics
Get admin order analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalOrders": 1000,
      "totalRevenue": 1000000.00,
      "averageOrderValue": 1000.00,
      "orderStatusDistribution": {
        "PENDING": 50,
        "PROCESSING": 30,
        "SHIPPED": 100,
        "DELIVERED": 800,
        "CANCELLED": 20
      },
      "paymentStatusDistribution": {
        "PENDING": 50,
        "COMPLETED": 900,
        "FAILED": 30,
        "REFUNDED": 20
      },
      "topVendors": [
        {
          "vendorName": "Top Store",
          "orders": 100,
          "revenue": 100000.00
        }
      ],
      "dailyOrders": [
        {
          "date": "2024-01-15",
          "orders": 25,
          "revenue": 25000.00
        }
      ]
    }
  }
}
``` 