# User Management Routes

Base path: `/users`

## GET /users/profile
Get user profile (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+977-9841234567",
      "avatar": "https://example.com/avatar.jpg",
      "role": "CUSTOMER",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLogin": "2024-01-15T10:30:00Z"
    }
  }
}
```

## PUT /users/profile
Update user profile (requires authentication).

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+977-9841234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+977-9841234567"
    }
  }
}
```

## POST /users/avatar
Upload user avatar (requires authentication).

**Request:** Multipart form data with image file.

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar": "https://example.com/avatars/user123.jpg"
  }
}
```

## DELETE /users/avatar
Remove user avatar (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Avatar removed successfully"
}
```

## PUT /users/password
Change password (requires authentication).

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

## GET /users/addresses
Get user addresses (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": 1,
        "label": "Home",
        "recipientName": "John Doe",
        "street": "123 Main St",
        "city": "Kathmandu",
        "state": "Bagmati",
        "postalCode": "44600",
        "country": "Nepal",
        "phone": "+977-9841234567",
        "isDefault": true
      }
    ]
  }
}
```

## POST /users/addresses
Add new address (requires authentication).

**Request Body:**
```json
{
  "label": "Office",
  "recipientName": "John Doe",
  "street": "456 Business Ave",
  "city": "Kathmandu",
  "state": "Bagmati",
  "postalCode": "44600",
  "country": "Nepal",
  "phone": "+977-9841234567",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "address": {
      "id": 2,
      "label": "Office",
      "recipientName": "John Doe",
      "street": "456 Business Ave",
      "city": "Kathmandu",
      "state": "Bagmati",
      "postalCode": "44600",
      "country": "Nepal",
      "phone": "+977-9841234567",
      "isDefault": false
    }
  }
}
```

## PUT /users/addresses/:id
Update address (requires authentication).

**Request Body:**
```json
{
  "label": "Home Updated",
  "street": "789 New St",
  "city": "Lalitpur"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address updated successfully"
}
```

## DELETE /users/addresses/:id
Delete address (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

## PUT /users/addresses/:id/default
Set address as default (requires authentication).

**Response:**
```json
{
  "success": true,
  "message": "Default address updated successfully"
}
```

## GET /users/orders
Get user orders (requires authentication).

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by order status

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
        "total": 1500.00,
        "createdAt": "2024-01-15T10:30:00Z",
        "items": [
          {
            "id": 1,
            "productName": "Product Name",
            "quantity": 2,
            "price": 750.00
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

## GET /users/orders/:id
Get specific order details (requires authentication).

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
      "subtotal": 1400.00,
      "shippingFee": 100.00,
      "taxAmount": 0.00,
      "discountAmount": 0.00,
      "total": 1500.00,
      "shippingAddress": {
        "recipientName": "John Doe",
        "street": "123 Main St",
        "city": "Kathmandu"
      },
      "trackingNumber": "TRK123456789",
      "estimatedDelivery": "2024-01-20T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "items": [
        {
          "id": 1,
          "productName": "Product Name",
          "quantity": 2,
          "price": 750.00,
          "variant": "Red, XL"
        }
      ],
      "payments": [
        {
          "id": 1,
          "amount": 1500.00,
          "method": "KHALTI",
          "status": "COMPLETED",
          "transactionId": "TXN123456"
        }
      ]
    }
  }
}
``` 