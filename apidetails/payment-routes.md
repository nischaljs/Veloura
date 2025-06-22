# Payment Management Routes

Base path: `/payments`

## POST /payments/khalti/initiate
Initiate Khalti payment.

**Request Body:**
```json
{
  "orderId": 1,
  "amount": 1100.00,
  "returnUrl": "https://example.com/payment/success",
  "cancelUrl": "https://example.com/payment/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": 1,
      "pidx": "pidx_1234567890",
      "paymentUrl": "https://khalti.com/pay/pidx_1234567890",
      "expiresAt": "2024-01-15T11:30:00Z"
    }
  }
}
```

## POST /payments/khalti/verify
Verify Khalti payment.

**Request Body:**
```json
{
  "pidx": "pidx_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "id": 1,
      "status": "COMPLETED",
      "transactionId": "TXN123456",
      "amount": 1100.00
    }
  }
}
```

## POST /payments/esewa/initiate
Initiate eSewa payment.

**Request Body:**
```json
{
  "orderId": 1,
  "amount": 1100.00,
  "returnUrl": "https://example.com/payment/success",
  "cancelUrl": "https://example.com/payment/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": 1,
      "token": "esewa_token_123",
      "paymentUrl": "https://esewa.com/pay?token=esewa_token_123"
    }
  }
}
```

## POST /payments/esewa/verify
Verify eSewa payment.

**Request Body:**
```json
{
  "token": "esewa_token_123",
  "refId": "ref_123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "payment": {
      "id": 1,
      "status": "COMPLETED",
      "transactionId": "ref_123456",
      "amount": 1100.00
    }
  }
}
```

## POST /payments/cod/confirm
Confirm Cash on Delivery payment.

**Request Body:**
```json
{
  "orderId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "COD payment confirmed",
  "data": {
    "payment": {
      "id": 1,
      "status": "PENDING",
      "method": "COD"
    }
  }
}
```

## GET /payments/:id
Get payment details (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": 1,
      "orderId": 1,
      "amount": 1100.00,
      "method": "KHALTI",
      "status": "COMPLETED",
      "transactionId": "TXN123456",
      "paymentDetails": {
        "pidx": "pidx_1234567890",
        "merchantName": "Veloura Store"
      },
      "processedAt": "2024-01-15T10:35:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## GET /payments/order/:orderId
Get payments for an order (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": 1,
        "amount": 1100.00,
        "method": "KHALTI",
        "status": "COMPLETED",
        "transactionId": "TXN123456",
        "processedAt": "2024-01-15T10:35:00Z"
      }
    ]
  }
}
```

## POST /payments/:id/refund
Request payment refund (requires authentication).

**Request Body:**
```json
{
  "amount": 550.00,
  "reason": "Partial refund for returned items"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refund request submitted successfully",
  "data": {
    "refund": {
      "id": 1,
      "amount": 550.00,
      "status": "PENDING",
      "reason": "Partial refund for returned items"
    }
  }
}
```

## GET /payments/refunds
Get user refunds (requires authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by refund status

**Response:**
```json
{
  "success": true,
  "data": {
    "refunds": [
      {
        "id": 1,
        "orderId": 1,
        "amount": 550.00,
        "reason": "Partial refund for returned items",
        "status": "COMPLETED",
        "createdAt": "2024-01-20T10:30:00Z",
        "processedAt": "2024-01-21T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

## Vendor Payment Management Routes

### GET /vendors/payments
Get vendor payments (requires vendor authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by payment status
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": 1,
        "orderId": 1,
        "orderNumber": "ORD-2024-001",
        "amount": 1000.00,
        "method": "KHALTI",
        "status": "COMPLETED",
        "transactionId": "TXN123456",
        "processedAt": "2024-01-15T10:35:00Z",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com"
        }
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

### GET /vendors/payments/analytics
Get vendor payment analytics (requires vendor authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalPayments": 150,
      "totalAmount": 150000.00,
      "pendingPayments": 10,
      "completedPayments": 140,
      "paymentMethodDistribution": {
        "KHALTI": 80,
        "ESEWA": 40,
        "COD": 30
      },
      "dailyPayments": [
        {
          "date": "2024-01-15",
          "payments": 5,
          "amount": 5000.00
        }
      ]
    }
  }
}
```

## Admin Payment Management Routes

### GET /admin/payments
Get all payments (requires admin authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by payment status
- `method` (string): Filter by payment method
- `vendor` (string): Filter by vendor
- `dateFrom` (string): Filter from date
- `dateTo` (string): Filter to date

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": 1,
        "orderId": 1,
        "orderNumber": "ORD-2024-001",
        "amount": 1100.00,
        "method": "KHALTI",
        "status": "COMPLETED",
        "transactionId": "TXN123456",
        "vendor": {
          "businessName": "My Store"
        },
        "customer": {
          "name": "John Doe",
          "email": "john@example.com"
        },
        "processedAt": "2024-01-15T10:35:00Z"
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

### PUT /admin/payments/:id/status
Update payment status (requires admin authentication).

**Request Body:**
```json
{
  "status": "COMPLETED",
  "transactionId": "TXN123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment status updated successfully"
}
```

### POST /admin/payments/:id/refund
Process refund (requires admin authentication).

**Request Body:**
```json
{
  "amount": 550.00,
  "reason": "Customer request",
  "status": "COMPLETED"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refund processed successfully"
}
```

### GET /admin/payments/analytics
Get admin payment analytics (requires admin authentication).

**Query Parameters:**
- `period` (string): Period (7d, 30d, 90d, 1y)

**Response:**
```json
{
  "success": true,
  "data": {
    "analytics": {
      "totalPayments": 1000,
      "totalAmount": 1000000.00,
      "pendingPayments": 50,
      "completedPayments": 900,
      "failedPayments": 30,
      "refundedPayments": 20,
      "paymentMethodDistribution": {
        "KHALT": 500,
        "ESEWA": 300,
        "COD": 150,
        "CARD": 50
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
          "payments": 100,
          "amount": 100000.00
        }
      ],
      "dailyPayments": [
        {
          "date": "2024-01-15",
          "payments": 25,
          "amount": 25000.00
        }
      ]
    }
  }
}
```

## Webhook Routes

### POST /payments/khalti/webhook
Khalti payment webhook.

**Request Body:**
```json
{
  "pidx": "pidx_1234567890",
  "status": "Completed",
  "amount": 1100,
  "transaction_id": "TXN123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

### POST /payments/esewa/webhook
eSewa payment webhook.

**Request Body:**
```json
{
  "token": "esewa_token_123",
  "refId": "ref_123456",
  "status": "success"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
``` 