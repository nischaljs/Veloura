# Order Fetching APIs

## 1. Fetch Customer Orders

### Endpoint
`GET /api/orders`

### Description
Fetch a paginated list of orders for the authenticated customer.

### Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
- **Query Parameters (optional):**
  - `page`, `limit`, `status`, `paymentStatus`

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 21,
        "orderNumber": "ORD-1752664144725",
        "userId": 13,
        "status": "DELIVERED",
        "paymentMethod": "KHALTI",
        "paymentStatus": "PENDING",
        "subtotal": "20",
        "shippingFee": "156",
        "total": "178.6",
        "shippingAddress": {
          "recipientName": "Alice Smith",
          "phone": "9800000000",
          "street": "Test Street",
          "city": "Kathmandu",
          "state": "Bagmati",
          "postalCode": "44600",
          "country": "Nepal"
        },
        "customerNote": "",
        "completedAt": null,
        "createdAt": "2025-07-16T11:09:04.731Z",
        "updatedAt": "2025-07-16T11:13:16.482Z",
        "updatedBy": null,
        "items": [
          {
            "id": 23,
            "orderId": 21,
            "productId": 23,
            "quantity": 1,
            "price": "20",
            "salePrice": "20",
            "productSnapshot": {
              "id": 23,
              "name": "Hydrating Moisturizer",
              "slug": "hydrating-moisturizer",
              "price": 25,
              "salePrice": 20,
              "sku": "BB-MOIST-001"
            },
            "createdAt": "2025-07-16T11:09:04.731Z",
            "updatedAt": "2025-07-16T11:09:04.731Z",
            "updatedBy": null,
            "vendorId": 7
          }
        ]
      }
      // ... more orders
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 9,
      "pages": 1
    }
  }
}
```

### Example
```bash
curl -X GET http://localhost:5000/api/orders \
  -H "Authorization: Bearer <customer_token>"
```

---

## 2. Fetch Vendor Orders

### Endpoint
`GET /api/orders/vendors/orders`

### Description
Fetch a paginated list of orders for the authenticated vendor (orders containing their products).

### Request
- **Headers:**
  - `Authorization: Bearer <vendor_token>`
- **Query Parameters (optional):**
  - `page`, `limit`, `status`, `paymentStatus`

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 21,
        "orderNumber": "ORD-1752664144725",
        "userId": 13,
        "status": "DELIVERED",
        "paymentMethod": "KHALTI",
        "paymentStatus": "PENDING",
        "subtotal": "20",
        "shippingFee": "156",
        "total": "178.6",
        "shippingAddress": {
          "recipientName": "Alice Smith",
          "phone": "9800000000",
          "street": "Test Street",
          "city": "Kathmandu",
          "state": "Bagmati",
          "postalCode": "44600",
          "country": "Nepal"
        },
        "customerNote": "",
        "completedAt": null,
        "createdAt": "2025-07-16T11:09:04.731Z",
        "updatedAt": "2025-07-16T11:13:16.482Z",
        "updatedBy": null,
        "items": [
          {
            "id": 23,
            "orderId": 21,
            "productId": 23,
            "quantity": 1,
            "price": "20",
            "salePrice": "20",
            "productSnapshot": {
              "id": 23,
              "name": "Hydrating Moisturizer",
              "slug": "hydrating-moisturizer",
              "price": 25,
              "salePrice": 20,
              "sku": "BB-MOIST-001"
            },
            "createdAt": "2025-07-16T11:09:04.731Z",
            "updatedAt": "2025-07-16T11:09:04.731Z",
            "updatedBy": null,
            "vendorId": 7
          }
        ],
        "user": {
          "firstName": "Anita",
          "lastName": "Sharma"
        }
      }
      // ... more orders
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 9,
      "pages": 1
    }
  }
}
```

---

## 3. Fetch Single Order (Customer)

### Endpoint
`GET /api/orders/{orderId}`

### Description
Fetch details of a single order for the authenticated customer.

### Request
- **Headers:**
  - `Authorization: Bearer <customer_token>`
- **Path Parameter:**
  - `orderId` (integer)

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 21,
      "orderNumber": "ORD-1752664144725",
      "userId": 13,
      "status": "DELIVERED",
      "paymentMethod": "KHALTI",
      "paymentStatus": "PENDING",
      "subtotal": "20",
      "shippingFee": "156",
      "total": "178.6",
      "shippingAddress": {
        "recipientName": "Alice Smith",
        "phone": "9800000000",
        "street": "Test Street",
        "city": "Kathmandu",
        "state": "Bagmati",
        "postalCode": "44600",
        "country": "Nepal"
      },
      "customerNote": "",
      "completedAt": null,
      "createdAt": "2025-07-16T11:09:04.731Z",
      "updatedAt": "2025-07-16T11:13:16.482Z",
      "updatedBy": null,
      "items": [
        {
          "id": 23,
          "orderId": 21,
          "productId": 23,
          "quantity": 1,
          "price": "20",
          "salePrice": "20",
          "productSnapshot": {
            "id": 23,
            "name": "Hydrating Moisturizer",
            "slug": "hydrating-moisturizer",
            "price": 25,
            "salePrice": 20,
            "sku": "BB-MOIST-001"
          },
          "createdAt": "2025-07-16T11:09:04.731Z",
          "updatedAt": "2025-07-16T11:09:04.731Z",
          "updatedBy": null,
          "vendorId": 7
        }
      ]
    }
  }
}
```

---

## 4. Fetch Single Order (Vendor)

### Endpoint
`GET /api/orders/vendors/orders/{orderId}`

### Description
Fetch details of a single order for the authenticated vendor (if it contains their products).

### Request
- **Headers:**
  - `Authorization: Bearer <vendor_token>`
- **Path Parameter:**
  - `orderId` (integer)

### Response
- **Success (200):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 21,
      "orderNumber": "ORD-1752664144725",
      "userId": 13,
      "status": "DELIVERED",
      "paymentMethod": "KHALTI",
      "paymentStatus": "PENDING",
      "subtotal": "20",
      "shippingFee": "156",
      "total": "178.6",
      "shippingAddress": {
        "recipientName": "Alice Smith",
        "phone": "9800000000",
        "street": "Test Street",
        "city": "Kathmandu",
        "state": "Bagmati",
        "postalCode": "44600",
        "country": "Nepal"
      },
      "customerNote": "",
      "completedAt": null,
      "createdAt": "2025-07-16T11:09:04.731Z",
      "updatedAt": "2025-07-16T11:13:16.482Z",
      "updatedBy": null,
      "items": [
        {
          "id": 23,
          "orderId": 21,
          "productId": 23,
          "quantity": 1,
          "price": "20",
          "salePrice": "20",
          "productSnapshot": {
            "id": 23,
            "name": "Hydrating Moisturizer",
            "slug": "hydrating-moisturizer",
            "price": 25,
            "salePrice": 20,
            "sku": "BB-MOIST-001"
          },
          "createdAt": "2025-07-16T11:09:04.731Z",
          "updatedAt": "2025-07-16T11:09:04.731Z",
          "updatedBy": null,
          "vendorId": 7,
          "product": {
            "id": 23,
            "vendorId": 7,
            "categoryId": 19,
            "name": "Hydrating Moisturizer",
            "slug": "hydrating-moisturizer",
            "description": "Lightweight moisturizer for daily use",
            "shortDescription": "Hydrates all skin types",
            "price": "25",
            "salePrice": "20",
            "costPrice": "15",
            "sku": "BB-MOIST-001",
            "stockQuantity": 97,
            "status": "ACTIVE",
            "isFeatured": true,
            "weight": 0.2,
            "length": null,
            "width": null,
            "height": null,
            "rating": 0,
            "reviewCount": 0,
            "createdAt": "2025-07-16T10:38:40.793Z",
            "updatedAt": "2025-07-16T11:09:04.774Z",
            "updatedBy": null
          }
        }
      ],
      "user": {
        "firstName": "Anita",
        "lastName": "Sharma",
        "email": "customer1@example.com"
      }
    }
  }
}
```

---

## Notes
- All image URLs in product snapshots are relative (e.g., `/images/products/...`). The frontend or image utility should convert them to full URLs.
- Vendor endpoints include a `user` object for each order (customer info for that order).
- All fields shown above are present in real API responses. 